export const DATA = [
  {
    'id': 'R_CUS_PER_CHARAC_BUSI.YEAR_INCOME',
    'name': '数值型名称',
    'type': '数值型',
    'unit': '元',
    'tagCtgryNm': '客户基本特征',
    'tagPrimClNm': '客户价值',
    'tagScdClNm': '资产实例',
    'relations': [
      {
        'label': '等于',
        'value': 0
      },
      {
        'label': '不等于',
        'value': 1
      },
      {
        'label': '区间',
        'value': 2
      },
      {
        'label': '有值',
        'value': '有值'
      }, {
        'label': '没值',
        'value': '没值'
      }],
    'enumCandidateList': null
  },
  {
    'id': 'R_CUS_PER_CHARAC_BUSI.VIP_LEVEL',
    'name': '字符串型名称',
    'type': '字符串型',
    'unit': '单位',
    'tagCtgryNm': '客户基本特征',
    'tagPrimClNm': '客户价值',
    'tagScdClNm': '客户价值率',
    'relations': [
      {
        'label': '包含',
        'value': 0
      },
      {
        'label': '等于',
        'value': 1
      },
      {
        'label': '不等于',
        'value': 2
      }, {
        'label': '有值',
        'value': '有值'
      }, {
        'label': '没值',
        'value': '没值'
      }
    ],
    'enumCandidateList': null
  },
  {
    'id': 'R_CUS_PER_CHARAC_BUSI.VIP_LEVEL1',
    'name': '枚举型名称',
    'type': '枚举型',
    'unit': '年/月/日',
    'tagCtgryNm': '客户基本特征',
    'tagPrimClNm': '客户价值',
    'tagScdClNm': '客户资产日期',
    'relations': [
      {
        'label': '等于',
        'value': 0
      }, {
        'label': '有值',
        'value': '有值'
      }, {
        'label': '没值',
        'value': '没值'
      }
    ],
    'enumCandidateList': [
      {
        'label': '选项1',
        'value': 0
      },
      {
        'label': '选项2',
        'value': 1
      },
      {
        'label': '选项3',
        'value': 2
      }
    ]
  },
  {
    'id': 'R_CUS_PER_CHARAC_BUSI.IS_MALE',
    'name': '日期型名称',
    'type': '日期型',
    'unit': null,
    'tagCtgryNm': '客户基本特征',
    'tagPrimClNm': '客户特征',
    'tagScdClNm': '人口统计特征',
    'relations': [
      {
        'label': '区间',
        'value': 0
      }, {
        'label': '有值',
        'value': '有值'
      }, {
        'label': '没值',
        'value': '没值'
      }
    ],
    'enumCandidateList': []
  }
]
