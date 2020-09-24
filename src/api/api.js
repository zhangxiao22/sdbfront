import request from '@/utils/request'

// 获取用户信息
export function getUserInfo(params) {
  return request({
    url: '/user/login',
    method: 'get',
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
// 获取事件类型
export function getEventCategory() {
  return request({
    url: '/event/queryCategoryList',
    method: 'get'
  })
}
// 获取抽样方式
export function getSampleList() {
  return request({
    url: '/event/querySampleList',
    method: 'get'
  })
}

// 获取产品列表
export function getProductList(data) {
  return request({
    url: 'http://10.5.0.240:8080/resource/select',
    method: 'post',
    data
  })
}
// 获取目标列表
export function getTargetList() {
  return request({
    url: '/event/queryAchieveTagList',
    method: 'get'
  })
}

/** ************************************************ 事件注册 ************************************************************/

export function saveEventBaseInfo(data) {
  return request({
    url: '/event/save',
    method: 'post',
    data
  })
}

// 获取事件详情 第一步
export function getEventBaseInfo(data) {
  return request({
    url: '/event/query',
    method: 'post',
    data
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
