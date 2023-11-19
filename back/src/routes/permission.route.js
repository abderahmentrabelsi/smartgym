import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import permissionController from '../controllers/permission.controller.js';

const router = express.Router();

router
  .route('/')
  .post(catchAsync(permissionController.createPermission))
  .get(catchAsync(permissionController.getPermissions));

router
  .route('/:permissionId')
  .get(catchAsync(permissionController.getPermission))
  .put(catchAsync(permissionController.updatePermission))
  .delete(catchAsync(permissionController.deletePermission));

export default router;
