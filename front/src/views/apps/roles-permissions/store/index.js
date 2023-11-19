// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getData = createAsyncThunk('permissions/getData', async params => {
  const response = await axios.get('/permissions', { params })
  return {
    total: response.data.total,
    params: response.data.params,
    results: response.data.results,
    data: response.data.results
  }
})

export const addPermission = createAsyncThunk(
  'permissions/addPermission',
  async (permission, { dispatch, getState }) => {
    await axios.post('/permissions', { permission })
    await dispatch(getData(getState().permissions.params))
    return permission
  }
)

export const updatePermission = createAsyncThunk(
  'permissions/updatePermission',
  async ({ id, name }, { dispatch, getState }) => {
    await axios.put(`/permissions/${id}`, { name })
    await dispatch(getData(getState().permissions.params))
    return { id, name }
  }
)

export const deletePermission = createAsyncThunk('permissions/deletePermission', async (id, { dispatch, getState }) => {
  await axios.delete(`/permissions/${id}`)
  await dispatch(getData(getState().permissions.params))
  return id
})

export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: {
    data: [],
    total: 1,
    params: {},
    results: [],
    selected: null
  },
  reducers: {
    selectPermission: (state, action) => {
      if (action.payload === null) {
        state.selected = null
      } else {
        state.selected = action.payload
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(getData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.results = action.payload.results
    })
  }
})

export const { selectPermission } = permissionsSlice.actions

export default permissionsSlice.reducer
