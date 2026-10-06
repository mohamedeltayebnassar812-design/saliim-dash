/* ==========================================================================
   WAHET NOUR / DR. AHMED ELKHATEEB — COMING SOON & SECRET BACKDOOR
   Public View: Luxury "Coming Soon" + VIP Waitlist Lead Capture
   Team View: Secret Hidden Backdoor (Triple-click / Ctrl+Shift+A / ?key=2026)
   ========================================================================== */

(function() {
  const VALID_KEYS = ['2026', 'wahetnor2026', 'wahet2026', 'elkhateeb2026', 'ahmed2026'];
  const STORAGE_KEY = 'wahetnor_team_unlocked';
  const LEADS_STORAGE_KEY = 'wahetnor_waitlist_leads';

  // 1. Check URL parameters for instant backdoor unlock
  try {
    const params = new URLSearchParams(window.location.search);
    const queryKey = params.get('team') || params.get('key') || params.get('preview') || params.get('pass') || params.get('admin');
    if (queryKey && (VALID_KEYS.includes(queryKey.toLowerCase()) || queryKey === 'open' || queryKey === 'true')) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(STORAGE_KEY, 'true');
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  } catch (e) {}

  // 2. Check if already unlocked for team
  const isUnlocked = sessionStorage.getItem(STORAGE_KEY) === 'true' || localStorage.getItem(STORAGE_KEY) === 'true';

  if (!isUnlocked) {
    document.documentElement.classList.add('site-is-coming-soon');
  }

  // 3. Inject CSS for Coming Soon Screen
  const style = document.createElement('style');
  style.id = 'wahetnor-coming-soon-styles';
  style.textContent = `
    html.site-is-coming-soon body > *:not(#wahetnor-coming-soon-overlay) {
      display: none !important;
    }
    html.site-is-coming-soon body {
      overflow-x: hidden !important;
      background: #030F1C !important;
      margin: 0 !important;
      padding: 0 !important;
      font-family: 'IBM Plex Sans Arabic', 'Cairo', -apple-system, BlinkMacSystemFont, sans-serif !important;
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.06); }
    }
    .coming-soon-glow {
      animation: pulseGlow 5s ease-in-out infinite;
    }
    .tap-scale:active {
      transform: scale(0.96);
    }
  `;
  document.head.appendChild(style);

  // 4. Render Coming Soon Overlay
  function initComingSoon() {
    if (isUnlocked) {
      renderTeamControlBadge();
      return;
    }
    if (document.getElementById('wahetnor-coming-soon-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'wahetnor-coming-soon-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999999;
      background: radial-gradient(circle at 50% 20%, #0A2540 0%, #030F1C 65%, #020812 100%);
      color: #F8FAFC;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 24px 16px 20px;
      overflow-y: auto;
      box-sizing: border-box;
      direction: rtl;
    `;

    overlay.innerHTML = `
      <!-- Ambient Glow Behind Hero -->
      <div class="coming-soon-glow" style="position:fixed;top:15%;left:50%;transform:translateX(-50%);width:500px;height:500px;background:radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(6, 78, 59, 0.12) 50%, transparent 70%);border-radius:50%;filter:blur(60px);pointer-events:none;"></div>

      <!-- Header with Secret Easter Egg Trigger -->
      <header style="width:100%;max-width:960px;display:flex;align-items:center;justify-content:between;padding:12px 0;position:relative;z-index:10;">
        <div id="secretLogoTrigger" class="tap-scale" title="واحة نور" style="cursor:pointer;display:flex;align-items:center;gap:12px;user-select:none;-webkit-tap-highlight-color:transparent;">
          <div style="width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg, #064E3B 0%, #047857 50%, #10B981 100%);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(16,185,129,0.3);border:1px solid rgba(255,255,255,0.18);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
              <path d="M12 12 2.1 7.1"></path>
              <path d="M12 12v10"></path>
            </svg>
          </div>
          <div>
            <div style="font-size:18px;font-weight:800;color:#FFFFFF;line-height:1.2;">واحة نور</div>
            <div style="font-size:11px;color:#94A3B8;letter-spacing:0.5px;">د. أحمد الخطيب</div>
          </div>
        </div>

        <div style="margin-right:auto;">
          <span style="display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:#10B981;background:rgba(16, 185, 129, 0.12);border:1px solid rgba(16, 185, 129, 0.25);padding:6px 14px;border-radius:99px;">
            <span style="width:7px;height:7px;border-radius:50%;background:#10B981;box-shadow:0 0 8px #10B981;display:inline-block;"></span>
            الإطلاق الرسمي قريباً
          </span>
        </div>
      </header>

      <!-- Main Coming Soon Content -->
      <main style="max-width:680px;width:100%;margin:auto 0;padding:30px 0;text-align:center;position:relative;z-index:10;">
        
        <!-- Credential Pill -->
        <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);padding:6px 16px;border-radius:99px;margin-bottom:20px;">
          <span style="color:#F59E0B;font-size:13px;">★</span>
          <span style="font-size:12px;color:#CBD5E1;font-weight:600;">استشارات التغذية ونمط الحياة المتوازن • PN1 & SCOPE UK</span>
        </div>

        <!-- Big Headline -->
        <h1 style="font-size:clamp(26px, 5vw, 42px);font-weight:900;line-height:1.35;margin:0 0 16px;color:#FFFFFF;letter-spacing:-0.5px;">
          المسألة ليست قلّة إرادة..<br>
          <span style="background:linear-gradient(90deg, #10B981, #34D399, #F59E0B);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">بل أن تفهم جسمك</span>
        </h1>

        <p style="font-size:clamp(13px, 2.5vw, 15px);line-height:1.8;color:#94A3B8;max-width:560px;margin:0 auto 32px;font-weight:400;">
          نضع اللمسات الأخيرة على منصة <strong style="color:#F1F5F9;">«واحة نور»</strong> مع د. أحمد الخطيب. تجربة صحية ورقمية متكاملة لعلاج مقاومة الإنسولين، خسارة دهون الكرش، واستعادة طاقتك بلا رجيمات حرمان أو جوع.
        </p>

        <!-- Waitlist Card -->
        <div style="background:rgba(10, 28, 48, 0.85);backdrop-filter:blur(24px);border:1px solid rgba(16, 185, 129, 0.35);border-radius:24px;padding:28px 24px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.6);text-align:right;">
          
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <div style="font-size:14px;font-weight:800;color:#FFFFFF;display:flex;align-items:center;gap:6px;">
              <span>🎁</span>
              <span>انضم للقائمة الذهبية المسبقة</span>
            </div>
            <span style="font-size:11px;font-weight:700;color:#F59E0B;background:rgba(245,158,11,0.12);padding:3px 10px;border-radius:8px;border:1px solid rgba(245,158,11,0.25);">
              خصم 40% لأول 500 مشترك
            </span>
          </div>

          <form id="waitlistForm" onsubmit="return false;" style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <input 
                id="waitlistName" 
                type="text" 
                placeholder="الاسم الكريم..." 
                required
                style="width:100%;height:48px;background:#06182B;border:1.5px solid #1E3A5F;border-radius:12px;padding:0 16px;font-size:13.5px;color:#FFFFFF;outline:none;box-sizing:border-box;transition:border-color 0.2s;"
              >
            </div>
            <div>
              <input 
                id="waitlistPhone" 
                type="tel" 
                placeholder="رقم الواتساب (مع كود الدولة مثل +20 أو +966)..." 
                required
                style="width:100%;height:48px;background:#06182B;border:1.5px solid #1E3A5F;border-radius:12px;padding:0 16px;font-size:13.5px;color:#FFFFFF;outline:none;box-sizing:border-box;direction:ltr;text-align:right;transition:border-color 0.2s;"
              >
            </div>

            <button 
              id="waitlistSubmitBtn"
              type="submit" 
              class="tap-scale"
              style="width:100%;height:50px;background:linear-gradient(135deg, #059669 0%, #10B981 100%);border:none;border-radius:12px;font-size:14px;font-weight:800;color:#FFFFFF;cursor:pointer;box-shadow:0 10px 20px rgba(16,185,129,0.3);transition:all 0.2s;margin-top:4px;"
            >
              احجز مقعدك في القائمة الذهبية واحصل على الخصم 🚀
            </button>
          </form>

          <div id="waitlistSuccess" style="display:none;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.4);border-radius:14px;padding:16px;text-align:center;color:#34D399;font-size:13px;line-height:1.6;margin-top:12px;">
            🎉 <strong>أهلاً بك في واحة نور!</strong><br>
            تم تسجيلك بنجاح في القائمة الذهبية. سنرسل لك رابط الخصم الحصري عبر الواتساب فور فتح باب الاشتراك الرسمي قبل الجميع.
          </div>

          <div style="font-size:11px;color:#64748B;text-align:center;margin-top:14px;line-height:1.5;">
            🔒 بياناتك مشفرة ومحفوظة بسرية تامة • لا نرسل رسائل مزعجة
          </div>
        </div>

        <!-- Trust Stats -->
        <div style="display:flex;align-items:center;justify-content:center;gap:24px;margin-top:36px;flex-wrap:wrap;">
          <div style="text-align:center;">
            <div style="font-size:18px;font-weight:800;color:#FFFFFF;">+9M</div>
            <div style="font-size:11px;color:#94A3B8;">متابع عبر المنصات</div>
          </div>
          <div style="width:1px;height:24px;background:#1E3A5F;"></div>
          <div style="text-align:center;">
            <div style="font-size:18px;font-weight:800;color:#10B981;">PN1 & SCOPE</div>
            <div style="font-size:11px;color:#94A3B8;">اعتمادات كندا وبريطانيا</div>
          </div>
          <div style="width:1px;height:24px;background:#1E3A5F;"></div>
          <div style="text-align:center;">
            <div style="font-size:18px;font-weight:800;color:#F59E0B;">80 / 20</div>
            <div style="font-size:11px;color:#94A3B8;">مرونة بلا حرمان</div>
          </div>
        </div>

      </main>

      <!-- Footer with subtle Secret Year Trigger -->
      <footer style="width:100%;max-width:960px;text-align:center;padding:16px 0 8px;font-size:11.5px;color:#475569;position:relative;z-index:10;">
        <p style="margin:0;">
          جميع الحقوق محفوظة © <span id="secretYearTrigger" style="cursor:pointer;" title="2026">2026</span> د. أحمد الخطيب • منصة واحة نور (Wahet Nour)
        </p>
        <p style="margin:4px 0 0;font-size:10px;color:#334155;">
          Dubai Media City License No. 102905 • wahetnor.com
        </p>
      </footer>

      <!-- Secret Backdoor Modal (Hidden by default) -->
      <div id="secretBackdoorModal" style="display:none;position:fixed;inset:0;z-index:10000000;background:rgba(3,15,28,0.85);backdrop-filter:blur(16px);align-items:center;justify-content:center;padding:16px;">
        <div style="max-width:360px;width:100%;background:#0A1C30;border:1.5px solid rgba(16,185,129,0.5);border-radius:20px;padding:24px;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.8);color:#FFF;">
          <div style="width:48px;height:48px;background:rgba(16,185,129,0.15);border-radius:14px;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:20px;">
            🔐
          </div>
          <h3 style="font-size:16px;font-weight:800;margin:0 0 6px;">بوابة معاينة فريق العمل</h3>
          <p style="font-size:12px;color:#94A3B8;margin:0 0 16px;">أدخل رمز الدخول السري لفتح الموقع الكامل:</p>
          
          <input 
            id="backdoorPinInput" 
            type="password" 
            placeholder="الرمز السري..." 
            style="width:100%;height:44px;background:#06182B;border:1px solid #1E3A5F;border-radius:10px;text-align:center;letter-spacing:3px;font-size:15px;color:#FFF;outline:none;box-sizing:border-box;margin-bottom:12px;"
          >
          <div id="backdoorError" style="display:none;color:#F87171;font-size:11px;margin-bottom:10px;">الرمز غير صحيح، حاول مجدداً</div>
          
          <div style="display:flex;gap:8px;">
            <button id="backdoorCancelBtn" style="flex:1;height:40px;background:#1E293B;border:none;border-radius:10px;color:#94A3B8;font-size:12px;cursor:pointer;">إلغاء</button>
            <button id="backdoorUnlockBtn" style="flex:2;height:40px;background:#10B981;border:none;border-radius:10px;color:#FFF;font-weight:700;font-size:12px;cursor:pointer;">فتح الموقع</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Bind Waitlist submission
    const waitlistForm = document.getElementById('waitlistForm');
    const waitlistSubmitBtn = document.getElementById('waitlistSubmitBtn');
    const waitlistSuccess = document.getElementById('waitlistSuccess');

    waitlistForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('waitlistName').value.trim();
      const phone = document.getElementById('waitlistPhone').value.trim();
      if (!name || !phone) return;

      waitlistSubmitBtn.disabled = true;
      waitlistSubmitBtn.innerText = 'جاري التسجيل...';

      // Save lead locally
      try {
        const existing = JSON.parse(localStorage.getItem(LEADS_STORAGE_KEY) || '[]');
        existing.push({ name, phone, date: new Date().toISOString() });
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(existing));
      } catch (err) {}

      setTimeout(() => {
        waitlistForm.style.display = 'none';
        waitlistSuccess.style.display = 'block';
      }, 500);
    });

    // 5. Secret Backdoor Triggers
    let logoClickCount = 0;
    let logoClickTimer = null;
    const logoTrigger = document.getElementById('secretLogoTrigger');
    const yearTrigger = document.getElementById('secretYearTrigger');
    const backdoorModal = document.getElementById('secretBackdoorModal');
    const backdoorPinInput = document.getElementById('backdoorPinInput');
    const backdoorUnlockBtn = document.getElementById('backdoorUnlockBtn');
    const backdoorCancelBtn = document.getElementById('backdoorCancelBtn');
    const backdoorError = document.getElementById('backdoorError');

    function openBackdoorModal() {
      backdoorModal.style.display = 'flex';
      backdoorError.style.display = 'none';
      backdoorPinInput.value = '';
      setTimeout(() => backdoorPinInput.focus(), 100);
    }

    function closeBackdoorModal() {
      backdoorModal.style.display = 'none';
    }

    // Trigger A: 3 quick clicks on Logo
    logoTrigger.addEventListener('click', function() {
      logoClickCount++;
      clearTimeout(logoClickTimer);
      if (logoClickCount >= 3) {
        logoClickCount = 0;
        openBackdoorModal();
      } else {
        logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 1200);
      }
    });

    // Trigger B: 3 quick clicks on Copyright Year (2026)
    let yearClickCount = 0;
    let yearClickTimer = null;
    yearTrigger.addEventListener('click', function() {
      yearClickCount++;
      clearTimeout(yearClickTimer);
      if (yearClickCount >= 3) {
        yearClickCount = 0;
        openBackdoorModal();
      } else {
        yearClickTimer = setTimeout(() => { yearClickCount = 0; }, 1200);
      }
    });

    // Trigger C: Keyboard Shortcut (Ctrl + Shift + A)
    window.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'ش')) {
        openBackdoorModal();
      }
    });

    // Backdoor modal actions
    backdoorCancelBtn.addEventListener('click', closeBackdoorModal);

    function attemptUnlock() {
      const pin = backdoorPinInput.value.trim().toLowerCase();
      if (VALID_KEYS.includes(pin)) {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        localStorage.setItem(STORAGE_KEY, 'true');
        closeBackdoorModal();
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          overlay.remove();
          document.documentElement.classList.remove('site-is-coming-soon');
          renderTeamControlBadge();
        }, 300);
      } else {
        backdoorError.style.display = 'block';
        backdoorPinInput.style.borderColor = '#EF4444';
      }
    }

    backdoorUnlockBtn.addEventListener('click', attemptUnlock);
    backdoorPinInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') attemptUnlock();
    });
  }

  // 6. Floating Control Badge for Team (When Unlocked)
  function renderTeamControlBadge() {
    if (document.getElementById('wahetnor-team-badge')) return;
    const badge = document.createElement('div');
    badge.id = 'wahetnor-team-badge';
    badge.style.cssText = `
      position: fixed;
      bottom: 16px;
      left: 16px;
      z-index: 999999;
      background: rgba(10, 28, 48, 0.92);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(16, 185, 129, 0.4);
      border-radius: 99px;
      padding: 6px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 11px;
      color: #F8FAFC;
      font-family: 'IBM Plex Sans Arabic', sans-serif;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      direction: rtl;
    `;
    badge.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:4px;color:#10B981;font-weight:700;">
        <span style="width:6px;height:6px;border-radius:50%;background:#10B981;"></span>
        معاينة الفريق (الموقع مفعل)
      </span>
      <button id="lockBackBtn" style="background:#1E293B;border:1px solid #334155;color:#94A3B8;padding:2px 8px;border-radius:6px;font-size:10px;cursor:pointer;">
        قفل للجمهور 🔒
      </button>
    `;
    document.body.appendChild(badge);

    document.getElementById('lockBackBtn').addEventListener('click', function() {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComingSoon);
  } else {
    initComingSoon();
  }

})();
