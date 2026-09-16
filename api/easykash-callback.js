// Vercel Serverless Function: /api/easykash-callback
// Webhook listener for EasyKash payment updates + Supabase Sync

const SUPABASE_URL = process.env.SUPABASE_URL || "https://zbtyybuofnlkbidoukzc.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const payload = req.method === "POST" ? req.body : req.query;
  console.log("EasyKash Webhook received:", payload);

  // Update client status in Supabase if phone or ref is provided
  if (SUPABASE_KEY) {
    try {
      const customerPhone = payload?.customerPhone || payload?.phone || payload?.customer_mobile;
      const status = (payload?.status || payload?.paymentStatus || '').toLowerCase();
      
      if (customerPhone) {
        const isPaid = status === 'success' || status === 'paid' || status === 'completed';
        const stage = isPaid ? 'payment_confirmed' : 'payment_failed';
        
        await fetch(`${SUPABASE_URL}/rest/v1/clients?phone=eq.${encodeURIComponent(customerPhone)}`, {
          method: "PATCH",
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            pipeline_stage: stage,
            stage_updated_at: new Date().toISOString()
          })
        });
      }
    } catch (err) {
      console.error("Supabase webhook update error:", err);
    }
  }

  return res.status(200).json({
    status: "success",
    message: "Callback received and synced successfully"
  });
}
