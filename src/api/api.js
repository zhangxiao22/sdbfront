import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }

// 获取用户信息
export function getUserInfo(params) {
  return request({
    url: '/login/getLoginUserInfo',
    method: 'post',
    params
  })
}
// 获取话术列表
export function getWordList() {
  return request({
    url: 'http://10.5.8.12:8848/resource/script/query/list',
    method: 'get'
  })
}

/** ************************************************ 事件汇总 ************************************************************/
// 饼图
export function getPie() {
  return request({
    url: 'http://10.5.8.12:8848/mock/pie',
    method: 'get'
  })
}

// 折线图
export function getLine() {
  return request({
    url: 'http://10.5.8.12:8848/mock/line',
    method: 'get'
  })
}
// 散点图
export function getScatter() {
  return request({
    url: 'http://10.5.8.12:8848/mock/scatter',
    method: 'get'
  })
}
