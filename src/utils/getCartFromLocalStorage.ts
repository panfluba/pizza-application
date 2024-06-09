import { calcTotalPrice } from './calcTotalPrice';

export const getCartFromLocalStorage = () => {
  const data = localStorage.getItem('pizzas-cart');
  const items = data ? JSON.parse(data) : [];
  const totalPrice = calcTotalPrice(items);

  return {
    items,
    totalPrice,
  };
};
