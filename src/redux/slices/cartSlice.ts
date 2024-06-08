import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type TCartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  size: number;
  type: number;
  count: number;
};

interface ICartSliceState {
  totalPrice: number;
  items: TCartItem[];
}

const initialState: ICartSliceState = {
  // начальное состояние нашей сортировки
  totalPrice: 0,
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const findItem = state.items.find((obj) => obj.id === action.payload.id);
      if (findItem) {
        findItem.count++;
      } else state.items.push({ ...action.payload, count: 1 });

      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.count * obj.price + sum;
      }, 0);
      //   state.totalPrice += action.payload.price;
    },

    minusItem(state, action) {
      const findItem = state.items.find((obj) => obj.id === action.payload);
      //   state.items = state.items.filter((obj) => obj.count !== 0);
      if (findItem) {
        findItem.count--;
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter((obj) => obj.id !== action.payload);
    },
    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const selectCart = (state: RootState) => state.cart;
export const selectCartItemById = (id: string) => (state: RootState) =>
  state.cart.items.find((obj) => obj.id === id);

export const { addItem, minusItem, removeItem, clearItems } = cartSlice.actions;

export default cartSlice.reducer;
