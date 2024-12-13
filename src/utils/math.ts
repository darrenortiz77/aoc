/*
  From https://stackoverflow.com/a/34955386
*/

const gcd2 = (a: number, b: number): number => {
  // Greatest common divisor of 2 integers
  if (!b) return b === 0 ? a : NaN;
  return gcd2(b, a % b);
};

export const gcd = (...array: number[]) => {
  // Greatest common divisor of a list of integers
  let n = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < array.length; ++i) n = gcd2(array[i], n);
  return n;
};

// Least common multiple of 2 integers
const lcm2 = (a: number, b: number) => (a * b) / gcd2(a, b);

export const lcm = (...array: number[]): number => {
  // Least common multiple of a list of integers
  let n = 1;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < array.length; ++i) n = lcm2(array[i], n);
  return n;
};