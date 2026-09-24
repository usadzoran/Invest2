import { ethers } from 'ethers';

const BSC_RPC_URL = process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/';
const TRON_API_URL = process.env.TRON_API_URL || 'https://api.trongrid.io';

// Official USDT Contract Addresses
export const USDT_BEP20_CONTRACT = '0x55d398326f99059fF775485246999027B3197955';
export const USDT_TRC20_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint amount)'
];

let bscProviderInstance = null;

export function getBscProvider() {
  if (!bscProviderInstance) {
    bscProviderInstance = new ethers.JsonRpcProvider(BSC_RPC_URL);
  }
  return bscProviderInstance;
}

/**
 * Fetch live BNB market price in USD from Binance ticker
 */
export async function getBnbPriceUsd() {
  try {
    const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
    if (!res.ok) throw new Error('Failed to fetch BNB ticker');
    const data = await res.json();
    return parseFloat(data.price) || 600;
  } catch (err) {
    console.warn('Fallback BNB price due to ticker error:', err.message);
    return 600.0;
  }
}

/**
 * Query real on-chain BNB balance
 */
export async function getBscBnbBalance(address) {
  try {
    const provider = getBscProvider();
    const balanceWei = await provider.getBalance(address);
    return {
      formatted: ethers.formatEther(balanceWei),
      raw: balanceWei.toString()
    };
  } catch (err) {
    console.error('Error fetching BSC BNB balance:', err.message);
    return { formatted: '0.0', raw: '0' };
  }
}

/**
 * Query real on-chain USDT BEP20 balance
 */
export async function getBscUsdtBalance(address) {
  try {
    const provider = getBscProvider();
    const contract = new ethers.Contract(USDT_BEP20_CONTRACT, ERC20_ABI, provider);
    const balance = await contract.balanceOf(address);
    return {
      formatted: ethers.formatUnits(balance, 18),
      raw: balance.toString()
    };
  } catch (err) {
    console.error('Error fetching BSC USDT balance:', err.message);
    return { formatted: '0.0', raw: '0' };
  }
}

/**
 * Query real on-chain TRON TRX and USDT TRC20 balances
 */
export async function getTronBalances(address) {
  try {
    const res = await fetch(`${TRON_API_URL}/v1/accounts/${address}`);
    if (!res.ok) {
      return { trx: '0.0', usdt: '0.0' };
    }
    const data = await res.json();
    if (!data.data || !data.data[0]) {
      // Account not yet activated or zero balance on Tron
      return { trx: '0.0', usdt: '0.0' };
    }
    const acc = data.data[0];
    const trxSun = acc.balance || 0;
    const trxFmt = (trxSun / 1_000_000).toFixed(6);

    let usdtRaw = '0';
    if (Array.isArray(acc.trc20)) {
      for (const item of acc.trc20) {
        if (item[USDT_TRC20_CONTRACT]) {
          usdtRaw = item[USDT_TRC20_CONTRACT];
          break;
        }
      }
    }
    const usdtFmt = (parseFloat(usdtRaw) / 1_000_000).toFixed(6);

    return {
      trx: trxFmt,
      usdt: usdtFmt
    };
  } catch (err) {
    console.error('Error fetching TRON balances:', err.message);
    return { trx: '0.0', usdt: '0.0' };
  }
}

/**
 * Fetch all wallet balances across networks in real time
 */
export async function fetchAllLiveBalances(bscAddress, tronAddress) {
  const [bnbBal, bscUsdtBal, tronBal, bnbPrice] = await Promise.all([
    getBscBnbBalance(bscAddress),
    getBscUsdtBalance(bscAddress),
    getTronBalances(tronAddress),
    getBnbPriceUsd()
  ]);

  const bnbValueUsd = parseFloat(bnbBal.formatted) * bnbPrice;
  const bscUsdtValueUsd = parseFloat(bscUsdtBal.formatted) * 1.0;
  const tronUsdtValueUsd = parseFloat(tronBal.usdt) * 1.0;
  const totalUsd = bnbValueUsd + bscUsdtValueUsd + tronUsdtValueUsd;

  return {
    totalUsd: totalUsd.toFixed(2),
    bnbPrice: bnbPrice.toFixed(2),
    assets: [
      {
        id: 'usdt-trc20',
        symbol: 'USDT',
        name: 'Tether USD',
        network: 'TRON (TRC20)',
        networkId: 'tron-mainnet',
        address: tronAddress,
        balance: tronBal.usdt,
        valueUsd: tronUsdtValueUsd.toFixed(2),
        decimals: 6,
        contract: USDT_TRC20_CONTRACT,
        explorerUrl: `https://tronscan.org/#/address/${tronAddress}`
      },
      {
        id: 'usdt-bep20',
        symbol: 'USDT',
        name: 'Tether USD',
        network: 'BNB Smart Chain (BEP20)',
        networkId: 'bsc-mainnet',
        address: bscAddress,
        balance: bscUsdtBal.formatted,
        valueUsd: bscUsdtValueUsd.toFixed(2),
        decimals: 18,
        contract: USDT_BEP20_CONTRACT,
        explorerUrl: `https://bscscan.com/address/${bscAddress}`
      },
      {
        id: 'bnb-bsc',
        symbol: 'BNB',
        name: 'BNB Coin',
        network: 'BNB Smart Chain',
        networkId: 'bsc-mainnet',
        address: bscAddress,
        balance: bnbBal.formatted,
        valueUsd: bnbValueUsd.toFixed(2),
        decimals: 18,
        contract: null,
        explorerUrl: `https://bscscan.com/address/${bscAddress}`
      }
    ]
  };
}

/**
 * Estimate real network fee for sending
 */
export async function estimateNetworkFee(networkId, assetId) {
  if (networkId === 'bsc-mainnet') {
    try {
      const provider = getBscProvider();
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice || ethers.parseUnits('3', 'gwei');
      const gasLimit = assetId === 'bnb-bsc' ? 21000n : 65000n;
      const totalFeeWei = gasPrice * gasLimit;
      const feeBnb = ethers.formatEther(totalFeeWei);
      const bnbPrice = await getBnbPriceUsd();
      const feeUsd = (parseFloat(feeBnb) * bnbPrice).toFixed(4);

      return {
        feeAmount: feeBnb,
        feeSymbol: 'BNB',
        feeUsd: feeUsd,
        gasPriceGwei: ethers.formatUnits(gasPrice, 'gwei')
      };
    } catch (err) {
      console.error('Error estimating BSC gas:', err.message);
      return {
        feeAmount: '0.0003',
        feeSymbol: 'BNB',
        feeUsd: '0.20'
      };
    }
  } else if (networkId === 'tron-mainnet') {
    // Standard TRON TRC20 transfer consumes ~31,895 energy or ~13.5 TRX to 27.5 TRX if no energy
    return {
      feeAmount: '15.0',
      feeSymbol: 'TRX (أو رصيد طاقة شبكة ترون)',
      feeUsd: '2.50'
    };
  }

  return { feeAmount: '0.0', feeSymbol: '' };
}

/**
 * Execute real blockchain transfer on BNB Smart Chain
 */
export async function executeBscSend({ privateKey, toAddress, amount, assetId }) {
  const provider = getBscProvider();
  const wallet = new ethers.Wallet(privateKey, provider);

  if (assetId === 'bnb-bsc') {
    const valueWei = ethers.parseEther(amount.toString());
    const balanceWei = await provider.getBalance(wallet.address);

    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits('3', 'gwei');
    const estimatedGas = 21000n;
    const requiredGasCost = gasPrice * estimatedGas;

    if (balanceWei < (valueWei + requiredGasCost)) {
      throw new Error(`رصيد BNB غير كافٍ. المطلوب: ${ethers.formatEther(valueWei + requiredGasCost)} BNB (شامل رسوم الغاز)، المتوفر في المحفظة: ${ethers.formatEther(balanceWei)} BNB`);
    }

    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: valueWei,
      gasLimit: estimatedGas
    });

    return {
      txHash: tx.hash,
      network: 'bsc-mainnet',
      explorerUrl: `https://bscscan.com/tx/${tx.hash}`
    };
  } else if (assetId === 'usdt-bep20') {
    const contract = new ethers.Contract(USDT_BEP20_CONTRACT, ERC20_ABI, wallet);
    const amountUnits = ethers.parseUnits(amount.toString(), 18);

    // Check token balance
    const tokenBal = await contract.balanceOf(wallet.address);
    if (tokenBal < amountUnits) {
      throw new Error(`رصيد USDT BEP20 غير كافٍ. المتوفر في المحفظة: ${ethers.formatUnits(tokenBal, 18)} USDT`);
    }

    // Check BNB for gas
    const bnbBal = await provider.getBalance(wallet.address);
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits('3', 'gwei');
    const estimatedGas = 65000n;
    const requiredBnbGas = gasPrice * estimatedGas;

    if (bnbBal < requiredBnbGas) {
      throw new Error(`المحفظة بحاجة إلى القليل من BNB لتغطية رسوم غاز الشبكة (Gas Fee). المطلوب: ${ethers.formatEther(requiredBnbGas)} BNB، المتوفر: ${ethers.formatEther(bnbBal)} BNB`);
    }

    const tx = await contract.transfer(toAddress, amountUnits, { gasLimit: estimatedGas });

    return {
      txHash: tx.hash,
      network: 'bsc-mainnet',
      explorerUrl: `https://bscscan.com/tx/${tx.hash}`
    };
  }

  throw new Error('أصل غير مدعوم على شبكة BSC');
}

/**
 * Check recent incoming transfers on TRON network for an address
 */
export async function fetchTronIncomingDeposits(tronAddress) {
  try {
    const url = `${TRON_API_URL}/v1/accounts/${tronAddress}/transactions/trc20?contract_address=${USDT_TRC20_CONTRACT}&limit=20`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.data || !Array.isArray(json.data)) return [];

    return json.data
      .filter(tx => tx.to === tronAddress && tx.type === 'Transfer')
      .map(tx => ({
        txHash: tx.transaction_id,
        from: tx.from,
        to: tx.to,
        amount: (parseFloat(tx.value) / 1_000_000).toString(),
        networkId: 'tron-mainnet',
        assetId: 'usdt-trc20',
        timestamp: new Date(tx.block_timestamp).toISOString()
      }));
  } catch (err) {
    console.error('Error fetching Tron incoming deposits:', err.message);
    return [];
  }
}

/**
 * Verify any transaction directly on the Blockchain by TxHash
 */
export async function verifyOnChainTransaction(txHash, networkId) {
  if (networkId === 'bsc-mainnet') {
    const provider = getBscProvider();
    const [tx, receipt, currentBlock] = await Promise.all([
      provider.getTransaction(txHash),
      provider.getTransactionReceipt(txHash),
      provider.getBlockNumber()
    ]);

    if (!tx || !receipt) {
      return { found: false, status: 'not_found' };
    }

    const confirmations = Math.max(0, currentBlock - receipt.blockNumber);
    const isSuccess = receipt.status === 1;

    let amount = ethers.formatEther(tx.value);
    let assetId = 'bnb-bsc';

    // If interact with USDT contract
    if (tx.to && tx.to.toLowerCase() === USDT_BEP20_CONTRACT.toLowerCase()) {
      assetId = 'usdt-bep20';
      // Try parsing transfer log
      for (const log of receipt.logs) {
        if (log.address.toLowerCase() === USDT_BEP20_CONTRACT.toLowerCase() && log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
          const rawAmount = BigInt(log.data);
          amount = ethers.formatUnits(rawAmount, 18);
          break;
        }
      }
    }

    return {
      found: true,
      networkId: 'bsc-mainnet',
      assetId,
      txHash,
      from: tx.from,
      to: tx.to,
      amount,
      status: isSuccess ? (confirmations >= 12 ? 'confirmed' : 'pending') : 'failed',
      confirmations,
      blockNumber: receipt.blockNumber,
      explorerUrl: `https://bscscan.com/tx/${txHash}`
    };
  } else if (networkId === 'tron-mainnet') {
    const res = await fetch(`${TRON_API_URL}/v1/transactions/${txHash}`);
    if (!res.ok) return { found: false, status: 'not_found' };
    const data = await res.json();
    if (!data.data || !data.data[0]) return { found: false, status: 'not_found' };

    const tx = data.data[0];
    const isSuccess = tx.ret && tx.ret[0]?.contractRet === 'SUCCESS';

    return {
      found: true,
      networkId: 'tron-mainnet',
      assetId: 'usdt-trc20',
      txHash,
      status: isSuccess ? 'confirmed' : 'failed',
      confirmations: 19,
      explorerUrl: `https://tronscan.org/#/transaction/${txHash}`
    };
  }

  return { found: false, status: 'unsupported_network' };
}
