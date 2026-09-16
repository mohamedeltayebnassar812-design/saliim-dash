// Vercel Serverless Function: /api/create-payment
// EasyKash DirectPay Integration for Dr. Ahmed Elkhateeb (Saliim)

const EASYKASH_API_KEY = process.env.EASYKASH_API_KEY || "8pwvua3plgp41tix";
const EASYKASH_ENDPOINT = "https://back.easykash.net/api/directpayv1/pay";

const PACKAGE_PRICES = {
  healthy: { amount: 69, currency: "USD", name: "باقة Healthy ($69)" },
  pro: { amount: 119, currency: "USD", name: "باقة Pro المتقدمة ($119)" },
  consultation_dr: { amount: 89, currency: "USD", name: "استشارة خاصة مع د. أحمد الخطيب ($89)" }
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { name, email, phone, pkg, goal, host } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and phone are required" });
    }

    const selectedPkg = PACKAGE_PRICES[pkg] || PACKAGE_PRICES["pro"];
    const siteHost = host || "https://ahmedelkhateeb.com";
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    const customerRef = Math.floor(100000 + Math.random() * 900000);

    const redirectParams = new URLSearchParams({
      name: name,
      phone: cleanPhone,
      email: email || "",
      pkg: pkg || "pro",
      goal: goal || "",
      paid: "1",
      ref: customerRef.toString()
    });

    const redirectUrl = `${siteHost}/onboarding-v2.html?${redirectParams.toString()}`;

    const easyKashPayload = {
      amount: selectedPkg.amount,
      currency: selectedPkg.currency,
      name: name,
      email: email || `${customerRef}@saliim.client`,
      mobile: cleanPhone.replace(/^\+/, ""),
      cashExpiry: 6,
      redirectUrl: redirectUrl,
      customerReference: customerRef
    };

    const response = await fetch(EASYKASH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": EASYKASH_API_KEY
      },
      body: JSON.stringify(easyKashPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("EasyKash API Error:", data);
      return res.status(response.status).json({
        success: false,
        message: data.message || "Failed to initialize EasyKash payment",
        details: data
      });
    }

    return res.status(200).json({
      success: true,
      paymentUrl: data.redirectUrl,
      customerReference: customerRef
    });

  } catch (error) {
    console.error("Payment Handler Exception:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during payment creation",
      error: error.message
    });
  }
}
