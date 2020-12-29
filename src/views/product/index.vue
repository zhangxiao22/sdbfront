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
      <template v-slot:main-buttons>
        <UploadButton button-name="批量上传"
                      class="button"
                      :upload-method="uploadProductFile"
                      @afterUploadSuccess="resetAll" />
        <el-button class="button"
                   icon="el-icon-download"
                   type="success"
                   plain
                   @click.native="downloadSome">
          批量下载
        </el-button>
        <el-tooltip class="item"
                    effect="dark"
                    content="全部下载当前搜索结果"
                    placement="top">
          <el-button class="button"
                     icon="el-icon-download"
                     type="success"
                     plain
                     @click.native="downloadAll">
            全部下载
          </el-button>
        </el-tooltip>
        <el-button class="button"
                   icon="el-icon-delete"
                   type="danger"
                   plain
                   @click.native="delSome">
          批量删除
        </el-button>
        <el-link type="primary"
                 class="button"
                 @click="downloadModel">模版下载</el-link>
      </template>
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
          <el-form-item label="产品类型:"
                        prop="category">
            <el-cascader v-model="filterForm.category"
                         style="width:300px;"
                         :options="categoryOpt"
                         :props="{ checkStrictly: true,expandTrigger: 'hover' }"
                         clearable />
          </el-form-item>
          <el-form-item label="产品用例："
                        prop="attributionUseCaseList">
            <el-select v-model="filterForm.attributionUseCaseList"
                       multiple
                       style="width:600px;"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in useCaseListOpt"
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
      <template v-slot:attributionUseCaseListSlot="scope">
        <template v-if="scope.row.attributionUseCaseList && scope.row.attributionUseCaseList.length">
          <el-tooltip placement="top-start"
                      class="hover-text">
            <div slot="content">
              <div v-for="(item,i) of scope.row.attributionUseCaseList"
                   :key="i"
                   style="margin:5px 0;">
                {{ item.label }}
              </div>
            </div>
            <div>
              {{ scope.row.attributionUseCaseList.length }}个用例
            </div>
          </el-tooltip>
        </template>
        <div v-else>
          无
        </div>
      </template>
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable/index'
import { SELF_COLUMN_LIST, COMMON_COLUMN_LIST, downloadFile } from '@/utils'
import { getProductList, getProductCategoryList, uploadProductFile, getAttributionUseCaseEnumList, delProduct } from '@/api/api'
import UploadButton from '@/components/UploadButton'

import qs from 'qs'
export default {
  name: 'Product',
  components: {
    ShunTable,
    UploadButton
  },
  props: {
    showSelection: {
      type: Boolean,
      default: true
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
      // 批量上传
      uploadProductFile,
      // 全量上传
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: {
        name: '',
        category: [],
        attributionUseCaseList: []
      },
      categoryOpt: [],
      useCaseListOpt: [],
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
    this.productCategoryList()
    this.attributionUseCaseEnumList()
    this.search()
  },
  methods: {
    resetAll() {
      this.reset()
      this.$refs.table.setSelection([])
    },
    reset() {
      this.$refs.filterRef.resetFields()
      this.search()
    },
    search() {
      // this.searchForm = {
      //   name: this.filterForm.name,
      //   category: this.filterForm.category.slice(0),
      //   attributionUseCaseList: this.filterForm.attributionUseCaseList.slice(0)
      // }
      this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
      this.getList(1)
      if (this.filterForm.category.length) {
        SELF_COLUMN_LIST.find(n => {
          if (n.type === this.filterForm.category[0]) {
            this.tableColumnList = [...COMMON_COLUMN_LIST, ...n.columnList]
            return true
          }
        })
      } else {
        this.tableColumnList = COMMON_COLUMN_LIST
      }
    },
    handleFileChange(file) {
      this.file = file.raw
    },
    resetFile() {
      this.file = ''
      this.$refs.uploadRef.clearFiles()
    },
    // 下载模版
    downloadModel() {
      window.open('/static/产品库模板.xlsx', '_blank')
      // window.open('http://10.5.14.149:8080/static/产品库模板.xlsx', '_blank')
    },

    downloadSome() {
      this.selection = this.$refs.table.getVal()
      const data = {
        idList: this.selection.map(n => n.id).join(',')
      }
      if (this.selection.length) {
        downloadFile('/resource/downloadProductBatch', data)
      } else {
        return this.$message({
          message: '请选择产品',
          type: 'warning',
          duration: '3000'
        })
      }
    },
    downloadAll() {
      if (this.tableData.length) {
        const data = {
          name: this.searchForm.name,
          category: this.searchForm.category.join(','),
          attributionUseCaseList: this.searchForm.attributionUseCaseList.join(',')
        }
        downloadFile('/resource/downloadProductAll', data)
      } else {
        return this.$message({
          message: '产品数据不存在',
          type: 'warning',
          duration: '3000'
        })
      }
    },
    delSome() {
      this.selection = this.$refs.table.getVal()
      const data = {
        ids: this.selection.map(n => n.id).join(',')
      }
      if (this.selection.length) {
        this.$confirm(`确定删除？`)
          .then(() => {
            this.loading = true
            delProduct(data).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: '3000'
                })
                this.resetAll()
              }
            })
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        return this.$message({
          message: '请选择产品',
          type: 'warning',
          duration: '3000'
        })
      }
    },
    // 获取产品类型
    productCategoryList() {
      getProductCategoryList().then(res => {
        this.categoryOpt = res.data.map((n) => {
          return Object.assign({}, {
            label: n.firstCategory.label,
            value: n.firstCategory.value,
            children: n.secondCategoryList
          })
        })
      })
    },

    // 获取产品用例getAttributionUseCaseEnumList
    attributionUseCaseEnumList() {
      getAttributionUseCaseEnumList().then(res => {
        this.useCaseListOpt = res.data
      })
    },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.searchForm)
      // this.filterForm = {
      //   name: this.searchForm.name,
      //   category: this.searchForm.category.slice(0),
      //   attributionUseCaseList: this.searchForm.attributionUseCaseList.slice(0)
      // }
      this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      this.loading = true
      getProductList(data).then(res => {
        this.tableData = res.data.resultList.map((n) => {
          return Object.assign({}, n, n.extraField)
        })
        this.total = res.pagination.totalItemCount
        // this.loading = false
      }).finally(() => {
        this.loading = false
      })
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
