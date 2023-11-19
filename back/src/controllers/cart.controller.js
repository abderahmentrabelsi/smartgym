import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import cartService from '../services/cart.service.js';

const createCart = catchAsync(async (req, res) => {
  const cart = await cartService.createCart(req.body);
  res.status(httpStatus.CREATED).send(cart);
});

const getCarts = catchAsync(async (req, res) => {
  const result = await cartService.getAllCarts();
  res.send({ products: result });
});

const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCartById(req.params.cartId);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  res.send(cart);
});

const deleteProductFromCart = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const cartProducts = await cartService.deleteProductFromCart(productId);
  res.send(cartProducts);
});


export default {
  createCart,
  getCarts,
  getCart,
  deleteProductFromCart,
};
