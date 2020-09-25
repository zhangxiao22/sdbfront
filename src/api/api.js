import request from '@/utils/request'

// 获取用户信息
export function getUserInfo(params) {
  return request({
    url: '/user/login',
    method: 'get',
    params
  })
}
/** ************************************************ 产品 ************************************************************/
// 获取产品列表
export function getProductList(data) {
  return request({
    url: '/resource/select',
    method: 'post',
    data
  })
}

/** ************************************************ 话术 ************************************************************/
// 获取话术列表
export function getWordList(data) {
  return request({
    url: '/script/select',
    method: 'post',
    data
  })
}
// 获取话术类型
export function getWordCategory() {
  return request({
    url: '/script/getCategory',
    method: 'get'
  })
}

/** ************************************************ 权益 ************************************************************/
// 获取权益库
export function getInterestList(data) {
  return request({
    url: '/material/equity/select',
    method: 'post',
    data
  })
}

/** ************************************************ 短信 ************************************************************/
// 获取短信库
export function getSmsList(data) {
  return request({
    url: '/material/sms/select',
    method: 'post',
    data
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

// 获取目标列表
export function getTargetList() {
  return request({
    url: '/event/queryAchieveTagList',
    method: 'get'
  })
}

/** ************************************************ 事件注册 ************************************************************/
// 保存事件详情 第1步
export function saveEventBaseInfo(data) {
  return request({
    url: '/event/save',
    method: 'post',
    data
  })
}

// 获取事件详情 第1步
export function getEventBaseInfo(data) {
  return request({
    url: '/event/query',
    method: 'post',
    data
  })
}

// 保存策略 第3步
export function savePloy(data) {
  return request({
    url: 'http://10.5.12.233:8848/sub_group/strategy',
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
