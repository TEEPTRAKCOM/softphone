const crypto = require('crypto');

// Twilio Credentials
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_API_KEY = process.env.TWILIO_API_KEY;
const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET;
const TWIML_APP_SID = process.env.TWIML_APP_SID;

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { identity, userId, userName } = req.body || {};
  
  if (!identity) {
    return res.status(400).json({ error: 'Identity is required' });
  }

  const TOKEN_TTL = 3600;
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: 'HS256',
    typ: 'JWT',
    cty: 'twilio-fpa;v=1'
  };

  const payload = {
    jti: `${TWILIO_API_KEY}-${now}`,
    iss: TWILIO_API_KEY,
    sub: TWILIO_ACCOUNT_SID,
    exp: now + TOKEN_TTL,
    grants: {
      identity: identity,
      voice: {
        incoming: { allow: true },
        outgoing: { application_sid: TWIML_APP_SID }
      }
    }
  };

  function base64UrlEncode(obj) {
    const str = JSON.stringify(obj);
    const base64 = Buffer.from(str).toString('base64');
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  const headerEncoded = base64UrlEncode(header);
  const payloadEncoded = base64UrlEncode(payload);
  const signatureInput = `${headerEncoded}.${payloadEncoded}`;
  
  const signature = crypto
    .createHmac('sha256', TWILIO_API_SECRET)
    .update(signatureInput)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const token = `${headerEncoded}.${payloadEncoded}.${signature}`;

  res.status(200).json({
    token,
    identity,
    userId,
    userName,
    expiresIn: TOKEN_TTL,
    success: true
  });
}
