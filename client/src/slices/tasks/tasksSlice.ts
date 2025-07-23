import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Define the Task interface (consistent with your hooks)
interface Task {
  id: number;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee_id?: number;
  due_date?: string;
}

// Define the initial state
const initialState: { tasks: Task[] } = {
  tasks: [],
};

// Create the slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Example reducer to set tasks (can be expanded later)
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
});

// Export the reducer and actions
export const { setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;