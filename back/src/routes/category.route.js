import express from 'express';
// eslint-disable-next-line import/extensions
import categoryController from '../controllers/category.controller.js';
// eslint-disable-next-line import/extensions
import validate from '../middlewares/validate.js';
// eslint-disable-next-line import/extensions
import categoryValidation from '../validations/category.validation.js';

const categoryRouter = express.Router();

categoryRouter
  .route('/')
  .post(validate(categoryValidation.createCategory), categoryController.createCategory)
  .get(validate(categoryValidation.getCategories), categoryController.getCategories);

categoryRouter
  .route('/:categoryId')
  .get(validate(categoryValidation.getCategory), categoryController.getCategory)
  .patch(validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

export default categoryRouter;
