import httpStatus from 'http-status';
import pick from '../utils/pick.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import permissionService from '../services/permission.service.js';

const createPermission = catchAsync(async (req, res) => {
  const permission = await permissionService.createPermission(req.body.permission);
  res.status(httpStatus.CREATED).send(permission);
});

const getPermissions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'category', 'price']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const permissions = await permissionService.queryPermissions(options, filter);
  res.send(permissions);
});

const getPermission = catchAsync(async (req, res) => {
  const permission = await permissionService.getPermissionById(req.params.permissionId);
  if (!permission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found');
  }
  res.send(permission);
});

const updatePermission = catchAsync(async (req, res) => {
  const { id, name } = req.body;
  const permission = await permissionService.updatePermissionById(req.params.permissionId, { id, name });
  res.send(permission);
});


const deletePermission = catchAsync(async (req, res) => {
  await permissionService.deletePermissionById(req.params.permissionId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createPermission,
  getPermissions,
  getPermission,
  updatePermission,
  deletePermission,
};
