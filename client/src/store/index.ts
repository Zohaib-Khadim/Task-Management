import { configureStore, combineReducers } from '@reduxjs/toolkit';
import tasksReducer from '../slices/tasks/tasksSlice';
// Placeholder reducer until we add slices
const rootReducer = combineReducers({
 tasks: tasksReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };