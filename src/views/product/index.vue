<template>
  <div class="container">
    <!-- {{ tableColumnList }} -->
    <shun-table ref="table"
                title="产品库"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :multiple="multiple"
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="产品名称："
                        prop="name">
            <el-input v-model.trim="filterForm.name"
                      style="width:300px"
                      placeholder="请输入产品名称"
                      clearable
                      prefix-icon="el-icon-search"
                      @keyup.enter.native="search" />
          </el-form-item>
          <el-form-item label="产品类型："
                        prop="category">
            <el-select v-model="filterForm.category"
                       clearable
                       placeholder="请选择"
                       @change="handleChangeCategory">
              <el-option v-for="item in categoryOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="归属用例："
                        prop="useCase">
            <el-select v-model="filterForm.useCase"
                       clearable
                       placeholder="请选择"
                       @change="handleChangeCategory">
              <el-option v-for="item in categoryOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item class="filter-item-end">
            <el-button type="primary"
                       icon="el-icon-search"
                       @click="search">
              搜索
            </el-button>
            <el-button icon="el-icon-refresh"
                       @click="reset">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:main-buttons>
        <el-upload ref="uploadRef"
                   class="upload"
                   :http-request="uploadFile"
                   :accept="accept.map(n => `.${n}`).join(',')"
                   action="">
          <el-button class="button"
                     type="primary">
            产品上传
          </el-button>
        </el-upload>
        <el-link type="primary"
                 @click="download">模版下载</el-link>
      </template>
      <template v-slot:useCaseSearchSlot="scope">
        <el-tooltip placement="top-start">
          <div slot="content">
            <div v-for="(item,i) of scope.row.achieveList"
                 :key="i"
                 style="margin:5px 0;">
              {{ item.name }} {{ item.riskLevel.label }}
            </div>
          </div>
          <div class="name-group">
            <!-- {{ scope.row.achieveList.length }}个目标 -->
            {{ scope.row }}个用例
          </div>
        </el-tooltip>

      </template>
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable/index'
import { getProductList, getProductCategoryList, uploadFile } from '@/api/api'
const COMMON_COLUMN_LIST = [
  {
    prop: 'name',
    label: '产品名称',
    minWidth: 100
  },
  {
    prop: 'classify.label',
    label: '产品一级分类',
    minWidth: 120
  },
  {
    prop: 'classify.label',
    label: '产品二级分类',
    minWidth: 120
  },
  {
    prop: 'useCaseSearch',
    label: '所属用例',
    minWidth: 100,
    slot: true
  }
]
const SELF_COLUMN_LIST = [
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
    },
    {
      prop: 'description',
      label: '产品说明',
      minWidth: 100
    }]
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

export default {
  name: 'Product',
  components: {
    ShunTable
  },
  props: {
    showSelection: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    // 表格已选中项
    selectedItems: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: {
        name: '',
        category: '',
        useCase: ''
      },
      accept: ['xls', 'xlsx', 'csv'],
      categoryOpt: [
        { label: '理财', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 }
      ],
      searchForm: {},
      tableColumnList: COMMON_COLUMN_LIST,
      tableData: [],
      selection: []
      // selectedId: [1, 20]
    }
  },
  computed: {
    parentRef() {
      return this.$refs.table
    }
  },

  watch: {},
  created() {
    // this.productCategoryList()
    this.getList(1)
    // this.productCategoryList()
  },
  methods: {
    resetAll() {
      this.reset()
      this.$refs.table.resetSelection()
    },
    reset() {
      this.$refs.filterRef.resetFields()
      this.search()
    },
    search() {
      this.searchForm = {
        name: this.filterForm.name,
        category: this.filterForm.category || null,
        classify: this.filterForm.classify || null,
        useCase: this.filterForm.useCase || null
      }
      // this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
      this.getList(1)
      if (this.filterForm.category) {
        SELF_COLUMN_LIST.find(n => {
          if (n.type === this.filterForm.category) {
            this.tableColumnList = [...COMMON_COLUMN_LIST, ...n.columnList]
            return true
          }
        })
      } else {
        this.tableColumnList = COMMON_COLUMN_LIST
      }
    },
    // 上传产品
    uploadFile() {
      const index = this.file.name.lastIndexOf('.')
      const suffix = this.file.name.substr(index + 1)
      console.log(suffix)
      if (!this.accept.includes(suffix)) {
        this.$message({
          message: '请上传正确的文件格式',
          type: 'error',
          duration: '5000'
        })
        this.resetFile()
        return
      } else {
        const formData = new FormData()
        formData.append('file', this.file)
        formData.append('baseId', this.id)
        this.$parent.mainLoading = true
        uploadFile(formData).then(res => {
          // console.log(res)
          this.fileId = res.data.fileId
          this.fileName = res.data.fileName
          this.customerCount = res.data.recordNum
          this.updateTime = res.data.uploadTime
          this.tableData = res.data.groupInfoWithCount.map((n) => {
            return Object.assign({}, n, {
              desc: '',
              _desc: '',
              isEdit: false,
              isHover: false
            })
          })
          this.$parent.mainLoading = false
        }).catch(() => {
          this.resetFile()
          this.$parent.mainLoading = false
        })
      }
    },
    // 下载模版
    download() {
      window.open('/static/template.xlsx', '_blank')
    },
    // 获取产品类型
    productCategoryList() {
      getProductCategoryList().then(res => {
        this.categoryOpt = res.data
      })
    },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.searchForm)
      this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      this.loading = true
      getProductList(data).then(res => {
        this.tableData = res.data.resultList
        this.total = res.pagination.totalItemCount
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleChangeCategory(val) {

    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .upload {
    width: 1000px;
    margin: 0 auto;
  }
}
</style>
