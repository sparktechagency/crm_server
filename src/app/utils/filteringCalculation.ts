export const filteringCalculation = (days: string) => {
  const convertDays = Number(days) || 30;

  let matchStage = {};
  matchStage = {
    createdAt: {
      $gte: new Date(new Date().setDate(new Date().getDate() - convertDays)),
      $lte: new Date(new Date().setDate(new Date().getDate() + convertDays)),
    },
  };

  return matchStage;
};
