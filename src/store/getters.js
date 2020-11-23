const getters = {
  user: state => state.user,
  roles: state => state.user.permissionPack.label,
  routes: state => state.permission.routes
}
export default getters
