const getters = {
  token: state => state.user.token,
  user: state => state.user,
  roles: state => state.user.roles,
  routes: state => state.permission.routes,
  eventData: state => state.event
}
export default getters
