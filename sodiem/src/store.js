import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './features/coursesSlice';
import goalReducer from './features/goalSlice';

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    goal: goalReducer,
  },
});