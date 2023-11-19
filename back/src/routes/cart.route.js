import express from 'express';
import cartController from '../controllers/cart.controller.js';

const cartRouter = express.Router();

cartRouter
  .route('/')
  .get(cartController.getCarts)
  .post(cartController.createCart);

cartRouter
  .route('/:productId')
  .delete(cartController.deleteProductFromCart);

export default cartRouter;
