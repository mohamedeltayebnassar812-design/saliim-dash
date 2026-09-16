/**
 * Saliim Platform - Onboarding & Scheduling Funnel Script
 * Dr. Ahmed Elkhateeb (Saliim)
 */
// ==========================================================
    // 1. CONFIGURATION & STATE
    // ==========================================================
    const GOOGLE_SHEETS_WEBAPP_URL = "/api/submit-lead";

    let currentLang = 'ar';
    let currentStep = 1;

    let clientProfile = {
      client_code: "",
      name: "",
      phone: "",
      email: "",
      location: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      target_weight: "",
      package: "",
      goal: "",
      conditions: [],
      medications: "",
      allergies: "",
      surgeries: "",
      activity: "",
      lab_link: "",
      nutrition_slot: "",
      coach_slot: ""
    };

    // ==========================================================
    // 2. BILINGUAL TRANSLATION DICTIONARY (i18n)
    // ==========================================================
    const translations = {
      ar: {
        header_brand: "منصة سليم",
        header_dr: "| د. أحمد الخطيب",
        header_sub: "بوابة استقبال وتفعيل اشتراكات المشتركين VIP",
        btn_support: "المساعدة والدعم",
        badge_step1: "1. بياناتك وأهدافك",
        badge_step1_m: "البيانات",
        badge_step2: "2. موعد أخصائي التغذية",
        badge_step2_m: "التغذية",
        badge_step3: "3. موعد الكوتش الرياضي",
        badge_step3_m: "الكوتش",
        badge_step4: "4. التفعيل والتأكيد",
        badge_step4_m: "التفعيل",
        step1_tag: "الخطوة 1 من 4",
        step1_title: "تسجيل بياناتك وأهداف التغذية واللياقة",
        step1_desc: "أهلاً بك في عائلة سليم! لنتمكن من تفصيل خطتك الغذائية وبرنامج التمارين الرياضية المناسب لروتينك بدقة، يرجى استكمال البيانات التالية.",
        sec1_title: "البيانات الشخصية والأساسية",
        lbl_name: "الاسم ثلاثي أو رباعي",
        lbl_phone: "رقم الواتساب مع كود الدولة",
        lbl_email: "البريد الإلكتروني",
        lbl_location: "الدولة والمدينة (لضبط فارق التوقيت للمواعيد)",
        lbl_age: "السن (بالسنوات)",
        lbl_gender: "الجنس",
        opt_select_gender: "اختر الجنس",
        opt_male: "ذكر",
        opt_female: "أنثى",
        lbl_height: "الطول (سم)",
        lbl_weight: "الوزن الحالي",
        lbl_target_weight: "المستهدف",
        lbl_package: "الباقة المختارة",
        opt_select_pkg: "اختر الباقة المناسبة",
        pkg_healthy: "باقة Healthy ($69 شهرياً)",
        pkg_pro: "باقة Pro المتقدمة ($119 شهرياً)",
        pkg_consultation: "استشارة خاصة مع د. أحمد الخطيب ($89)",
        pkg_other: "أخرى / قمت بالتحويل البنكي أو الدفع المباشر",
        sec2_title: "أهدافك ونمط حياتك الغذائي والبدني",
        lbl_goal: "ما هو هدفك الأساسي من الاشتراك؟",
        goal_fatloss: "خسارة الوزن ونزول الدهون الزائدة وشد الجسم",
        goal_tone: "زيادة الوزن وبناء كتلة عضلية صحية",
        goal_habits: "نمط حياة صحي وتنظيم التغذية والنشاط اليومي",
        goal_other: "هدف آخر (سأوضحه لأخصائي التغذية والكوتش)",
        lbl_workout_place: "أين تفضل أداء تمارينك مع الكوتش؟",
        place_home: "تمارين منزلية (بأدوات بسيطة أو بوزن الجسم)",
        place_gym: "في الجيم / النادي الرياضي (أوزان وأجهزة)",
        place_walk: "مشي يومي وتمارين خفيفة وتنشيطية",
        place_diet_first: "أفضّل التركيز على التغذية ونمط الحياة أولاً",
        lbl_activity: "مستوى النشاط البدني اليومي الحالي",
        act_sedentary: "خامل (عمل مكتبي، حركة قليلة جداً)",
        act_moderate: "متوسط (أمشي بين الحين والآخر، نشاط عادي)",
        act_active: "نشط (أمارس تمارين 2-3 أيام أسبوعياً)",
        act_athlete: "متقدم (أتدرب بانتظام 4-5 أيام أسبوعياً)",
        lbl_meals_count: "كم وجبة رئيسية تفضل تناولها يومياً؟",
        meals_2: "وجبتان رئيسيتان (نظام الصيام أو وجبتين مشبعتين)",
        meals_3: "3 وجبات رئيسية منتظمة (إفطار، غداء، عشاء)",
        meals_multi: "وجبات متعددة وصغيرة خلال اليوم",
        meals_specialist: "حسب ما يراه أخصائي التغذية مناسباً لروتين يومي",
        lbl_injuries: "هل تعاني من أي آلام مفاصل أو ظهر يجب على الكوتش مراعاتها؟",
        lbl_allergies: "الحساسيات الغذائية أو أطعمة لا تفضل وجودها في وجباتك",
        lbl_lifestyle_notes: "طبيعة روتين يومك، نومك، أو أي تفاصيل إضافية تحب توضيحها",
        btn_submit_step1: "حفظ البيانات والانتقال لجدولة المواعيد",
        calendly_lock_title: "حجز مضمون وغير متكرر:",
        calendly_lock_notice: "بمجرد اختيارك للموعد، يُغلق تلقائياً في Calendly لمنع أي تعارض ولا يستطيع أي عميل آخر اختياره.",
        loading_nutrition_cal: "جاري تحميل تقويم المواعيد المباشر من Calendly...",
        loading_coach_cal: "جاري تحميل تقويم الكوتش المباشر من Calendly...",
        btn_advance_coach_manual: "أتممت حجز التغذية ➔ الانتقال لموعد الكوتش",
        btn_advance_step4_manual: "أتممت حجز الكوتش ➔ استكمال وتأكيد التفعيل",
        lbl_nutrition_booked_success: "تم تأكيده في Calendly ✓",
        msg_confidential: "بياناتك وتفضيلاتك مشفرة ومحفوظة بخصوصية وسرية تامة تحت إشراف د. أحمد الخطيب وفريقه.",
        step2_tag: "الخطوة 2 من 4",
        step2_sub: "جلسة فردية 1:1 متخصصة",
        step2_title: "حجز استشارة أخصائي التغذية الصحية",
        step2_desc: "اختر اليوم والفترة الأنسب لك لحجز جلستك الفردية مع أخصائي التغذية لمناقشة ملفك الطبي وتفصيل خطتك.",
        lbl_client_confirmed: "المشترك المسجل:",
        lbl_select_day: "1. اختر اليوم المتاح للمقابلة:",
        lbl_select_time: "2. اختر التوقيت الأنسب لك (بتوقيت مكة والقاهرة):",
        lbl_slot_chosen: "الموعد المحدد للتغذية:",
        lbl_ready: "جاهز للاعتماد ✓",
        btn_back_intake: "العودة لتعديل البيانات",
        btn_lock_coach: "خطوة الكوتش مقفولة حتى تحديد موعد التغذية أولاً",
        btn_advance_coach: "تأكيد موعد التغذية والانتقال للكوتش الرياضي ←",
        step3_tag: "الخطوة 3 من 4",
        step3_sub: "جلسة تدريبية وتقييم حركي",
        step3_title: "حجز جلسة الكوتش الرياضي والتقييم الحركي",
        step3_desc: "اختر موعد جلستك مع المدرب الرياضي لتحديد مستوى لياقتك وبرنامج التمارين المتوافق مع حالتك الصحية.",
        lbl_confirmed_nutrition: "موعد التغذية المحجوز:",
        msg_anti_conflict: "نظام الحجز الذكي يمنع تلقائياً اختيار نفس توقيت موعد التغذية لتجنب أي تعارض في جدولك.",
        lbl_select_coach_day: "1. اختر يوم جلسة الكوتش:",
        lbl_select_coach_time: "2. اختر التوقيت المتاح للكوتش:",
        lbl_slot_coach_chosen: "الموعد المحدد للكوتش:",
        btn_back_nutrition: "العودة لتعديل موعد التغذية",
        btn_lock_step4: "خطوة التفعيل مقفولة حتى تحديد موعد الكوتش",
        btn_advance_step4: "تأكيد موعد الكوتش وتفعيل الاشتراك ←",
        step4_tag: "تم تفعيل ملفك بنجاح!",
        step4_welcome: "أهلاً بك رسمياً في عائلة سليم،",
        step4_desc: "تم استلام بياناتك وتفضيلاتك وحفظ كافة مواعيدك بنجاح. أخصائي التغذية والكوتش وفريق د. أحمد الخطيب بانتظارك لمرافقتك في رحلة التحول الصحي.",
        lbl_vip_code: "كود المشترك المعتمد في منصة سليم",
        btn_copy_code: "نسخ الكود",
        card_nutrition_title: "موعد أخصائي التغذية",
        card_coach_title: "موعد الكوتش الرياضي",
        btn_join_wa: "الانضمام لمحادثة الواتساب VIP للمشتركين",
        msg_wa_hint: "اضغط للتواصل المباشر مع فريق سليم المخصص للمتابعة",
        btn_home: "العودة إلى الصفحة الرئيسية لمنصة سليم",
        footer_copy: "جميع الحقوق محفوظة ©",
        footer_brand: "منصة سليم (Saliim) - د. أحمد الخطيب",
        nav_packages: "الباقات",
        nav_faq: "الأسئلة الشائعة",
        nav_support: "الدعم الطبي"
      },
      en: {
        header_brand: "Saliim Platform",
        header_dr: "| Dr. Ahmed El-Khateeb",
        header_sub: "VIP Client Intake & Onboarding Portal",
        btn_support: "Support & Help",
        badge_step1: "1. Goals & Profile",
        badge_step1_m: "Intake",
        badge_step2: "2. Nutrition Specialist",
        badge_step2_m: "Nutrition",
        badge_step3: "3. Fitness Coach",
        badge_step3_m: "Coach",
        badge_step4: "4. VIP Activation",
        badge_step4_m: "Activation",
        step1_tag: "Step 1 of 4",
        step1_title: "Nutrition & Fitness Goals Profile",
        step1_desc: "Welcome to the Saliim family! To help us tailor your medical, healthy nutrition, and fitness plan with the highest precision, please fill out your profile below.",
        sec1_title: "Personal Information",
        lbl_name: "Full Name",
        lbl_phone: "WhatsApp Number (with Country Code)",
        lbl_email: "Email Address",
        lbl_location: "Country & City (to match timezone for appointments)",
        lbl_age: "Age (Years)",
        lbl_gender: "Gender",
        opt_select_gender: "Select Gender",
        opt_male: "Male",
        opt_female: "Female",
        lbl_height: "Height (cm)",
        lbl_weight: "Current Weight (kg)",
        lbl_target_weight: "Target Weight (kg)",
        lbl_package: "Selected Package",
        opt_select_pkg: "Select Suitable Package",
        pkg_healthy: "Healthy Package ($69/mo)",
        pkg_pro: "Pro Advanced Package ($119/mo)",
        pkg_consultation: "Private Consultation with Dr. Ahmed El-Khateeb ($89)",
        pkg_other: "Other / Direct Bank Transfer",
        sec2_title: "Nutrition & Fitness Goals",
        lbl_goal: "What is your primary goal?",
        goal_fatloss: "Weight loss & sustainable fat loss",
        goal_tone: "Weight gain & healthy lean muscle building",
        goal_habits: "Healthy lifestyle & balanced daily routine",
        goal_other: "Other goal (will discuss with coach)",
        lbl_conditions: "Have you been diagnosed with any of the following? (Check all that apply)",
        cond_ir: "Insulin Resistance",
        cond_dm2: "Type 2 Diabetes",
        cond_bp: "High Blood Pressure",
        cond_fl: "Fatty Liver Disease",
        cond_th: "Hypothyroidism",
        cond_chol: "High Cholesterol / Triglycerides",
        cond_pcos: "PCOS",
        cond_ibs: "IBS / Digestive Disorders",
        cond_healthy: "None (Completely Healthy)",
        lbl_meds: "Current Medications & Supplements (if any)",
        lbl_allergies: "Food Allergies or Food Intolerances",
        lbl_surgeries: "Past Surgeries or Joint / Spine Injuries",
        lbl_activity: "Current Daily Activity Level",
        act_sedentary: "Sedentary (desk job, minimal movement)",
        act_moderate: "Moderate (walking occasionally, normal routine)",
        act_active: "Active (resistance or cardio 2-3 days/week)",
        act_athlete: "Advanced (regular training 4-6 days/week)",
        lbl_lab: "Link to Recent Blood Tests / Lab Reports (Optional)",
        lbl_lab_hint: "You can also send your test results later via WhatsApp to your specialist.",
        btn_submit_step1: "Save Profile & Proceed to Scheduling",
        msg_confidential: "Your medical data is securely encrypted under Dr. Ahmed El-Khateeb's expert supervision.",
        step2_tag: "Step 2 of 4",
        step2_sub: "Dedicated 1:1 Session",
        step2_title: "Schedule Your Healthy Nutrition Consultation",
        step2_desc: "Select your preferred date and slot to meet with your healthy nutritionist and review your health protocol.",
        lbl_client_confirmed: "Registered Client:",
        lbl_select_day: "1. Select Available Date:",
        lbl_select_time: "2. Select Convenient Time (Makkah & Cairo Time):",
        lbl_slot_chosen: "Selected Nutrition Slot:",
        lbl_ready: "Confirmed ✓",
        btn_back_intake: "Back to Edit Intake Form",
        btn_lock_coach: "Coach step is locked until Nutrition slot is chosen",
        btn_advance_coach: "Confirm Nutrition Slot & Proceed to Coach →",
        step3_tag: "Step 3 of 4",
        step3_sub: "Fitness & Movement Assessment",
        step3_title: "Schedule Your Fitness Coach Session",
        step3_desc: "Choose a time with your fitness coach to assess your mobility and design your tailored exercise routine.",
        lbl_confirmed_nutrition: "Booked Nutrition Time:",
        msg_anti_conflict: "Smart scheduling prevents booking the same time as your Nutrition slot to avoid schedule overlap.",
        lbl_select_coach_day: "1. Select Coach Session Date:",
        lbl_select_coach_time: "2. Select Available Coach Time:",
        lbl_slot_coach_chosen: "Selected Coach Slot:",
        btn_back_nutrition: "Back to Nutrition Calendar",
        btn_lock_step4: "Activation step is locked until Coach slot is chosen",
        btn_advance_step4: "Confirm Coach Slot & Activate Profile →",
        step4_tag: "Your Profile is Fully Activated!",
        step4_welcome: "Welcome officially to Saliim Family,",
        step4_desc: "Your medical intake and booked sessions are confirmed. Dr. Ahmed El-Khateeb and your care team are ready to guide you.",
        lbl_vip_code: "Official Saliim VIP Client Code",
        btn_copy_code: "Copy Code",
        card_nutrition_title: "Healthy Nutrition Session",
        card_coach_title: "Fitness Coach Session",
        btn_join_wa: "Join VIP Members WhatsApp Chat",
        msg_wa_hint: "Tap to connect directly with your dedicated medical follow-up team",
        btn_home: "Return to Saliim Homepage",
        footer_copy: "All Rights Reserved ©",
        footer_brand: "Saliim Platform - Dr. Ahmed El-Khateeb",
        nav_packages: "Packages",
        nav_faq: "FAQ",
        nav_support: "Support"
      }
    };

    // ==========================================================
    // 3. GENERATE CALENDAR DATES & SLOTS
    // ==========================================================
    function buildAvailableCalendarDays() {
      const days = [];
      const arabicDayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const englishDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const englishMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      let curr = new Date();
      curr.setDate(curr.getDate() + 1); // Start from tomorrow

      while (days.length < 6) {
        // Skip Friday (Day 5) as weekly clinic holiday
        if (curr.getDay() !== 5) {
          const dIndex = curr.getDay();
          const dayNum = curr.getDate();
          const mIndex = curr.getMonth();
          const year = curr.getFullYear();

          const dateKey = `${year}-${String(mIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

          days.push({
            dateKey: dateKey,
            dayNameAr: arabicDayNames[dIndex],
            dayNameEn: englishDayNames[dIndex],
            dayNum: dayNum,
            monthAr: arabicMonths[mIndex],
            monthEn: englishMonths[mIndex]
          });
        }
        curr.setDate(curr.getDate() + 1);
      }
      return days;
    }

    // Standard clinical slots
    const standardSlots = [
      { id: '11:00', timeAr: '11:00 صباحاً', timeEn: '11:00 AM' },
      { id: '12:30', timeAr: '12:30 ظهراً', timeEn: '12:30 PM' },
      { id: '02:00', timeAr: '02:00 عصراً', timeEn: '02:00 PM' },
      { id: '04:00', timeAr: '04:00 عصراً', timeEn: '04:00 PM' },
      { id: '05:30', timeAr: '05:30 مساءً', timeEn: '05:30 PM' },
      { id: '07:00', timeAr: '07:00 مساءً', timeEn: '07:00 PM' },
      { id: '08:30', timeAr: '08:30 مساءً', timeEn: '08:30 PM' },
      { id: '10:00', timeAr: '10:00 مساءً', timeEn: '10:00 PM' }
    ];

    // Fresh Client Code Generator (SLM-XXXX, range 2480-9890)
    function generateNewClientCode() {
      const min = 2480;
      const max = 9890;
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      return `SLM-${num}`;
    }

    // Copy Code Helper
    function copyClientCode() {
      const codeEl = document.getElementById('display-client-code');
      const code = (codeEl && codeEl.innerText && codeEl.innerText !== '---') ? codeEl.innerText : (clientProfile.client_code || 'SLM-5820');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
          const textEl = document.getElementById('copy-code-text');
          if (textEl) {
            textEl.innerText = currentLang === 'ar' ? "تم النسخ ✓" : "Copied ✓";
            setTimeout(() => { 
              textEl.innerText = currentLang === 'ar' ? "نسخ الكود" : "Copy Code"; 
            }, 2500);
          }
        });
      }
    }

    // ==========================================================
    // 4. INITIALIZATION & CLEAN STATE RESET
    // ==========================================================
    document.addEventListener("DOMContentLoaded", () => {
      lucide.createIcons();
      document.getElementById('year').textContent = new Date().getFullYear();

      // Clear any previous session lock to ensure fresh onboarding starts at Step 1
      sessionStorage.removeItem('saliim_nutrition_scheduled');
      sessionStorage.removeItem('saliim_coach_scheduled');
      sessionStorage.removeItem('saliim_nutrition_time');
      sessionStorage.removeItem('saliim_coach_time');

      
      // Read incoming parameters and auto-fill ALL previous user inputs
      const urlParams = new URLSearchParams(window.location.search);
      const prevName = urlParams.get('name') || sessionStorage.getItem('saliim_lead_name') || localStorage.getItem('saliim_user_name') || '';
      const prevPhone = urlParams.get('phone') || sessionStorage.getItem('saliim_lead_phone') || localStorage.getItem('saliim_user_phone') || '';
      const prevEmail = urlParams.get('email') || sessionStorage.getItem('saliim_lead_email') || localStorage.getItem('saliim_user_email') || '';
      const prevGoal = urlParams.get('goal') || sessionStorage.getItem('saliim_lead_goal') || '';

      if (prevName && document.getElementById('client_name')) document.getElementById('client_name').value = prevName;
      if (prevPhone) setPhoneAndCountryCode(prevPhone);
      if (prevEmail && document.getElementById('client_email')) document.getElementById('client_email').value = prevEmail;

      if (prevGoal && document.getElementById('client_goal')) {
        const goalEl = document.getElementById('client_goal');
        for (let i = 0; i < goalEl.options.length; i++) {
          if (goalEl.options[i].text.includes(prevGoal) || prevGoal.includes(goalEl.options[i].value)) {
            goalEl.selectedIndex = i;
            break;
          }
        }
      }

      if (urlParams.has('lang') && urlParams.get('lang') === 'en') {
        setLanguage('en');
      }

      autoSelectPackage();

      // Setup mutual exclusivity for medical condition checkboxes
      // Lifestyle & nutrition preferences initialized

      // Render Step 2 (Nutrition) Calendar
      
      // Always start fresh at Step 1
      goToStep(1);

      // Instant Pre-warming: Pre-load Nutrition Calendly in background while user fills Step 1
      setTimeout(() => {
        initNutritionCalendly();
        // Also pre-warm coach calendar
        setTimeout(initCoachCalendly, 1500);
      }, 500);
    });

    
    // ==========================================================
    // AUTO-FILL SELECTED PACKAGE FROM PAYMENT / CHECKOUT
    // ==========================================================
    function autoSelectPackage() {
      const pkgSelect = document.getElementById('client_package');
      if (!pkgSelect) return;

      const urlParams = new URLSearchParams(window.location.search);
      
      // 1. Gather all potential package indicators from URL
      const rawSources = [
        urlParams.get('pkg'),
        urlParams.get('package'),
        urlParams.get('plan'),
        urlParams.get('tier'),
        urlParams.get('selected'),
        urlParams.get('selected_package'),
        urlParams.get('price'),
        urlParams.get('amount')
      ];

      // 2. Add fallback sources: sessionStorage, localStorage, cookie
      try {
        rawSources.push(sessionStorage.getItem('saliim_selected_package'));
        rawSources.push(localStorage.getItem('saliim_selected_package'));
        rawSources.push(sessionStorage.getItem('saliim_package'));
        rawSources.push(localStorage.getItem('saliim_package'));
      } catch(e) {}

      // Parse cookies
      try {
        const cookies = document.cookie.split(';');
        for (let c of cookies) {
          const [k, v] = c.trim().split('=');
          if (k === 'saliim_selected_package' && v) {
            rawSources.push(decodeURIComponent(v));
          }
        }
      } catch(e) {}

      // 3. Find first non-empty input
      let rawInput = '';
      for (let s of rawSources) {
        if (s && typeof s === 'string' && s.trim().length > 0) {
          rawInput = s.trim().toLowerCase();
          break;
        }
      }

      if (!rawInput) return; // No package specified, keep default or existing

      // 4. Resolve package index:
      // Option 0: Healthy ($69)
      // Option 1: Pro ($119)
      // Option 2: Consultation with Dr. Ahmed ($89)
      // Option 3: Other / Direct transfer
      let targetIndex = -1;

      // Check PRO ($119) first (to prevent false matches)
      if (
        rawInput === 'pro' ||
        rawInput.includes('pro') ||
        rawInput.includes('119') ||
        rawInput.includes('120') ||
        rawInput.includes('برو') ||
        rawInput.includes('متقدم') ||
        rawInput.includes('advanced') ||
        rawInput.includes('vip') ||
        rawInput.includes('full')
      ) {
        targetIndex = 1;
      }
      // Check CONSULTATION ($89)
      else if (
        rawInput === 'consultation' ||
        rawInput === 'consultation_dr' ||
        rawInput.includes('consult') ||
        rawInput.includes('89') ||
        rawInput.includes('90') ||
        rawInput.includes('استشارة') ||
        rawInput.includes('جلسة') ||
        rawInput.includes('دكتور') ||
        rawInput.includes('احمد') ||
        rawInput.includes('أحمد') ||
        rawInput.includes('الخطيب') ||
        rawInput.includes('private')
      ) {
        targetIndex = 2;
      }
      // Check HEALTHY ($69)
      else if (
        rawInput === 'healthy' ||
        rawInput.includes('healthy') ||
        rawInput.includes('69') ||
        rawInput.includes('60') ||
        rawInput.includes('هيلثي') ||
        rawInput.includes('هلثي') ||
        rawInput.includes('أساسي') ||
        rawInput.includes('اساسي') ||
        rawInput.includes('لايف ستايل') ||
        rawInput.includes('lifestyle')
      ) {
        targetIndex = 0;
      }
      // Check OTHER / DIRECT TRANSFER
      else if (
        rawInput.includes('other') ||
        rawInput.includes('transfer') ||
        rawInput.includes('تحويل') ||
        rawInput.includes('بنك') ||
        rawInput.includes('مباشر') ||
        rawInput.includes('أخرى') ||
        rawInput.includes('اخري')
      ) {
        targetIndex = 3;
      }

      // 5. Apply selection
      if (targetIndex >= 0 && targetIndex < pkgSelect.options.length) {
        pkgSelect.selectedIndex = targetIndex;
        for (let i = 0; i < pkgSelect.options.length; i++) {
          pkgSelect.options[i].selected = (i === targetIndex);
        }
        pkgSelect.value = pkgSelect.options[targetIndex].value;
        
        // Trigger change event so any listeners run
        pkgSelect.dispatchEvent(new Event('change', { bubbles: true }));

        // Persist back to storage
        try {
          localStorage.setItem('saliim_selected_package', pkgSelect.options[targetIndex].value);
          sessionStorage.setItem('saliim_selected_package', pkgSelect.options[targetIndex].value);
        } catch(e) {}
      }

      // Keep updated if user manually changes
      pkgSelect.addEventListener('change', () => {
        try {
          localStorage.setItem('saliim_selected_package', pkgSelect.value);
          sessionStorage.setItem('saliim_selected_package', pkgSelect.value);
        } catch(e) {}
      });
    }

    function setupConditionCheckboxesLogic() {
      const allCbs = document.querySelectorAll('input[name="medical_condition"]');
      allCbs.forEach(cb => {
        cb.addEventListener('change', (e) => {
          const isHealthyCb = (cb.value.includes('سليم') || cb.value.includes('لا توجد') || cb.value.includes('Healthy'));
          if (isHealthyCb && cb.checked) {
            // If healthy is selected, uncheck all other disease checkboxes
            allCbs.forEach(other => {
              if (other !== cb) other.checked = false;
            });
          } else if (!isHealthyCb && cb.checked) {
            // If any condition is checked, uncheck the healthy checkbox
            allCbs.forEach(other => {
              if (other.value.includes('سليم') || other.value.includes('لا توجد') || other.value.includes('Healthy')) {
                other.checked = false;
              }
            });
          }
        });
      });
    }

    // ==========================================================
    // 5. LANGUAGE TOGGLE IMPLEMENTATION
    // ==========================================================
    function toggleLanguage() {
      setLanguage(currentLang === 'ar' ? 'en' : 'ar');
    }

    function setLanguage(lang) {
      currentLang = lang;
      const htmlEl = document.documentElement;
      const langBtnText = document.getElementById('lang-btn-text');

      if (lang === 'en') {
        htmlEl.setAttribute('lang', 'en');
        htmlEl.setAttribute('dir', 'ltr');
        langBtnText.innerText = 'العربية';
        const icon = document.getElementById('step1-btn-icon');
        if (icon) icon.setAttribute('data-lucide', 'arrow-right');
      } else {
        htmlEl.setAttribute('lang', 'ar');
        htmlEl.setAttribute('dir', 'rtl');
        langBtnText.innerText = 'English';
        const icon = document.getElementById('step1-btn-icon');
        if (icon) icon.setAttribute('data-lucide', 'arrow-left');
      }

      // Update all elements with data-i18n
      const dict = translations[lang];
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
          el.innerText = dict[key];
        }
      });

      // Update advance buttons state text if needed
      if (isNutritionScheduled) {
        unlockNutritionStep();
      }
      if (isCoachScheduled) {
        unlockCoachStep();
      }

      lucide.createIcons();
    }

    // ==========================================================
    // 6. STEP 1 FORM SUBMISSION
    // ==========================================================
    
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
        input.classList.remove('border-slate-700', 'focus:border-[#18746F]', 'focus:border-[#07C1BE]');
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

    function handleOnboardingSubmit(e) {
      e.preventDefault();
      const btn = document.getElementById('step-1-btn');

      clearPhoneError();
      const localPhone = document.getElementById('client_phone').value.trim().replace(/[^\d]/g, '');
      if (!localPhone) {
        showPhoneError(currentLang === 'ar' ? 'يرجى إدخال رقم الواتساب للمتابعة' : 'Please enter your phone number');
        return;
      }
      if (localPhone.length < 7 || localPhone.length > 14) {
        showPhoneError(currentLang === 'ar' ? 'رقم الهاتف غير مكتمل، يرجى كتابة الرقم كاملاً بدون كود الدولة' : 'Incomplete phone number, please enter without country code');
        return;
      }
      const rawPhone = getFormattedFullPhone();

      // Save for auto-fill in browser storage
      try {
        localStorage.setItem('saliim_user_name', document.getElementById('client_name').value.trim());
        localStorage.setItem('saliim_user_phone', rawPhone);
        localStorage.setItem('saliim_user_email', document.getElementById('client_email').value.trim());
      } catch(err) {}

      // Fresh unique prestigious code
      const freshCode = generateNewClientCode();
      sessionStorage.setItem('saliim_active_code', freshCode);

      const workoutPlaceEl = document.getElementById('client_workout_place');
      const mealsCountEl = document.getElementById('client_meals_count');
      const injuriesEl = document.getElementById('client_injuries');
      const allergiesEl = document.getElementById('client_allergies');
      const notesEl = document.getElementById('client_lifestyle_notes');

      clientProfile = {
        client_code: freshCode,
        name: document.getElementById('client_name').value.trim(),
        phone: document.getElementById('client_phone').value.trim(),
        email: document.getElementById('client_email').value.trim(),
        location: document.getElementById('client_location').value.trim(),
        age: document.getElementById('client_age').value.trim(),
        gender: document.getElementById('client_gender').value,
        height: document.getElementById('client_height').value.trim(),
        weight: document.getElementById('client_weight').value.trim(),
        target_weight: document.getElementById('client_target_weight').value.trim(),
        package: document.getElementById('client_package').value,
        goal: document.getElementById('client_goal').value,
        workout_place: workoutPlaceEl ? workoutPlaceEl.value : 'تمارين منزلية',
        activity: document.getElementById('client_activity_level').value,
        meals_count: mealsCountEl ? mealsCountEl.value : '3 وجبات رئيسية منتظمة',
        injuries: (injuriesEl && injuriesEl.value.trim()) || 'لا توجد آلام مفاصل',
        allergies: (allergiesEl && allergiesEl.value.trim()) || 'لا توجد حساسيات',
        lifestyle_notes: (notesEl && notesEl.value.trim()) || 'لا توجد ملاحظات إضافية',
        conditions: workoutPlaceEl ? workoutPlaceEl.value : 'نمط صحي',
        medications: mealsCountEl ? mealsCountEl.value : '3 وجبات',
        surgeries: (injuriesEl && injuriesEl.value.trim()) || 'لا يوجد',
        lab_link: (notesEl && notesEl.value.trim()) || 'لا يوجد',
        nutrition_slot: 'بانتظار الاختيار',
        coach_slot: 'بانتظار الاختيار',
        submitted_at: new Date().toISOString()
      };

      // Button feedback
      btn.disabled = true;
      btn.innerHTML = `
        <span class="inline-block animate-spin mr-2 border-2 border-slate-950 border-t-transparent rounded-full w-4 h-4"></span>
        <span>${currentLang === 'ar' ? 'جاري حفظ بياناتك وتفضيلاتك...' : 'Saving your profile & goals...'}</span>
      `;

      // Hold dispatch until appointments are chosen, so all 22 fields + appointments are sent in ONE single clean row
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = `
          <span>${currentLang === 'ar' ? 'حفظ البيانات ومتابعة حجز المواعيد' : 'Save Profile & Proceed to Scheduling'}</span>
          <i data-lucide="${currentLang === 'ar' ? 'arrow-left' : 'arrow-right'}" class="w-5 h-5"></i>
        `;
        lucide.createIcons();
        goToStep(2);
      }, 100);
    }

    // Google Sheets Dispatcher
    function sendToGoogleSheets(data) {
      if (!GOOGLE_SHEETS_WEBAPP_URL) return;

      const payload = {
        form_type: "استمارة سليم V2 - Onboarding Intake & Appointments",
        client_id: data.client_code,
        client_code: data.client_code,
        client_name: data.name,
        client_phone: data.phone,
        client_email: data.email,
        client_location: data.location,
        client_age: data.age,
        client_gender: data.gender,
        client_height: data.height,
        client_weight: data.weight,
        client_target_weight: data.target_weight,
        package: data.package,
        client_goal: data.goal,
        medical_conditions: data.conditions,
        medications: data.medications,
        allergies: data.allergies,
        surgeries: data.surgeries,
        activity_level: data.activity,
        lab_link: data.lab_link,
        nutrition_slot: data.nutrition_slot || 'بانتظار الاختيار',
        coach_slot: data.coach_slot || 'بانتظار الاختيار',
        nutrition_iso: data.nutrition_iso || '',
        coach_iso: data.coach_iso || '',
        submitted_at: data.submitted_at
      };

      try {
        fetch(GOOGLE_SHEETS_WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(err => console.log('Sheets log:', err));
      } catch(err) {
        console.log('Sheets log:', err);
      }
    }

    // Update slots in sheet
    function updateBookingSlotsInGoogleSheets() {
      if (!GOOGLE_SHEETS_WEBAPP_URL) return;
      const clientCode = clientProfile.client_code || sessionStorage.getItem('saliim_active_code');
      if (!clientCode) return;

      // Update existing record with appointments
      const payload = {
        action: 'update_appointments',
        client_id: clientCode,
        client_code: clientCode,
        nutrition_slot: clientProfile.nutrition_slot,
        coach_slot: clientProfile.coach_slot
      };

      try {
        fetch(GOOGLE_SHEETS_WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(err => console.log('Update slots log:', err));
      } catch(e) {
        console.log('Update slots err:', e);
      }
    }

    // ==========================================================
    // 7. CALENDLY WIDGET INTEGRATION & REAL-TIME SCHEDULING
    // ==========================================================
    const CALENDLY_NUTRITION_URL = "https://calendly.com/mohamedeltayebreyad222/meet-with-me";
    const CALENDLY_COACH_URL = "https://calendly.com/mohamedeltayebreyad222/clone";

    let nutritionWidgetLoaded = false;
    let coachWidgetLoaded = false;
    let isNutritionScheduled = false;
    let isCoachScheduled = false;

    function buildCalendlyUrl(baseUrl, primaryColor = '07c1be') {
      const url = new URL(baseUrl);
      url.searchParams.set('hide_landing_page_details', '1');
      url.searchParams.set('hide_gdpr_banner', '1');
      url.searchParams.set('background_color', '0E2530');
      url.searchParams.set('text_color', 'ffffff');
      url.searchParams.set('primary_color', primaryColor);
      url.searchParams.set('embed_domain', window.location.host || 'ahmedelkhateeb.com');
      url.searchParams.set('embed_type', 'Inline');

      const clientName = clientProfile.name || document.getElementById('client_name')?.value?.trim();
      const clientEmail = clientProfile.email || document.getElementById('client_email')?.value?.trim();
      const clientPhone = clientProfile.phone || document.getElementById('client_phone')?.value?.trim();
      const clientCode = clientProfile.client_code || sessionStorage.getItem('saliim_active_code');

      if (clientName) {
        const displayName = clientCode ? `${clientName} (${clientCode})` : clientName;
        url.searchParams.set('name', displayName);
      }
      if (clientEmail) url.searchParams.set('email', clientEmail);
      if (clientPhone) {
        url.searchParams.set('a1', clientPhone);
        url.searchParams.set('phone', clientPhone);
      }

      return url.toString();
    }

    function initNutritionCalendly(forceReload = false) {
      const container = document.getElementById('calendly-nutrition-container');
      if (!container) return;
      if (!forceReload && nutritionWidgetLoaded && container.querySelector('iframe')) return;

      const fullUrl = buildCalendlyUrl(CALENDLY_NUTRITION_URL, '07c1be');
      container.innerHTML = '';

      const prefillData = {
        name: clientProfile.client_code ? `${clientProfile.name} (${clientProfile.client_code})` : clientProfile.name,
        email: clientProfile.email || '',
        customAnswers: {
          a1: clientProfile.phone || ''
        }
      };

      if (window.Calendly && typeof window.Calendly.initInlineWidget === 'function') {
        window.Calendly.initInlineWidget({
          url: fullUrl,
          parentElement: container,
          prefill: prefillData
        });
        nutritionWidgetLoaded = true;
      } else {
        container.innerHTML = `
          <iframe 
            src="${fullUrl}" 
            width="100%" 
            height="100%" 
            frameborder="0"
            loading="eager"
            title="حجز موعد أخصائي التغذية">
          </iframe>
        `;
        nutritionWidgetLoaded = true;
      }
    }

    function initCoachCalendly(forceReload = false) {
      const container = document.getElementById('calendly-coach-container');
      if (!container) return;
      if (!forceReload && coachWidgetLoaded && container.querySelector('iframe')) return;

      const fullUrl = buildCalendlyUrl(CALENDLY_COACH_URL, '07c1be');
      container.innerHTML = '';

      const prefillData = {
        name: clientProfile.client_code ? `${clientProfile.name} (${clientProfile.client_code})` : clientProfile.name,
        email: clientProfile.email || '',
        customAnswers: {
          a1: clientProfile.phone || ''
        }
      };

      if (window.Calendly && typeof window.Calendly.initInlineWidget === 'function') {
        window.Calendly.initInlineWidget({
          url: fullUrl,
          parentElement: container,
          prefill: prefillData
        });
      } else {
        container.innerHTML = `
          <iframe 
            src="${fullUrl}" 
            width="100%" 
            height="100%" 
            frameborder="0"
            title="حجز موعد الكوتش الرياضي">
          </iframe>
        `;
      }
      coachWidgetLoaded = true;
    }

    function unlockNutritionStep() {
    // Pre-load Coach Calendly as soon as user unlocks Step 2
    setTimeout(() => {
      if (typeof initCoachCalendly === 'function') initCoachCalendly();
    }, 1200);
      isNutritionScheduled = true;
      const btn = document.getElementById('advance-to-coach-btn');
      if (btn) {
        btn.className = "w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#07C1BE] to-[#18746F] hover:from-[#05A8A5] hover:to-[#135E5A] text-slate-950 text-xs font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5";
        btn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4"></i><span>${currentLang === 'ar' ? 'تم تأكيد موعد التغذية! المتابعة للكوتش ←' : 'Nutrition Confirmed! Proceed to Coach →'}</span>`;
        lucide.createIcons();
      }
    }

    function unlockCoachStep() {
      isCoachScheduled = true;
      const btn = document.getElementById('advance-to-step4-btn');
      if (btn) {
        btn.className = "w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#07C1BE] to-[#18746F] hover:from-[#05A8A5] hover:to-[#135E5A] text-slate-950 text-xs font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5";
        btn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4"></i><span>${currentLang === 'ar' ? 'تم تأكيد موعد الكوتش! تفعيل الحساب ←' : 'Coach Confirmed! Activate Profile →'}</span>`;
        lucide.createIcons();
      }
    }

    function handleAdvanceToCoach() {
      clientProfile.nutrition_slot = "تم الحجز والتأكيد عبر Calendly ✓";
      isNutritionScheduled = true;
      updateBookingSlotsInGoogleSheets();
      goToStep(3);
    }

    function handleAdvanceToStep4() {
      clientProfile.coach_slot = "تم الحجز والتأكيد عبر Calendly ✓";
      isCoachScheduled = true;
      // Dispatch full profile to Google Sheets
      sendToGoogleSheets(clientProfile);
      goToStep(4);
    }

    // ==========================================================
    // INSTANT AUTOMATED CALENDLY EVENT SCHEDULING LISTENER
    // Automatically transitions step-to-step the moment Schedule Event is clicked
    // ==========================================================
    function parseCalendlyMessage(e) {
      if (!e || !e.data) return null;
      let data = e.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch(err) {
          if (data.indexOf('calendly.event_scheduled') !== -1 || data.indexOf('event_scheduled') !== -1) {
            return { event: 'calendly.event_scheduled' };
          }
          return null;
        }
      }
      return data;
    }

    window.addEventListener('message', function(e) {
      const msg = parseCalendlyMessage(e);
      if (!msg) return;

      const eventName = msg.event || msg.action || '';
      const isScheduled = (eventName === 'calendly.event_scheduled' || eventName === 'event_scheduled');

      if (isScheduled) {
        console.log("Calendly schedule event triggered:", eventName, "currentStep:", currentStep);

        // Transition from Step 2 (Nutrition) -> Step 3 (Coach)
        if (currentStep === 2 || !isNutritionScheduled) {
          isNutritionScheduled = true;
          clientProfile.nutrition_slot = "تم الحجز والتأكيد عبر Calendly ✓";
          
          try { updateBookingSlotsInGoogleSheets(); } catch(err) {}
          
          showToastAlert(currentLang === 'ar' ? 'تم تأكيد موعد التغذية بنجاح! جاري تحويلك لحجز موعد الكوتش...' : 'Nutrition confirmed! Moving to Coach scheduling...');
          
          // Instant automated transition
          setTimeout(() => {
            goToStep(3);
            window.scrollTo({ top: 100, behavior: 'smooth' });
          }, 300);
        }
        // Transition from Step 3 (Coach) -> Step 4 (Activation)
        else if (currentStep === 3 || isNutritionScheduled) {
          isCoachScheduled = true;
          clientProfile.coach_slot = "تم الحجز والتأكيد عبر Calendly ✓";

          try { sendToGoogleSheets(clientProfile); } catch(err) {}

          showToastAlert(currentLang === 'ar' ? 'تم تأكيد موعد الكوتش بنجاح! جاري إكمال تفعيل ملفك...' : 'Coach confirmed! Finalizing your activation...');

          // Instant automated transition
          setTimeout(() => {
            goToStep(4);
            window.scrollTo({ top: 50, behavior: 'smooth' });
          }, 300);
        }
      }
    });

    // ==========================================================
    // 9. STEP NAVIGATION & STEP 4 FINAL SETUP
    // ==========================================================
    function goToStep(step) {
      currentStep = step;

      document.getElementById('step-1-container').classList.add('hidden');
      document.getElementById('step-2-container').classList.add('hidden');
      document.getElementById('step-3-container').classList.add('hidden');
      document.getElementById('step-4-container').classList.add('hidden');

      const progressFill = document.getElementById('progress-bar-fill');
      const progressMap = { 1: '25%', 2: '50%', 3: '75%', 4: '100%' };
      progressFill.style.width = progressMap[step];

      // Update badge states
      for (let i = 1; i <= 4; i++) {
        const badge = document.getElementById(`step-badge-${i}`);
        const circle = badge.querySelector('div');
        if (i < step) {
          badge.className = 'flex flex-col items-center gap-1.5 text-emerald-400 font-bold';
          circle.className = 'w-8 h-8 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center';
        } else if (i === step) {
          badge.className = 'flex flex-col items-center gap-1.5 text-[#07C1BE] font-black';
          circle.className = 'w-8 h-8 rounded-full bg-cyan-950 border-2 border-[#07C1BE] flex items-center justify-center shadow-lg shadow-cyan-500/30';
        } else {
          badge.className = 'flex flex-col items-center gap-1.5 text-slate-500 font-bold';
          circle.className = 'w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center';
        }
      }

      const currentContainer = document.getElementById(`step-${step}-container`);
      if (currentContainer) {
        currentContainer.classList.remove('hidden');
      }

      // Step specific setups
      if (step === 2) {
        initNutritionCalendly(true);
        document.getElementById('summary-client-name').innerText = (clientProfile.name || 'المشترك') + (clientProfile.client_code ? ` [${clientProfile.client_code}]` : '');
        document.getElementById('summary-client-phone').innerText = clientProfile.phone || '';
      } else if (step === 3) {
        initCoachCalendly(true);
      } else if (step === 4) {
        document.getElementById('final-client-name').innerText = clientProfile.name || (currentLang === 'ar' ? 'عزيزي المشترك' : 'Valued Client');
        
        let codeToShow = clientProfile.client_code || sessionStorage.getItem('saliim_active_code') || generateNewClientCode();
        clientProfile.client_code = codeToShow;
        document.getElementById('display-client-code').innerText = codeToShow;

        document.getElementById('final-nutrition-slot').innerText = clientProfile.nutrition_slot || '-';
        document.getElementById('final-coach-slot').innerText = clientProfile.coach_slot || '-';

        // Prepare WhatsApp message
        let waMsg = "";
        if (currentLang === 'ar') {
          waMsg = encodeURIComponent(
            `مرحباً د. أحمد الخطيب وفريق سليم 🌿

` +
            `أنا المشترك: ${clientProfile.name || 'مشترك سليم'}
` +
            `كود المشترك الطبي الخاص بي: ${codeToShow}
` +
            `الباقة: ${clientProfile.package || 'سليم VIP'}
` +
            `موعد التغذية: ${clientProfile.nutrition_slot}
` +
            `موعد الكوتش: ${clientProfile.coach_slot}

` +
            `أتممت تسجيل ملفي الطبي وحجز المواعيد بنجاح، وجاهز للبدء والتواصل معكم!`
          );
        } else {
          waMsg = encodeURIComponent(
            `Hello Dr. Ahmed El-Khateeb & Saliim Team 🌿

` +
            `Client Name: ${clientProfile.name || 'Saliim Member'}
` +
            `Medical Client Code: ${codeToShow}
` +
            `Package: ${clientProfile.package || 'Saliim VIP'}
` +
            `Nutrition Session: ${clientProfile.nutrition_slot}
` +
            `Fitness Session: ${clientProfile.coach_slot}

` +
            `I have successfully completed my medical intake and booked my sessions. Ready to start!`
          );
        }
        document.getElementById('whatsapp-vip-link').href = `https://wa.me/201016629916?text=${waMsg}`;
      }

      // Smooth scroll
      setTimeout(() => {
        if (currentContainer) {
          const yOffset = -70;
          const y = currentContainer.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      }, 80);

      lucide.createIcons();
    }

    function showToastAlert(msg) {
      const alert = document.createElement('div');
      alert.className = 'fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm border-2 border-amber-300 animate-bounce';
      alert.innerHTML = `<i data-lucide="alert-triangle" class="w-5 h-5 flex-shrink-0"></i><span>${msg}</span>`;
      document.body.appendChild(alert);
      lucide.createIcons();
      setTimeout(() => alert.remove(), 3500);
    }