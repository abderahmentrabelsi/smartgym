import express from 'express';
import roleController from '../controllers/role.controller.js';

const router = express.Router();

router.route('/').post(roleController.createRole).get(roleController.getRoles);

router.route('/:roleId').get(roleController.getRole).put(roleController.updateRole).delete(roleController.deleteRole);

export default router;
