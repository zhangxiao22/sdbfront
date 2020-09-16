import router from '.'
import store from '../store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/start'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 获取cookie中存的token
  const hasToken = getToken()
  // console.log('hasToken>>>>>>>>>>>>>>>>>>>>>>>>>', hasToken)
  if (hasToken) {
    if (to.path === '/start') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 获取用户的权限(角色)
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // console.log('hasRoles>>>>>>>>>>>>>>>>>>>>>>>>', hasRoles)
      if (hasRoles) {
        next()
      } else {
        // 如果没有权限就调接口获取
        // try {
        // get user info
        // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
        const { roles } = await store.dispatch('user/getInfo')
        // console.log('roles>>>>>>>>>>>>>>>>>>>>>>>', roles)
        // generate accessible routes map based on roles
        const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
        // console.log('??', accessRoutes)
        // dynamically add accessible routes
        router.addRoutes(accessRoutes)

        // hack method to ensure that addRoutes is complete
        // set the replace: true, so the navigation will not leave a history record
        next({ ...to, replace: true })
        // } catch (error) {
        //   // remove token and go to 401 page
        //   console.log(99999)
        //   await store.dispatch('user/resetToken')
        //   // Message.error(error || 'Has Error')
        //   Message.error('Error')
        //   next(`/401?redirect=${to.path}`)
        NProgress.done()
        // }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to 401 page.
      // next()
      if (to.path === '/start') {
        next()
      } else {
        next(`/start?redirect=${to.path}`)
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
