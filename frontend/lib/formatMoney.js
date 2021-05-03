export default function formatMoney(amount = 0) {
  const options = {
    style: 'currency',
    currency: 'EUR',
    minimunFractionDigits: 2,
  };

  // check if it's a clean ammount
  if (amount % 100 === 0) {
    options.minimunFractionDigits = 0;
  }

  const formatter = Intl.NumberFormat('en-IN', options);

  return formatter.format(amount / 100);
}
