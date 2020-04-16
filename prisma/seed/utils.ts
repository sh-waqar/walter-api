// @ts-nocheck

export const getColor = () => {
  const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'gray', 'brown'];

  return colors[Math.floor(Math.random() * 6)];
};

export const getAmount = (max) => {
  const balance = Math.random() * max;
  return Math.round(balance * 100) / 100;
};
