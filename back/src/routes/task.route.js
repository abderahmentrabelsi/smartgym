// Module Import
import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import {
  getAllTasks,
  createTask,
  updateTask,
  getCurrentUserTasks,
  deleteAllTasks,
  deleteTask,
} from '../controllers/task.controller.js';

// Express Router
const router = express.Router();

router.get('/all', getAllTasks);
router.post('/', createTask);
router.put('/:taskId', updateTask);
router.get('/myTasks', getCurrentUserTasks);
router.delete('/deleteAll', deleteAllTasks);
router.delete('/:taskId', deleteTask);

export default router;
