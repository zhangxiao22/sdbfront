var data = [
  {
    label: '数值',
    value: 1,
    type: 'unmber',
    // 一般都是0
    min: 0,
    // 没有就null
    max: 100,
    // %、元、次。。。
    unit: '%',
    // 精度 整数：0或null
    precision: '2'
  },
  {
    label: '枚举',
    value: 2,
    type: 'select',
    options: [{
      label: '选项1',
      value: 1
    }, {
      label: '选项2',
      value: 2
    }, {
      label: '选项2',
      value: 2
    }]
  },
  {
    label: '布尔',
    value: 3,
    type: 'boolean'
    // options: [{
    //   label: '是',
    //   value: 1
    // }, {
    //   label: '否',
    //   value: 2
    // }]
  },
  {
    label: '日期',
    value: 4,
    type: 'date'
  },
  {
    label: '字符串',
    value: 5,
    type: 'string'
  }
]
