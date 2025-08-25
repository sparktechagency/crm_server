export const installmentAmountCalculator = async (
  requestAmount: number,
  terms: string,
) => {
  const termInNumber = Number(terms.split(' ')[0]);
  const installmentAmount = requestAmount / termInNumber;
  return installmentAmount;
};
