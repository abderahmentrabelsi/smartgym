// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";

export const getTasks = createAsyncThunk("appTodo/getTasks", async (params) => {
  const response = await axios.get("/tasks/all", { params });
  return {
    params: response.data.params,
    data: response.data.results,
  };
});

export const addTask = createAsyncThunk(
  "appTodo/addTask",
  async (task, { dispatch, getState }) => {
    const response = await axios.post("tasks/", { task });
    await dispatch(getTasks(getState().task.params));
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  "appTodo/updateTask",
  async (task, { dispatch, getState }) => {
    const response = await axios.post(`/tasks/${id}`, { task });
    await dispatch(getTasks(getState().todo.params));
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  "appTodo/deleteTask",
  async (taskId, { dispatch, getState }) => {
    const response = await axios.delete(`/tasks/${id}`, { taskId });
    await dispatch(getTasks(getState().todo.params));
    return taskId;
  }
);

export const appTodoSlice = createSlice({
  name: "appTodo",
  initialState: {
    tasks: [],
    selectedTask: {},
    params: {
      filter: "",
      q: "",
      sort: "",
      tag: "",
    },
  },
  reducers: {
    reOrderTasks: (state, action) => {
      state.tasks = action.payload;
    },
    selectTask: (state, action) => {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTasks.fulfilled, (state, action) => {
      state.tasks = action.payload.data;
      state.params = action.payload.params;
    });
  },
});

export const { reOrderTasks, selectTask } = appTodoSlice.actions;

export default appTodoSlice.reducer;
