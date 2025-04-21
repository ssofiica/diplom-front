import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Food } from './types/types';
import { RootState } from '../app/store';

interface BasketState {
  food: Food[];
  sum: number;
}

const initialState: BasketState = {
  food: [],
  sum: 0,
};

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any>) => {
      state.food = action.payload.food
      state.sum = action.payload.sum
      console.log(state.food)
    },

    addFood: (state, action: PayloadAction<any>) => {
      const exist = state.food.find(item => item.id === action.payload.id);
      if (exist) {
        exist.count += 1;
      } else {
        state.food.push({ ...action.payload, count: 1 });
      }
      state.sum += action.payload.price;
      console.log(state.food)
    },

    removeItem: (state, action: PayloadAction<any>) => {
      const exist = state.food.find(item => item.id === action.payload.id);
      if (!exist) return;
      if (exist.count > 1) {
        exist.count -= 1;
        state.sum -= exist.price;
      } else {
        state.sum -= exist.price * exist.count;
        state.food = state.food.filter(item => item.id !== action.payload.id);
      }
    },
  },
});

export const selectBasketFood = (state: RootState) => state.basket.food
export const selectBasketSum = (state: RootState) => state.basket.sum;
export const { setData, addFood, removeItem } = basketSlice.actions;
export default basketSlice.reducer;