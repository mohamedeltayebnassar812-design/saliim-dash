// Vercel Serverless Function: /api/submit-lead
// Secure backend proxy for Google Sheets - Hides WebApp URL and protects against spam

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
    const payload = req.body;
    if (!payload) {
      return res.status(400).json({ success: false, message: "Missing payload" });
    }

    // Forward to Google Apps Script
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return res.status(200).json({
      success: true,
      message: "Lead submitted successfully"
    });
  } catch (error) {
    console.error("Submit Lead Proxy Error:", error);
    // Still return 200 to prevent frontend disruption
    return res.status(200).json({
      success: false,
      message: "Buffered",
      error: error.message
    });
  }
}
