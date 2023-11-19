import express from 'express';
import wishlistController from '../controllers/wishlist.controller.js';

const wishlistRouter = express.Router();

wishlistRouter
  .route('/')
  .get(wishlistController.getWishlists)
  .post(wishlistController.createWishlist);

//wishlist router for the delete product from wishlist
wishlistRouter
  .route('/:productId')
  .delete(wishlistController.deleteProductFromWishlist);

export default wishlistRouter;
