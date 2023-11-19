import express from 'express';
// eslint-disable-next-line import/extensions
import productController from '../controllers/product.controller.js';
// eslint-disable-next-line import/extensions
import validate from '../middlewares/validate.js';
// eslint-disable-next-line import/extensions
import productValidation from '../validations/product.validation.js';

const productRouter = express.Router();
productRouter.route('/').post(productController.createProduct).get(productController.getProducts);

/*
[  {    "id": "63fb51afea73b43e407dc73a",    "quantity": 2  },
  {    "id": "63fb51afea73b43e407dc73a",    "quantity": 1  }
]
For each product in the cart, we need to create a line item
*/
productRouter
  .route('/create-checkout')
  .post(validate(productValidation.createCheckOutSession), productController.createCheckOutSession);

productRouter
  .route('/:productId')
  .get(validate(productValidation.getProduct), productController.getProduct)
  .patch(validate(productValidation.updateProduct), productController.updateProduct)
  .delete(validate(productValidation.deleteProduct), productController.deleteProduct);

productRouter.route('/slug/:slug').get(productController.getProductBySlug);

/*
This is a checkout session test with static data [TODO]

productRouter.post('/payment', async (req, res) => {
  try {
    const {currency, price} = req.body;

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 2111,
            product_data: {
              name: 'Stubborn Attachments',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });

    res.status(200).json({url: session.url});
  } catch (err) {
    res.status(500).json({status: 0, message: err.message});
  }
});
 */

export default productRouter;
