import { random as remotionRandom } from 'remotion';

export const random = (min: number, max: number, seed?: number): number => {
  const rand = seed !== undefined ? remotionRandom(seed) : 1;
  return min + rand * (max - min);
};