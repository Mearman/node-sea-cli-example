/**
 * Convert a string to an array of byte values (UTF-8 code units for ASCII,
 * raw char codes for simplicity in this demo).
 */
export function stringToBytes(input: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code > 127) {
      throw new Error(
        `Non-ASCII character at position ${i}: "${input[i]}" (code ${code})`
      );
    }
    bytes.push(code);
  }
  return bytes;
}

/**
 * Convert an array of byte values back to a string.
 */
export function bytesToString(bytes: number[]): string {
  return String.fromCharCode(...bytes);
}
