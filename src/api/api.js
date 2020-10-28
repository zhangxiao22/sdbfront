import request from '@/utils/request'
const api2 = process.env.VUE_APP_BASE_API_2
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
// 获取事件简介
export function getEventInfo(params) {
  return request({
    url: '/event/abstract',
    method: 'get',
    params
  })
}

// 第1步
// 保存事件详情
export function saveEventBaseInfo(data) {
  return request({
    url: '/event/save',
    method: 'post',
    data
  })
}

// 获取事件详情
export function getEventBaseInfo(data) {
  return request({
    url: '/event/query',
    method: 'post',
    data
  })
}
// 第2步
// 白名单上传
export function uploadFile(data) {
  return request({
    url: '/customer/upload',
    method: 'post',
    data
  })
}

// 获取维度补充的维度
export function getLabelList(params) {
  return request({
    url: '/customer/querySupply',
    method: 'get',
    params
  })
}

// 获取分群规则
export function getCustomerLabel(params) {
  return request({
    url: '/customer/queryTagsCandy',
    method: 'get',
    params
  })
}
// 预估人数
export function getPeopleCount(data) {
  return request({
    url: '/customer/queryTagCount',
    method: 'post',
    data
  })
}

// 保存客群
export function saveGroup(data) {
  return request({
    url: '/customer/save',
    method: 'post',
    data
  })
}

// 根据id获取客群信息
export function getGroup(params) {
  return request({
    url: '/customer/getDetail',
    method: 'get',
    params
  })
}
// 第3步
// 获取策略信息
export function getPloyDetail(params) {
  return request({
    url: '/strategy/query',
    method: 'get',
    params
  })
}

// 保存策略
export function savePloy(data) {
  return request({
    url: '/strategy/save',
    method: 'post',
    data
  })
}
// 第4步
// 获取预览信息
export function getEventPreview(params) {
  return request({
    url: '/event/preview',
    method: 'get',
    params
  })
}

// 保存event
export function eventPublish(params) {
  return request({
    url: '/clue/save',
    method: 'get',
    params
  })
}

/** ************************************************ 事件看板 ************************************************************/
// 获取创建者
export function getEventOwner() {
  return request({
    url: '/event/getCreateUser',
    method: 'get'
  })
}

// 获取事件列表
export function getEventList(data) {
  return request({
    url: '/event/selectPage',
    method: 'post',
    data
  })
}

// 获取事件状态
export function getEventStatus() {
  return request({
    url: '/event/getEventStatus',
    method: 'get'
  })
}
/** ************************************************ 事件汇总 ************************************************************/
// 饼图
export function getPie() {
  return request({
    url: api2 + '/mock/pie',
    method: 'get'
  })
}

// 折线图
export function getLine() {
  return request({
    url: api2 + '/mock/line',
    method: 'get'
  })
}
// 散点图
export function getScatter() {
  return request({
    url: api2 + '/mock/scatter',
    method: 'get'
  })
}
