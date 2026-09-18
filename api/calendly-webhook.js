// Vercel Serverless Function: /api/calendly-webhook
// Automatically syncs Calendly scheduled appointments to Supabase & Google Sheets

const SUPABASE_URL = process.env.SUPABASE_URL || "https://zbtyybuofnlkbidoukzc.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL || "https://script.google.com/macros/s/AKfycbxVYE6T2lYH87A7R8Yuzcl_PfE1920BA9pHC9zB0GHu-RuxEXC_PgWQhtgkBA_8pCtnyQ/exec";

function formatArabicDateTime(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    const monthsAr = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    const daysAr = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    
    const dayName = daysAr[d.getDay()];
    const dayNum = d.getDate();
    const monthName = monthsAr[d.getMonth()];
    
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'مساءً' : 'صباحاً';
    hours = hours % 12 || 12;

    return `${dayName} ${dayNum} ${monthName} - ${hours}:${minutes} ${ampm}`;
  } catch (e) {
    return isoString;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({ status: "active", message: "Calendly Webhook is active and ready" });
  }

  try {
    const body = req.body || {};
    const eventType = body.event; // 'invitee.created' or 'invitee.canceled'
    const payload = body.payload || {};

    if (!payload || !eventType) {
      return res.status(200).json({ status: "ignored", message: "No payload" });
    }

    const inviteeName = payload.name || "";
    const inviteeEmail = payload.email || "";
    const scheduledEvent = payload.scheduled_event || {};
    const eventName = (scheduledEvent.name || "").toLowerCase();
    const startTimeIso = scheduledEvent.start_time || payload.event_start_time || "";
    const formattedSlot = formatArabicDateTime(startTimeIso);

    // Extract phone from questions_and_answers if present
    let inviteePhone = "";
    if (Array.isArray(payload.questions_and_answers)) {
      for (const qa of payload.questions_and_answers) {
        const q = (qa.question || "").toLowerCase();
        if (q.includes("phone") || q.includes("هاتف") || q.includes("واتساب") || q.includes("mobile") || q.includes("whatsapp")) {
          inviteePhone = qa.answer || "";
          break;
        }
      }
    }

    // Extract client code if embedded in name: "Name (SLM-XXXX)"
    let clientCode = "";
    const matchCode = inviteeName.match(/\((SLM-[A-Z0-9-]+)\)/i);
    if (matchCode) {
      clientCode = matchCode[1];
    }

    // Determine session type: Nutrition vs Coach
    const isCoach = eventName.includes("coach") || eventName.includes("رياض") || eventName.includes("تمارين") || eventName.includes("clone");
    const sessionLabel = isCoach ? "جلسة الكوتش الرياضي" : "جلسة أخصائي التغذية";
    const slotUpdateText = `${formattedSlot} (${sessionLabel})`;

    console.log(`Calendly Webhook: ${eventType} | Invitee: ${inviteeName} | Slot: ${slotUpdateText}`);

    // 1. Update Supabase
    if (SUPABASE_KEY) {
      try {
        let matchQuery = "";
        if (clientCode) {
          matchQuery = `id=eq.${encodeURIComponent(clientCode)}`;
        } else if (inviteePhone) {
          matchQuery = `phone=eq.${encodeURIComponent(inviteePhone)}`;
        } else if (inviteeEmail) {
          matchQuery = `email=eq.${encodeURIComponent(inviteeEmail)}`;
        }

        if (matchQuery) {
          const findResp = await fetch(`${SUPABASE_URL}/rest/v1/clients?${matchQuery}&select=*&limit=1`, {
            headers: {
              "apikey": SUPABASE_KEY,
              "Authorization": `Bearer ${SUPABASE_KEY}`
            }
          });
          const existingRows = await findResp.json();
          
          if (Array.isArray(existingRows) && existingRows.length > 0) {
            const client = existingRows[0];
            let notes = client.notes_preview || "";
            if (notes && !notes.includes(slotUpdateText)) {
              notes += ` | ${slotUpdateText}`;
            } else if (!notes) {
              notes = slotUpdateText;
            }

            await fetch(`${SUPABASE_URL}/rest/v1/clients?id=eq.${encodeURIComponent(client.id)}`, {
              method: "PATCH",
              headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                notes_preview: notes,
                pipeline_stage: "scheduled",
                stage_updated_at: new Date().toISOString()
              })
            });
            console.log(`Updated client ${client.id} in Supabase with slot: ${slotUpdateText}`);
          }
        }
      } catch (dbErr) {
        console.error("Supabase webhook update error:", dbErr);
      }
    }

    // 2. Forward slot update to Google Sheets
    if (GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL.startsWith("http")) {
      try {
        const sheetsPayload = {
          form_type: "تحديث موعد Calendly التلقائي",
          action: "update_appointments",
          client_code: clientCode,
          client_name: inviteeName,
          client_phone: inviteePhone,
          client_email: inviteeEmail,
          nutrition_slot: isCoach ? undefined : formattedSlot,
          coach_slot: isCoach ? formattedSlot : undefined,
          scheduled_at: new Date().toISOString()
        };

        await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sheetsPayload)
        });
      } catch (sheetsErr) {
        console.error("Google Sheets forward error:", sheetsErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Calendly appointment synced successfully",
      slot: slotUpdateText
    });

  } catch (error) {
    console.error("Calendly Webhook Error:", error);
    return res.status(200).json({ success: false, error: error.message });
  }
}
