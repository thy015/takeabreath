export const formatMoney = (money) => {
  return new Intl.NumberFormat ("de-DE").format (money);
};