import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/404',
    component: () => import('@/views/errPage/404'),
    hidden: true
  },
  {
    path: '/start',
    component: () => import('@/views/start'),
    hidden: true
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
        meta: { title: '首页', icon: 'home', underline: true }
      },
      {
        path: 'useCase',
        name: 'UseCase',
        component: () => import('@/views/useCase/index'),
        meta: {
          title: '用例库', icon: 'useCase'
        }
      },
      {
        path: 'createUseCase',
        name: 'CreateUseCase',
        component: () => import('@/views/createUseCase/index'),
        meta: {
          title: '创建用例', hide: true
        }
      },
      {
        path: 'createEvent',
        name: 'CreateEvent',
        component: () => import('@/views/createEvent/index'),
        meta: { title: '新建营销事件', icon: 'create' }
      },
      {
        path: 'eventBoard',
        name: 'EventBoard',
        component: () => import('@/views/eventBoard/index'),
        meta: { title: '事件看板', icon: 'eventList' }
      },
      {
        path: 'eventDetail',
        name: 'EventDetail',
        component: () => import('@/views/eventDetail/index'),
        meta: { title: '事件详情', hide: true }
      },
      {
        path: 'product',
        name: 'Product',
        component: () => import('@/views/product/index'),
        meta: { title: '产品库', icon: 'product' }
      },
      {
        path: 'word',
        name: 'Word',
        component: () => import('@/views/word/index'),
        meta: { title: '话术库', icon: 'chat' }
      },
      {
        path: 'interest',
        name: 'Interest',
        component: () => import('@/views/interest/index'),
        meta: { title: '权益库', icon: 'interest' }
      },
      {
        path: 'sms',
        name: 'Sms',
        component: () => import('@/views/sms/index'),
        meta: { title: '短信库', icon: 'shortmessage' }
      },
      {
        path: 'hateMarketing',
        name: 'HateMarketing',
        component: () => import('@/views/hateMarketing/index'),
        meta: {
          title: '厌恶营销名单', icon: 'list'
        }
      }

    ]
  }
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'test',
        name: 'Test',
        component: () => import('@/views/test/index'),
        meta: { title: 'test', icon: 'list', roles: ['admin'] }
      }
    ]
  },

  // 营销结果看板
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'resultsBoard',
        name: 'ResultsBoard',
        component: () => import('@/views/resultsBoard/index'),
        meta: { title: '营销结果看板', icon: 'list', roles: ['boss'] }
      }
    ]
  },
  // 总看板
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'totalBoard',
        name: 'TotalBoard',
        component: () => import('@/views/totalBoard/index'),
        meta: { title: '线索发布总览', icon: 'list', roles: ['boss'] }
      }
    ]
  },
  // 设置
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/config/index'),
        meta: { title: '系统配置', icon: 'config', roles: ['boss'] }
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
