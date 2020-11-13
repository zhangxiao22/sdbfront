export const DATA = [
  {
    'id': 'R_CUS_PER_CHARAC_BUSI.YEAR_INCOME',
    'name': '收入',
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
      }],
    'enumCandidateList': null
  },
  {
    'id': 'R_CUS_PER_CHARAC_BUSI.VIP_LEVEL',
    'name': '客户层级',
    'type': '数值型',
    'unit': '%',
    'tagCtgryNm': '客户基本特征',
    'tagPrimClNm': '客户价值',
    'tagScdClNm': '客户价值率',
    'relations': [
      {
        'label': '=',
        'value': 0
      },
      {
        'label': '>',
        'value': 1
      },
      {
        'label': '≥',
        'value': 2
      },
      {
        'label': '<',
        'value': 3
      },
      {
        'label': '≤',
        'value': 4
      },
      {
        'label': '≠',
        'value': 5
      }
    ],
    'enumCandidateList': null
  },
  {
    'id': 'R_CUS_PER_CHARAC_BUSI.VIP_LEVEL1',
    'name': '客户资产',
    'type': '日期型',
    'unit': '年/月/日',
    'tagCtgryNm': '客户基本特征',
    'tagPrimClNm': '客户价值',
    'tagScdClNm': '客户资产日期',
    'relations': [
      {
        'label': '=',
        'value': 0
      },
      {
        'label': '>',
        'value': 1
      },
      {
        'label': '≥',
        'value': 2
      },
      {
        'label': '<',
        'value': 3
      },
      {
        'label': '≤',
        'value': 4
      }
    ],
    'enumCandidateList': null
  },
  {
    'id': 'R_CUS_PER_CHARAC_BUSI.IS_MALE',
    'name': '是否男性',
    'type': '枚举型',
    'unit': null,
    'tagCtgryNm': '客户基本特征',
    'tagPrimClNm': '客户特征',
    'tagScdClNm': '人口统计特征',
    'relations': [],
    'enumCandidateList': [
      {
        'label': '女性',
        'value': 0
      },
      {
        'label': '男性',
        'value': 1
      },
      {
        'label': '未知',
        'value': 2
      }
    ]
  }
]
