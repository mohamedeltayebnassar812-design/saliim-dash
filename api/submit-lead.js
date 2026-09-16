// Vercel Serverless Function: /api/submit-lead
// Dual Persistence: Supabase Database (saliim-dash) + Google Sheets Backup

const SUPABASE_URL = process.env.SUPABASE_URL || "https://zbtyybuofnlkbidoukzc.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL || "https://script.google.com/macros/s/AKfycbxVYE6T2lYH87A7R8Yuzcl_PfE1920BA9pHC9zB0GHu-RuxEXC_PgWQhtgkBA_8pCtnyQ/exec";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const payload = req.body || {};

    // 1. Map incoming payload to Supabase "clients" schema
    const clientId = payload.client_code || ('SLM-' + Date.now().toString(36).toUpperCase());
    const fullName = payload.name || payload.client_name || "مشترك جديد";
    const phone = payload.phone || payload.client_phone || "";
    const email = payload.email || payload.client_email || null;
    const pkg = payload.package || payload.package_name || payload.pkg || "pro";
    const goal = payload.goal || payload.client_goal || "";

    const age = payload.age ? parseInt(payload.age, 10) : null;
    const height = payload.height ? parseFloat(payload.height) : null;
    const weight = payload.weight ? parseFloat(payload.weight) : null;
    const targetWeight = payload.target_weight ? parseFloat(payload.target_weight) : null;
    
    let gender = null;
    if (payload.gender === 'male' || payload.gender === 'ذكر') gender = 'ذكر';
    else if (payload.gender === 'female' || payload.gender === 'أنثى') gender = 'أنثى';

    const stage = (payload.height || payload.weight) ? 'onboarding_completed' : 'new_lead';
    
    // Construct rich notes preview
    let notesPreview = [];
    if (goal) notesPreview.push(`الهدف: ${goal}`);
    if (payload.workout_place) notesPreview.push(`مكان التمرين: ${payload.workout_place}`);
    if (payload.activity) notesPreview.push(`النشاط: ${payload.activity}`);
    if (payload.injuries) notesPreview.push(`المفاصل: ${payload.injuries}`);
    if (payload.nutrition_slot && payload.nutrition_slot !== 'بانتظار الاختيار') {
      notesPreview.push(`جلسة التغذية: ${payload.nutrition_slot}`);
    }
    if (payload.coach_slot && payload.coach_slot !== 'بانتظار الاختيار') {
      notesPreview.push(`جلسة الكوتش: ${payload.coach_slot}`);
    }
    if (payload.lifestyle_notes) notesPreview.push(`ملاحظات: ${payload.lifestyle_notes}`);

    const clientRecord = {
      id: clientId,
      full_name: fullName,
      phone: phone,
      email: email,
      age: isNaN(age) ? null : age,
      gender: gender,
      height_cm: isNaN(height) ? null : height,
      current_weight_kg: isNaN(weight) ? null : weight,
      target_weight_kg: isNaN(targetWeight) ? null : targetWeight,
      health_condition: goal || 'نمط حياة صحي',
      package_name: pkg,
      source: 'landing_funnel',
      pipeline_stage: stage,
      notes_preview: notesPreview.join(' | ') || null,
      stage_updated_at: new Date().toISOString()
    };

    // 2. Upsert into Supabase "clients" (if key configured)
    if (SUPABASE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/clients`, {
          method: "POST",
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
          },
          body: JSON.stringify(clientRecord)
        });
      } catch (dbErr) {
        console.error("Supabase write error:", dbErr);
      }
    }

    // 3. Backup forward to Google Apps Script
    if (GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL.startsWith("http")) {
      try {
        fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).catch(() => {});
      } catch (e) {}
    }

    return res.status(200).json({
      success: true,
      client_id: clientId,
      message: "Lead saved successfully"
    });

  } catch (error) {
    console.error("Submit Lead Handler Error:", error);
    return res.status(200).json({
      success: false,
      message: "Buffered",
      error: error.message
    });
  }
}
