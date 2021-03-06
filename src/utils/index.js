import qs from 'qs'
import axios from 'axios'

export const MAX_NUMBER = 1e14

/**
 * filter tree
 * @param {Array} data [{label: 'A', value: 'A', children: [{label: 'B', value: 'B'}]}]
 * @param {Array} list ['B']
 * @returns {Array}
 */
export function filterTreeByValueList(data, list) {
  return data.filter(item => {
    if (item.children && item.children.length > 0) {
      item.children = filterTreeByValueList(item.children, list)
      return item.children.length > 0
    }
    return list.includes(item.value)
  })
}

// for el-table-column 百分比保留两位小数
export const percentFormatter = (row, column, cellValue, index) => {
  if (!cellValue && cellValue !== 0) {
    return ''
  }
  return (+cellValue * 100).toFixed(2) + '%'
}

// for el-table-column 万元保留两位小数
export const tenThousandFormatter = (row, column, cellValue, index) => {
  if (!cellValue && cellValue !== 0) {
    return ''
  }
  return Number((+cellValue / 10000).toFixed(2)).toLocaleString()
}

// for el-table-column 万元整数
export const tenThousandWholeNumberFormatter = (row, column, cellValue, index) => {
  if (!cellValue && cellValue !== 0) {
    return ''
  }
  return (Math.round(+cellValue / 10000)).toLocaleString()
}

// for el-table-column 整数保留两位小数
export const wholeNumberFormatter = (row, column, cellValue, index) => {
  if (!cellValue && cellValue !== 0) {
    return ''
  }
  return cellValue.toLocaleString()
}

export function formatMoney(val) {
  return `${val}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`)
}

// 产品公共字段
export const COMMON_COLUMN_LIST = [
  {
    prop: 'id',
    label: 'ID',
    minWidth: 50
  },
  {
    prop: 'name',
    label: '产品名称',
    minWidth: 200
  },
  {
    prop: 'firstCategory.label',
    label: '产品一级分类',
    minWidth: 120
  },
  {
    prop: 'secondCategory.label',
    label: '产品二级分类',
    minWidth: 120
  },
  {
    prop: 'attributionUseCaseList',
    label: '产品用例',
    minWidth: 100,
    slot: true
  },
  {
    prop: 'description',
    label: '产品描述',
    minWidth: 100
  },
  {
    prop: 'userId',
    label: '上传人',
    width: 100
  },
  // {
  //   prop: 'reviser',
  //   label: '最后修改人',
  //   width: 100
  // },
  {
    prop: 'modifyTime',
    label: '最后修改时间',
    minWidth: 180
  },
  {
    prop: 'operate',
    label: '操作',
    width: 120,
    fixed: 'right',
    slot: true,
    hide: true // 详情页隐藏
  }
]

// 按产品类型区分不同字段
export const SELF_COLUMN_LIST = [
  {
    // 存款类产品
    type: 1,
    columnList: [{
      prop: 'type',
      label: '产品类型',
      minWidth: 100
    },
    {
      prop: 'timeLimit',
      label: '期限',
      minWidth: 100
    },
    {
      prop: 'interestRate',
      label: '利率',
      minWidth: 100
    },
    {
      prop: 'floatingRatio',
      label: '上浮比例',
      minWidth: 100
    },
    {
      prop: 'startingAmount',
      label: '起点金额',
      minWidth: 100
    }
    ]
  },
  {
    // 理财类产品
    type: 2,
    columnList: [{
      prop: 'code',
      label: '产品代码',
      minWidth: 100
    },
    {
      prop: 'performanceBenchmark',
      label: '业绩比较基准',
      minWidth: 120
    },
    {
      prop: 'startDateOfRaising',
      label: '募集开始日期',
      minWidth: 120
    },
    {
      prop: 'endDateOfRaising',
      label: '募集结束日期',
      minWidth: 120
    },
    {
      prop: 'productEstablishmentDate',
      label: '产品成立日期',
      minWidth: 120
    },
    {
      prop: 'productValueDate',
      label: '产品起息日期',
      minWidth: 120
    },
    {
      prop: 'productEndDate',
      label: '产品结束日期',
      minWidth: 120
    },
    {
      prop: 'riskLevel',
      label: '风险等级',
      minWidth: 100
    },
    {
      prop: 'minimumInvestment',
      label: '个人首次最低投资金额',
      minWidth: 160
    },
    {
      prop: 'nextConfirmDate',
      label: '下一确认日',
      minWidth: 100
    }
    ]
  },
  {
    // 基金类产品
    type: 3,
    columnList: [
      {
        prop: 'code',
        label: '产品代码',
        minWidth: 100
      }, {
        prop: 'taCode',
        label: 'TA代码',
        minWidth: 100
      },
      {
        prop: 'productEstablishmentDate',
        label: '产品成立日期',
        minWidth: 120
      },
      {
        prop: 'productEndDate',
        label: '产品结束日期',
        minWidth: 120
      },
      {
        prop: 'riskLevel',
        label: '风险等级',
        minWidth: 100
      },
      {
        prop: 'daysOfFundArrival',
        label: '赎回资金到帐天数',
        minWidth: 140
      }
    ]
  },
  {
    // 保险类产品
    type: 4,
    columnList: [{
      prop: 'paymentPeriod',
      label: '交费年限',
      minWidth: 100
    },
    {
      prop: 'guaranteePeriod',
      label: '保障期间',
      minWidth: 100
    },
    {
      prop: 'ensureClassify',
      label: '保障分类',
      minWidth: 100
    },
    {
      prop: 'riskLevel',
      label: '风险等级',
      minWidth: 100
    }]
  },
  {
    // 信托类产品
    type: 5,
    columnList: [{
      prop: 'code',
      label: '产品代码',
      minWidth: 100
    },
    {
      prop: 'performanceBenchmark',
      label: '业绩比较基准',
      minWidth: 120
    },
    {
      prop: 'startDateOfRaising',
      label: '募集开始日期',
      minWidth: 120
    },
    {
      prop: 'endDateOfRaising',
      label: '募集结束日期',
      minWidth: 120
    },
    {
      prop: 'productEstablishmentDate',
      label: '产品成立日期',
      minWidth: 120
    },
    {
      prop: 'productValueDate',
      label: '产品起息日期',
      minWidth: 120
    },
    {
      prop: 'productEndDate',
      label: '产品结束日期',
      minWidth: 120
    },
    {
      prop: 'riskLevel',
      label: '风险等级',
      minWidth: 100
    },
    {
      prop: 'minimumInvestment',
      label: '个人首次最低投资金额',
      minWidth: 160
    },
    {
      prop: 'nextConfirmDate',
      label: '下一确认日',
      minWidth: 100
    }
    ]
  },
  {
    // 债券类产品
    type: 6,
    columnList: [{
      prop: 'type',
      label: '产品类型',
      minWidth: 100
    },
    {
      prop: 'publisher',
      label: '发行人全称',
      minWidth: 100
    },
    {
      prop: 'bondMaturity',
      label: '债券期限',
      minWidth: 100
    },
    {
      prop: 'couponRate',
      label: '票面利率',
      minWidth: 100
    },
    {
      prop: 'startingAmount',
      label: '起点金额',
      minWidth: 100
    }]
  },
  {
    // 信用卡类产品
    type: 7,
    columnList: [{
      prop: 'forPeople',
      label: '适用人群',
      minWidth: 100
    },
    {
      prop: 'rightDiscount',
      label: '权益优惠',
      minWidth: 100
    },
    {
      prop: 'interestDiscount',
      label: '利息优惠',
      minWidth: 100
    },
    {
      prop: 'productEndDate',
      label: '产品结束日期',
      minWidth: 120
    }]
  },
  {
    // 贷款类产品
    type: 8,
    columnList: [{
      prop: 'guaranteeMethod',
      label: '担保方式',
      minWidth: 100
    }
    ]
  },
  {
    // 通用类产品
    type: 9,
    columnList: [{
      prop: 'attribute',
      label: '产品属性（保本/非保本）',
      minWidth: 180
    },
    {
      prop: 'riskLevel',
      label: '风险等级',
      minWidth: 100
    },
    {
      prop: 'yield',
      label: '今年以来年化收益率',
      minWidth: 150
    },
    {
      prop: 'nextConfirmDate',
      label: '下一确认日',
      minWidth: 100
    },
    {
      prop: 'buyStartAmount',
      label: '购买起点金额',
      minWidth: 120
    }]
  }
]

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

export function downloadFile(url, params) {
  const openUrl = process.env.VUE_APP_BASE_API + url + '?' + qs.stringify(params)
  window.open(openUrl, '_self')
}

// post请求下载文件
export function downloadFilePost(url, data, config) {
  return axios.post(url, data, {
    baseURL: process.env.VUE_APP_BASE_API,
    responseType: 'blob',
    ...config
  })
}

// nb数据转tree
export function translate(data, opt = {}) {
  // 参数的别名
  const defaultOpt = {
    id: 'id',
    pid: 'pid',
    label: 'label',
    children: 'children',
    noChildren: []
  }
  const option = Object.assign(defaultOpt, opt)
  // console.log(option.noChildren)
  const refn = (list) => {
    if (!list.length) return option.noChildren
    return list.map(n => {
      if (n.userGraphVOList) {
        n.userGraphVOList.forEach(a => {
          a.parentOrgId = n.orgId
        })
      }
      // console.log(n.userGraphVOList, n.subOrgList)
      return Object.assign({}, n, {
        [option.id]: n.orgId || n.userId,
        [option.pid]: n.parentOrgId || 0,
        [option.label]: n.orgName || n.userName,
        [option.children]: refn([...n.userGraphVOList || [], ...n.subOrgList || []])
      })
    })
  }
  return refn(data)
}

// 按钮注释
export const DESCRIPTION = {
  uploadSome: '上传并增加数据',
  uploadAll: '上传并覆盖原数据',
  downloadSome: '下载已选项',
  downloadSearch: '全部下载当前搜索结果',
  delSome: '删除已选项'
}

/**
 * 判断当前页是否为最后一页并且当前页是否只有一条数据
 * @param {Number} total 总条数
 * @param {Number} pageSize 每页多少条
 * @param {Number} currentPage 当前页码
 * @returns {Boolean}
 */
export function lastAndSingle(total, pageSize, currentPage) {
  // console.log(total, pageSize, currentPage)
  return (total % pageSize) === 1 && (currentPage === Math.ceil(total / pageSize))
}
