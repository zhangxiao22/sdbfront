import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/404',
    component: () => import('@/views/errPage/404'),
    meta: {
      title: '404', hide: true
    }
  },
  {
    path: '/401',
    component: () => import('@/views/errPage/401'),
    meta: {
      title: '401', hide: true
    }
  }
]

let asyncRoutes = [
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home/index'),
        meta: { title: '首页', icon: 'home' }
      },
      {
        // 营销用例
        path: 'useCase',
        name: 'UseCase',
        component: () => import(/* webpackChunkName: "useCase" */ '@/views/useCase/index'),
        meta: {
          title: '用例库', icon: 'useCase', roles: ['用例管理', '线索统筹', '领导审批', '事件注册']
        }
      },
      {
        // 新建营销用例
        path: 'createUseCase',
        name: 'CreateUseCase',
        component: () => import(/* webpackChunkName: "createUseCase" */ '@/views/createUseCase/index'),
        meta: {
          title: '创建用例', hide: true, roles: ['用例管理']
        }
      },
      {
        // 新建营销事件
        path: 'createEvent',
        name: 'CreateEvent',
        component: () => import(/* webpackChunkName: "createEvent" */ '@/views/createEvent/index'),
        meta: { title: '新建营销事件', icon: 'create', roles: ['事件注册', '用例管理'] }
      },
      {
        // 事件看板
        path: 'eventBoard',
        name: 'EventBoard',
        component: () => import(/* webpackChunkName: "eventBoard" */ '@/views/eventBoard/index'),
        meta: { title: '事件列表', icon: 'eventList' }
      },
      {
        // 事件详情
        path: 'eventDetail',
        name: 'EventDetail',
        component: () => import(/* webpackChunkName: "eventDetail" */ '@/views/eventDetail/index'),
        meta: { title: '事件详情', hide: true }
      },
      {
        // 产品库
        path: 'product',
        name: 'Product',
        component: () => import(/* webpackChunkName: "product" */ '@/views/product/index'),
        meta: { title: '产品库', icon: 'product', roles: ['事件注册', '用例管理'] }
      },
      {
        // 话术库
        path: 'word',
        name: 'Word',
        component: () => import(/* webpackChunkName: "word" */ '@/views/word/index'),
        meta: { title: '话术库', icon: 'chat', roles: ['事件注册', '用例管理'] }
      },
      {
        // 权益库
        path: 'interest',
        name: 'Interest',
        component: () => import(/* webpackChunkName: "interest" */ '@/views/interest/index'),
        meta: { title: '权益库', icon: 'interest', roles: ['事件注册', '用例管理'] }
      },
      {
        // 短信库
        path: 'sms',
        name: 'Sms',
        component: () => import(/* webpackChunkName: "sms" */ '@/views/sms/index'),
        meta: { title: '短信库', icon: 'shortmessage', roles: ['事件注册', '用例管理'] }
      },
      // {
      //   // 规则库
      //   path: 'rule',
      //   name: 'Rule',
      //   component: () => import('@/views/rule/index'),
      //   meta: { title: '规则库', icon: 'rule', roles: ['事件注册', '用例管理'] }
      // },
      {
        // 模型库
        path: 'model',
        name: 'Model',
        component: () => import(/* webpackChunkName: "model" */ '@/views/model/index'),
        meta: { title: '模型库', icon: 'cpu', roles: ['事件注册', '用例管理'] }
      },
      {
        // 总看板
        path: 'totalBoard',
        name: 'TotalBoard',
        component: () => import(/* webpackChunkName: "totalBoard" */ '@/views/totalBoard/index'),
        meta: { title: '成效看板', icon: 'board' }
      },
      {
        path: 'crmAndOds',
        name: 'CrmAndOds',
        component: () => import(/* webpackChunkName: "crmAndOds" */ '@/views/crmAndOds/index'),
        meta: { title: 'crm与ods反馈数据的查询列表', icon: 'crmAndOds' }
      },
      {
        // 督导看板
        path: 'inspectorBoard',
        name: 'InspectorBoard',
        component: () => import(/* webpackChunkName: "inspectorBoard" */ '@/views/inspectorBoard/index'),
        meta: { title: '督导看板', icon: 'inspector' }
      },
      {
        // 设置
        path: 'config',
        name: 'Config',
        component: () => import(/* webpackChunkName: "config" */ '@/views/config/index'),
        meta: { title: '系统配置', icon: 'config', roles: ['线索统筹', '业务管理', '支行业务管理', '用例管理'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
const testRoutes = [{
  path: '/',
  redirect: '/home',
  component: Layout,
  children: [{
    path: 'test',
    name: 'Test',
    component: () => import(/* webpackChunkName: "test" */ '@/views/test/index'),
    meta: { title: 'test', icon: 'bug' }
  }]
}]
if (process.env.NODE_ENV === 'development') {
  asyncRoutes = asyncRoutes.concat(testRoutes)
}
export { asyncRoutes }
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
