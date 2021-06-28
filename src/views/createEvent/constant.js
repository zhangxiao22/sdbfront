export const CHANNEL_OPT = [
  {
    value: 1,
    label: 'CRM',
    disabled: false,
    icon: 'phone',
    iconColor: '#409eff',
    // 1:定时型 2:规则
    chooseType: 1,
    timingDateType: 1,
    timingDateValue: [],
    timingTimeValue: '07:00',
    dateRange: [],
    ruleValue: [{
      date: 0,
      time: '00:00'
    }],
    type: [{
      id: 1,
      icon: 'el-icon-alarm-clock',
      name: '定时型'
    }],
    model: [],
    beforeSms: [],
    afterSms: []
    // validPeriod: 0,
  },
  {
    value: 2,
    label: '短信',
    disabled: false,
    icon: 'sms',
    iconColor: '#FF9933',
    chooseType: 1,
    // 定时型的值-规则 (每周几或每月)
    timingDateType: 1,
    // 定时型的值-规则 (周几或者几号) (多选)
    timingDateValue: [],
    // 定时型的值-时间
    timingTimeValue: '07:00',
    // 定时型的值-起止时间
    dateRange: [],
    // 规则型的值
    ruleValue: [{
      date: 0,
      time: '00:00'
    }],
    smsSendMode: 0,
    // 精准内测
    test: '',
    type: [{
      id: 1,
      name: '定时型',
      icon: 'el-icon-alarm-clock'
    }
      // {
      //   id: 2,
      //   name: '规则型',
      //   icon: 'el-icon-tickets'
      // }
    ],
    model: []
  }, // {
  //   value: 3,
  //   label: '微信',
  //   disabled: false,
  //   icon: 'wechat',
  //   iconColor: '#67c23a',
  //   chooseType: 1,
  //   timingDateType: 1,
  //   timingDateValue: [],
  //   timingTimeValue: '07:00',
  //   dateRange: [],
  //   ruleValue: [{
  //     date: 0,
  //     time: '00:00'
  //   }],
  //   type: [{
  //     id: 1,
  //     name: '定时型',
  //     icon: 'el-icon-alarm-clock'
  //   }, {
  //     id: 2,
  //     name: '规则型',
  //     icon: 'el-icon-tickets'
  //   }],
  //   model: []
  // }

  {
    value: 5,
    label: 'STM',
    disabled: false,
    icon: 'stm',
    iconColor: '#990099',
    chooseType: 1,
    type: [{
      id: 1,
      name: '定时型',
      icon: 'el-icon-alarm-clock'
    }],
    // 定时型的值-起止时间
    dateRange: []
  }
]
export const TIMING_OPT = [
  {
    value: 1,
    label: '每周',
    children: [{
      value: 1,
      label: '星期一'
    }, {
      value: 2,
      label: '星期二'
    }, {
      value: 3,
      label: '星期三'
    }, {
      value: 4,
      label: '星期四'
    }, {
      value: 5,
      label: '星期五'
    }, {
      value: 6,
      label: '星期六'
    }, {
      value: 7,
      label: '星期日'
    }]
  },
  {
    value: 2,
    label: '每月',
    children: Array.apply(null, Array(31)).map((n, i) => {
      return { value: i + 1, label: i + 1 + '号' }
    })
  }
]
