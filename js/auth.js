// ==================== SALIIM AUTHENTICATION CLIENT (SUPABASE + GOOGLE + EMAIL + OTP) ====================

const SUPABASE_AUTH_URL = window.SALIIM_SUPABASE_URL || "https://zbtyybuofnlkbidoukzc.supabase.co";
const SUPABASE_ANON_KEY = window.SALIIM_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpidHl5YnVvZm5sa2JpZG91a3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MDcyMDYsImV4cCI6MjA1MDk4MzIwNn0.sb_publishable_ZZ74w87LalDGGqAUnDZCBg_zFXekAgj";

let supabaseClient = null;
let currentAuthMode = 'login'; // 'login' | 'signup' | 'forgot'
let currentUser = null;
let pendingAuthEmail = '';
let resendTimerInterval = null;
let resendSecondsRemaining = 0;

function initSupabaseAuth() {
  try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      supabaseClient = window.supabase.createClient(SUPABASE_AUTH_URL, SUPABASE_ANON_KEY);
    }
  } catch (e) {
    console.warn("Supabase init note:", e.message);
  }
  checkInitialSession();
}

async function checkInitialSession() {
  // Check URL hash from OAuth or Email Link redirect
  if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('type='))) {
    const hashStr = window.location.hash.substring(1);
    const params = new URLSearchParams(hashStr);
    const token = params.get('access_token');
    if (token && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.getUser(token);
        if (data && data.user) {
          setCurrentUser(data.user);
          window.history.replaceState(null, '', window.location.pathname);
          showGlobalToast("تم تأكيد وتفعيل حسابك بنجاح! مرحباً بك في سليم.", "success");
          return;
        }
      } catch (err) {
        console.error("Auth redirect error:", err);
      }
    }
  }

  if (supabaseClient) {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session && session.user) {
        setCurrentUser(session.user);
        return;
      }
    } catch (e) {}
  }

  const storedUser = localStorage.getItem('saliim_user');
  if (storedUser) {
    try {
      setCurrentUser(JSON.parse(storedUser));
    } catch (e) {
      localStorage.removeItem('saliim_user');
    }
  }
}

function setCurrentUser(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem('saliim_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('saliim_user');
  }
  updateAuthUI();
}

function updateAuthUI() {
  const loginBtns = document.querySelectorAll('.auth-login-btn');
  const userMenus = document.querySelectorAll('.auth-user-menu');
  const userNames = document.querySelectorAll('.auth-user-name');
  const userAvatars = document.querySelectorAll('.auth-user-avatar-text');
  const userAvatarImgs = document.querySelectorAll('.auth-user-avatar-img');

  if (currentUser) {
    const name = currentUser.user_metadata?.full_name || currentUser.name || currentUser.email?.split('@')[0] || 'المشترك';
    const email = currentUser.email || '';
    const avatarUrl = currentUser.user_metadata?.avatar_url || currentUser.avatar_url;
    const initial = name.trim().charAt(0).toUpperCase();

    loginBtns.forEach(el => el.classList.add('hidden'));
    userMenus.forEach(el => el.classList.remove('hidden'));
    userNames.forEach(el => el.textContent = name);

    userAvatars.forEach(el => {
      el.textContent = initial;
      if (avatarUrl) el.classList.add('hidden');
      else el.classList.remove('hidden');
    });

    userAvatarImgs.forEach(el => {
      if (avatarUrl) {
        el.src = avatarUrl;
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });

    const emailEl = document.getElementById('user-dropdown-email');
    if (emailEl) emailEl.textContent = email;
    const nameEl = document.getElementById('user-dropdown-name');
    if (nameEl) nameEl.textContent = name;
  } else {
    loginBtns.forEach(el => el.classList.remove('hidden'));
    userMenus.forEach(el => el.classList.add('hidden'));
  }
}

function openAuthModal(mode = 'login') {
  currentAuthMode = mode;
  returnToMainAuth();
  setAuthModeUI(mode);
  
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
  clearAuthAlert();
  if (resendTimerInterval) {
    clearInterval(resendTimerInterval);
    resendTimerInterval = null;
  }
}

function setAuthModeUI(mode) {
  currentAuthMode = mode;
  clearAuthAlert();

  const titleEl = document.getElementById('auth-modal-title');
  const subEl = document.getElementById('auth-modal-subtitle');
  const nameField = document.getElementById('auth-name-group');
  const submitBtnText = document.getElementById('auth-submit-btn-text');
  const tabLogin = document.getElementById('auth-tab-login');
  const tabSignup = document.getElementById('auth-tab-signup');
  const toggleText = document.getElementById('auth-toggle-prompt');
  const toggleLink = document.getElementById('auth-toggle-link');
  const forgotBtn = document.getElementById('auth-forgot-link');

  if (mode === 'signup') {
    if (titleEl) titleEl.textContent = "إنشاء حساب جديد في سليم";
    if (subEl) subEl.textContent = "ابدأ رحلتك لمتابعة صحتك وحرقك مع د. أحمد الخطيب";
    if (nameField) nameField.classList.remove('hidden');
    if (submitBtnText) submitBtnText.textContent = "إنشاء حساب وتأكيد البريد";
    if (tabLogin) tabLogin.className = "flex-1 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer";
    if (tabSignup) tabSignup.className = "flex-1 py-2 text-xs font-bold text-[#1D9BF0] border-b-2 border-[#1D9BF0] transition-all cursor-pointer";
    if (toggleText) toggleText.textContent = "لديك حساب بالفعل؟";
    if (toggleLink) {
      toggleLink.textContent = "تسجيل الدخول";
      toggleLink.setAttribute('onclick', "setAuthModeUI('login')");
    }
    if (forgotBtn) forgotBtn.classList.add('hidden');
  } else if (mode === 'forgot') {
    if (titleEl) titleEl.textContent = "استعادة كلمة المرور";
    if (subEl) subEl.textContent = "أدخل بريدك الإلكتروني لنرسل لك رابط استعادة الدخول";
    if (nameField) nameField.classList.add('hidden');
    if (submitBtnText) submitBtnText.textContent = "إرسال رابط الاستعادة";
    if (toggleText) toggleText.textContent = "تذكرت كلمة المرور؟";
    if (toggleLink) {
      toggleLink.textContent = "العودة لتسجيل الدخول";
      toggleLink.setAttribute('onclick', "setAuthModeUI('login')");
    }
    if (forgotBtn) forgotBtn.classList.add('hidden');
  } else {
    if (titleEl) titleEl.textContent = "تسجيل الدخول إلى سليم";
    if (subEl) subEl.textContent = "مرحباً بك مجدداً في منصتك المخصصة للمتابعة الصحية";
    if (nameField) nameField.classList.add('hidden');
    if (submitBtnText) submitBtnText.textContent = "دخول إلى حسابي";
    if (tabLogin) tabLogin.className = "flex-1 py-2 text-xs font-bold text-[#1D9BF0] border-b-2 border-[#1D9BF0] transition-all cursor-pointer";
    if (tabSignup) tabSignup.className = "flex-1 py-2 text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer";
    if (toggleText) toggleText.textContent = "ليس لديك حساب بعد؟";
    if (toggleLink) {
      toggleLink.textContent = "إنشاء حساب جديد مجاناً";
      toggleLink.setAttribute('onclick', "setAuthModeUI('signup')");
    }
    if (forgotBtn) forgotBtn.classList.remove('hidden');
  }
}

function showAuthAlert(msg, isSuccess = false) {
  const alertEl = document.getElementById('auth-alert');
  if (!alertEl) return;
  alertEl.textContent = msg;
  alertEl.className = isSuccess 
    ? "p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs text-center font-bold block mb-4"
    : "p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs text-center font-bold block mb-4";
}

function clearAuthAlert() {
  const alertEl = document.getElementById('auth-alert');
  if (alertEl) {
    alertEl.className = "hidden mb-4";
    alertEl.textContent = "";
  }
}

function translateAuthError(errMsg) {
  if (!errMsg) return "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.";
  const msg = String(errMsg).toLowerCase();
  if (msg.includes("invalid login credentials")) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  if (msg.includes("user already registered")) return "هذا البريد الإلكتروني مسجل بالفعل، يرجى اختيار تسجيل الدخول.";
  if (msg.includes("email not confirmed")) return "بريدك الإلكتروني غير مفعّل بعد. يرجى تأكيده عبر الرمز.";
  if (msg.includes("password should be at least")) return "كلمة المرور يجب أن لا تقل عن 6 أحرف.";
  if (msg.includes("email rate limit")) return "تم تجاوز عدد المحاولات المسموح، يرجى الانتظار دقيقة والمحاولة.";
  if (msg.includes("token has expired") || msg.includes("otp expired")) return "انتهت صلاحية رمز التحقق، اضغط على إعادة إرسال الرمز.";
  if (msg.includes("token is invalid") || msg.includes("invalid token")) return "رمز التحقق غير صحيح، يرجى التأكد من الرمز وإعادة المحاولة.";
  if (msg.includes("provider is not enabled")) return "تسجيل الدخول بحساب Google غير مفعّل حالياً في لوحة Supabase.";
  return errMsg;
}

// ------------------- OTP STEP MANAGEMENT -------------------
function showOtpStep(email) {
  pendingAuthEmail = email;
  clearAuthAlert();

  const stepMain = document.getElementById('auth-step-main');
  const stepOtp = document.getElementById('auth-step-otp');
  const emailDisplay = document.getElementById('auth-otp-email-display');
  const otpInput = document.getElementById('auth-otp-input');

  if (stepMain) stepMain.classList.add('hidden');
  if (stepOtp) stepOtp.classList.remove('hidden');
  if (emailDisplay) emailDisplay.textContent = email;
  if (otpInput) {
    otpInput.value = '';
    setTimeout(() => otpInput.focus(), 150);
  }

  showAuthAlert("تم إرسال رمز التحقق إلى بريدك الإلكتروني. يرجى إدخال الرمز المكون من 6 أرقام لتفعيل الحساب والدخول.", true);
  startResendTimer(60);

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function returnToMainAuth() {
  clearAuthAlert();
  const stepMain = document.getElementById('auth-step-main');
  const stepOtp = document.getElementById('auth-step-otp');

  if (stepOtp) stepOtp.classList.add('hidden');
  if (stepMain) stepMain.classList.remove('hidden');

  if (resendTimerInterval) {
    clearInterval(resendTimerInterval);
    resendTimerInterval = null;
  }
}

function startResendTimer(seconds) {
  if (resendTimerInterval) clearInterval(resendTimerInterval);
  resendSecondsRemaining = seconds;

  const btn = document.getElementById('auth-otp-resend-btn');
  const timerSpan = document.getElementById('auth-otp-timer');

  const updateDisplay = () => {
    if (resendSecondsRemaining > 0) {
      if (btn) btn.disabled = true;
      if (timerSpan) timerSpan.textContent = `(${resendSecondsRemaining} ثانية)`;
      resendSecondsRemaining--;
    } else {
      if (btn) btn.disabled = false;
      if (timerSpan) timerSpan.textContent = '';
      clearInterval(resendTimerInterval);
      resendTimerInterval = null;
    }
  };

  updateDisplay();
  resendTimerInterval = setInterval(updateDisplay, 1000);
}

async function handleResendOtp() {
  if (resendSecondsRemaining > 0 || !pendingAuthEmail) return;
  clearAuthAlert();

  const btn = document.getElementById('auth-otp-resend-btn');
  if (btn) btn.disabled = true;

  try {
    if (supabaseClient) {
      const { error } = await supabaseClient.auth.resend({
        type: 'signup',
        email: pendingAuthEmail
      });
      if (error) throw error;
      showAuthAlert("تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني بنجاح.", true);
      startResendTimer(60);
      return;
    }
  } catch (err) {
    console.warn("Resend OTP error:", err);
    showAuthAlert(translateAuthError(err.message));
  }

  startResendTimer(60);
}

async function handleOtpVerify(e) {
  e.preventDefault();
  clearAuthAlert();

  const otpInput = document.getElementById('auth-otp-input');
  const submitBtn = document.getElementById('auth-otp-submit-btn');
  const submitText = document.getElementById('auth-otp-submit-text');
  const token = otpInput ? otpInput.value.trim() : '';

  if (!token || token.length < 6) {
    showAuthAlert("يرجى إدخال رمز التحقق المكون من 6 أرقام كاملاً.");
    return;
  }

  if (submitBtn) {
    submitBtn.classList.add('opacity-70', 'pointer-events-none');
    if (submitText) submitText.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> جاري التحقق...';
  }

  try {
    if (supabaseClient) {
      // First attempt: verifyOtp with type 'signup'
      let { data, error } = await supabaseClient.auth.verifyOtp({
        email: pendingAuthEmail,
        token: token,
        type: 'signup'
      });

      // Second attempt if type differed: type 'email'
      if (error && (error.message.includes('type') || error.message.includes('invalid') || error.status === 400)) {
        const retry = await supabaseClient.auth.verifyOtp({
          email: pendingAuthEmail,
          token: token,
          type: 'email'
        });
        if (!retry.error && (retry.data.session || retry.data.user)) {
          data = retry.data;
          error = null;
        }
      }

      if (error) throw error;

      if (data && (data.user || data.session?.user)) {
        const verifiedUser = data.user || data.session.user;
        setCurrentUser(verifiedUser);
        showAuthAlert("تم تأكيد وتفعيل بريدك الإلكتروني بنجاح! مرحباً بك في سليم.", true);
        setTimeout(() => closeAuthModal(), 1200);
        return;
      }
    }
  } catch (err) {
    console.error("OTP Verification failed:", err);
    showAuthAlert(translateAuthError(err.message));
  } finally {
    if (submitBtn) {
      submitBtn.classList.remove('opacity-70', 'pointer-events-none');
      if (submitText) submitText.textContent = 'تأكيد الرمز والدخول';
    }
  }
}

// ------------------- GOOGLE SIGN IN -------------------
async function handleGoogleSignIn() {
  clearAuthAlert();
  const btn = document.getElementById('auth-google-btn');
  if (btn) btn.classList.add('opacity-70', 'pointer-events-none');

  try {
    if (supabaseClient && window.location.protocol.startsWith('http')) {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return;
    }
  } catch (err) {
    console.warn("Google OAuth note:", err.message);
    if (btn) btn.classList.remove('opacity-70', 'pointer-events-none');
    
    if (err.message && err.message.includes("provider is not enabled")) {
      showAuthAlert("تنبيه: مزود Google غير مفعّل حالياً في لوحة تحكم Supabase. يرجى تفعيله من Authentication -> Providers -> Google.");
    } else {
      showAuthAlert(translateAuthError(err.message));
    }
    return;
  }
}

// ------------------- EMAIL AUTH (LOGIN / SIGNUP / FORGOT) -------------------
async function handleEmailAuth(e) {
  e.preventDefault();
  clearAuthAlert();

  const email = document.getElementById('auth-email')?.value?.trim();
  const password = document.getElementById('auth-password')?.value;
  const name = document.getElementById('auth-name')?.value?.trim();
  const submitBtn = document.getElementById('auth-submit-btn');
  const submitText = document.getElementById('auth-submit-btn-text');

  if (!email) {
    showAuthAlert("يرجى إدخال البريد الإلكتروني بشكل صحيح.");
    return;
  }

  if (currentAuthMode !== 'forgot' && (!password || password.length < 6)) {
    showAuthAlert("كلمة المرور يجب أن لا تقل عن 6 أحرف.");
    return;
  }

  if (submitBtn) {
    submitBtn.classList.add('opacity-70', 'pointer-events-none');
    if (submitText) submitText.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> جاري المعالجة...';
  }

  try {
    if (supabaseClient && window.location.protocol.startsWith('http')) {
      
      // 1. SIGN UP WITH REQUIRED VERIFICATION
      if (currentAuthMode === 'signup') {
        const { data, error } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
          options: {
            data: { full_name: name || email.split('@')[0] }
          }
        });
        
        if (error) throw error;

        // If email confirmation is required by Supabase (data.session is null):
        if (data && (!data.session || (data.user && !data.user.confirmed_at))) {
          // Mandatory verification step!
          showOtpStep(email);
          return;
        }

        // If confirmation is disabled in Supabase, login directly
        if (data && data.user) {
          setCurrentUser(data.user);
          showAuthAlert("تم إنشاء حسابك بنجاح! مرحباً بك في سليم.", true);
          setTimeout(() => closeAuthModal(), 1200);
          return;
        }
      } 
      
      // 2. FORGOT PASSWORD
      else if (currentAuthMode === 'forgot') {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin
        });
        if (error) throw error;
        showAuthAlert("تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح!", true);
        return;
      } 
      
      // 3. LOGIN WITH PASSWORD
      else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) {
          // If email is not confirmed yet, trigger OTP step!
          if (error.message && error.message.toLowerCase().includes("email not confirmed")) {
            try {
              await supabaseClient.auth.resend({ type: 'signup', email: email });
            } catch (rErr) {}
            showOtpStep(email);
            showAuthAlert("بريدك الإلكتروني غير مفعّل بعد. أرسلنا لك رمز تحقق جديد، يرجى إدخاله هنا لتفعيل الحساب.", false);
            return;
          }
          throw error;
        }

        if (data && data.user) {
          setCurrentUser(data.user);
          showAuthAlert("تم تسجيل الدخول بنجاح! أهلاً بك مجدداً.", true);
          setTimeout(() => closeAuthModal(), 1000);
          return;
        }
      }
    }
  } catch (err) {
    console.warn("Supabase auth error:", err.message);
    showAuthAlert(translateAuthError(err.message));
  } finally {
    if (submitBtn) {
      submitBtn.classList.remove('opacity-70', 'pointer-events-none');
      if (submitText) {
        if (currentAuthMode === 'signup') submitText.textContent = "إنشاء حساب وتأكيد البريد";
        else if (currentAuthMode === 'forgot') submitText.textContent = "إرسال رابط الاستعادة";
        else submitText.textContent = "دخول إلى حسابي";
      }
    }
  }
}

async function signOutUser() {
  if (supabaseClient) {
    try {
      await supabaseClient.auth.signOut();
    } catch (e) {}
  }
  setCurrentUser(null);
  closeUserDropdown();
}

function toggleUserDropdown() {
  const dd = document.getElementById('user-dropdown');
  if (dd) dd.classList.toggle('hidden');
}

function closeUserDropdown() {
  const dd = document.getElementById('user-dropdown');
  if (dd) dd.classList.add('hidden');
}

function togglePasswordVisibility() {
  const input = document.getElementById('auth-password');
  const icon = document.getElementById('pwd-toggle-icon');
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.setAttribute('data-lucide', 'eye-off');
  } else {
    input.type = 'password';
    if (icon) icon.setAttribute('data-lucide', 'eye');
  }
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function showGlobalToast(msg, type = "info") {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold text-white transition-all transform duration-300 ${type === 'success' ? 'bg-emerald-600' : 'bg-[#0A4174]'}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

window.addEventListener('click', function(e) {
  const userMenu = document.querySelector('.auth-user-menu');
  const dd = document.getElementById('user-dropdown');
  if (userMenu && !userMenu.contains(e.target) && dd && !dd.classList.contains('hidden')) {
    closeUserDropdown();
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSupabaseAuth);
} else {
  initSupabaseAuth();
}
