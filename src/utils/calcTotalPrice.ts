import { TCartItem } from '../redux/slices/cartSlice';

export const calcTotalPrice = (items: TCartItem[]) => {
  return items.reduce((sum, obj) => {
    return +(obj.count * obj.price + sum).toFixed(2);
  }, 0);
};
