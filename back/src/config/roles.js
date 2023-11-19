const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
};
const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));
export { roles };
export { roleRights };
export default {
  roles,
  roleRights,
};
