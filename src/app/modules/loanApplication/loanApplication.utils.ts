export const installmentAmountCalculator = async (
  hubFormula: string,
  requestAmount: number,
  terms: string,
): Promise<number> => {
  const months = Number(terms.split(' ')[0]);

  const parseFormula = (formula: string) => {
    // Extract the values dynamically
    const multiplierMatch = formula.match(/\(([\d.]+) \* P/);
    const markupPercentageMatch = formula.match(
      /IF\(m > 6, \(m - 6\) \* ([\d.]+) \* P/,
    );
    const processingFeeMatch = formula.match(/(\d+) \+ \s*IF/);

    // Extracting the matched values
    const multiplier = multiplierMatch ? parseFloat(multiplierMatch[1]) : 1.35;
    const markupPercentage = markupPercentageMatch
      ? parseFloat(markupPercentageMatch[1])
      : 0.018;
    const processingFee = processingFeeMatch
      ? parseInt(processingFeeMatch[1], 10)
      : 19;

    return { multiplier, markupPercentage, processingFee };
  };

  // Parse the formula to get the values
  const { multiplier, markupPercentage, processingFee } =
    parseFormula(hubFormula);

  // Apply the dynamic formula
  const extraCharge =
    months > 6 ? (months - 6) * markupPercentage * requestAmount : 0;
  const installmentAmount = (
    (multiplier * requestAmount + processingFee + extraCharge) /
    months
  ).toFixed(2);

  return Number(installmentAmount);
};
