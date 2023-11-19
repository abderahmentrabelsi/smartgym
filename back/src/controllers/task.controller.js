import createError from '../utils/createError.js';
import * as taskService from '../services/task.service.js';

export const createTask = async (req, res, next) => {
  try {
    const savedTask = await taskService.createTask(req.body.title, req.user.id, req.body.completed);
    return res.status(200).json(savedTask);
  } catch (err) {
    return next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const updatedTask = await taskService.updateTask(req.params.taskId, req.body.title, req.body.completed, req.user.id);
    return res.status(200).json(updatedTask);
  } catch (err) {
    return next(err);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks();
    return res.status(200).json(tasks);
  } catch (err) {
    return next(err);
  }
};

export const getCurrentUserTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getCurrentUserTasks(req.user.id);
    return res.status(200).json(tasks);
  } catch (err) {
    return next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.taskId, req.user.id);
    return res.json('Task Deleted Successfully');
  } catch (err) {
    return next(err);
  }
};

export const deleteAllTasks = async (req, res, next) => {
  try {
    await taskService.deleteAllTasks(req.user.id);
    return res.json('All Todo Deleted Successfully');
  } catch (err) {
    return next(err);
  }
};

