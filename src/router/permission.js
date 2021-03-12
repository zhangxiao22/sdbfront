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
  // console.log(to.path)
  // // start progress bar
  NProgress.start()

  // // set page title
  document.title = getPageTitle(to.meta.title)

  // 获取用户的权限(角色)
  const hasRoles = store.getters.roles
  // console.log('hasRoles>>>>>>>>>>>>>>>>>>>>>>>>', hasRoles)
  const isIncludeWhiteList = whiteList.includes(to.path)
  // console.log('isIncludeWhiteList>>>>>>>>>>>>>>>>>>>>>>>', isIncludeWhiteList)
  if (isIncludeWhiteList || hasRoles) {
    next()
  } else {
    // 必须try catch
    try {
      const data = await store.dispatch('user/getInfo')
      // console.log('process.env.NODE_ENV>>>>>>>>>>>>>>', process.env.NODE_ENV)
      // let roles
      // if (process.env.NODE_ENV === 'development') {
      //   roles = 'admin'
      //   // roles = data?.permissionPack.label
      //   store.commit('user/SET_ROLES', roles)
      // } else {
      const roles = data?.permissionPack.label
      // }
      // console.log('roles>>>>>>>>>>>>>>>>>>>>>>>', roles)
      // 1.使用roles过滤有权限路由  2.在state中存储路由数据   3.返回数据
      const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
      // console.log('accessRoutes>>>>>>>>>>>>>>>>>>>>>>>>>', accessRoutes)
      // 在路由中加入动态路由
      router.addRoutes(accessRoutes)
      // next()
      next({ ...to, replace: true })
    } catch (e) {
      console.log(e)
    }
  }
  NProgress.done()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
