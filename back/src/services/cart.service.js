import httpStatus from 'http-status';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';

/**
 * Create a cart
 * @param {Object} cartBody
 * @returns {Promise<Cart>}
 */
const createCart = async (cartBody) => {
  const { productId, qty } = cartBody;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid productId');
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, `Product with id ${productId} not found.`);
  }

  let cart = await Cart.findOne();
  let cartProducts = [];

  if (cart) {
    // If cart exists, check if the product is already added
    const existingProductIndex = cart.products.findIndex((p) => p.product.toString() === productId);

    if (existingProductIndex !== -1) {
      // If product already exists, update the quantity
      cart.products[existingProductIndex].qty += qty;
    } else {
      // If product does not exist, add it to the cart
      cartProducts = [...cart.products, { product, qty }];
    }

    cart.products = cartProducts;
  } else {
    // If cart does not exist, create a new cart with the product
    cartProducts = [{ product, qty }];
    cart = new Cart({ products: cartProducts });
  }

  const savedCart = await cart.save();

  const populatedCart = await Cart.populate(savedCart, {
    path: 'products.product',
    model: 'Product',
  });

  return populatedCart.products;
};

/**
 * Get all carts
 * @returns {Promise<Array<Cart>>}
 */
const getAllCarts = async () => {
  const carts = await Cart.find({}, { _id: 0 }).populate('products.product');
  const products = carts.map((cart) => cart.products ? cart.products.map((product) => product.product) : []);
  return products.flat();
};

/**
 * Get cart by id
 * @param {ObjectId} id
 * @returns {Promise<Cart>}
 */
const getCartById = async (id) => {
  return Cart.findById(id);
};

/**
 * Delete product from cart
 * @param {ObjectId} productId
 * @returns {Promise<Cart>}
 */
const deleteProductFromCart = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid productId');
  }

  const cart = await Cart.findOne({ "products.product": productId });

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, `Cart with product id ${productId} not found.`);
  }

  // Remove the product from the cart
  cart.products = cart.products.filter(p => p.product.toString() !== productId.toString());
  await cart.save();

  const populatedCart = await Cart.populate(cart, {
    path: 'products.product',
    model: 'Product',
  });

  return populatedCart.products;
};

export default { createCart, getAllCarts, getCartById, deleteProductFromCart };
