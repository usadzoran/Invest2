// INVEST Crypto Wallet Application Logic

let currentWalletData = null;
let currentEstimatedFee = null;

// Modal helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Show Toast
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toastNotification');
  const icon = document.getElementById('toastIcon');
  const msg = document.getElementById('toastMessage');

  if (toast && msg) {
    icon.innerText = isSuccess ? '✓' : '⚠️';
    icon.style.color = isSuccess ? 'var(--green)' : '#ef4444';
    toast.style.borderColor = isSuccess ? 'var(--green)' : '#ef4444';
    msg.innerText = message;
    toast.style.display = 'flex';

    setTimeout(() => {
      toast.style.display = 'none';
    }, 3500);
  }
}

// Copy to Clipboard
function copyText(text) {
  if (!text || text.includes('...')) return;
  navigator.clipboard.writeText(text).then(() => {
    showToast('تم نسخ العنوان إلى الحافظة بنجاح ✓');
  }).catch(() => {
    // Fallback
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('تم نسخ العنوان بنجاح ✓');
  });
}

function copyReceiveAddress() {
  const addr = document.getElementById('receiveAddressText')?.innerText;
  const btn = document.getElementById('copyReceiveBtn');
  if (addr) {
    copyText(addr);
    if (btn) {
      const orig = btn.innerText;
      btn.innerText = 'تم النسخ! ✓';
      setTimeout(() => { btn.innerText = orig; }, 2000);
    }
  }
}

// System status check
async function checkSystemStatus() {
  try {
    const res = await fetch('/api/system/status');
    if (!res.ok) return;
    const data = await res.json();

    const sbDot = document.getElementById('supabaseDot');
    const sbText = document.getElementById('supabaseStatusText');
    const bnbText = document.getElementById('liveBnbPriceText');

    if (data.supabase) {
      if (data.supabase.ready) {
        sbDot.className = 'status-dot';
        sbText.innerText = 'قاعدة البيانات Supabase: متصلة وجاهزة';
      } else {
        sbDot.className = 'status-dot warning';
        sbText.innerText = 'Supabase: بانتظار تنفيذ schema.sql';
        sbText.title = data.supabase.message;
      }
    }

    if (data.blockchain && data.blockchain.bnbPriceUsd) {
      bnbText.innerText = `$${data.blockchain.bnbPriceUsd.toFixed(2)}`;
    }
  } catch (err) {
    console.warn('System status fetch failed:', err.message);
  }
}

// Authentication Check
function getAuthToken() {
  return localStorage.getItem('invest_token');
}

function getUserData() {
  try {
    const raw = localStorage.getItem('invest_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function updateAuthUI() {
  const token = getAuthToken();
  const user = getUserData();

  const guestNav = document.getElementById('guestNavActions');
  const userNav = document.getElementById('userNavActions');
  const mobileGuestNav = document.getElementById('mobileGuestActions');
  const mobileUserNav = document.getElementById('mobileUserActions');
  const navEmail = document.getElementById('navUserEmail');
  const mobileNavEmail = document.getElementById('mobileNavUserEmail');

  const guestWalletView = document.getElementById('walletGuestView');
  const authWalletView = document.getElementById('walletAuthView');

  const navAdminBtn = document.getElementById('navAdminBtn');
  const mobileNavAdminBtn = document.getElementById('mobileNavAdminBtn');
  const adminPanel = document.getElementById('adminPanel');

  if (token && user) {
    if (guestNav) guestNav.style.display = 'none';
    if (userNav) userNav.style.display = 'flex';
    if (mobileGuestNav) mobileGuestNav.style.display = 'none';
    if (mobileUserNav) mobileUserNav.style.display = 'flex';

    const isOwner = user.role === 'OWNER';
    if (navAdminBtn) navAdminBtn.style.display = isOwner ? 'inline-block' : 'none';
    if (mobileNavAdminBtn) mobileNavAdminBtn.style.display = isOwner ? 'block' : 'none';

    const displayName = (user.fullName || user.email) + (isOwner ? ' (👑 OWNER)' : '');
    if (navEmail) navEmail.innerText = displayName;
    if (mobileNavEmail) mobileNavEmail.innerText = displayName;

    if (guestWalletView) guestWalletView.style.display = 'none';
    if (authWalletView) authWalletView.style.display = 'block';

    if (isOwner && adminPanel) {
      adminPanel.style.display = 'block';
      loadAdminDashboardData();
    } else if (adminPanel) {
      adminPanel.style.display = 'none';
    }

    fetchWalletDetails();
  } else {
    if (guestNav) guestNav.style.display = 'flex';
    if (userNav) userNav.style.display = 'none';
    if (mobileGuestNav) mobileGuestNav.style.display = 'flex';
    if (mobileUserNav) mobileUserNav.style.display = 'none';

    if (navAdminBtn) navAdminBtn.style.display = 'none';
    if (mobileNavAdminBtn) mobileNavAdminBtn.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'none';

    if (guestWalletView) guestWalletView.style.display = 'block';
    if (authWalletView) authWalletView.style.display = 'none';
  }
}

// Fetch Wallet Details
async function fetchWalletDetails() {
  const token = getAuthToken();
  if (!token) return;

  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) refreshBtn.innerHTML = '<span>⏳</span> جاري التحديث...';

  try {
    const res = await fetch('/api/wallet/details', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.status === 401) {
      logoutUser();
      return;
    }

    if (!res.ok) throw new Error('فشل جلب بيانات المحفظة');
    const data = await res.json();
    currentWalletData = data;
    renderWalletData(data);
  } catch (err) {
    console.error('Error loading wallet:', err.message);
  } finally {
    if (refreshBtn) refreshBtn.innerHTML = '<span>🔄</span> تحديث الرصيد';
  }
}

// Refresh Wallet Balances
async function refreshWalletBalances() {
  const token = getAuthToken();
  if (!token) return;

  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) refreshBtn.innerHTML = '<span>⏳</span> فحص الـ Blockchain...';

  try {
    const res = await fetch('/api/wallet/refresh', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      currentWalletData = data;
      renderWalletData(data);
      showToast('تم تحديث الأرصدة الحقيقية من الـ Blockchain بنجاح ✓');
    }
  } catch (err) {
    showToast('تعذر تحديث الأرصدة حالياً', false);
  } finally {
    if (refreshBtn) refreshBtn.innerHTML = '<span>🔄</span> تحديث الرصيد';
  }
}

// Render Wallet Data
function renderWalletData(data) {
  if (!data || !data.balances) return;

  // Total Balance Display
  const totalUsdElem = document.getElementById('walletTotalUsdDisplay');
  if (totalUsdElem) {
    totalUsdElem.innerText = `$${parseFloat(data.balances.totalUsd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Render Assets
  const assets = data.balances.assets || [];
  assets.forEach((asset) => {
    const balElem = document.getElementById(`bal-${asset.id}`);
    const fiatElem = document.getElementById(`fiat-${asset.id}`);
    const addrElem = document.getElementById(`addr-${asset.id}`);

    if (balElem) {
      balElem.innerText = `${parseFloat(asset.balance).toFixed(asset.id === 'bnb-bsc' ? 4 : 2)} ${asset.symbol}`;
    }
    if (fiatElem) {
      fiatElem.innerText = `≈ $${asset.valueUsd} USD`;
    }
    if (addrElem) {
      const fullAddr = asset.address;
      addrElem.innerText = fullAddr;
      addrElem.title = fullAddr;
    }
  });

  // Render Transaction History
  renderTransactionHistory(data.transactions || []);
}

function renderTransactionHistory(transactions) {
  const tbody = document.getElementById('txTableBody');
  if (!tbody) return;

  if (transactions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-tx-placeholder">
          لا توجد معاملات مسجلة بعد. عند استلام أو إرسال عملات ستظهر تفاصيل المعاملة وروابط Blockchain Explorer هنا.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = transactions.map(tx => {
    const isDeposit = tx.type === 'deposit';
    const explorerBase = tx.networkId === 'tron-mainnet' ? 'https://tronscan.org/#/transaction/' : 'https://bscscan.com/tx/';
    const shortTx = tx.txHash ? `${tx.txHash.slice(0, 8)}...${tx.txHash.slice(-6)}` : '—';
    const dateFormatted = new Date(tx.createdAt || Date.now()).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const assetName = tx.assetId === 'usdt-trc20' ? 'USDT (TRC20)' : tx.assetId === 'usdt-bep20' ? 'USDT (BEP20)' : 'BNB';
    const networkName = tx.networkId === 'tron-mainnet' ? 'TRON' : 'BSC';

    return `
      <tr>
        <td>
          <span class="tx-type-badge ${isDeposit ? 'deposit' : 'withdraw'}">
            ${isDeposit ? '📥 إيداع' : '📤 إرسال'}
          </span>
        </td>
        <td>
          <strong>${assetName}</strong>
          <span style="font-size: 11px; color: var(--muted); display: block;">شبكة ${networkName}</span>
        </td>
        <td>
          <strong style="color: ${isDeposit ? 'var(--green)' : '#f59e0b'};">
            ${isDeposit ? '+' : '-'}${parseFloat(tx.amount).toFixed(4)}
          </strong>
        </td>
        <td>
          <span style="font-family: monospace; font-size: 12px; color: var(--muted);" title="${isDeposit ? tx.fromAddress : tx.toAddress}">
            ${isDeposit ? (tx.fromAddress ? `${tx.fromAddress.slice(0, 6)}...${tx.fromAddress.slice(-4)}` : 'خارجي') : (tx.toAddress ? `${tx.toAddress.slice(0, 6)}...${tx.toAddress.slice(-4)}` : '—')}
          </span>
        </td>
        <td>
          ${tx.txHash ? `
            <a href="${explorerBase}${tx.txHash}" target="_blank" rel="noopener noreferrer" class="tx-hash-link">
              ${shortTx} ↗
            </a>
          ` : '—'}
        </td>
        <td>
          <span style="color: ${tx.status === 'confirmed' ? 'var(--green)' : '#f59e0b'}; font-size: 12px;">
            ${tx.status === 'confirmed' ? 'مؤكدة ✓' : 'قيد المعالجة'}
          </span>
        </td>
        <td style="font-size: 12px; color: var(--muted);">
          ${dateFormatted}
        </td>
      </tr>
    `;
  }).join('');
}

// Receive Modal
function openReceiveModal(assetId = 'usdt-trc20') {
  if (!getAuthToken()) {
    openModal('loginModal');
    return;
  }
  const select = document.getElementById('receiveAssetSelect');
  if (select && assetId) {
    select.value = assetId;
  }
  openModal('receiveModal');
  updateReceiveModalDetails();
}

async function updateReceiveModalDetails() {
  const select = document.getElementById('receiveAssetSelect');
  const warningElem = document.getElementById('receiveNetworkWarning');
  const addrElem = document.getElementById('receiveAddressText');
  const qrImg = document.getElementById('receiveQrImage');

  if (!select || !currentWalletData) return;

  const assetId = select.value;
  let targetAddress = '';
  let warningHtml = '';

  if (assetId === 'usdt-trc20') {
    targetAddress = currentWalletData.addresses?.tron || '';
    warningHtml = '⚠️ <strong>تنبيه مهم:</strong> أرسل فقط عملة <strong>USDT</strong> عبر شبكة <strong>TRON (TRC20)</strong> إلى هذا العنوان. إرسال عملات عبر شبكات أخرى مثل BEP20 أو ERC20 سيؤدي إلى فقدانها نهائياً.';
  } else if (assetId === 'usdt-bep20') {
    targetAddress = currentWalletData.addresses?.bsc || '';
    warningHtml = '⚠️ <strong>تنبيه مهم:</strong> أرسل فقط عملة <strong>USDT</strong> عبر شبكة <strong>BNB Smart Chain (BEP20)</strong> إلى هذا العنوان. لا ترسل عبر شبكة TRON أو شبكات أخرى.';
  } else if (assetId === 'bnb-bsc') {
    targetAddress = currentWalletData.addresses?.bsc || '';
    warningHtml = '⚠️ <strong>تنبيه مهم:</strong> أرسل فقط عملة <strong>BNB</strong> عبر شبكة <strong>BNB Smart Chain</strong> إلى هذا العنوان.';
  }

  if (addrElem) addrElem.innerText = targetAddress;
  if (warningElem) warningElem.innerHTML = warningHtml;

  // Generate QR Code
  if (qrImg && targetAddress) {
    try {
      const res = await fetch(`/api/wallet/qrcode?text=${encodeURIComponent(targetAddress)}`);
      if (res.ok) {
        const json = await res.json();
        qrImg.src = json.dataUrl;
      }
    } catch (err) {
      console.error('QR fetch error:', err.message);
    }
  }
}

// Send Modal
function openSendModal(assetId = 'usdt-trc20') {
  if (!getAuthToken()) {
    openModal('loginModal');
    return;
  }
  const select = document.getElementById('sendAssetSelect');
  if (select && assetId) {
    select.value = assetId;
  }
  const resultMsg = document.getElementById('sendResultMsg');
  if (resultMsg) resultMsg.style.display = 'none';

  document.getElementById('sendToAddress').value = '';
  document.getElementById('sendAmountInput').value = '';
  document.getElementById('sendAddressFeedback').innerHTML = '';

  openModal('sendModal');
  updateSendModalDetails();
}

async function updateSendModalDetails() {
  const select = document.getElementById('sendAssetSelect');
  if (!select || !currentWalletData) return;

  const assetId = select.value;
  const asset = currentWalletData.balances?.assets?.find(a => a.id === assetId);
  const balLabel = document.getElementById('sendAvailableBalanceLabel');

  if (balLabel && asset) {
    balLabel.innerText = `الرصيد المتاح: ${asset.balance} ${asset.symbol} (الحد الأقصى)`;
  }

  // Fetch estimated fee
  const networkId = assetId === 'usdt-trc20' ? 'tron-mainnet' : 'bsc-mainnet';
  const feeText = document.getElementById('sendEstimatedFeeText');
  try {
    const res = await fetch('/api/wallet/estimate-fee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ networkId, assetId })
    });
    if (res.ok) {
      const feeData = await res.json();
      currentEstimatedFee = feeData;
      if (feeText) {
        feeText.innerText = `${feeData.feeAmount} ${feeData.feeSymbol} (≈ $${feeData.feeUsd || '0.00'})`;
      }
    }
  } catch (err) {
    if (feeText) feeText.innerText = 'تقديري: 0.0003 BNB / 15 TRX';
  }

  validateSendAddressLive();
  calculateSendTotal();
}

function fillMaxAmount() {
  const select = document.getElementById('sendAssetSelect');
  if (!select || !currentWalletData) return;
  const assetId = select.value;
  const asset = currentWalletData.balances?.assets?.find(a => a.id === assetId);
  if (!asset) return;

  let maxVal = parseFloat(asset.balance || 0);
  if (assetId === 'bnb-bsc' && currentEstimatedFee) {
    // Leave some BNB for gas
    const gasReserve = parseFloat(currentEstimatedFee.feeAmount || 0.001);
    maxVal = Math.max(0, maxVal - gasReserve);
  }

  const amountInput = document.getElementById('sendAmountInput');
  if (amountInput) {
    amountInput.value = maxVal > 0 ? maxVal.toFixed(4) : '0';
    calculateSendTotal();
  }
}

function calculateSendTotal() {
  const amountInput = document.getElementById('sendAmountInput');
  const totalText = document.getElementById('sendTotalDeductionText');
  const select = document.getElementById('sendAssetSelect');

  if (!amountInput || !totalText || !select) return;

  const val = parseFloat(amountInput.value || 0);
  const assetId = select.value;
  const symbol = assetId === 'bnb-bsc' ? 'BNB' : 'USDT';

  totalText.innerText = `${val.toFixed(4)} ${symbol}`;
}

async function validateSendAddressLive() {
  const addrInput = document.getElementById('sendToAddress');
  const feedback = document.getElementById('sendAddressFeedback');
  const select = document.getElementById('sendAssetSelect');
  if (!addrInput || !feedback || !select) return;

  const address = addrInput.value.trim();
  const assetId = select.value;
  const networkId = assetId === 'usdt-trc20' ? 'tron-mainnet' : 'bsc-mainnet';

  if (!address) {
    feedback.innerHTML = '';
    return;
  }

  // Cross-network checks to prevent loss of funds
  if (networkId === 'tron-mainnet' && address.startsWith('0x')) {
    feedback.innerHTML = '<span style="color: #ef4444;">❌ تنبيه: العنوان يبدأ بـ 0x وهو يتبع شبكة EVM/BSC وليس شبكة TRON. لا يمكنك إرسال USDT TRC20 إلى هذا العنوان.</span>';
    return;
  }
  if (networkId === 'bsc-mainnet' && address.startsWith('T')) {
    feedback.innerHTML = '<span style="color: #ef4444;">❌ تنبيه: العنوان يبدأ بـ T وهو يتبع شبكة TRON وليس شبكة BNB Smart Chain. لا يمكنك إرسال عملات BEP20 إلى هذا العنوان.</span>';
    return;
  }

  // Call validation API
  try {
    const res = await fetch('/api/wallet/validate-address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, networkId })
    });
    const data = await res.json();
    if (data.valid) {
      feedback.innerHTML = `<span style="color: var(--green);">✓ ${data.message}</span>`;
    } else {
      feedback.innerHTML = `<span style="color: #ef4444;">❌ ${data.message}</span>`;
    }
  } catch (err) {
    feedback.innerHTML = '';
  }
}

// Handle Send Transaction Submit
async function handleSendTransaction(event) {
  event.preventDefault();

  const token = getAuthToken();
  if (!token) {
    openModal('loginModal');
    return;
  }

  const select = document.getElementById('sendAssetSelect');
  const addrInput = document.getElementById('sendToAddress');
  const amountInput = document.getElementById('sendAmountInput');
  const submitBtn = document.getElementById('sendSubmitBtn');
  const resultMsg = document.getElementById('sendResultMsg');

  const assetId = select.value;
  const networkId = assetId === 'usdt-trc20' ? 'tron-mainnet' : 'bsc-mainnet';
  const toAddress = addrInput.value.trim();
  const amount = amountInput.value.trim();

  resultMsg.style.display = 'none';
  submitBtn.disabled = true;
  submitBtn.innerText = 'جاري التحقق وبث المعاملة إلى الـ Blockchain...';

  try {
    const res = await fetch('/api/wallet/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        assetId,
        networkId,
        toAddress,
        amount
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'فشلت عملية الإرسال');
    }

    resultMsg.className = 'network-alert-box';
    resultMsg.style.borderColor = 'var(--green)';
    resultMsg.style.color = 'var(--green)';
    resultMsg.style.background = 'rgba(25, 213, 138, 0.1)';
    resultMsg.innerHTML = `
      ✓ <strong>تم بنجاح!</strong> تم بث المعاملة إلى البلوكشين.<br>
      <span style="font-size: 12px; word-break: break-all;">رمز المعاملة: <strong>${data.txHash}</strong></span><br>
      <a href="${data.explorerUrl}" target="_blank" rel="noopener noreferrer" style="color: #fff; text-decoration: underline; margin-top: 6px; display: inline-block;">
        عرض المعاملة على المستكشف (Blockchain Explorer) ↗
      </a>
    `;
    resultMsg.style.display = 'block';

    showToast('تم إرسال المعاملة بنجاح إلى البلوكشين ✓');
    addrInput.value = '';
    amountInput.value = '';

    // Refresh balances
    setTimeout(() => {
      fetchWalletDetails();
    }, 1500);
  } catch (err) {
    resultMsg.className = 'network-alert-box danger';
    resultMsg.style.display = 'block';
    resultMsg.innerHTML = `❌ <strong>خطأ في الإرسال:</strong> ${err.message}`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = 'تأكيد وإرسال المعاملة إلى البلوكشين';
  }
}

// Handle Register
async function handleRegister(event) {
  event.preventDefault();
  const fullName = document.getElementById('registerFullName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const btn = document.getElementById('registerSubmitBtn');
  const errBox = document.getElementById('registerError');

  errBox.style.display = 'none';
  btn.disabled = true;
  btn.innerText = 'جاري إنشاء المحفظة وتشفير المفاتيح...';

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'فشل إنشاء الحساب');

    localStorage.setItem('invest_token', data.token);
    localStorage.setItem('invest_user', JSON.stringify(data.user));

    showToast('تم إنشاء الحساب وتوليد عناوين المحفظة بنجاح ✓');
    closeModal('registerModal');
    updateAuthUI();

    // Scroll to wallet
    const walletSection = document.getElementById('wallet');
    if (walletSection) walletSection.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    errBox.innerText = err.message;
    errBox.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.innerText = 'إنشاء الحساب وتوليد المحفظة';
  }
}

// Handle Login
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginSubmitBtn');
  const errBox = document.getElementById('loginError');

  errBox.style.display = 'none';
  btn.disabled = true;
  btn.innerText = 'جاري التحقق والاتصال بالمحفظة...';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'فشل تسجيل الدخول');

    localStorage.setItem('invest_token', data.token);
    localStorage.setItem('invest_user', JSON.stringify(data.user));

    showToast('تم تسجيل الدخول بنجاح ✓');
    closeModal('loginModal');
    updateAuthUI();

    // Scroll to wallet
    const walletSection = document.getElementById('wallet');
    if (walletSection) walletSection.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    errBox.innerText = err.message;
    errBox.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.innerText = 'تسجيل الدخول';
  }
}

// Logout
function logoutUser() {
  const token = getAuthToken();
  if (token) {
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).catch(() => {});
  }
  localStorage.removeItem('invest_token');
  localStorage.removeItem('invest_user');
  currentWalletData = null;
  updateAuthUI();
  showToast('تم تسجيل الخروج');
}

// Verify Transaction Modal
function openVerifyTxModal() {
  if (!getAuthToken()) {
    openModal('loginModal');
    return;
  }
  const resultMsg = document.getElementById('verifyTxResultMsg');
  if (resultMsg) resultMsg.style.display = 'none';
  const input = document.getElementById('verifyTxHashInput');
  if (input) input.value = '';
  openModal('verifyTxModal');
}

async function handleVerifyTx(event) {
  event.preventDefault();
  const token = getAuthToken();
  if (!token) return;

  const networkSelect = document.getElementById('verifyNetworkSelect');
  const txInput = document.getElementById('verifyTxHashInput');
  const btn = document.getElementById('verifyTxSubmitBtn');
  const resultMsg = document.getElementById('verifyTxResultMsg');

  const networkId = networkSelect.value;
  const txHash = txInput.value.trim();

  resultMsg.style.display = 'none';
  btn.disabled = true;
  btn.innerText = 'جاري الفحص المباشر على الـ Blockchain...';

  try {
    const res = await fetch('/api/wallet/verify-tx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ networkId, txHash })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'تعذر تأكيد المعاملة');
    }

    resultMsg.className = 'network-alert-box';
    resultMsg.style.borderColor = 'var(--green)';
    resultMsg.style.color = 'var(--green)';
    resultMsg.style.background = 'rgba(25, 213, 138, 0.1)';
    resultMsg.innerHTML = `
      ✓ <strong>تم التحقق بنجاح من المعاملة!</strong><br>
      • الحالة: <strong>${data.status === 'confirmed' ? 'مؤكدة على البلوكشين' : 'قيد التأكيد'}</strong><br>
      • عدد التأكيدات (Confirmations): <strong>${data.confirmations || 0}</strong><br>
      • المبلغ: <strong>${data.amount || '0'}</strong><br>
      <a href="${data.explorerUrl}" target="_blank" rel="noopener noreferrer" style="color: #fff; text-decoration: underline; margin-top: 6px; display: inline-block;">
        عرض المعاملة على المستكشف ↗
      </a>
    `;
    resultMsg.style.display = 'block';

    showToast('تم التحقق من المعاملة وتحديث السجل ✓');
    fetchWalletDetails();
  } catch (err) {
    resultMsg.className = 'network-alert-box danger';
    resultMsg.style.display = 'block';
    resultMsg.innerHTML = `❌ <strong>نتيجة الفحص:</strong> ${err.message}`;
  } finally {
    btn.disabled = false;
    btn.innerText = 'فحص وتأكيد المعاملة الآن';
  }
}

// OWNER Admin Dashboard Logic
function scrollToAdminPanel() {
  const panel = document.getElementById('adminPanel');
  if (panel) {
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth' });
    loadAdminDashboardData();
  }
}

async function loadAdminDashboardData() {
  const token = getAuthToken();
  if (!token) return;

  const accessDenied = document.getElementById('adminAccessDenied');
  const authContent = document.getElementById('adminAuthorizedContent');

  try {
    const res = await fetch('/api/admin/overview', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.status === 403) {
      if (accessDenied) accessDenied.style.display = 'block';
      if (authContent) authContent.style.display = 'none';
      return;
    }

    if (!res.ok) throw new Error('فشل تحميل بيانات لوحة الإدارة');

    const data = await res.json();

    if (accessDenied) accessDenied.style.display = 'none';
    if (authContent) authContent.style.display = 'block';

    // Populate stats
    const uStat = document.getElementById('adminStatUsers');
    const wStat = document.getElementById('adminStatWallets');
    const txStat = document.getElementById('adminStatTxs');
    const depStat = document.getElementById('adminStatDeposits');
    const wthStat = document.getElementById('adminStatWithdrawals');

    if (uStat) uStat.innerText = data.stats.totalUsers || 0;
    if (wStat) wStat.innerText = data.stats.totalWallets || 0;
    if (txStat) txStat.innerText = data.stats.totalTransactions || 0;
    if (depStat) depStat.innerText = data.stats.totalDeposits || 0;
    if (wthStat) wthStat.innerText = data.stats.totalWithdrawals || 0;

    // Populate Users table
    const usersTbody = document.getElementById('adminUsersTableBody');
    if (usersTbody) {
      if (!data.users || data.users.length === 0) {
        usersTbody.innerHTML = '<tr><td colspan="6" class="empty-tx-placeholder">لا يوجد مستخدمون مسجلون بعد.</td></tr>';
      } else {
        usersTbody.innerHTML = data.users.map(u => `
          <tr>
            <td><strong>${u.email}</strong></td>
            <td>${u.fullName || '—'}</td>
            <td>
              <span class="role-tag ${u.role === 'OWNER' ? 'owner' : 'user'}">
                ${u.role === 'OWNER' ? '👑 OWNER' : 'USER'}
              </span>
            </td>
            <td><code style="font-size: 11px;">${u.tronAddress || '—'}</code></td>
            <td><code style="font-size: 11px;">${u.bscAddress || '—'}</code></td>
            <td><small>${new Date(u.createdAt).toLocaleDateString('ar-EG')}</small></td>
          </tr>
        `).join('');
      }
    }

    // Populate Unified Ledger table
    const ledgerTbody = document.getElementById('adminLedgerTableBody');
    if (ledgerTbody) {
      if (!data.recentTransactions || data.recentTransactions.length === 0) {
        ledgerTbody.innerHTML = '<tr><td colspan="7" class="empty-tx-placeholder">لا توجد عمليات مسجلة في السجل العام بعد.</td></tr>';
      } else {
        ledgerTbody.innerHTML = data.recentTransactions.map(tx => {
          const isDeposit = tx.type === 'deposit';
          const typeBadge = `<span class="tx-badge ${isDeposit ? 'tx-deposit' : 'tx-withdraw'}">${isDeposit ? 'إيداع وارد' : 'سحب صادر'}</span>`;
          const explorer = tx.networkId === 'tron-mainnet'
            ? `https://tronscan.org/#/transaction/${tx.txHash}`
            : `https://bscscan.com/tx/${tx.txHash}`;

          return `
            <tr>
              <td>${typeBadge}</td>
              <td>${tx.assetId || 'USDT'} (${tx.networkId === 'tron-mainnet' ? 'TRON' : 'BSC'})</td>
              <td><strong>${tx.amount}</strong></td>
              <td><code style="font-size: 11px;">${(tx.toAddress || tx.destinationAddress || '').substring(0, 10)}...</code></td>
              <td>
                <a href="${explorer}" target="_blank" rel="noopener noreferrer" style="color: var(--green); text-decoration: underline; font-size: 12px;">
                  ${tx.txHash.substring(0, 10)}... ↗
                </a>
              </td>
              <td><span style="color: var(--green); font-size: 12px;">✓ ${tx.status || 'confirmed'}</span></td>
              <td><small>${new Date(tx.createdAt).toLocaleDateString('ar-EG')}</small></td>
            </tr>
          `;
        }).join('');
      }
    }

    // Populate Settings form
    if (data.settings) {
      const sName = document.getElementById('settingSiteName');
      const sMaint = document.getElementById('settingMaintenanceMode');
      const sMinDep = document.getElementById('settingMinDeposit');
      const sMinWth = document.getElementById('settingMinWithdraw');
      const sFee = document.getElementById('settingWithdrawFee');
      const sEmail = document.getElementById('settingOwnerEmail');

      if (sName) sName.value = data.settings.siteName || 'INVEST';
      if (sMaint) sMaint.checked = !!data.settings.maintenanceMode;
      if (sMinDep) sMinDep.value = data.settings.minDepositUsdt || 1.0;
      if (sMinWth) sMinWth.value = data.settings.minWithdrawUsdt || 5.0;
      if (sFee) sFee.value = data.settings.withdrawFeePercent || 0.5;
      if (sEmail) sEmail.value = data.settings.ownerEmail || 'wahablila31000@gmail.com';
    }
  } catch (err) {
    console.error('Error fetching admin data:', err.message);
  }
}

function switchAdminTab(tabName) {
  const tabs = ['users', 'ledger', 'settings'];
  tabs.forEach(t => {
    const btn = document.getElementById('tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
    const panel = document.getElementById('adminTab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) btn.classList.toggle('active', t === tabName);
    if (panel) panel.style.display = t === tabName ? 'block' : 'none';
  });
}

async function handleSaveSettings(event) {
  event.preventDefault();
  const token = getAuthToken();
  if (!token) return;

  const btn = document.getElementById('adminSettingsSubmitBtn');
  const feedback = document.getElementById('adminSettingsFeedback');

  btn.disabled = true;
  btn.innerText = 'جاري الحفظ في Supabase...';

  try {
    const payload = {
      siteName: document.getElementById('settingSiteName').value.trim(),
      maintenanceMode: document.getElementById('settingMaintenanceMode').checked,
      minDepositUsdt: parseFloat(document.getElementById('settingMinDeposit').value),
      minWithdrawUsdt: parseFloat(document.getElementById('settingMinWithdraw').value),
      withdrawFeePercent: parseFloat(document.getElementById('settingWithdrawFee').value)
    };

    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'تعذر حفظ الإعدادات');

    if (feedback) {
      feedback.className = 'network-alert-box';
      feedback.style.borderColor = 'var(--green)';
      feedback.style.color = 'var(--green)';
      feedback.style.display = 'block';
      feedback.innerText = '✓ تم حفظ الإعدادات بنجاح وتطبيقها في Supabase.';
    }

    showToast('تم حفظ إعدادات المنصة بنجاح ✓');
  } catch (err) {
    if (feedback) {
      feedback.className = 'network-alert-box danger';
      feedback.style.display = 'block';
      feedback.innerText = '❌ ' + err.message;
    }
  } finally {
    btn.disabled = false;
    btn.innerText = 'حفظ التغييرات في Supabase';
  }
}

// Window Event Listeners
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach((modal) => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }

  checkSystemStatus();
  updateAuthUI();

  // Check status and balances periodically every 30 seconds
  setInterval(() => {
    if (getAuthToken()) {
      fetchWalletDetails();
    }
  }, 30000);
});

// Expose globals
window.openModal = openModal;
window.closeModal = closeModal;
window.copyText = copyText;
window.copyReceiveAddress = copyReceiveAddress;
window.openReceiveModal = openReceiveModal;
window.openSendModal = openSendModal;
window.updateReceiveModalDetails = updateReceiveModalDetails;
window.updateSendModalDetails = updateSendModalDetails;
window.validateSendAddressLive = validateSendAddressLive;
window.calculateSendTotal = calculateSendTotal;
window.fillMaxAmount = fillMaxAmount;
window.handleSendTransaction = handleSendTransaction;
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.logoutUser = logoutUser;
window.refreshWalletBalances = refreshWalletBalances;
window.openVerifyTxModal = openVerifyTxModal;
window.handleVerifyTx = handleVerifyTx;
window.scrollToAdminPanel = scrollToAdminPanel;
window.loadAdminDashboardData = loadAdminDashboardData;
window.switchAdminTab = switchAdminTab;
window.handleSaveSettings = handleSaveSettings;
