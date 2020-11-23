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
  },
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', icon: 'home' }
      },
      {
        // 事件看板
        path: 'eventBoard',
        name: 'EventBoard',
        component: () => import('@/views/eventBoard/index'),
        meta: { title: '事件看板', icon: 'eventList' }
      },
      {
        // 事件详情
        path: 'eventDetail',
        name: 'EventDetail',
        component: () => import('@/views/eventDetail/index'),
        meta: { title: '事件详情', hide: true }
      },

      {
        // 总看板
        path: 'totalBoard',
        name: 'TotalBoard',
        component: () => import('@/views/totalBoard/index'),
        meta: { title: '线索发布总览', icon: 'list' }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: 'useCase',
        name: 'UseCase',
        component: () => import('@/views/useCase/index'),
        meta: {
          title: '用例库', icon: 'useCase', roles: ['基础包']
        }
      },
      {
        path: 'createUseCase',
        name: 'CreateUseCase',
        component: () => import('@/views/createUseCase/index'),
        meta: {
          title: '创建用例', hide: true, roles: ['基础包']
        }
      },
      {
        // 新建营销事件
        path: 'createEvent',
        name: 'CreateEvent',
        component: () => import('@/views/createEvent/index'),
        meta: { title: '新建营销事件', icon: 'create', roles: ['事件注册'] }
      },

      {
        // 产品库
        path: 'product',
        name: 'Product',
        component: () => import('@/views/product/index'),
        meta: { title: '产品库', icon: 'product', roles: ['事件注册'] }
      },
      {
        path: 'word',
        name: 'Word',
        component: () => import('@/views/word/index'),
        meta: { title: '话术库', icon: 'chat', roles: ['基础包'] }
      },
      {
        path: 'interest',
        name: 'Interest',
        component: () => import('@/views/interest/index'),
        meta: { title: '权益库', icon: 'interest', roles: ['基础包'] }
      },
      {
        path: 'sms',
        name: 'Sms',
        component: () => import('@/views/sms/index'),
        meta: { title: '短信库', icon: 'shortmessage', roles: ['基础包'] }
      },
      {
        path: 'test',
        name: 'Test',
        component: () => import('@/views/test/index'),
        meta: { title: 'test', icon: 'list', roles: ['基础包'] }
      },
      // {
      //   // 营销结果看板
      //   path: 'resultsBoard',
      //   name: 'ResultsBoard',
      //   component: () => import('@/views/resultsBoard/index'),
      //   meta: { title: '营销结果看板', icon: 'list', roles: ['基础包'] }
      // },

      {
        // 设置
        path: 'config',
        name: 'Config',
        component: () => import('@/views/config/index'),
        meta: { title: '系统配置', icon: 'config', roles: ['基础包'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

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
