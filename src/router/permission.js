import router from './index'
import store from '../store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/401', '/404'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // console.log(to)
  // // start progress bar
  NProgress.start()

  // // set page title
  document.title = getPageTitle(to.meta.title)

  // 获取用户的权限(角色)
  const hasRoles = store.getters.roles
  // console.log('hasRoles>>>>>>>>>>>>>>>>>>>>>>>>', hasRoles)
  if (hasRoles) {
    next()
  } else {
    const data = await store.dispatch('user/getInfo')
    // console.log('process.env.NODE_ENV>>>>>>>>>>>>>>', process.env.NODE_ENV)
    let roles
    if (process.env.NODE_ENV === 'development') {
      roles = 'admin'
      // roles = data.permissionPack.label
      store.commit('user/SET_ROLES', roles)
    } else {
      roles = data.permissionPack.label
    }
    // console.log('roles>>>>>>>>>>>>>>>>>>>>>>>', roles)
    const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
    // console.log('accessRoutes>>>>>>>>>>>>>>>>>>>>>>>>>', accessRoutes)
    router.addRoutes(accessRoutes)
    // next()
    next({ ...to, replace: true })
  }
  NProgress.done()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
