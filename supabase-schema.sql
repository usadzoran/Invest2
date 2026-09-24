-- =============================================================================
-- INVEST CRYPTO WALLET PLATFORM - SUPABASE PRODUCTION SCHEMA & RLS POLICIES
-- =============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (With RBAC: USER & OWNER)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'OWNER')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. SITE SETTINGS TABLE (Platform Configurations managed by OWNER)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    site_name TEXT NOT NULL DEFAULT 'INVEST',
    maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
    min_deposit_usdt NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
    min_withdraw_usdt NUMERIC(10, 2) NOT NULL DEFAULT 5.0,
    withdraw_fee_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.5,
    owner_email TEXT NOT NULL DEFAULT 'wahablila31000@gmail.com',
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. SUPPORTED NETWORKS (Blockchain Nodes & Explorers)
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

-- 4. SUPPORTED ASSETS (Cryptocurrencies & Tokens)
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

-- 5. WALLETS (Vaults storing securely encrypted keys - NEVER cleartext)
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    encrypted_vault TEXT NOT NULL, -- AES-256-GCM encrypted payload (iv:tag:ciphertext)
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. WALLET ADDRESSES (Specific on-chain addresses per network)
CREATE TABLE IF NOT EXISTS public.wallet_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    network_id TEXT NOT NULL REFERENCES public.supported_networks(id) ON DELETE RESTRICT,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(wallet_id, network_id)
);

-- 7. WALLET BALANCES (Real balances verified against the blockchain)
CREATE TABLE IF NOT EXISTS public.wallet_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    asset_id TEXT NOT NULL REFERENCES public.supported_assets(id) ON DELETE RESTRICT,
    balance NUMERIC(36, 18) NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(wallet_id, asset_id)
);

-- 8. DEPOSIT ADDRESSES
CREATE TABLE IF NOT EXISTS public.deposit_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    network_id TEXT NOT NULL REFERENCES public.supported_networks(id) ON DELETE RESTRICT,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, network_id)
);

-- 9. TRANSACTIONS (Verified blockchain transaction ledger)
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

-- 10. WITHDRAWALS (Tracking outbound requests and approvals)
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

-- 11. DEPOSITS (Incoming blockchain verified deposits)
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

INSERT INTO public.site_settings (id, site_name, maintenance_mode, min_deposit_usdt, min_withdraw_usdt, withdraw_fee_percent, owner_email)
VALUES ('global', 'INVEST', false, 1.0, 5.0, 0.5, 'wahablila31000@gmail.com')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- HELPER FUNCTIONS FOR SECURITY & RBAC
-- =============================================================================

-- Helper function to check if current authenticated user is OWNER
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'OWNER'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supported_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supported_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposit_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: users can read their own profile; OWNER can view all profiles
CREATE POLICY "Users read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_owner());

CREATE POLICY "Users update own profile non-role" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- 2. Site Settings: Anyone can read settings; ONLY OWNER can update
CREATE POLICY "Anyone can read site settings" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Owner can update site settings" ON public.site_settings
    FOR UPDATE USING (public.is_owner());

-- 3. Supported Networks & Assets: Anyone can read active; OWNER can view all
CREATE POLICY "Anyone can read active networks" ON public.supported_networks
    FOR SELECT USING (active = true OR public.is_owner());

CREATE POLICY "Anyone can read active assets" ON public.supported_assets
    FOR SELECT USING (active = true OR public.is_owner());

-- 4. Wallets: Users can ONLY read their own wallet record (metadata).
-- CRITICAL SECURITY RULE: Even OWNER cannot read other users' encrypted_vault!
CREATE POLICY "Users read own wallet only" ON public.wallets
    FOR SELECT USING (auth.uid() = user_id);

-- 5. Wallet Addresses: Users can read own addresses; OWNER can view user public addresses for audit
CREATE POLICY "Users read own addresses" ON public.wallet_addresses
    FOR SELECT USING (auth.uid() = user_id OR public.is_owner());

-- 6. Wallet Balances: Users read own balances; OWNER can view balances
CREATE POLICY "Users read own balances" ON public.wallet_balances
    FOR SELECT USING (auth.uid() = user_id OR public.is_owner());

-- 7. Transactions: Users read own transactions; OWNER can view all transactions for audit
CREATE POLICY "Users read own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id OR public.is_owner());

-- 8. Deposits: Users read own deposits; OWNER can view all deposits
CREATE POLICY "Users read own deposits" ON public.deposits
    FOR SELECT USING (auth.uid() = user_id OR public.is_owner());

-- 9. Withdrawals: Users read & request own withdrawals; OWNER can view all
CREATE POLICY "Users read own withdrawals" ON public.withdrawals
    FOR SELECT USING (auth.uid() = user_id OR public.is_owner());

CREATE POLICY "Users insert own withdrawals" ON public.withdrawals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- TRIGGER: Auto-create Profile upon Supabase Auth sign-up & Assign OWNER
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    user_role TEXT := 'USER';
BEGIN
    -- Automatically assign OWNER role to the configured site owner email
    IF new.email = 'wahablila31000@gmail.com' THEN
        user_role := 'OWNER';
    END IF;

    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        user_role
    )
    ON CONFLICT (id) DO UPDATE SET
        role = EXCLUDED.role,
        updated_at = NOW();

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
