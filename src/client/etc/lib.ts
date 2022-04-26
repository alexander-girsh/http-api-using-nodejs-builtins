import { config } from '../../commonConfig';

export const delay = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export function* createExponentialNumbersSubsequenceGenerator(
  initialValue: number,
  maxValue: number
) {
  let nextValue = initialValue;

  while (true) {
    yield nextValue;
    nextValue = Math.min(
      Math.trunc(Math.random() * (nextValue ** 2 - nextValue + nextValue)),
      maxValue
    );
  }
}
