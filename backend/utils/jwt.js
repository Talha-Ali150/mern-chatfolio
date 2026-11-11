const crypto = require("crypto");

const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");

const sign = (payload, secret, { expiresInSeconds = 30 * 24 * 60 * 60 } = {}) => {
  if (!secret) throw new Error("JWT_SECRET must be configured");

  const now = Math.floor(Date.now() / 1000);
  const header = encode({ alg: "HS256", typ: "JWT" });
  const body = encode({ ...payload, iat: now, exp: now + expiresInSeconds });
  const signingInput = `${header}.${body}`;
  const signature = crypto.createHmac("sha256", secret).update(signingInput).digest("base64url");
  return `${signingInput}.${signature}`;
};

const verify = (token, secret) => {
  if (!secret) throw new Error("JWT_SECRET must be configured");
  const parts = typeof token === "string" ? token.split(".") : [];
  if (parts.length !== 3) throw new Error("Invalid token");

  const [headerPart, payloadPart, signaturePart] = parts;
  let header;
  let payload;
  try {
    header = JSON.parse(Buffer.from(headerPart, "base64url").toString("utf8"));
    payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
  } catch {
    throw new Error("Invalid token");
  }
  if (header.alg !== "HS256") throw new Error("Invalid token algorithm");

  const expected = crypto.createHmac("sha256", secret)
    .update(`${headerPart}.${payloadPart}`)
    .digest();
  let actual;
  try {
    actual = Buffer.from(signaturePart, "base64url");
  } catch {
    throw new Error("Invalid token");
  }
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    throw new Error("Invalid token signature");
  }
  if (typeof payload.exp !== "number" || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }
  return payload;
};

module.exports = { sign, verify };
