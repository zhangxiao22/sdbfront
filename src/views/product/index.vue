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
        <UploadButton button-name="增量更新"
                      class="button"
                      :description="DESCRIPTION.uploadSome"
                      :upload-method="uploadProductFile"
                      @afterUploadSuccess="resetAll" />
        <!-- <el-button class="button"
                   type="primary"
                   icon="el-icon-plus"
                   plain
                   @click="handleAdd">
          新增权益
        </el-button> -->
        <el-tooltip class="item"
                    effect="dark"
                    :content="DESCRIPTION.downloadSome"
                    placement="top">
          <el-button class="button"
                     icon="el-icon-download"
                     type="success"
                     plain
                     @click="downloadSome">
            批量下载
          </el-button>
        </el-tooltip>
        <el-tooltip class="item"
                    effect="dark"
                    :content="DESCRIPTION.downloadSearch"
                    placement="top">
          <el-button class="button"
                     icon="el-icon-download"
                     type="success"
                     plain
                     @click="downloadAll">
            全部下载
          </el-button>
        </el-tooltip>
        <el-tooltip class="item"
                    effect="dark"
                    :content="DESCRIPTION.delSome"
                    placement="top">
          <el-button class="button"
                     icon="el-icon-delete"
                     type="danger"
                     plain
                     @click="delSome">
            批量删除
          </el-button>
        </el-tooltip>
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
            <span>
              {{ scope.row.attributionUseCaseList.length }}个用例
            </span>
          </el-tooltip>
        </template>
        <div v-else>
          无
        </div>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="btn"
             style="color:#1890FF;"
             @click="handleEdit(scope.row)">修改</div>
      </template>
    </shun-table>
    <el-dialog :title="isEdit?'修改产品':'新增产品'"
               :visible.sync="showDialog"
               @open="dialogOpen">
      <el-form ref="regFormRef"
               label-width="110px"
               :model="addInfo">
        <el-form-item label="产品名称："
                      :rules="[{
                        required: true, message: '请输入产品名称', trigger: 'blur'
                      }]"
                      prop="name">
          <el-input v-model.trim="addInfo.name"
                    show-word-limit
                    style="width:90%;"
                    maxlength="50" />
        </el-form-item>
        <el-form-item label="产品类型："
                      prop="category"
                      label-width="110px">
          <el-cascader v-model="addInfo.category"
                       style="width:300px;"
                       :options="categoryOpt"
                       :props="{ expandTrigger: 'hover' }"
                       clearable
                       @change="changeProductParams" />
        </el-form-item>
        <el-form-item label="产品用例："
                      prop="attributionUseCaseList">
          <el-select v-model="addInfo.attributionUseCaseList"
                     multiple
                     style="width:300px;"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in useCaseListOpt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品说明："
                      prop="description">
          <el-input v-model.trim="addInfo.description"
                    style="width:90%;"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    placeholder="请输入产品说明" />
        </el-form-item>
        <div v-for="(pItem,pi) of productParams"
             :key="pi"
             class="condition-item">
          <!-------------------------- input -------------------------->
          <template v-if="pItem.formatType==='input'">
            <el-form-item :prop="`${pItem.fieldName}`"
                          :label="`${pItem.desc}:`"
                          class="shun-label"
                          :rules="[{
                            // required: true, validator: (rule, value, callback) => {validateNumber(rule, value, callback,pItem.type,pItem.range,pItem.name)},trigger: 'blur'
                            required: true, message: '请填写'
                          }]">
              <el-input v-model="addInfo[pItem.fieldName]"
                        style="width:90%;"
                        controls-position="right" />
            </el-form-item>
          </template>
          <!-------------------------- rate -------------------------->
          <template v-if="pItem.formatType==='rate'">
            <el-form-item :prop="`${pItem.fieldName}`"
                          :label="`${pItem.desc}:`"
                          class="shun-label"
                          :rules="[{
                            // required: true, validator: (rule, value, callback) => {validateNumber(rule, value, callback,pItem.type,pItem.range,pItem.name)},trigger: 'blur'
                            required: true, message: '请填写'
                          }]">
              <el-input-number v-model="addInfo[pItem.fieldName]"
                               :precision="2"
                               :step="0.1"
                               controls-position="right" />
            </el-form-item>
          </template>
          <!-------------------------- date -------------------------->
          <template v-if="pItem.formatType==='date'">
            <el-form-item :prop="`${pItem.fieldName}`"
                          :label="`${pItem.desc}:`"
                          class="shun-label"
                          :rules="[{
                            // required: true, validator: (rule, value, callback) => {validateNumber(rule, value, callback,pItem.type,pItem.range,pItem.name)},trigger: 'blur'
                            required: true, message: '请填写'
                          }]">
              <el-date-picker v-model="addInfo[pItem.fieldName]"
                              type="date"
                              placeholder="选择日期" />
            </el-form-item>
          </template>
          <!-------------------------- select -------------------------->
          <template v-if="pItem.formatType==='select'">
            <el-form-item :prop="`${pItem.fieldName}`"
                          :label="`${pItem.desc}:`"
                          class="shun-label"
                          :rules="[{
                            // required: true, validator: (rule, value, callback) => {validateNumber(rule, value, callback,pItem.type,pItem.range,pItem.name)},trigger: 'blur'
                            required: true, message: '请填写'
                          }]">
              <el-select v-model="addInfo[pItem.fieldName]"
                         placeholder="请选择">
                <el-option v-for="(item,i) of [1]"
                           :key="i"
                           :label="item"
                           :value="item" />
              </el-select>
            </el-form-item>
          </template>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoading"
                   @click="ensureEdit">确 定</el-button>
      </div>
    </el-dialog>
    <Dialog ref="dialog"
            :is-edit="isEdit"
            :cancel-edit-test="cancelEditTest"
            :show-dialog-test="showDialogTest"
            :all-params="allParams"
            :product-params="productParams"
            :use-case-list-opt="useCaseListOpt"
            :category-opt="categoryOpt" />
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable/index'
import { SELF_COLUMN_LIST, COMMON_COLUMN_LIST, downloadFile, DESCRIPTION } from '@/utils'
import { getProductList, getProductCategoryList, uploadProductFile, getAttributionUseCaseEnumList, delProduct, getProductExtraParams } from '@/api/api'
import UploadButton from '@/components/UploadButton'

import qs from 'qs'
import Dialog from './dialog.vue'
export default {
  name: 'Product',
  components: {
    Dialog,
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
      DESCRIPTION,
      // 增量更新
      uploadProductFile,
      // 是否编辑
      isEdit: false,
      // 全量上传
      loading: false,
      buttonLoading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      addInfo: {
        id: '',
        name: '',
        category: [],
        attributionUseCaseList: [],
        description: ''
      },
      dataSetParams:
        [
          {
            name: 'code',
            type: 'int'
          }
        ],
      showDialog: false,
      showDialogTest: false,
      filterForm: {
        name: '',
        category: [],
        attributionUseCaseList: []
      },
      allParams: [],
      productParams: [],
      categoryOpt: [],
      useCaseListOpt: [],
      searchForm: {},
      tableColumnList: COMMON_COLUMN_LIST,
      tableData: []
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
    this.getExtraParams()
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
    getExtraParams() {
      getProductExtraParams().then(res => {
        this.allParams = res.data
      })
    },
    changeProductParams(val) {
      console.log(val)
      if (this.addInfo.category[0]) {
        this.productParams = this.allParams.find(n => n.type === this.addInfo.category[0]).array
      } else {
        this.productParams = this.allParams.find(n => n.type === this.addInfo.category[0]).array
      }
      console.log(this.productParams)
    },
    dialogOpen() {
      this.$refs['regFormRef'] && this.$refs['regFormRef'].resetFields()
    },
    handleAdd() {
      this.isEdit = false
      this.addInfo.id = ''
      this.showDialog = true
    },
    // handleEdit(row) {
    //   this.showDialog = true
    //   this.$nextTick(() => {
    //     this.isEdit = true
    //     this.addInfo.id = row.id
    //     // 基础字段
    //     this.addInfo.name = row.name
    //     this.addInfo.category = row.secondCategory.value ? [row.firstCategory.value, row.secondCategory.value] : [row.firstCategory.value]
    //     this.addInfo.attributionUseCaseList = row.attributionUseCaseList?.map(n => n.value)
    //     this.addInfo.description = row.description
    //     this.productParams = this.allParams.find(n => n.type === this.addInfo.category[0]).array
    //   })
    // },
    handleEdit(row) {
      this.showDialogTest = true
    },
    cancelEditTest() {
      this.showDialogTest = false
    },
    cancelEdit() {
      // this.$refs['regFormRef'].resetFields()
      this.showDialog = false
    },
    ensureEdit() {
      console.log(this.addInfo)
    },
    // 下载模版
    downloadModel() {
      window.open('/static/产品库模板.xlsx', '_blank')
      // window.open('http://10.5.14.149:8080/static/产品库模板.xlsx', '_blank')
    },

    downloadSome() {
      const selection = this.$refs.table.getVal()
      const data = {
        idList: selection.map(n => n.id).join(',')
      }
      if (selection.length) {
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
      const selection = this.$refs.table.getVal()
      if (selection.length) {
        this.$confirm(`确定删除？`)
          .then(() => {
            this.loading = true
            const data = {
              ids: selection.map(n => n.id).join(',')
            }
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
            children: n.secondCategoryList.length ? n.secondCategoryList : null
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
  .btn {
    cursor: pointer;
  }
}
</style>
