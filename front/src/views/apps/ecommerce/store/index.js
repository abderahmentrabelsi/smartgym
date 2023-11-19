// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getProducts = createAsyncThunk('appEcommerce/getProducts', async params => {
  const response = await axios.get('/products', { params })
  return { params, data: response.data }
})

export const addToCart = createAsyncThunk('appEcommerce/addToCart', async (id, { dispatch, getState }) => {
  try {
    console.log(`Sending POST request to /cart with productId: ${id}`)
    const response = await axios.post('/cart', { productId: id })
    console.log(`POST request to /cart successful with response: ${JSON.stringify(response.data)}`)
    await dispatch(getProducts(getState().ecommerce.params))
    console.log(`Dispatched getProducts action with params: ${JSON.stringify(getState().ecommerce.params)}`)
    return response.data
  } catch (error) {
    console.error(`Error in addToCart: ${error.message}`)
    throw error
  }
})


export const getWishlistItems = createAsyncThunk('appEcommerce/getWishlistItems', async () => {
  const response = await axios.get('/wishlist')
  return response.data
})

export const deleteWishlistItem = createAsyncThunk('appEcommerce/deleteWishlistItem', async (id, { dispatch }) => {
  const response = await axios.delete(`/wishlist/${id}`)
  dispatch(getWishlistItems())
  return response.data
})

export const getCartItems = createAsyncThunk('appEcommerce/getCartItems', async () => {
  const response = await axios.get('/cart')
  return response.data
})

export const getProduct = createAsyncThunk('appEcommerce/getProduct', async slug => {
  const response = await axios.get(`/products/slug/${slug}`)
  return response.data
})

export const addToWishlist = createAsyncThunk('appEcommerce/addToWishlist', async id => {
  await axios.post('/wishlist', { productId: id })
  return id
})

export const deleteCartItem = createAsyncThunk('appEcommerce/deleteCartItem', async (id, { dispatch }) => {
  await axios.delete(`/cart/${id}`)
  dispatch(getCartItems())
  return id
})

export const appEcommerceSlice = createSlice({
  name: 'appEcommerce',
  initialState: {
    cart: [],
    params: {},
    results: [],
    wishlist: [],
    totalProducts: 0,
    productDetail: {}
  },
  reducers: {},
  extraReducers: builder => {
    builder
        .addCase(getProducts.fulfilled, (state, action) => {
          state.params = action.payload.params
          state.results = action.payload.data.results
          state.totalProducts = action.payload.data.totalResults
        })
        .addCase(getWishlistItems.fulfilled, (state, action) => {
          state.wishlist = action.payload.products
        })
        .addCase(getCartItems.fulfilled, (state, action) => {
          state.cart = action.payload.products
        })
        .addCase(getProduct.fulfilled, (state, action) => {
          state.productDetail = action.payload.product
        })
  }
})

export default appEcommerceSlice.reducer