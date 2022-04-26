export const delay = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export function* createExponentialNumbersSubsequenceGenerator(
  initialValue: number
) {
  let nextValue = initialValue;

  while (nextValue < Number.MAX_SAFE_INTEGER) {
    yield nextValue;
    nextValue = Math.trunc(Math.E ** nextValue);
  }
  return null;
}
