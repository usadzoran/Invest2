import crypto from 'crypto';
import { ethers } from 'ethers';

const ALGORITHM = 'aes-256-gcm';

function getMasterKey() {
  const hexKey = process.env.WALLET_MASTER_KEY;
  if (!hexKey || hexKey.length < 64) {
    throw new Error('WALLET_MASTER_KEY environment variable is missing or invalid (must be 32 bytes hex).');
  }
  return Buffer.from(hexKey.slice(0, 64), 'hex');
}

/**
 * Encrypt a string or JSON object using AES-256-GCM
 */
export function encryptData(data) {
  const masterKey = getMasterKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);
  
  const text = typeof data === 'string' ? data : JSON.stringify(data);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt AES-256-GCM payload
 */
export function decryptData(encryptedPayload) {
  const masterKey = getMasterKey();
  const [ivHex, authTagHex, encryptedHex] = encryptedPayload.split(':');
  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error('Invalid encrypted vault format.');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  try {
    return JSON.parse(decrypted);
  } catch {
    return decrypted;
  }
}

/**
 * Derive TRON address from uncompressed public key or HDNode
 */
export function deriveTronAddress(tronNode) {
  const pubKey = tronNode.signingKey.publicKey; // 0x04 + 64 bytes
  const pubKeyBytes = ethers.getBytes(pubKey).slice(1); // 64 bytes
  const hash = ethers.keccak256(pubKeyBytes); // 32 bytes
  const address20 = ethers.getBytes('0x41' + hash.slice(-40)); // 21 bytes
  const checksum = ethers.sha256(ethers.sha256(address20)).slice(2, 10);
  const fullBytes = ethers.getBytes(ethers.hexlify(address20) + checksum);
  return ethers.encodeBase58(fullBytes);
}

/**
 * Generate a new self-custody wallet vault with deterministic derivation
 * m/44'/60'/0'/0/0 for BNB Smart Chain (EVM)
 * m/44'/195'/0'/0/0 for TRON
 */
export function generateNewWalletVault() {
  const randomWallet = ethers.Wallet.createRandom();
  const mnemonicPhrase = randomWallet.mnemonic.phrase;
  const mnemonic = ethers.Mnemonic.fromPhrase(mnemonicPhrase);

  // Derivation for BSC / EVM
  const bscNode = ethers.HDNodeWallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0");
  const bscAddress = bscNode.address;
  const bscPrivateKey = bscNode.privateKey;

  // Derivation for TRON
  const tronNode = ethers.HDNodeWallet.fromMnemonic(mnemonic, "m/44'/195'/0'/0/0");
  const tronAddress = deriveTronAddress(tronNode);
  const tronPrivateKey = tronNode.privateKey;

  const rawVault = {
    mnemonic: mnemonicPhrase,
    bsc: {
      path: "m/44'/60'/0'/0/0",
      address: bscAddress,
      privateKey: bscPrivateKey
    },
    tron: {
      path: "m/44'/195'/0'/0/0",
      address: tronAddress,
      privateKey: tronPrivateKey
    },
    createdAt: new Date().toISOString()
  };

  const encryptedVault = encryptData(rawVault);

  return {
    bscAddress,
    tronAddress,
    encryptedVault
  };
}

/**
 * Validate BSC (EVM) Address
 */
export function isValidBscAddress(address) {
  return typeof address === 'string' && ethers.isAddress(address);
}

/**
 * Validate TRON Base58Check Address
 */
export function isValidTronAddress(address) {
  if (typeof address !== 'string' || address.length !== 34 || !address.startsWith('T')) {
    return false;
  }
  try {
    const decodedNum = ethers.decodeBase58(address);
    let hex = decodedNum.toString(16);
    if (hex.length % 2 !== 0) hex = '0' + hex;
    if (hex.length !== 50) return false;
    const bodyHex = '0x' + hex.slice(0, 42);
    const checksumHex = hex.slice(42, 50);
    const bodyBytes = ethers.getBytes(bodyHex);
    if (bodyBytes[0] !== 0x41) return false;
    const expectedChecksum = ethers.sha256(ethers.sha256(bodyBytes)).slice(2, 10);
    return checksumHex.toLowerCase() === expectedChecksum.toLowerCase();
  } catch {
    return false;
  }
}
