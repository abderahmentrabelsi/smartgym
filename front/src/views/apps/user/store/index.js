// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

/*export const getAllData = createAsyncThunk('appUsers/getAllData', async () => {
  const response = await axios.get(`/users/${id}`)
  return {
    total: response.data.total,
    params: response.data.response,
    results: response.data.results,
    data: response.data.results,
  }
})*/
export const getUser = createAsyncThunk('appUsers/getUser', async id => {
  const response = await axios.get(`/users/${id}`)
  return response.data 
})
export const getData = createAsyncThunk('user/getData', async params => {
  const response = await axios.get('/users', {params})
  return {
    total: response.data.total,
    params: response.data.params,
    results: response.data.results,
    data: response.data.results
  }
})

export const addUser = createAsyncThunk('appUsers/addUser', async (user, { dispatch, getState }) => {
  await axios.post('/users', {user})
  await dispatch(getData(getState().users.params))
  await dispatch(getAllData())
  return user
})

export const deleteUser = createAsyncThunk('appUsers/deleteUser', async (id, { dispatch, getState }) => {
  await axios.delete(`/users/${id}`)
  await dispatch(getData(getState().users.params))
  await dispatch(getAllData())
  return id
})

export const updateUser = createAsyncThunk('appUsers/updateUser', async ({ id, user }, { dispatch, getState }) => {
  await axios.put(`/users/${id}`, { user })
  await dispatch(getData(getState().users.params))
  return { id, user }
})

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    results: [],
    selectedUser: null
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getData.fulfilled, (state, action) => {
      
      state.total = action.payload.total
      state.params = action.payload.params
      state.results = action.payload.results
    })
    .addCase(getUser.fulfilled, (state, action) => {
      state.selectedUser = action.payload
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      const { id, user } = action.payload
      const userIndex = state.data.findIndex(u => u.id === id)
      state.data[userIndex] = user
    })
  }
  
})

export default appUsersSlice.reducer
