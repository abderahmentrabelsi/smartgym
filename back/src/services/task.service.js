import Task from '../models/task.model.js';
import createError from '../utils/createError.js';

const createTask = async (title, userId, completed) => {
  const newTask = new Task({
    title: title,
    user: userId,
    completed: completed,
  });
  const savedTask = await newTask.save();
  return savedTask;
};

const updateTask = async (taskId, title, completed, userId) => {
  const task = await Task.findById(taskId).exec();
  if (!task) throw createError({ status: 404, message: 'Task not found' });
  if (task.user.toString() !== userId) throw createError({ status: 401, message: "It's not your todo." });

  const updatedTask = await Task.findByIdAndUpdate(taskId, { title: title, completed: completed }, { new: true });
  return updatedTask;
};

const getAllTasks = async () => {
  const tasks = await Task.find({});
  return tasks;
};

const getCurrentUserTasks = async (userId) => {
  const tasks = await Task.find({ user: userId });
  return tasks;
};
const deleteTask = async (taskId, user) => {
  const task = await Task.findById(taskId).exec();
  if (!task) {
    throw createError({ status: 404, message: 'Task not found' });
  }
  if (task.user.toString() !== user.id) {
    throw createError({ status: 401, message: "It's not your todo." });
  }

  await Task.findByIdAndDelete(taskId);
  return 'Task Deleted Successfully';
};

const deleteAllTasks = async (user) => {
  await Task.deleteMany({ user: user.id });
  return 'All Todo Deleted Successfully';
};

export default {
  createTask,
  getAllTasks,
  updateTask,
  getCurrentUserTasks,
  deleteTask,
  deleteAllTasks,
};
