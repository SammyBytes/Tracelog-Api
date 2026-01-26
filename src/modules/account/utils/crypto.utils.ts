/**
 * Generate a random Tracelog key
 * @returns  Random Tracelog key string (tl_8f3e2a1b9c0d)
 */
export const generateTracelogKey = (): string => {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);

  const randomPart = Array.from(buffer)
    .map((byte) => byte.toString(32).padStart(2, "0"))
    .join("");

  return `tl_${randomPart}`;
};
