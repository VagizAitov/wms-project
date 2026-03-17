import { randomInt } from 'crypto';

export function generateBarcode(): string {
  return String(randomInt(100000000000, 999999999999));
}