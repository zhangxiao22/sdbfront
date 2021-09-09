import request from '@/utils/request'
const api2 = process.env.VUE_APP_BASE_API_2 + '/odsEffect'
const api3 = process.env.VUE_APP_BASE_API_2
// 获取用户信息
export function getUserInfo(params) {
  return request({
    url: '/user/login',
    method: 'get',
    params
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}
/** ************************************************ 产品 ************************************************************/
// 获取产品列表
export function getProductList(data) {
  return request({
    url: '/resource/selectProduct',
    method: 'post',
    data
  })
}

// 获取产品分类
export function getProductCategoryList() {
  return request({
    url: '/resource/getCategoryList',
    method: 'get'
  })
}

// 获取产品用例
export function getAttributionUseCaseEnumList() {
  return request({
    url: '/resource/getAttributionUseCaseEnumList',
    method: 'get'
  })
}

// 上传产品
export function uploadProductFile(data) {
  return request({
    url: '/resource/uploadProduct',
    method: 'post',
    data
  })
}

// 删除产品
export function delProduct(params) {
  return request({
    url: '/resource/delProduct',
    method: 'get',
    params
  })
}

// 获取产品私有属性 useCase/getProductExtraFieldEnum
export function getProductExtraParams() {
  return request({
    url: '/resource/getProductExtraFieldEnum',
    method: 'get'
  })
}

// 编辑产品
export function updateProduct(data) {
  return request({
    url: '/resource/updateData',
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

// 增量更新话术
export function uploadScriptFile(data) {
  return request({
    url: '/script/uploadScript',
    method: 'post',
    data
  })
}

// 删除话术
export function delScript(params) {
  return request({
    url: '/script/delScript',
    method: 'get',
    params
  })
}

// 话术编辑
export function updateScript(data) {
  return request({
    url: '/script/update',
    method: 'post',
    data
  })
}

/** ************************************************ 权益 ************************************************************/
// 获取权益库
export function getInterestList(data) {
  return request({
    url: '/interests/select',
    method: 'post',
    data
  })
}

// 增量更新权益
export function uploadInterestFile(data) {
  return request({
    url: '/interests/uploadInterests',
    method: 'post',
    data
  })
}

// 删除权益
export function delInterests(params) {
  return request({
    url: '/interests/delInterests',
    method: 'get',
    params
  })
}

// 修改权益
export function updateInterests(data) {
  return request({
    url: '/interests/updateData',
    method: 'post',
    data
  })
}

// 新增权益
export function addInterest(data) {
  return request({
    url: '/interests/insert',
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
// 上传短信
export function uploadSmsFile(data) {
  return request({
    url: '/material/uploadSMS',
    method: 'post',
    data
  })
}

// 删除短信
export function delSms(params) {
  return request({
    url: '/material/delSMS',
    method: 'get',
    params
  })
}

// 编辑短信
export function editSms(data) {
  return request({
    url: 'material/update',
    method: 'post',
    data
  })
}

// 通过事件id获取变更话术、短信
export function getStrategyChangeListByEventId(params) {
  return request({
    url: 'strategy/selectUpdate',
    method: 'get',
    params
  })
}

/** ************************************************ 策略 ************************************************************/
// 获取策略库
export function getStragetyList(params) {
  return request({
    url: '/strategy/history_template',
    method: 'get',
    params
  })
}
// list 联想搜索
export function fuzzySearch(params) {
  return request({
    url: '/strategy/fuzzy_search',
    method: 'get',
    params
  })
}

// 修改运行事件的产品权益话术
export function updateStrategy(data) {
  return request({
    url: '/strategy/updateNote',
    method: 'post',
    data
  })
}

// 获取运行中事件线索信息
export function queryStatistics() {
  return request({
    url: '/event/query_statistics',
    method: 'get'
  })
}

/** ************************************************ 模型 ************************************************************/
// 获取模型库
export function queryModelList() {
  return request({
    url: '/customer/queryModelList',
    method: 'get'
  })
}

// 运行模型库
export function noticeModel(params) {
  return request({
    url: '/clue/noticeModel',
    method: 'get',
    params
  })
}

/** ************************************************ 事件 ************************************************************/

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

// 获取规则标签
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

// 获取策略推荐产品
export function getRecommendedProducts(params) {
  return request({
    url: '/resource/selectByIdList',
    method: 'get',
    params
  })
}

// 获取策略推荐权益
export function getRecommendedInterests(params) {
  return request({
    url: '/interests/selectInterestsByIds',
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
// 精准内侧
export function testSms(data) {
  return request({
    url: '/clue/sendSms',
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

// 获取审核人
export function getEventReviewer() {
  return request({
    url: '/event/getAllReviewer',
    method: 'get'
  })
}

// 获取审批人
export function getEventApprover() {
  return request({
    url: '/event/getAllApprover',
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

// 事件复制
export function copyEvent(params) {
  return request({
    url: '/event/copyEvent',
    method: 'get',
    params
  })
}

// 事件下线
export function offlineEvent(params) {
  return request({
    url: '/event/offline',
    method: 'get',
    params
  })
}

// 事件删除
export function deleteEvent(params) {
  return request({
    url: '/event/delEvent',
    method: 'get',
    params
  })
}

// 事件排序
export function setEventPriority(data) {
  return request({
    url: '/event/setEventPriority',
    method: 'post',
    data
  })
}

// 设置事件线索分发上限
export function setEventDistributeLimit(data) {
  return request({
    url: '/event/setDistributeLimit',
    method: 'post',
    data
  })
}

// 同步产品按钮
export function syncProduct(data) {
  return request({
    url: '/event/sync_product',
    method: 'post',
    data
  })
}

// 分发按钮
export function allocate(data) {
  return request({
    url: '/event/allocate',
    method: 'post',
    data
  })
}

/** ************************************************ 事件审批 ************************************************************/
// 事件审批
export function isPass(data) {
  return request({
    url: '/approval/isPass',
    method: 'post',
    data
  })
}

// 提交审核
export function askForApproval(params) {
  return request({
    url: '/approval/askForApproval',
    method: 'get',
    params
  })
}

// 获取审批状态信息
export function getEventApprovalLink(params) {
  return request({
    url: '/approval/getEventApprovalLink',
    method: 'get',
    params
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

/** ************************************************ 用例 ************************************************************/
// 获取用例
export function getUseCaseList(data) {
  return request({
    url: '/useCase/getUseCase',
    method: 'post',
    data
  })
}
// 获取用例（我的）[事件优先级]
export function getUseCaseForEvent() {
  return request({
    url: '/useCase/getMyUseCase',
    method: 'get'
  })
}

// 事件看板页面，用例网点分配页面 获取用例
export function getAllUseCase() {
  return request({
    url: '/useCase/getAllUseCase',
    method: 'get'
  })
}

// 事件优先级页面 根据用例获取事件
export function getEventPriorityList(params) {
  return request({
    url: '/event/getEventPriorityList',
    method: 'get',
    params
  })
}

// 事件注册第一步获取用例接口
export function getUseCaseICanChoose() {
  return request({
    url: '/event/getUseCaseICanChoose',
    method: 'get'
  })
}

// 删除用例
export function delUseCase(data) {
  return request({
    url: '/useCase/delUseCase',
    method: 'post',
    data
  })
}
// 获取用例归属人
export function getUseCaseBelongerCandidateList(params) {
  return request({
    url: '/useCase/getUseCaseBelongerCandidateList',
    method: 'get',
    params
  })
}

// 用例归属人修改
export function modifyUseCaseUser(data) {
  return request({
    url: '/useCase/modifyUseCaseUser',
    method: 'post',
    data
  })
}

// 用例线索分发数修改
export function setDistributeLimit(data) {
  return request({
    url: '/useCase/setDistributeLimit',
    method: 'post',
    data
  })
}

// 切换上下线
export function changeStatusUseCase(data) {
  return request({
    url: '/useCase/offlineUseCase',
    method: 'post',
    data
  })
}

// 获取用例类型
export function getUseCaseType(params) {
  return request({
    url: '/event/getUseCaseCategoryEnums',
    method: 'get',
    params
  })
}
// 获取用例参与人
export function getUseCaseParticipant(params) {
  return request({
    url: '/useCase/getAllEventParticipant',
    method: 'get',
    params
  })
}

// 获取审批人
export function getApproverList() {
  return request({
    url: '/useCase/getApproverList ',
    method: 'get'
  })
}

// 获取分发模式选项
export function getDitributeModeList() {
  return request({
    url: '/useCase/distributeEnum',
    method: 'get'
  })
}

// 新建用例
export function saveUseCase(data) {
  return request({
    url: '/useCase/insertUseCase',
    method: 'post',
    data
  })
}

// 修改用例
export function editUseCase(data) {
  return request({
    url: '/useCase/changeUseCase',
    method: 'post',
    data
  })
}

// 根据id获取用例详情
export function getUseCaseDetailById(params) {
  return request({
    url: '/useCase/getUseCaseDetailById',
    method: 'get',
    params
  })
}

/** ************************************************ 防打扰名单/短信黑名单 ************************************************************/
// 获取黑名单（CRM+SMS）
export function getHateMarketingList(data) {
  return request({
    url: '/hateSale/select',
    method: 'post',
    data
  })
}

// 新增用户
export function addCustomerToBlackList(data) {
  return request({
    url: '/hateSale/insertBatch',
    method: 'post',
    data
  })
}

// 增量导入
export function batchUploadFile(data) {
  return request({
    url: '/hateSale/upload',
    method: 'post',
    data
  })
}

// 删除客户
export function deleteHateMarketingListById(params) {
  return request({
    url: '/hateSale/deleteById',
    method: 'get',
    params
  })
}

/** ************************************************ 总看板 ************************************************************/
export function totalOverview(params) {
  return request({
    url: api2 + '/head/overview',
    method: 'get',
    params
  })
}
export function totalFunnel(params) {
  return request({
    url: api2 + '/head/funnel',
    method: 'get',
    params
  })
}
export function totalPie(params) {
  return request({
    url: api2 + '/head/pie',
    method: 'get',
    params
  })
}
export function totalCluesUseCase(params) {
  return request({
    url: api2 + '/head/case_rank',
    method: 'get',
    params
  })
}
export function totalAchieveRate(params) {
  return request({
    url: api2 + '/achieve_rate',
    method: 'get',
    params
  })
}

export function getAllBranches() {
  return request({
    url: api3 + '/branches',
    method: 'get'
  })
}

export function getAllBranchList() {
  return request({
    url: '/config/role/list',
    method: 'get'
  })
}

// export function totalPurchaseAmount(params) {
//   return request({
//     url: api2 + '/purchase_amount',
//     method: 'get',
//     params
//   })
// }
// export function totalStatistics(params) {
//   return request({
//     url: api2 + '/chart/mock',
//     method: 'get',
//     params
//   })
// }

// 获取实际达成率折线图
export function getActualRate(params) {
  return request({
    url: api2 + '/head/line',
    method: 'get',
    params
  })
}

// 单用例获取成效统计
export function totalStatisticsOne(params) {
  return request({
    url: api2 + '/head/single_case',
    method: 'get',
    params
  })
}

// /head/multi_cases/case
export function totalStatisticsMul(params) {
  return request({
    url: api2 + '/head/multi_cases/case',
    method: 'get',
    params
  })
}

export function totalRank(params) {
  return request({
    url: api2 + '/head/rank',
    method: 'get',
    params
  })
}

// export function totalRankOrg(params) {
//   return request({
//     url: api2 + '/rank_org',
//     method: 'get',
//     params
//   })
// }
// export function totalRankBrancg(params) {
//   return request({
//     url: api2 + '/rank_branch',
//     method: 'get',
//     params
//   })
// }

// Copy
//
export function totalOverviewCopy(params) {
  return request({
    url: '/report/summary',
    method: 'get',
    params
  })
}

// AUM LUM 信用卡小图
export function totalIncreaseCopy(params) {
  return request({
    url: '/report/increase',
    method: 'get',
    params
  })
}

// 漏斗图
export function totalFunnelCopy(params) {
  return request({
    url: '/report/sales_funnel',
    method: 'get',
    params
  })
}

// 饼图
export function totalPieCopy(params) {
  return request({
    url: '/report/channel_distribution',
    method: 'get',
    params
  })
}

// 获取rateOpt
export function rateOptCopy() {
  return request({
    url: '/report/rate_labels',
    method: 'get'
  })
}

// rate
export function totalRateCopy(params) {
  return request({
    url: '/report/rate_by_batch',
    method: 'get',
    params
  })
}
// rateRank
export function totalRateRankCopy(params) {
  return request({
    url: '/report/rate_by_Executor',
    method: 'get',
    params
  })
}

// 获取resultOpt
export function resultOptCopy() {
  return request({
    url: '/report/value_labels',
    method: 'get'
  })
}

// result
export function totalResultCopy(params) {
  return request({
    url: '/report/data_by_batch',
    method: 'get',
    params
  })
}
// resultRank
export function totalResultRankCopy(params) {
  return request({
    url: '/report/data_by_Executor',
    method: 'get',
    params
  })
}

// 获取effectOpt
export function effectOptCopy() {
  return request({
    url: '/report/target_labels',
    method: 'get'
  })
}

// effect
export function totalEffectCopy(params) {
  return request({
    url: '/report/target_by_batch',
    method: 'get',
    params
  })
}
// effectRank
export function totalEffectRankCopy(params) {
  return request({
    url: '/report/target_by_Executor',
    method: 'get',
    params
  })
}

/** ************************************************ crm与ods ************************************************************/

export function getRecordPage(data) {
  return request({
    url: '/clue/selectRecordPage',
    method: 'post',
    data
  })
}
/** ************************************************ 系统配置 ************************************************************/
// 防打扰修改
export function updateNoDisturb(data) {
  return request({
    url: '/config/updateNoDisturb',
    method: 'post',
    data
  })
}

// 获取防打扰
export function getNoDisturb() {
  return request({
    url: '/config/getNoDisturb',
    method: 'get'
  })
}

// Notdisturb页面测试分发按钮接口
export function testAllocateClue(params) {
  return request({
    url: '/bmp2crm/test_allocate_clue',
    method: 'get',
    params
  })
}

// 获取网点
export function getOutletList(data) {
  return request({
    url: '/config/getOutletList',
    method: 'get',
    data
  })
}

// 获取设置网点比例页面数据
export function getOutletAllot(data) {
  return request({
    url: '/config/getOutletAllot',
    method: 'post',
    data
  })
}

// 保存（用例）网点信息
export function insertOutletAllotBatch(data) {
  return request({
    url: '/config/insertOutletAllotBatch',
    method: 'post',
    data
  })
}

// 获取用例优先级
export function setUseCasePriority(data) {
  return request({
    url: '/useCase/setUseCasePriority',
    method: 'post',
    data
  })
}

// 获取线索
export function checkCluePriorityList() {
  return request({
    url: '/useCase/checkCluePriorityList',
    method: 'get'
  })
}

// 获取优先级列表
export function getCluePriorityRuleEnums() {
  return request({
    url: '/useCase/getCluePriorityRuleEnums',
    method: 'get'
  })
}

// 修改线索优先级
export function setCluePriority(data) {
  return request({
    url: '/event/setCluePriority',
    method: 'post',
    data
  })
}

// 获取岗位下的人员
export function postPeopleList(params) {
  return request({
    url: '/config/role/orgList',
    method: 'get',
    params
  })
}

// 获取岗位
export function getAllJob() {
  return request({
    url: '/config/job/getAll',
    method: 'get'
  })
}

// 保存岗位
export function saveBatch(data) {
  return request({
    url: '/config/job/saveBatch',
    method: 'post',
    data
  })
}

// 新增岗位
export function insertJob(data) {
  return request({
    url: '/config/job/insert',
    method: 'post',
    data
  })
}

// 编辑岗位
export function updateJob(data) {
  return request({
    url: '/config/job/update',
    method: 'post',
    data
  })
}

// 删除岗位
export function deleteJob(params) {
  return request({
    url: '/config/job/delete',
    method: 'get',
    params
  })
}

// 分配岗位
export function occupyJob(data) {
  return request({
    url: '/config/userJob/occupyJob',
    method: 'post',
    data
  })
}

// 获取角色
export function getPermissionPackEnum() {
  return request({
    url: '/config/job/getPermissionPackEnum',
    method: 'get'
  })
}

// 下载黑名单
export function downloadTest(params) {
  return request({
    url: '/hateSale/downloadAll',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 获取员工
export function getEmployees(data) {
  return request({
    url: '/user/queryPageEmp',
    method: 'post',
    data
  })
}

/** ************************************************ 理财顾问 ************************************************************/

// 获取理顾指派列表数据
export function getAppointList(data) {
  return request({
    url: '/emp/select_by_page',
    method: 'post',
    data
  })
}

// 获取理顾指派列表数据
export function appointEmp(params) {
  return request({
    url: '/emp/update_by_emp',
    method: 'get',
    params
  })
}

// 全量更新理顾指派列表数据
export function empUpdate(data) {
  return request({
    url: '/emp/upload',
    method: 'post',
    data
  })
}

/** ************************************************ 请假代办 ************************************************************/

// 获取请假代办列表数据
export function getEmpLeave(data) {
  return request({
    url: '/empLeave/get_emp_leave',
    method: 'post',
    data
  })
}

export function addEmpLeave(data) {
  return request({
    url: '/empLeave/insert_leave',
    method: 'post',
    data
  })
}

// 删除请假代办列表某个数据
export function delEmpLeave(params) {
  return request({
    url: '/empLeave/delete_by_code',
    method: 'get',
    params
  })
}

// 删除请假代办列表某个数据
export function getEmpInCurrentOrg(params) {
  return request({
    url: '/empLeave/get_emp_in_current_org',
    method: 'get',
    params
  })
}

/** ************************************************ 分配规则 ************************************************************/

// 获取分配规则列表
export function getRuleList(data) {
  return request({
    url: '/distribution/selectPage',
    method: 'post',
    data
  })
}

// 添加分配规则
export function addRule(data) {
  return request({
    url: '/distribution/insert',
    method: 'post',
    data
  })
}
// 修改分配规则
export function editRule(data) {
  return request({
    url: '/distribution/updateById',
    method: 'post',
    data
  })
}
// 删除分配规则
export function delRule(params) {
  return request({
    url: '/distribution/deleteById',
    method: 'get',
    params
  })
}

// 运行分配规则
export function runRule(params) {
  return request({
    url: '/distribution/updateStatusById',
    method: 'get',
    params
  })
}

// 获取分配规则的规则
export function getRuleDetail(params) {
  return request({
    url: '/distribution/getWithDetail',
    method: 'get',
    params
  })
}
// 获取规则的调用类选项
export function ruleClassList(params) {
  return request({
    url: '/distribution/returnDistributionTypeEnum',
    method: 'get',
    params
  })
}

// 更新列表的规则
export function updateRule(data) {
  return request({
    url: '/distributionDetail/updateData',
    method: 'post',
    data
  })
}

/** ************************************************ 事件驱动 ************************************************************/

// 查询事件驱动规则
export function getEventRuleList(data) {
  return request({
    url: '/rule/select',
    method: 'post',
    data
  })
}

// 删除事件驱动规则
export function delEventRule(params) {
  return request({
    url: '/rule/deleteById',
    method: 'get',
    params
  })
}

// 新增
export function addEventRule(data) {
  return request({
    url: '/rule/insert',
    method: 'post',
    data
  })
}

// 编辑
export function editEventRule(data) {
  return request({
    url: '/rule/update',
    method: 'post',
    data
  })
}

/** ************************************************ 规则库 ************************************************************/
// 获取标签
export function ruleTag(params) {
  return request({
    url: '/rule/getEventDrivenLabelEnum',
    method: 'get',
    params
  })
}

// 更新规则
export function updateRuleData(data) {
  return request({
    url: '/rule/updateDataMethod',
    method: 'post',
    data
  })
}
// 获取规则详情
export function ruleDetail(params) {
  return request({
    url: '/rule/getRuleCascade',
    method: 'get',
    params
  })
}

