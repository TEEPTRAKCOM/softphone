cat > api/token.js << 'EOF'
const crypto = require('crypto');

module.exports = function handler(req, res) {
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_API_KEY = process.env.TWILIO_API_KEY;
  const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET;
  const TWIML_APP_SID = process.env.TWIML_APP_SID;

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

  const header = { alg: 'HS256', typ: 'JWT', cty: 'twilio-fpa;v=1' };

  const payload = {
    jti: TWILIO_API_KEY + '-' + now,
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
    return Buffer.from(JSON.stringify(obj)).toString('base64')
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  const headerEnc = base64UrlEncode(header);
  const payloadEnc = base64UrlEncode(payload);

  const signature = crypto
    .createHmac('sha256', TWILIO_API_SECRET)
    .update(headerEnc + '.' + payloadEnc)
    .digest('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const token = headerEnc + '.' + payloadEnc + '.' + signature;

  res.status(200).json({ token, identity, userId, userName, expiresIn: TOKEN_TTL, success: true });
};
EOF