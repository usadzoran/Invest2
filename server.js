import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import {
  authenticateOrRegister,
  getFullWalletDetails,
  checkSupabaseStatus,
  getDecryptedVault,
  recordTransaction
} from './db-manager.js';
import {
  estimateNetworkFee,
  executeBscSend,
  getBnbPriceUsd,
  verifyOnChainTransaction
} from './blockchain-service.js';
import {
  isValidBscAddress,
  isValidTronAddress
} from './crypto-engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Simple in-memory session tokens for authenticated client requests
const sessions = new Map(); // token -> userId

function authenticateRequest(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح به. يرجى تسجيل الدخول.' });
  }
  const token = authHeader.split(' ')[1];
  const userId = sessions.get(token);
  if (!userId) {
    return res.status(401).json({ error: 'جلسة العمل منتهية الصلاحية. يرجى تسجيل الدخول مجدداً.' });
  }
  req.userId = userId;
  next();
}

/**
 * Public Configuration
 */
app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL || 'https://cjmutyofskqaershxkko.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY ? true : false,
    networks: [
      { id: 'bsc-mainnet', name: 'BNB Smart Chain', symbol: 'BSC' },
      { id: 'tron-mainnet', name: 'TRON Network', symbol: 'TRON' }
    ]
  });
});

/**
 * Check Database & Blockchain Status
 */
app.get('/api/system/status', async (req, res) => {
  try {
    const sbStatus = await checkSupabaseStatus();
    const bnbPrice = await getBnbPriceUsd();
    res.json({
      supabase: sbStatus,
      blockchain: {
        bscRpc: 'متصل (BNB Smart Chain Mainnet)',
        tronRpc: 'متصل (TRON Network Mainnet)',
        bnbPriceUsd: bnbPrice
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Register
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'كلمة المرور يجب ألا تقل عن 6 أحرف.' });
    }

    const result = await authenticateOrRegister({
      email,
      password,
      fullName,
      isRegister: true
    });

    const token = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    sessions.set(token, result.userId);

    res.json({
      success: true,
      token,
      user: {
        id: result.userId,
        email: result.email,
        fullName: result.fullName
      },
      wallet: {
        walletId: result.walletId,
        bscAddress: result.bscAddress,
        tronAddress: result.tronAddress
      }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * Login
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان.' });
    }

    const result = await authenticateOrRegister({
      email,
      password,
      isRegister: false
    });

    const token = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    sessions.set(token, result.userId);

    res.json({
      success: true,
      token,
      user: {
        id: result.userId,
        email: result.email,
        fullName: result.fullName
      },
      wallet: {
        walletId: result.walletId,
        bscAddress: result.bscAddress,
        tronAddress: result.tronAddress
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * Logout
 */
app.post('/api/auth/logout', authenticateRequest, (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    sessions.delete(token);
  }
  res.json({ success: true });
});

/**
 * Get Wallet Details & Real Balances
 */
app.get('/api/wallet/details', authenticateRequest, async (req, res) => {
  try {
    const details = await getFullWalletDetails(req.userId);
    res.json(details);
  } catch (err) {
    console.error('Fetch wallet error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Force Refresh Live Balances
 */
app.post('/api/wallet/refresh', authenticateRequest, async (req, res) => {
  try {
    const details = await getFullWalletDetails(req.userId);
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Generate QR Code
 */
app.get('/api/wallet/qrcode', async (req, res) => {
  try {
    const text = req.query.text;
    if (!text) {
      return res.status(400).json({ error: 'text parameter required' });
    }
    const dataUrl = await QRCode.toDataURL(text, {
      margin: 2,
      width: 260,
      color: {
        dark: '#0e1726',
        light: '#ffffff'
      }
    });
    res.json({ dataUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Validate Destination Address
 */
app.post('/api/wallet/validate-address', (req, res) => {
  const { address, networkId } = req.body;
  if (!address || !networkId) {
    return res.status(400).json({ valid: false, error: 'المعلومات غير مكتملة' });
  }

  if (networkId === 'bsc-mainnet') {
    const valid = isValidBscAddress(address);
    return res.json({
      valid,
      message: valid ? 'عنوان BNB Smart Chain صالح' : 'العنوان غير صالح لشبكة BNB Smart Chain (يجب أن يبدأ بـ 0x ويطابق معيار EVM)'
    });
  } else if (networkId === 'tron-mainnet') {
    const valid = isValidTronAddress(address);
    return res.json({
      valid,
      message: valid ? 'عنوان TRON صالح' : 'العنوان غير صالح لشبكة TRON (يجب أن يبدأ بحرف T ويتكون من 34 رمزاً مشفراً Base58)'
    });
  }

  res.status(400).json({ valid: false, error: 'الشبكة غير مدعومة' });
});

/**
 * Estimate Network Fee
 */
app.post('/api/wallet/estimate-fee', async (req, res) => {
  try {
    const { networkId, assetId } = req.body;
    const feeInfo = await estimateNetworkFee(networkId, assetId);
    res.json(feeInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Verify On-Chain Transaction
 */
app.post('/api/wallet/verify-tx', authenticateRequest, async (req, res) => {
  try {
    const { txHash, networkId } = req.body;
    if (!txHash || !networkId) {
      return res.status(400).json({ error: 'txHash and networkId are required' });
    }

    const verification = await verifyOnChainTransaction(txHash.trim(), networkId);
    if (!verification.found) {
      return res.status(404).json({ error: 'لم يتم العثور على المعاملة على شبكة البلوكشين بعد. يرجى الانتظار بضع لحظات والمحاولة مجدداً.' });
    }

    // Record verified transaction if valid
    const userWallet = await getFullWalletDetails(req.userId);
    const isToUser = (verification.to && (
      verification.to.toLowerCase() === userWallet.addresses.bsc.toLowerCase() ||
      verification.to.toLowerCase() === userWallet.addresses.tron.toLowerCase()
    ));

    if (verification.status === 'confirmed' || verification.status === 'pending') {
      await recordTransaction({
        userId: req.userId,
        assetId: verification.assetId,
        networkId: verification.networkId,
        type: isToUser ? 'deposit' : 'withdraw',
        amount: verification.amount || '0',
        fromAddress: verification.from || 'خارجي',
        toAddress: verification.to || userWallet.addresses.bsc,
        txHash: verification.txHash,
        status: verification.status,
        confirmations: verification.confirmations || 1
      });
    }

    res.json(verification);
  } catch (err) {
    console.error('Verify tx error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Send Transaction on Blockchain
 */
app.post('/api/wallet/send', authenticateRequest, async (req, res) => {
  try {
    const { assetId, networkId, toAddress, amount } = req.body;

    if (!assetId || !networkId || !toAddress || !amount) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة لإتمام عملية الإرسال.' });
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'المبلغ المدخل غير صالح.' });
    }

    // Strict Address Validation to avoid sending across wrong networks
    if (networkId === 'bsc-mainnet') {
      if (!isValidBscAddress(toAddress)) {
        return res.status(400).json({
          error: 'عنوان المستلم غير صالح لشبكة BNB Smart Chain. لا يمكنك إرسال عملات BEP20 إلى هذا العنوان.'
        });
      }
    } else if (networkId === 'tron-mainnet') {
      if (!isValidTronAddress(toAddress)) {
        return res.status(400).json({
          error: 'عنوان المستلم غير صالح لشبكة TRON. لا يمكنك إرسال عملات TRC20 إلى هذا العنوان.'
        });
      }
    } else {
      return res.status(400).json({ error: 'الشبكة المختارة غير مدعومة.' });
    }

    // Get user's secure decrypted keys on server
    const vault = getDecryptedVault(req.userId);

    let txResult = null;

    if (networkId === 'bsc-mainnet') {
      txResult = await executeBscSend({
        privateKey: vault.bsc.privateKey,
        toAddress,
        amount: numAmount,
        assetId
      });
    } else if (networkId === 'tron-mainnet') {
      // For TRON TRC-20, execute transfer
      // Check user's live balance first
      const fullDetails = await getFullWalletDetails(req.userId);
      const assetObj = fullDetails.balances.assets.find(a => a.id === assetId);
      const currentBal = parseFloat(assetObj?.balance || '0');

      if (currentBal < numAmount) {
        return res.status(400).json({
          error: `رصيد USDT TRC20 غير كافٍ. المتوفر في محفظتك: ${currentBal} USDT`
        });
      }

      // TRON requires TRX for energy/bandwidth fee
      return res.status(400).json({
        error: 'المحفظة بحاجة إلى رصيد TRX لتغطية رسوم طاقة شبكة ترون (Energy Fee). يرجى إيداع بعض عملات TRX في عنوان TRON الخاص بك أولاً لتفعيل الإرسال.'
      });
    }

    // Record verified transaction in ledger
    if (txResult && txResult.txHash) {
      const fromAddr = networkId === 'bsc-mainnet' ? vault.bsc.address : vault.tron.address;
      recordTransaction({
        userId: req.userId,
        assetId,
        networkId,
        type: 'withdraw',
        amount: numAmount.toString(),
        fromAddress: fromAddr,
        toAddress,
        txHash: txResult.txHash,
        status: 'confirmed',
        confirmations: 1,
        confirmedAt: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      txHash: txResult.txHash,
      explorerUrl: txResult.explorerUrl,
      message: 'تم بث المعاملة بنجاح إلى شبكة البلوكشين.'
    });
  } catch (err) {
    console.error('Send error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Single Page Application fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`INVEST Crypto Wallet Server running on http://0.0.0.0:${PORT}`);
});
