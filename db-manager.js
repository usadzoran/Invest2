import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { generateNewWalletVault, decryptData } from './crypto-engine.js';
import { fetchAllLiveBalances, fetchTronIncomingDeposits } from './blockchain-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_STORE_FILE = path.join(__dirname, 'data', 'vault-store.json');

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cjmutyofskqaershxkko.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

// In-memory / local fallback store
let localStore = {
  users: {}, // email -> { id, email, passwordHash, fullName, createdAt }
  wallets: {}, // userId -> { id, userId, encryptedVault, createdAt }
  addresses: {}, // userId -> { bscAddress, tronAddress }
  transactions: [] // list of confirmed/pending transactions
};

// Load local store if exists
function loadLocalStore() {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const raw = fs.readFileSync(LOCAL_STORE_FILE, 'utf8');
      localStore = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading local store:', err.message);
  }
}

// Save local store
function saveLocalStore() {
  try {
    fs.mkdirSync(path.dirname(LOCAL_STORE_FILE), { recursive: true });
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(localStore, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local store:', err.message);
  }
}

loadLocalStore();

/**
 * Check if Supabase tables are ready
 */
export async function checkSupabaseStatus() {
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    if (error && error.code === 'PGRST205') {
      return {
        ready: false,
        message: 'جداول Supabase بحاجة إلى تشغيل ملف supabase-schema.sql في لوحة تحكم Supabase SQL Editor.',
        url: SUPABASE_URL
      };
    }
    return {
      ready: true,
      message: 'قاعدة بيانات Supabase متصلة وجداول المحفظة جاهزة بنجاح.',
      url: SUPABASE_URL
    };
  } catch (err) {
    return {
      ready: false,
      message: err.message,
      url: SUPABASE_URL
    };
  }
}

/**
 * Register or login user and ensure they have a single permanent wallet
 */
export async function authenticateOrRegister({ email, password, fullName, isRegister }) {
  const normalizedEmail = email.trim().toLowerCase();

  // Try Supabase Auth first
  let userId = null;
  let supabaseConnected = false;

  try {
    if (isRegister) {
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: password,
        options: {
          data: { full_name: fullName || '' }
        }
      });
      if (!signUpErr && signUpData.user) {
        userId = signUpData.user.id;
        supabaseConnected = true;
      }
    } else {
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password
      });
      if (!signInErr && signInData.user) {
        userId = signInData.user.id;
        supabaseConnected = true;
      }
    }
  } catch (err) {
    console.warn('Supabase auth attempt notice:', err.message);
  }

  // If user exists in local store or needs registration
  if (!userId) {
    if (localStore.users[normalizedEmail]) {
      // Existing user login check
      const user = localStore.users[normalizedEmail];
      if (user.password !== password) {
        throw new Error('كلمة المرور غير صحيحة');
      }
      userId = user.id;
    } else {
      // New user registration
      if (!isRegister) {
        throw new Error('الحساب غير موجود، يرجى إنشاء حساب جديد أولاً');
      }
      userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      localStore.users[normalizedEmail] = {
        id: userId,
        email: normalizedEmail,
        password: password, // For auth
        fullName: fullName || normalizedEmail.split('@')[0],
        createdAt: new Date().toISOString()
      };
      saveLocalStore();
    }
  } else {
    // If authenticated through Supabase, also register in local memory if needed
    if (!localStore.users[normalizedEmail]) {
      localStore.users[normalizedEmail] = {
        id: userId,
        email: normalizedEmail,
        password: password,
        fullName: fullName || normalizedEmail.split('@')[0],
        createdAt: new Date().toISOString()
      };
      saveLocalStore();
    }
  }

  // Ensure user has permanent wallet
  const walletData = await getOrCreateUserWallet(userId, normalizedEmail);

  return {
    userId,
    email: normalizedEmail,
    fullName: localStore.users[normalizedEmail]?.fullName || fullName || '',
    supabaseConnected,
    ...walletData
  };
}

/**
 * Get or create wallet for a user. Never duplicates.
 */
export async function getOrCreateUserWallet(userId, email) {
  // Check if wallet exists in Supabase
  try {
    const { data: sbWallet } = await supabase
      .from('wallets')
      .select('id, encrypted_vault')
      .eq('user_id', userId)
      .maybeSingle();

    if (sbWallet) {
      const { data: sbAddrs } = await supabase
        .from('wallet_addresses')
        .select('network_id, address')
        .eq('wallet_id', sbWallet.id);

      const bscObj = sbAddrs?.find(a => a.network_id === 'bsc-mainnet');
      const tronObj = sbAddrs?.find(a => a.network_id === 'tron-mainnet');

      if (bscObj && tronObj) {
        return {
          walletId: sbWallet.id,
          bscAddress: bscObj.address,
          tronAddress: tronObj.address
        };
      }
    }
  } catch (err) {
    // Supabase table not migrated yet, fallback to local store
  }

  // Check local store
  if (localStore.wallets[userId] && localStore.addresses[userId]) {
    return {
      walletId: localStore.wallets[userId].id,
      bscAddress: localStore.addresses[userId].bscAddress,
      tronAddress: localStore.addresses[userId].tronAddress
    };
  }

  // Generate a brand new real cryptographic vault
  const vault = generateNewWalletVault();
  const walletId = 'wlt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);

  localStore.wallets[userId] = {
    id: walletId,
    userId,
    encryptedVault: vault.encryptedVault,
    createdAt: new Date().toISOString()
  };

  localStore.addresses[userId] = {
    bscAddress: vault.bscAddress,
    tronAddress: vault.tronAddress
  };

  saveLocalStore();

  // Try persisting to Supabase if tables exist
  try {
    await supabase.from('profiles').upsert({
      id: userId,
      email: email,
      full_name: localStore.users[email]?.fullName || ''
    });

    const { data: insWallet } = await supabase.from('wallets').insert({
      id: walletId,
      user_id: userId,
      encrypted_vault: vault.encryptedVault
    }).select().maybeSingle();

    if (insWallet) {
      await supabase.from('wallet_addresses').insert([
        {
          wallet_id: walletId,
          user_id: userId,
          network_id: 'bsc-mainnet',
          address: vault.bscAddress
        },
        {
          wallet_id: walletId,
          user_id: userId,
          network_id: 'tron-mainnet',
          address: vault.tronAddress
        }
      ]);
    }
  } catch (err) {
    // Ignore migration pending
  }

  return {
    walletId,
    bscAddress: vault.bscAddress,
    tronAddress: vault.tronAddress
  };
}

/**
 * Get user wallet keys securely on server (for transaction signing)
 */
export function getDecryptedVault(userId) {
  const wallet = localStore.wallets[userId];
  if (!wallet || !wallet.encryptedVault) {
    throw new Error('لم يتم العثور على محفظة للمستخدم');
  }
  return decryptData(wallet.encryptedVault);
}

/**
 * Fetch full wallet details with real on-chain balances and transactions
 */
export async function getFullWalletDetails(userId) {
  const user = Object.values(localStore.users).find(u => u.id === userId);
  if (!user) throw new Error('المستخدم غير مسجل');

  const addrs = localStore.addresses[userId];
  if (!addrs) throw new Error('لا توجد عناوين محفظة للمستخدم');

  // Query real-time balances from blockchain
  const liveBalances = await fetchAllLiveBalances(addrs.bscAddress, addrs.tronAddress);

  // Sync TRON incoming deposits automatically
  try {
    const incomingTron = await fetchTronIncomingDeposits(addrs.tronAddress);
    for (const dep of incomingTron) {
      const exists = localStore.transactions.some(tx => tx.txHash === dep.txHash);
      if (!exists) {
        localStore.transactions.unshift({
          id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          userId,
          walletId: localStore.wallets[userId]?.id,
          assetId: dep.assetId,
          networkId: dep.networkId,
          type: 'deposit',
          amount: dep.amount,
          fee: '0',
          fromAddress: dep.from,
          toAddress: dep.to,
          txHash: dep.txHash,
          status: 'confirmed',
          confirmations: 12,
          createdAt: dep.timestamp,
          confirmedAt: dep.timestamp
        });
        saveLocalStore();
      }
    }
  } catch (err) {
    console.error('Error auto-syncing Tron deposits:', err.message);
  }

  // Filter user transactions
  const userTxs = localStore.transactions
    .filter(tx => tx.userId === userId || tx.toAddress === addrs.bscAddress || tx.toAddress === addrs.tronAddress)
    .slice(0, 50);

  return {
    userId,
    email: user.email,
    fullName: user.fullName,
    addresses: {
      bsc: addrs.bscAddress,
      tron: addrs.tronAddress
    },
    balances: liveBalances,
    transactions: userTxs
  };
}

/**
 * Record a transaction (with duplicate prevention and multi-table sync)
 */
export async function recordTransaction(txData) {
  // Prevent duplicate txHash on same network
  const existing = localStore.transactions.find(
    tx => tx.txHash === txData.txHash && tx.networkId === txData.networkId
  );

  if (existing) {
    // Update status or confirmations if changed
    if (txData.status) existing.status = txData.status;
    if (txData.confirmations !== undefined) existing.confirmations = txData.confirmations;
    saveLocalStore();
    return existing;
  }

  const record = {
    id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    confirmations: 12,
    ...txData
  };

  localStore.transactions.unshift(record);
  saveLocalStore();

  // Also attempt Supabase insert if tables exist
  try {
    // 1. Transactions table
    await supabase.from('transactions').insert([{
      user_id: record.userId,
      wallet_id: record.walletId,
      asset_id: record.assetId,
      network_id: record.networkId,
      type: record.type,
      amount: record.amount,
      fee: record.fee || 0,
      from_address: record.fromAddress,
      to_address: record.toAddress,
      tx_hash: record.txHash,
      status: record.status,
      confirmations: record.confirmations
    }]);

    // 2. Deposits / Withdrawals table
    if (record.type === 'deposit') {
      await supabase.from('deposits').insert([{
        user_id: record.userId,
        wallet_id: record.walletId,
        asset_id: record.assetId,
        network_id: record.networkId,
        amount: record.amount,
        from_address: record.fromAddress,
        to_address: record.toAddress,
        tx_hash: record.txHash,
        status: record.status,
        confirmations: record.confirmations
      }]);
    } else if (record.type === 'withdraw') {
      await supabase.from('withdrawals').insert([{
        user_id: record.userId,
        wallet_id: record.walletId,
        asset_id: record.assetId,
        network_id: record.networkId,
        amount: record.amount,
        fee: record.fee || 0,
        destination_address: record.toAddress,
        tx_hash: record.txHash,
        status: 'completed'
      }]);
    }
  } catch (err) {
    // Supabase migration pending, ignore
  }

  return record;
}
