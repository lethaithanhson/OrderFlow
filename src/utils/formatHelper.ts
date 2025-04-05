export const formatNumber = (number: number | string | undefined) => {
    if (typeof number === 'number') return new Intl.NumberFormat('en-VN').format(number);
    else return number;
  };