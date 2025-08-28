// export const installmentAmountCalculator = async (
//   hubFormula: string,
//   requestAmount: number,
//   terms: string,
// ): Promise<number> => {
//   const months = Number(terms.split(' ')[0]);

import { IRepaymentsDates } from './loanApplication.interface';

//   const parseFormula = (formula: string) => {
//     // Extract the values dynamically
//     const multiplierMatch = formula.match(/\(([\d.]+) \* P/);
//     const markupPercentageMatch = formula.match(
//       /IF\(m > 6, \(m - 6\) \* ([\d.]+) \* P/,
//     );
//     const processingFeeMatch = formula.match(/(\d+) \+ \s*IF/);

//     // Extracting the matched values
//     const multiplier = multiplierMatch ? parseFloat(multiplierMatch[1]) : 1.35;
//     const markupPercentage = markupPercentageMatch
//       ? parseFloat(markupPercentageMatch[1])
//       : 0.018;
//     const processingFee = processingFeeMatch
//       ? parseInt(processingFeeMatch[1], 10)
//       : 19;

//     return { multiplier, markupPercentage, processingFee };
//   };

//   // Parse the formula to get the values
//   const { multiplier, markupPercentage, processingFee } =
//     parseFormula(hubFormula);

//   // Apply the dynamic formula
//   const extraCharge =
//     months > 6 ? (months - 6) * markupPercentage * requestAmount : 0;
//   const installmentAmount = (
//     (multiplier * requestAmount + processingFee + extraCharge) /
//     months
//   ).toFixed(2);

//   return Number(installmentAmount);
// };

export const installmentAmountCalculator = async (
  hubFormula: string,
  requestAmount: number,
  terms: string,
): Promise<{
  installmentAmount: number;
  totalRepayments: number;
  grossProfit: number;
  repaymentsDates: IRepaymentsDates[];
}> => {
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

  const totalRepayments = Number(installmentAmount) * months; // Total repayments over all months
  const grossProfit = totalRepayments - requestAmount; // Gross profit

  const repaymentsDates = [];

  for (let i = 0; i < months; i++) {
    const month = new Date();
    month.setMonth(month.getMonth() + i);

    const formattedDate = month.toISOString().split('T')[0];

    const monthName = month.toLocaleString('default', { month: 'long' });

    repaymentsDates.push({
      month: monthName,
      dueDate: formattedDate,
    });
  }

  return {
    installmentAmount: Number(installmentAmount),
    totalRepayments,
    grossProfit: Number(grossProfit.toFixed(2)),
    repaymentsDates,
  };
};
