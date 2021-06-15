import qs from 'qs'

export const MAX_NUMBER = 1e14

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
