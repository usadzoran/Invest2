-- =============================================================================
-- INVEST CRYPTO WALLET PLATFORM - SUPABASE SCHEMA & RLS POLICIES
-- =============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. SUPPORTED NETWORKS
CREATE TABLE IF NOT EXISTS public.supported_networks (
    id TEXT PRIMARY KEY, -- e.g. 'bsc-mainnet', 'tron-mainnet'
    name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    chain_id BIGINT,
    rpc_url TEXT NOT NULL,
    explorer_url TEXT NOT NULL,
    network_type TEXT NOT NULL, -- 'evm', 'tron', 'bitcoin'
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. SUPPORTED ASSETS
CREATE TABLE IF NOT EXISTS public.supported_assets (
    id TEXT PRIMARY KEY, -- e.g. 'usdt-trc20', 'usdt-bep20', 'bnb-bsc'
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    network_id TEXT NOT NULL REFERENCES public.supported_networks(id) ON DELETE RESTRICT,
    contract_address TEXT, -- NULL for native coins like BNB/TRX/BTC
    decimals INT NOT NULL DEFAULT 18,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. WALLETS (Vaults storing securely encrypted keys - NEVER cleartext)
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    encrypted_vault TEXT NOT NULL, -- AES-256-GCM encrypted payload (iv:tag:ciphertext)
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. WALLET ADDRESSES (Specific on-chain addresses per network)
CREATE TABLE IF NOT EXISTS public.wallet_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    network_id TEXT NOT NULL REFERENCES public.supported_networks(id) ON DELETE RESTRICT,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(wallet_id, network_id)
);

-- 6. WALLET BALANCES (Real balances verified against the blockchain)
CREATE TABLE IF NOT EXISTS public.wallet_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    asset_id TEXT NOT NULL REFERENCES public.supported_assets(id) ON DELETE RESTRICT,
    balance NUMERIC(36, 18) NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(wallet_id, asset_id)
);

-- 7. DEPOSIT ADDRESSES
CREATE TABLE IF NOT EXISTS public.deposit_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    network_id TEXT NOT NULL REFERENCES public.supported_networks(id) ON DELETE RESTRICT,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, network_id)
);

-- 8. TRANSACTIONS (Verified blockchain transaction ledger)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    asset_id TEXT NOT NULL REFERENCES public.supported_assets(id) ON DELETE RESTRICT,
    network_id TEXT NOT NULL REFERENCES public.supported_networks(id) ON DELETE RESTRICT,
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdraw')),
    amount NUMERIC(36, 18) NOT NULL,
    fee NUMERIC(36, 18) DEFAULT 0,
    from_address TEXT NOT NULL,
    to_address TEXT NOT NULL,
    tx_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'cancelled')),
    confirmations INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    confirmed_at TIMESTAMPTZ,
    UNIQUE(network_id, tx_hash)
);

-- 9. WITHDRAWALS (Tracking outbound requests and approvals)
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    asset_id TEXT NOT NULL REFERENCES public.supported_assets(id) ON DELETE RESTRICT,
    network_id TEXT NOT NULL REFERENCES public.supported_networks(id) ON DELETE RESTRICT,
    amount NUMERIC(36, 18) NOT NULL,
    fee NUMERIC(36, 18) NOT NULL DEFAULT 0,
    destination_address TEXT NOT NULL,
    tx_hash TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMPTZ
);

-- 10. DEPOSITS (Incoming blockchain verified deposits)
CREATE TABLE IF NOT EXISTS public.deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    asset_id TEXT NOT NULL REFERENCES public.supported_assets(id) ON DELETE RESTRICT,
    network_id TEXT NOT NULL REFERENCES public.supported_networks(id) ON DELETE RESTRICT,
    amount NUMERIC(36, 18) NOT NULL,
    from_address TEXT NOT NULL,
    to_address TEXT NOT NULL,
    tx_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    confirmations INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    confirmed_at TIMESTAMPTZ,
    UNIQUE(network_id, tx_hash)
);

-- =============================================================================
-- SEED DATA: OFFICIAL NETWORKS & ASSETS
-- =============================================================================

INSERT INTO public.supported_networks (id, name, symbol, chain_id, rpc_url, explorer_url, network_type, active)
VALUES
    ('bsc-mainnet', 'BNB Smart Chain', 'BSC', 56, 'https://bsc-dataseed.binance.org/', 'https://bscscan.com', 'evm', true),
    ('tron-mainnet', 'TRON Network', 'TRON', NULL, 'https://api.trongrid.io', 'https://tronscan.org', 'tron', true)
ON CONFLICT (id) DO UPDATE SET
    rpc_url = EXCLUDED.rpc_url,
    explorer_url = EXCLUDED.explorer_url,
    active = EXCLUDED.active;

INSERT INTO public.supported_assets (id, symbol, name, network_id, contract_address, decimals, active)
VALUES
    ('bnb-bsc', 'BNB', 'BNB (Native)', 'bsc-mainnet', NULL, 18, true),
    ('usdt-bep20', 'USDT', 'Tether USD (BEP20)', 'bsc-mainnet', '0x55d398326f99059fF775485246999027B3197955', 18, true),
    ('usdt-trc20', 'USDT', 'Tether USD (TRC20)', 'tron-mainnet', 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', 6, true)
ON CONFLICT (id) DO UPDATE SET
    contract_address = EXCLUDED.contract_address,
    decimals = EXCLUDED.decimals,
    active = EXCLUDED.active;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supported_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supported_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposit_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- Profiles: users read and update their own profile only
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Supported Networks & Assets: Anyone authenticated or anonymous can read
CREATE POLICY "Anyone can read active networks" ON public.supported_networks
    FOR SELECT USING (active = true);

CREATE POLICY "Anyone can read active assets" ON public.supported_assets
    FOR SELECT USING (active = true);

-- Wallets: Users can read their own wallet metadata, only backend/owner can access
CREATE POLICY "Users can read own wallet" ON public.wallets
    FOR SELECT USING (auth.uid() = user_id);

-- Wallet Addresses: Users can read their own addresses
CREATE POLICY "Users can read own wallet addresses" ON public.wallet_addresses
    FOR SELECT USING (auth.uid() = user_id);

-- Wallet Balances: Users can read their own balances, cannot forge balance updates directly
CREATE POLICY "Users can read own balances" ON public.wallet_balances
    FOR SELECT USING (auth.uid() = user_id);

-- Deposit Addresses: Users can read own deposit addresses
CREATE POLICY "Users can read own deposit addresses" ON public.deposit_addresses
    FOR SELECT USING (auth.uid() = user_id);

-- Transactions: Users can read own transactions
CREATE POLICY "Users can read own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Withdrawals: Users can view and create withdrawal requests
CREATE POLICY "Users can read own withdrawals" ON public.withdrawals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own withdrawals" ON public.withdrawals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Deposits: Users can read own deposits
CREATE POLICY "Users can read own deposits" ON public.deposits
    FOR SELECT USING (auth.uid() = user_id);

-- =============================================================================
-- TRIGGER: Auto-create Profile upon Supabase Auth sign-up
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
