import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import wishlistService from '../services/wishlist.service.js';

const createWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.createWishlist(req.body);
  res.status(httpStatus.CREATED).send(wishlist);
});

const getWishlists = catchAsync(async (req, res) => {
  const result = await wishlistService.getAllWishlists();
  res.send({ products: result });
});

const getWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.getWishlistById(req.params.wishlistId);
  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist not found');
  }
  res.send(wishlist);
});

const deleteProductFromWishlist = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const wishlistProducts = await wishlistService.deleteProductFromWishlist(productId);
  res.send(wishlistProducts);
});


export default {
  createWishlist,
  getWishlists,
  getWishlist,
  deleteProductFromWishlist,
};
