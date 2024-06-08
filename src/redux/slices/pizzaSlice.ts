import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// type TFetchPizzas = Record<string, string>; // все параметры(ключи и значения) - строчки

type TPizza = {
  id: string;
  title: string;
  price: number;
  image: string;
  sizes: number[];
  types: number[];
};

enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

interface IPizzaSliceState {
  items: TPizza[];
  status: 'loading' | 'success' | 'error';
}

const initialState: IPizzaSliceState = {
  items: [],
  status: Status.LOADING, //loading | success | error
};

export type TSearchPizzasParams = {
  sortType: string;
  category: string;
  search: string;
  currentPage: string;
};

export const fetchPizzas = createAsyncThunk<TPizza[], TSearchPizzasParams>(
  'pizza/fetchPizzaStatus',
  async (params) => {
    const { currentPage, category, sortType, search } = params;
    const { data } = await axios.get<TPizza[]>(
      `https://665da1fee88051d6040799ed.mockapi.io/pizzas?page=${currentPage}&limit=12&${category}&sortBy=${sortType}&order=desc${search}`,
    );
    return data;
  },
);

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPizzas.pending, (state) => {
        state.status = Status.LOADING;
        state.items = [];
      })
      .addCase(fetchPizzas.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = Status.SUCCESS;
      })
      .addCase(fetchPizzas.rejected, (state) => {
        state.status = Status.ERROR;
        state.items = [];
      });
  },
});

export const selectPizzaData = (state: RootState) => state.pizza;

export const { setItems } = pizzaSlice.actions;

export default pizzaSlice.reducer;
