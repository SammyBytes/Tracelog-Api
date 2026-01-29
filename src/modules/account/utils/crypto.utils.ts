/**
 * Generate a random Tracelog key
 * @returns  Random Tracelog key string (tl_8f3e2a1b9c0d)
 */
export const generateTracelogKey = (): string => {
  const buffer = new Uint8Array(16);
  crypto.getRandomValues(buffer);

  const randomPart = Array.from(buffer)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `tl_${randomPart}`;
};
export const hashApiKey = async (
  apiKey: string,
  salt: string,
): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${apiKey}${salt}`);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const verifyApiKey = async (
  receivedKey: string,
  storedHash: string,
  salt: string,
): Promise<boolean> => {
  const hashedInput = await hashApiKey(receivedKey, salt);

  // Convert the stored hash to a Uint8Array for comparison (timingSafeEqual requires Uint8Arrays)
  const encoder = new TextEncoder();
  const a = encoder.encode(hashedInput);
  const b = encoder.encode(storedHash);

  if (a.length !== b.length) return false;

  return crypto.subtle.timingSafeEqual(a, b);
};
