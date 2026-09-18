/**
 * Saliim Platform - Main Landing Page Script
 * Dr. Ahmed Elkhateeb (Saliim)
 */
lucide.createIcons();

    // 1. Google Sheets Integration Webhook
    const GOOGLE_SHEETS_WEBAPP_URL = "/api/submit-lead";

    function sendDataToGoogleSheets(payload) {
      if (!GOOGLE_SHEETS_WEBAPP_URL) return;
      fetch(GOOGLE_SHEETS_WEBAPP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(e => console.error("Sheet error:", e));
    }

    // 2. Mobile Menu Toggle
    function toggleMobileMenu() {
      const menu = document.getElementById('mobile-menu');
      if (menu) menu.classList.toggle('hidden');
    }

    // 3. Plate Comparison Slider Logic (Ultra-smooth 60fps Pointer & Touch Drag)
        function setupGenericSlider(containerId, clipWrapId, lineId) {
      const container = document.getElementById(containerId);
      const clipWrap = document.getElementById(clipWrapId);
      const line = document.getElementById(lineId);
      if (!container || !clipWrap || !line) {
        console.warn('Slider elements not found for:', containerId);
        return;
      }

      let isDragging = false;

      function updatePos(clientX) {
        const rect = container.getBoundingClientRect();
        let x = clientX - rect.left;
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        const percent = (x / rect.width) * 100;
        clipWrap.style.clipPath = `inset(0 0 0 ${percent}%)`;
        line.style.left = `${percent}%`;
      }

      // Universal Pointer Events
      container.addEventListener('pointerdown', (e) => {
        isDragging = true;
        try { container.setPointerCapture(e.pointerId); } catch(err) {}
        updatePos(e.clientX);
      });

      container.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        updatePos(e.clientX);
      });

      const stopDrag = (e) => {
        isDragging = false;
        try { if (e.pointerId) container.releasePointerCapture(e.pointerId); } catch(err) {}
      };

      container.addEventListener('pointerup', stopDrag);
      container.addEventListener('pointercancel', stopDrag);
      container.addEventListener('pointerleave', stopDrag);

      // Touch Events fallback
      container.addEventListener('touchstart', (e) => {
        isDragging = true;
        if (e.touches && e.touches[0]) updatePos(e.touches[0].clientX);
      }, { passive: true });

      container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        if (e.touches && e.touches[0]) updatePos(e.touches[0].clientX);
      }, { passive: true });

      container.addEventListener('touchend', () => { isDragging = false; });
      container.addEventListener('touchcancel', () => { isDragging = false; });

      // Click to move anywhere
      container.addEventListener('click', (e) => {
        updatePos(e.clientX);
      });
    }

    function initAllSliders() {
      // Food plate comparison slider removed
      setupGenericSlider('body-ba-container', 'body-ba-clip-wrap', 'body-ba-divider-line');
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAllSliders);
    } else {
      initAllSliders();
    }
    window.addEventListener('load', initAllSliders);

    // 4. FAQ Accordion Logic
    function toggleFaq(num) {
      const ans = document.getElementById('faq-ans-' + num);
      const icon = document.getElementById('faq-icon-' + num);
      if (!ans) return;
      if (ans.classList.contains('hidden')) {
        ans.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        ans.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    }

    // 5. Booking Modal Logic & Package Sync
    const PACKAGE_PRICES = {
      'healthy': '$69/شهرياً',
      'pro': '$119/شهرياً',
      'consultation_dr': '$249',
      'app_waitlist': 'مجاني'
    };

    function openBookingModal(pkgKey = 'pro', pkgTitle = 'باقة Pro المتقدمة', priceText = '$119/شهرياً') {
      try {
        localStorage.setItem('saliim_selected_package', pkgKey);
        sessionStorage.setItem('saliim_selected_package', pkgKey);
        document.cookie = `saliim_selected_package=${encodeURIComponent(pkgKey)}; path=/; max-age=604800`;
      } catch(e) {}
      try {
        localStorage.setItem('saliim_selected_package', pkgKey);
        sessionStorage.setItem('saliim_selected_package', pkgKey);
        document.cookie = `saliim_selected_package=${encodeURIComponent(pkgKey)}; path=/; max-age=604800`;
      } catch(e) {}
      const modal = document.getElementById('booking-modal');
      const select = document.getElementById('package_select');
      const titleEl = document.getElementById('modal-title');
      const priceEl = document.getElementById('summary_price');
      
      if (select && pkgKey && select.querySelector(`option[value="${pkgKey}"]`)) {
        select.value = pkgKey;
      }
      if (titleEl && pkgTitle) titleEl.innerText = pkgTitle;
      if (priceEl && priceText) priceEl.innerText = priceText;

      if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeBookingModal() {
      const modal = document.getElementById('booking-modal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
    }

    function syncPackagePrice(val) {
      try {
        localStorage.setItem('saliim_selected_package', val);
        sessionStorage.setItem('saliim_selected_package', val);
        document.cookie = `saliim_selected_package=${encodeURIComponent(val)}; path=/; max-age=604800`;
      } catch(e) {}
      const priceEl = document.getElementById('summary_price');
      if (priceEl && PACKAGE_PRICES[val]) {
        priceEl.innerText = PACKAGE_PRICES[val];
      }
    }

    function toggleCustomGoal(val) {
      const box = document.getElementById('custom_goal_box');
      if (!box) return;
      if (val === 'other') box.classList.remove('hidden');
      else box.classList.add('hidden');
    }

    
    // ==========================================
    // AI SCANNER 4.5s 3-STAGE VIDEO ENGINE
    // ==========================================
    let scannerCurrentStage = 1;
    let scannerIsPlaying = true;
    let scannerStartTime = Date.now();
    const SCANNER_TOTAL_DURATION = 4500; // 4.5 seconds

    function updateScannerVideoLoop() {
      if (!scannerIsPlaying) {
        requestAnimationFrame(updateScannerVideoLoop);
        return;
      }

      const elapsed = (Date.now() - scannerStartTime) % SCANNER_TOTAL_DURATION;
      const progressPercent = (elapsed / SCANNER_TOTAL_DURATION) * 100;
      
      const progressBar = document.getElementById('scanner-video-progress');
      if (progressBar) progressBar.style.width = progressPercent + '%';

      // Stage 1: 0 to 1500ms (التصوير والمسح)
      // Stage 2: 1500 to 3000ms (بيانات الوجبة)
      // Stage 3: 3000 to 4500ms (المكونات والنسب)
      let targetStage = 1;
      if (elapsed >= 1500 && elapsed < 3000) {
        targetStage = 2;
      } else if (elapsed >= 3000) {
        targetStage = 3;
      }

      if (targetStage !== scannerCurrentStage) {
        applyScannerStageUI(targetStage);
      }

      requestAnimationFrame(updateScannerVideoLoop);
    }

    function applyScannerStageUI(stage) {
      scannerCurrentStage = stage;

      const s1 = document.getElementById('video-stage-1');
      const s2 = document.getElementById('video-stage-2');
      const s3 = document.getElementById('video-stage-3');
      const label = document.getElementById('scanner-stage-label');

      const p1 = document.getElementById('pill-stage-1');
      const p2 = document.getElementById('pill-stage-2');
      const p3 = document.getElementById('pill-stage-3');

      if (!s1 || !s2 || !s3) return;

      // Hide all stages
      s1.classList.add('hidden');
      s2.classList.add('hidden');
      s3.classList.add('hidden');

      // Reset pill styles
      [p1, p2, p3].forEach(p => {
        if (p) {
          p.className = 'px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-400 font-bold transition-all cursor-pointer';
        }
      });

      if (stage === 1) {
        s1.classList.remove('hidden');
        if (label) label.innerText = '1. تصوير ومسح الطبق';
        if (p1) p1.className = 'px-2 py-0.5 rounded border border-[#1D9BF0] bg-[#1D9BF0] text-white font-bold transition-all cursor-pointer';
      } else if (stage === 2) {
        s2.classList.remove('hidden');
        if (label) label.innerText = '2. تحليل كيمياء الوجبة والشبع';
        if (p2) p2.className = 'px-2 py-0.5 rounded border border-[#1D9BF0] bg-[#1D9BF0] text-white font-bold transition-all cursor-pointer';
      } else if (stage === 3) {
        s3.classList.remove('hidden');
        if (label) label.innerText = '3. المكونات والنسب الدقيقة';
        if (p3) p3.className = 'px-2 py-0.5 rounded border border-[#1D9BF0] bg-[#1D9BF0] text-white font-bold transition-all cursor-pointer';
      }

      lucide.createIcons();
    }

    function setScannerStage(stage) {
      applyScannerStageUI(stage);
      // Adjust start time so the loop aligns with the selected stage
      if (stage === 1) scannerStartTime = Date.now();
      else if (stage === 2) scannerStartTime = Date.now() - 1500;
      else if (stage === 3) scannerStartTime = Date.now() - 3000;
    }

    function toggleScannerVideoPlay() {
      scannerIsPlaying = !scannerIsPlaying;
      const icon = document.getElementById('scanner-play-icon');
      if (icon) {
        icon.setAttribute('data-lucide', scannerIsPlaying ? 'pause' : 'play');
        lucide.createIcons();
      }
      if (scannerIsPlaying) {
        // Resume seamlessly
        if (scannerCurrentStage === 1) scannerStartTime = Date.now();
        else if (scannerCurrentStage === 2) scannerStartTime = Date.now() - 1500;
        else if (scannerCurrentStage === 3) scannerStartTime = Date.now() - 3000;
      }
    }

    // Start video loop on load
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(updateScannerVideoLoop);
    });

    // 6.2 App Email Waitlist Handler
    function handleAppWaitlistSubmit(e) {
      e.preventDefault();
      const input = document.getElementById('waitlist_email');
      const btn = document.getElementById('waitlist-btn');
      const msg = document.getElementById('waitlist-success-msg');
      const email = input.value.trim();
      if (!email) return;

      btn.disabled = true;
      btn.innerHTML = `<span class="inline-block animate-spin border-2 border-slate-950 border-t-transparent rounded-full w-3.5 h-3.5"></span> <span>جاري الحفظ...</span>`;

      sendDataToGoogleSheets({
        form_type: "قائمة انتظار تطبيق سليم (Email Waitlist)",
        client_email: email,
        client_name: "مشترك مهتم بالتطبيق",
        submitted_at: new Date().toISOString()
      });

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i> <span>تم التسجيل ✓</span>`;
        input.value = '';
        if (msg) msg.classList.remove('hidden');
        lucide.createIcons();
      }, 600);
    }

    // 6. Form Submission & Payment Link Redirect
    const CHECKOUT_REDIRECT_URL = "https://buy.stripe.com/test_placeholder_saliim_199";

    
    // Country Code & Phone Inline Validation Helpers
    function updatePhonePlaceholder(context) {
      const codeSelect = document.getElementById('phone_country_code');
      const phoneInput = document.getElementById('client_phone');
      if (!codeSelect || !phoneInput) return;
      const code = codeSelect.value;
      if (code === '+966') phoneInput.placeholder = '50 123 4567';
      else if (code === '+20') phoneInput.placeholder = '10 1234 5678';
      else if (code === '+971') phoneInput.placeholder = '50 123 4567';
      else if (code === '+965') phoneInput.placeholder = '50 123 456';
      else if (code === '+1') phoneInput.placeholder = '202 555 0123';
      else phoneInput.placeholder = '123456789';
      clearPhoneError();
    }

    function showPhoneError(msg) {
      const input = document.getElementById('client_phone');
      const errBox = document.getElementById('phone-error-msg');
      const errText = document.getElementById('phone-error-text');
      if (input) {
        input.classList.remove('border-slate-700', 'focus:border-[#0A4174]', 'focus:border-[#1D9BF0]');
        input.classList.add('border-rose-500', 'bg-rose-950/20');
        input.focus();
      }
      if (errBox) {
        errBox.classList.remove('hidden');
        if (errText) errText.innerText = msg;
      }
      if (window.lucide) lucide.createIcons();
    }

    function clearPhoneError() {
      const input = document.getElementById('client_phone');
      const errBox = document.getElementById('phone-error-msg');
      if (input) {
        input.classList.remove('border-rose-500', 'bg-rose-950/20');
        input.classList.add('border-slate-700');
      }
      if (errBox) {
        errBox.classList.add('hidden');
      }
    }

    function getFormattedFullPhone() {
      const codeSelect = document.getElementById('phone_country_code');
      const phoneInput = document.getElementById('client_phone');
      if (!phoneInput) return '';
      let raw = phoneInput.value.trim().replace(/[^\d+]/g, '');
      if (!raw) return '';

      // If user pasted a number with country code
      if (raw.startsWith('+')) {
        return raw;
      }

      // Remove leading zeros e.g. 050 -> 50
      raw = raw.replace(/^0+/, '');
      const code = codeSelect ? codeSelect.value : '+966';
      return (code === '+' ? '+' : code) + raw;
    }

    function setPhoneAndCountryCode(fullNumber) {
      if (!fullNumber) return;
      const codeSelect = document.getElementById('phone_country_code');
      const phoneInput = document.getElementById('client_phone');
      if (!codeSelect || !phoneInput) return;

      let clean = fullNumber.trim().replace(/[^\d+]/g, '');
      const knownCodes = ["+966", "+971", "+965", "+974", "+968", "+973", "+962", "+964", "+961", "+212", "+213", "+216", "+218", "+249", "+967", "+20", "+44", "+49", "+90", "+1"];
      
      let matchedCode = '+966';
      for (const c of knownCodes) {
        if (clean.startsWith(c)) {
          matchedCode = c;
          clean = clean.substring(c.length);
          break;
        }
      }
      codeSelect.value = matchedCode;
      phoneInput.value = clean.replace(/^0+/, '');
    }

    // Attach real-time clear error listener on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
      const phoneInput = document.getElementById('client_phone');
      if (phoneInput) {
        phoneInput.addEventListener('input', clearPhoneError);
      }
    });

    function handleBookingSubmit(e) {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-btn');
      const name = document.getElementById('client_name').value.trim();
      const phone = document.getElementById('client_phone').value.trim();

      clearPhoneError();
      const localPhone = document.getElementById('client_phone').value.trim().replace(/[^\d]/g, '');
      if (!localPhone) {
        showPhoneError("يرجى إدخال رقم الواتساب للمتابعة");
        return;
      }
      if (localPhone.length < 7 || localPhone.length > 14) {
        showPhoneError("رقم الهاتف غير مكتمل، يرجى كتابة الرقم كاملاً بدون كود الدولة");
        return;
      }
      const fullPhone = getFormattedFullPhone();
      if (window.validatePhoneNumber && !window.validatePhoneNumber(fullPhone)) {
        showPhoneError("رقم الهاتف غير متوافق مع المعايير الدولية، يرجى التأكد من الرقم");
        return;
      }
      const pkgSelect = document.getElementById('package_select');
      const pkgName = pkgSelect.options[pkgSelect.selectedIndex].text;
      const priceText = document.getElementById('summary_price').innerText;
      
      const goalSelect = document.getElementById('modal_goal');
      let goal = goalSelect.options[goalSelect.selectedIndex].text;
      if (goalSelect.value === 'other') {
        const customText = document.getElementById('custom_goal_text').value.trim();
        if (customText) goal = 'مخصص: ' + customText;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="inline-block animate-spin mr-2 border-2 border-slate-950 border-t-transparent rounded-full w-4 h-4"></span>
        <span>جاري تأكيد بياناتك وتحويلك لبوابة الدفع...</span>
      `;

      // Save lead details locally so Onboarding submits ONE comprehensive row in Google Sheets
      try {
        sessionStorage.setItem('saliim_lead_name', name);
        sessionStorage.setItem('saliim_lead_phone', fullPhone);
        sessionStorage.setItem('saliim_lead_goal', goal);
        sessionStorage.setItem('saliim_lead_pkg', pkgName);
      } catch(e) {}

            const pkgKey = pkgSelect.value || 'pro';
      try {
        localStorage.setItem('saliim_selected_package', pkgKey);
        sessionStorage.setItem('saliim_selected_package', pkgKey);
        document.cookie = `saliim_selected_package=${encodeURIComponent(pkgKey)}; path=/; max-age=604800`;
      } catch(e) {}

      const params = new URLSearchParams({
        name: name,
        phone: fullPhone,
        goal: goal,
        pkg: pkgKey,
        package: pkgKey,
        price: priceText
      });

      // Save lead immediately to Supabase & Google Sheets
      fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          phone: fullPhone,
          package: pkgKey,
          price: priceText,
          goal: goal,
          source: 'landing_modal'
        })
      }).catch(err => console.log('Lead save background err:', err));

      // Call EasyKash API via Vercel Serverless Function /api/create-payment
      fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          phone: fullPhone,
          pkg: pkgKey,
          goal: goal,
          host: window.location.origin
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          console.warn('EasyKash notice:', data.message || data);
          submitBtn.innerHTML = `<span>جاري تحويلك لاستكمال بيانات الاشتراك والمواعيد...</span>`;
          setTimeout(() => { window.location.href = `onboarding-v2.html?${params.toString()}`; }, 800);
        }
      })
      .catch(err => {
        console.error('Payment gateway fetch error, fallback:', err);
        window.location.href = `onboarding-v2.html?${params.toString()}`;
      });
    }



    // 7. Legal Modals Logic
function openLegalModal(type) {
      const modal = document.getElementById('legal-modal');
      const types = ['privacy', 'terms', 'medical', 'refund'];
      types.forEach(t => {
        const el = document.getElementById('legal-content-' + t);
        if (el) el.classList.add('hidden');
      });
      const target = document.getElementById('legal-content-' + type);
      if (target) target.classList.remove('hidden');
      if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
      lucide.createIcons();
    }

    function closeLegalModal() {
      const modal = document.getElementById('legal-modal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
    }

    // ==========================================================
    // 8. ULTRA-SMOOTH 60FPS ANIMATED NUMBER COUNTERS (easeOutQuart)
    // ==========================================================
    function initStatsCounter() {
      const statsSection = document.getElementById('hero-stats');
      if (!statsSection) return;

      let started = false;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !started) {
            started = true;
            runAllCountersSmooth();
          }
        });
      }, { threshold: 0.15 });

      observer.observe(statsSection);
    }

    function easeOutQuart(x) {
      return 1 - Math.pow(1 - x, 4);
    }

    function runAllCountersSmooth() {
      const counters = document.querySelectorAll('.stat-counter');
      const duration = 1800; // 1.8 seconds perfectly smooth duration
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);

        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target') || '0');
          const suffix = counter.getAttribute('data-suffix') || '';
          const isComma = counter.getAttribute('data-format') === 'comma';
          
          const currentVal = Math.floor(easedProgress * target);

          if (isComma) {
            counter.innerText = currentVal.toLocaleString('en-US') + suffix;
          } else {
            counter.innerText = currentVal + suffix;
          }
        });

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          // Guarantee final values are exact
          counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target') || '0');
            const suffix = counter.getAttribute('data-suffix') || '';
            const isComma = counter.getAttribute('data-format') === 'comma';
            if (isComma) {
              counter.innerText = target.toLocaleString('en-US') + suffix;
            } else {
              counter.innerText = target + suffix;
            }
          });
        }
      }

      requestAnimationFrame(update);
    }

    // ==========================================
    // 9. INTERACTIVE HEALTH QUIZ / CALCULATOR
    // ==========================================
    let currentQuizStep = 1;
    let quizSelectedGoal = 'weight_burn';
    let quizRecommendedPackage = 'pro';
    let quizRecommendedTitle = 'باقة Pro المتقدمة';
    let quizRecommendedPrice = '$119/شهرياً';

    function highlightQuizCard(radio) {
      document.querySelectorAll('.quiz-opt-card').forEach(c => {
        c.classList.remove('border-[#0A4174]', 'bg-[#1a314b]');
        c.classList.add('border-transparent');
      });
      const parent = radio.closest('.quiz-opt-card');
      if (parent) {
        parent.classList.add('border-[#0A4174]', 'bg-[#1a314b]');
        parent.classList.remove('border-transparent');
      }
      quizSelectedGoal = radio.value;
    }

    function nextQuizStep(step) {
      currentQuizStep = step;
      document.querySelectorAll('.quiz-step').forEach(s => s.classList.add('hidden'));
      const activeStep = document.getElementById('quiz-step-' + step);
      if (activeStep) activeStep.classList.remove('hidden');

      const titleEl = document.getElementById('quiz-step-title');
      const pctEl = document.getElementById('quiz-step-pct');
      const barEl = document.getElementById('quiz-progress-bar');

      if (step === 1) {
        if (titleEl) titleEl.innerText = 'الخطوة 1 من 3: هدفك الصحي الأساسي';
        if (pctEl) pctEl.innerText = '33%';
        if (barEl) barEl.style.width = '33%';
      } else if (step === 2) {
        if (titleEl) titleEl.innerText = 'الخطوة 2 من 3: القياسات الحيوية (الطول والوزن)';
        if (pctEl) pctEl.innerText = '66%';
        if (barEl) barEl.style.width = '66%';
      } else if (step === 3) {
        if (titleEl) titleEl.innerText = 'الخطوة 3 من 3: مستوى النشاط والتحدي الغذائي';
        if (pctEl) pctEl.innerText = '100%';
        if (barEl) barEl.style.width = '100%';
      }
      lucide.createIcons();
    }

    function validateAndGoStep3() {
      const h = parseFloat(document.getElementById('quiz_height').value);
      const w = parseFloat(document.getElementById('quiz_weight').value);
      if (!h || h < 100 || !w || w < 30) {
        alert('يرجى إدخال الطول والوزن بشكل صحيح للمتابعة');
        return;
      }
      nextQuizStep(3);
    }

    function calculateQuizResult(e) {
      e.preventDefault();
      const h = parseFloat(document.getElementById('quiz_height').value) / 100;
      const w = parseFloat(document.getElementById('quiz_weight').value);
      const act = document.getElementById('quiz_activity').value;
      const med = document.getElementById('quiz_medical').value;

      const bmi = (w / (h * h)).toFixed(1);
      let bmiStatus = '';
      let diagnosis = '';

      if (bmi < 18.5) {
        bmiStatus = `مؤشر كتلة جسمك: ${bmi} (نحافة أو كتلة عضلية منخفضة)`;
        diagnosis = 'جسمك يحتاج خطة تغذية بنائية لزيادة الكتلة العضلية وتحسين امتصاص المغذيات بدون دهون حشوية.';
        quizRecommendedPackage = 'pro';
        quizRecommendedTitle = 'باقة PRO (المتابعة المكثفة)';
        quizRecommendedPrice = '$119/شهرياً';
      } else if (bmi >= 18.5 && bmi < 25) {
        bmiStatus = `مؤشر كتلة جسمك: ${bmi} (وزن طبيعي ومتناسق)`;
        diagnosis = 'وزنك العام مثالي، والتركيز معك سيكون على إعادة تشكيل الجسم (Body Recomposition)، حرق الدهون السطحية الموضعية، وزيادة النشاط والإنتاجية اليومية.';
        quizRecommendedPackage = 'healthy';
        quizRecommendedTitle = 'باقة Healthy الأساسية';
        quizRecommendedPrice = '$69/شهرياً';
      } else if (bmi >= 25 && bmi < 30) {
        bmiStatus = `مؤشر كتلة جسمك: ${bmi} (زيادة وزن خفيفة إلى متوسطة)`;
        if (med === 'craving' || med === 'schedule') {
          diagnosis = 'جسمك يحتاج تنظيم أوقات الوجبات وكسر ثبات الوزن، والحل يبدأ من ضبط جودة المغذيات وهرمونات الشبع بدلاً من التجويع السعري.';
          quizRecommendedPackage = 'pro';
          quizRecommendedTitle = 'باقة Pro المتقدمة';
          quizRecommendedPrice = '$119/شهرياً';
        } else {
          diagnosis = 'جسمك يحتاج خطة حرق دهون مرنة تركز على كسر ثبات الوزن وتنظيم عادات الأكل مع تعديلات أسبوعية دقيقة على تقدمك.';
          quizRecommendedPackage = 'pro';
          quizRecommendedTitle = 'باقة PRO (المتابعة المكثفة)';
          quizRecommendedPrice = '$119/شهرياً';
        }
      } else {
        bmiStatus = `مؤشر كتلة جسمك: ${bmi} (سمنة أو دهون حشوية عنيدة)`;
        diagnosis = 'حالتك تتطلب اهتماماً غذائياً دقيقاً ومتابعة مستمرة لنمط حياتك وعاداتك اليومية، مع إشراف ومتابعة مكثفة تضمن وصولك لهدفك بثبات.';
        quizRecommendedPackage = 'pro';
        quizRecommendedTitle = 'باقة Pro المتقدمة';
        quizRecommendedPrice = '$119/شهرياً';
      }

      // Display Result
      document.getElementById('result-bmi-status').innerText = bmiStatus;
      document.getElementById('result-diagnosis-text').innerText = diagnosis;
      document.getElementById('result-plan-name').innerText = quizRecommendedTitle;
      document.getElementById('result-plan-price').innerText = quizRecommendedPrice;

      document.getElementById('health-quiz-form').classList.add('hidden');
      document.getElementById('quiz-result').classList.remove('hidden');
      lucide.createIcons();
    }

    function bookFromQuiz() {
      openBookingModal(quizRecommendedPackage, quizRecommendedTitle, quizRecommendedPrice);
    }

    function resetQuiz() {
      document.getElementById('health-quiz-form').reset();
      document.getElementById('quiz-result').classList.add('hidden');
      document.getElementById('health-quiz-form').classList.remove('hidden');
      nextQuizStep(1);
    }


    // ==========================================
    // 10. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
    // ==========================================
    function initScrollReveal() {
      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      if (!revealElements.length) return;

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target); // Reveal once smoothly
          }
        });
      }, {
        root: null,
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    }

    // Automatically initialize counters when DOM loads
    document.addEventListener('DOMContentLoaded', () => {
      initStatsCounter();
      initScrollReveal();
      // Auto highlight step 1 first option
      const firstOpt = document.querySelector('input[name="quiz_goal"]:checked');
      if (firstOpt) highlightQuizCard(firstOpt);
    });