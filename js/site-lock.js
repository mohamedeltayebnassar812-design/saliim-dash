/* ==========================================================================
   WAHET NOUR / DR. AHMED ELKHATEEB - EXCLUSIVE SITE LOCK SCREEN
   Restricts public access to authorized team members with secret PIN / URL Key
   ========================================================================== */

(function() {
  const VALID_KEYS = ['2026', 'wahetnor2026', 'wahet2026', 'elkhateeb2026', 'ahmed2026'];
  const STORAGE_KEY = 'wahetnor_site_unlocked';

  // 1. Check URL parameters for instant unlock
  try {
    const params = new URLSearchParams(window.location.search);
    const queryKey = params.get('key') || params.get('preview') || params.get('pin') || params.get('pass');
    if (queryKey && VALID_KEYS.includes(queryKey.toLowerCase())) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(STORAGE_KEY, 'true');
      // Clean query parameter from address bar cleanly
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  } catch (e) {}

  // 2. Check if already unlocked
  const isUnlocked = sessionStorage.getItem(STORAGE_KEY) === 'true' || localStorage.getItem(STORAGE_KEY) === 'true';

  if (!isUnlocked) {
    document.documentElement.classList.add('site-is-locked');
  }

  // 3. Inject CSS for lock screen
  const style = document.createElement('style');
  style.id = 'wahetnor-lock-styles';
  style.textContent = `
    html.site-is-locked body > *:not(#wahetnor-lock-overlay) {
      display: none !important;
    }
    html.site-is-locked body {
      overflow: hidden !important;
      background: #030F1C !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    @keyframes lockShake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
    }
    .animate-lock-shake {
      animation: lockShake 0.4s ease-in-out;
    }
    @keyframes auraBreathe {
      0%, 100% { opacity: 0.35; transform: scale(1); }
      50% { opacity: 0.65; transform: scale(1.08); }
    }
    .lock-aura {
      animation: auraBreathe 4s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);

  // 4. Render Overlay when DOM is ready
  function initLockOverlay() {
    if (isUnlocked) return;
    if (document.getElementById('wahetnor-lock-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'wahetnor-lock-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999999;display:flex;align-items:center;justify-content:center;background:#030F1C;font-family:"IBM Plex Sans Arabic",Cairo,-apple-system,sans-serif;direction:rtl;padding:16px;box-sizing:border-box;';

    overlay.innerHTML = `
      <!-- Ambient Glow Behind Card -->
      <div style="position:absolute;width:400px;height:400px;background:radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(10, 65, 116, 0.15) 50%, transparent 70%);border-radius:50%;filter:blur(40px);pointer-events:none;" class="lock-aura"></div>

      <!-- Lock Card -->
      <div id="wahetnor-lock-card" style="position:relative;z-index:10;max-width:440px;width:100%;background:rgba(10, 28, 48, 0.95);backdrop-filter:blur(20px);border:1px solid rgba(16, 185, 129, 0.3);border-radius:24px;padding:36px 28px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.7), 0 0 40px rgba(16, 185, 129, 0.1);text-align:center;color:#F8FAFC;">
        
        <!-- Logo / Icon -->
        <div style="width:68px;height:68px;margin:0 auto 20px;background:linear-gradient(135deg, #064E3B 0%, #047857 50%, #10B981 100%);border-radius:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 25px rgba(16, 185, 129, 0.35);border:1px solid rgba(255,255,255,0.2);">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <!-- Title -->
        <h1 style="font-size:22px;font-weight:800;margin:0 0 6px;color:#FFFFFF;letter-spacing:-0.5px;">د. أحمد الخطيب • واحة نور</h1>
        <p style="font-size:13px;color:#94A3B8;margin:0 0 20px;line-height:1.6;">
          الموقع مغلق حالياً للتطوير والإطلاق الرسمي قريباً 🌱<br>
          <span style="display:inline-block;margin-top:6px;font-size:11px;font-weight:700;color:#10B981;background:rgba(16, 185, 129, 0.12);padding:3px 12px;border-radius:99px;border:1px solid rgba(16, 185, 129, 0.25);">الدخول مخصص لفريق العمل فقط</span>
        </p>

        <!-- PIN Form -->
        <form id="wahetnor-lock-form" onsubmit="return false;" style="margin-top:16px;">
          <div style="position:relative;margin-bottom:14px;">
            <input 
              id="wahetnor-pin-input" 
              type="password" 
              placeholder="أدخل الرمز السري..." 
              autocomplete="current-password"
              style="width:100%;height:50px;background:#06182B;border:1.5px solid #1E3A5F;border-radius:14px;padding:0 16px;font-size:15px;color:#FFFFFF;text-align:center;letter-spacing:3px;outline:none;box-sizing:border-box;transition:all 0.2s;"
              onfocus="this.style.borderColor='#10B981';this.style.boxShadow='0 0 0 3px rgba(16,185,129,0.2)';"
              onblur="this.style.borderColor='#1E3A5F';this.style.boxShadow='none';"
            />
          </div>

          <div id="wahetnor-pin-error" style="display:none;color:#F87171;font-size:12px;font-weight:600;margin-bottom:12px;">
            ⚠️ الرمز السري غير صحيح، يرجى المحاولة مرة أخرى.
          </div>

          <button 
            id="wahetnor-pin-submit" 
            type="submit" 
            style="width:100%;height:50px;background:linear-gradient(135deg, #059669 0%, #10B981 100%);color:#FFFFFF;font-weight:700;font-size:15px;border:none;border-radius:14px;cursor:pointer;box-shadow:0 10px 20px rgba(16, 185, 129, 0.3);transition:transform 0.15s, opacity 0.15s;"
            onmouseover="this.style.opacity='0.92';"
            onmouseout="this.style.opacity='1';"
            onmousedown="this.style.transform='scale(0.98)';"
            onmouseup="this.style.transform='scale(1)';"
          >
            فتح الموقع والمعاينة
          </button>
        </form>

        <!-- Footer Note -->
        <div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;color:#64748B;">
          جميع الحقوق محفوظة &copy; 2026 د. أحمد الخطيب • wahetnor.com
        </div>

      </div>
    `;

    document.body.prepend(overlay);

    // Auto-focus input
    setTimeout(() => {
      const inp = document.getElementById('wahetnor-pin-input');
      if (inp) inp.focus();
    }, 100);

    // Handle form submit
    const form = document.getElementById('wahetnor-lock-form');
    const input = document.getElementById('wahetnor-pin-input');
    const err = document.getElementById('wahetnor-pin-error');
    const card = document.getElementById('wahetnor-lock-card');

    function tryUnlock() {
      const entered = input.value.trim().toLowerCase();
      if (VALID_KEYS.includes(entered)) {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        localStorage.setItem(STORAGE_KEY, 'true');
        overlay.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        overlay.style.opacity = '0';
        overlay.style.transform = 'scale(1.03)';
        setTimeout(() => {
          document.documentElement.classList.remove('site-is-locked');
          overlay.remove();
          showRelockButton();
        }, 300);
      } else {
        err.style.display = 'block';
        input.style.borderColor = '#EF4444';
        card.classList.add('animate-lock-shake');
        setTimeout(() => card.classList.remove('animate-lock-shake'), 450);
        input.value = '';
        input.focus();
      }
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      tryUnlock();
    });
  }

  // Floating Re-lock Badge for authorized users
  function showRelockButton() {
    if (document.getElementById('wahetnor-relock-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'wahetnor-relock-btn';
    btn.innerHTML = '🔒 قفل الموقع مجدداً';
    btn.style.cssText = 'position:fixed;bottom:16px;left:16px;z-index:999999;background:rgba(6,78,59,0.9);backdrop-filter:blur(10px);color:#D1FAE5;font-size:11px;font-weight:700;padding:6px 12px;border-radius:99px;border:1px solid rgba(16,185,129,0.4);cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
    btn.title = 'إعادة إغلاق الموقع وإظهار شاشة القفل';
    btn.onclick = function() {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    };
    document.body.appendChild(btn);
  }

  // DOM ready check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (!isUnlocked) initLockOverlay();
      else showRelockButton();
    });
  } else {
    if (!isUnlocked) initLockOverlay();
    else showRelockButton();
  }
})();
