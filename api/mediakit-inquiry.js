// Vercel Serverless Function: /api/mediakit-inquiry
// Direct handling of Media Kit Sponsorship Inquiries
// Dual Persistence: Google Sheets Webhook Backup + Supabase (if configured)

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

    const brand = payload.brand || payload.brand_name || "";
    const person = payload.person || payload.contact_person || payload.name || "";
    const email = payload.email || "";
    const phone = payload.phone || "";
    const territory = payload.territory || "";
    const format = payload.format || "";
    const message = payload.message || "";
    const subject = payload.subject || `[طلب رعاية تجارية] ${brand} - ${format}`;

    if (!brand && !email && !phone) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const inquiryId = 'MK-' + Date.now().toString(36).toUpperCase();

    // 1. Forward to Google Sheets Webhook
    if (GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL.startsWith("http")) {
      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_code: inquiryId,
            name: `${person} (${brand})`,
            phone: phone,
            email: email,
            package: format,
            goal: territory,
            lifestyle_notes: `[طلب رعاية ميديا كيت]\nالشركة: ${brand}\nالمسؤول: ${person}\nالباقة: ${format}\nالسوق: ${territory}\nالعنوان: ${subject}\nتفاصيل: ${message}`,
            source: 'mediakit_official_inquiry',
            action: 'mediakit_inquiry',
            created_at: new Date().toISOString()
          })
        }).catch((e) => console.error("Sheets fetch error:", e));
      } catch (e) {
        console.error("Google Sheets forward error:", e);
      }
    }

    // 2. Forward to Supabase clients table if configured
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
          body: JSON.stringify({
            id: inquiryId,
            full_name: `${person} (${brand})`,
            phone: phone,
            email: email,
            package_name: format,
            source: 'mediakit_official_inquiry',
            pipeline_stage: 'mediakit_lead',
            notes_preview: `شركة: ${brand} | باقة: ${format} | نطاق: ${territory}`,
            stage_updated_at: new Date().toISOString()
          })
        }).catch((e) => console.error("Supabase fetch error:", e));
      } catch (dbErr) {
        console.error("Supabase write error:", dbErr);
      }
    }

    return res.status(200).json({
      success: true,
      inquiry_id: inquiryId,
      message: "Inquiry recorded successfully"
    });

  } catch (error) {
    console.error("Media Kit Inquiry Handler Error:", error);
    return res.status(200).json({
      success: false,
      message: "Buffered",
      error: error.message
    });
  }
}
