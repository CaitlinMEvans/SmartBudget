export function getJwtExpMs(token) {
  try {
    const [, payloadB64] = token.split(".");
    if (!payloadB64) return null;

    // base64url -> base64
    const b64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);
    const payload = JSON.parse(json);

    if (typeof payload.exp !== "number") return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
}
