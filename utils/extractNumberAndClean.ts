export function extractNumberAndClean(text: string): {
  name: string;
  quantity: number | null;
} {
  // Match number at the start of the string
  const matchStart = text.match(/^(\d+)\s*(\S.*)/);
  // Match number at the end of the string
  const matchEnd = text.match(/(\S.*)\s*(\d+)$/);

  if (matchStart) {
    return {
      name: matchStart[2], // The remaining part after the number at the start
      quantity: parseInt(matchStart[1], 10), // The number at the start
    };
  } else if (matchEnd) {
    return {
      name: matchEnd[1], // The remaining part before the number at the end
      quantity: parseInt(matchEnd[2], 10), // The number at the end
    };
  }

  // If no valid number is found, return the original string and null for quantity
  return { name: text, quantity: null };
}
