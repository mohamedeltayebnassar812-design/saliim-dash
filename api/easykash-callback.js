// Vercel Serverless Function: /api/easykash-callback
// Webhook listener for EasyKash payment updates

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const payload = req.method === "POST" ? req.body : req.query;
  console.log("EasyKash Webhook received:", payload);

  // Return 200 OK to acknowledge receipt
  return res.status(200).json({
    status: "success",
    message: "Callback received successfully"
  });
}
