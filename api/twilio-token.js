import twilio from "twilio";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { identity = "anonymous", userId = "", userName = "" } = req.body || {};

  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY,
    TWILIO_API_SECRET,
    TWIML_APP_SID,
  } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_API_KEY || !TWILIO_API_SECRET || !TWIML_APP_SID) {
    return res.status(500).json({
      success: false,
      error: "Missing Twilio env vars on server",
    });
  }

  try {
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const grant = new VoiceGrant({
      outgoingApplicationSid: TWIML_APP_SID,
      incomingAllow: true,
    });

    const token = new AccessToken(
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET,
      { identity, ttl: 3600 }
    );

    token.addGrant(grant);

    return res.status(200).json({
      success: true,
      token: token.toJwt(),
      identity,
      userId,
      userName,
      expiresIn: 3600,
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e?.message || "Token error" });
  }
}
