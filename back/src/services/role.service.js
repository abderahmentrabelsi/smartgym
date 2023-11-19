import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Role from '../models/role.model.js';
import ApiError from '../utils/ApiError.js';
import Permission from '../models/permission.model.js';

/**
 * Create a role
 * @param {Object} roleBody
 * @returns {Promise<Role>}
 */
const createRole = async (roleBody) => {
  const permissionIds = roleBody.permissions || [];

  // Check if all permissionIds are valid ObjectId's
  const validPermissionIds = await Promise.all(
    permissionIds.map(async (id) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      const permission = await Permission.findById(id);
      return permission ? permission._id : null;
    })
  );

  // Filter out any null or undefined values
  const filteredPermissionIds = validPermissionIds.filter((id) => id);

  // Check if all permissionIds are valid and present in the database
  if (filteredPermissionIds.length !== permissionIds.length) {
    throw new Error('Invalid permission ID(s) provided');
  }

  // Create the role
  return Role.create({ ...roleBody, permissions: filteredPermissionIds });
};

/**
 * Query for roles
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRoles = async (filter, options) => {
  return Role.find(filter, options).populate('permissions');
};

/**
 * Get role by id
 * @param {ObjectId} id
 * @returns {Promise<Role>}
 */
const getRoleById = async (id) => {
  return Role.findById(id);
};

/**
 * Update role by id
 * @param {ObjectId} roleId
 * @param {Object} updateBody
 * @returns {Promise<Role>}
 */
const updateRoleById = async (roleId, updateBody) => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  if (updateBody.name && (await Role.isNameTaken(updateBody.name, roleId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role name already taken');
  }
  Object.assign(role, updateBody);
  await role.save();
  return role;
};

/**
 * Delete role by id
 * @param {ObjectId} roleId
 * @returns {Promise<Role>}
 */
const deleteRoleById = async (roleId) => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  await role.remove();
  return role;
};

export default {
  createRole,
  queryRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
};
