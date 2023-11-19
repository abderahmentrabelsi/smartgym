import httpStatus from 'http-status';
import Wishlist from '../models/wishlist.model.js';
import Product from '../models/product.model.js';
import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';

/**
 * Create a wishlist
 * @param {Object} wishlistBody
 * @returns {Promise<Wishlist>}
 */
const createWishlist = async (wishlistBody) => {
  const { productId } = wishlistBody;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid productId');
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, `Product with id ${productId} not found.`);
  }

  const wishlistProducts = [{ product }];
  const wishlist = new Wishlist({ products: wishlistProducts });
  const savedWishlist = await wishlist.save();

  // Update the isInWishlist field of the Product model
  await Product.findOneAndUpdate({ _id: productId }, { isInWishlist: true });

  const populatedWishlist = await Wishlist.populate(savedWishlist, {
    path: 'products.product',
    model: 'Product',
  });

  return populatedWishlist.products;
};


/**
 * Get all wishlists
 * @returns {Promise<Array<Wishlist>>}
 */

const getAllWishlists= async () => {
  const wishlists = await Wishlist.find({}, { _id: 0 }).populate('products.product');
  const products = wishlists.map((wishlist) => wishlist.products ? wishlist.products.map((product) => product.product) : []);
  return products.flat();
};




/**
 * Get wishlist by id
 * @param {ObjectId} id
 * @returns {Promise<Wishlist>}
 */
const getWishlistById = async (id) => {
  return Wishlist.findById(id);
};

/**
 * Delete product from wishlist
 * @param {ObjectId} productId
 * @returns {Promise<Wishlist>}
 */
const deleteProductFromWishlist = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid productId');
  }

  const wishlist = await Wishlist.findOne({ "products.product": productId });

  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, `Wishlist with product id ${productId} not found.`);
  }

  // Remove the product from the wishlist
  wishlist.products = wishlist.products.filter(p => p.product.toString() !== productId.toString());
  await wishlist.save();

  // Update the isInWishlist field of the corresponding product to false
  await Product.findByIdAndUpdate(productId, { isInWishlist: false });

  const populatedWishlist = await Wishlist.populate(wishlist, {
    path: 'products.product',
    model: 'Product',
  });

  return populatedWishlist.products;
};



export default { createWishlist, getAllWishlists, getWishlistById, deleteProductFromWishlist };
