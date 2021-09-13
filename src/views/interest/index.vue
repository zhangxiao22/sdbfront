<template>
  <div class="container">
    <shun-table ref="table"
                title="权益库"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                multiple
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="权益名称："
                        prop="name">
            <el-input v-model.trim="filterForm.name"
                      style="width:300px"
                      placeholder="请输入权益名称"
                      clearable
                      @keyup.enter.native="search" />
          </el-form-item>

          <el-form-item label="权益用例："
                        prop="attributionUseCaseList">
            <el-select v-model="filterForm.attributionUseCaseList"
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
          <el-form-item label="归属产品："
                        prop="productFirstCategoryList">
            <el-select v-model="filterForm.productFirstCategoryList"
                       multiple
                       style="width:300px;"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in productListOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="日期范围："
                        prop="dateRange">
            <el-date-picker v-model="filterForm.dateRange"
                            value-format="yyyy-MM-dd"
                            style="width:300px;"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" />
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
        <el-button class="button"
                   type="primary"
                   icon="el-icon-plus"
                   plain
                   @click="handleAdd">
          新增权益
        </el-button>
        <UploadButton :upload-method="uploadInterestFile"
                      class="button"
                      :description="DESCRIPTION.uploadSome"
                      button-name="增量更新"
                      @afterUploadSuccess="resetAll" />

        <!-- <el-tooltip class="item"
                    effect="dark"
                    content="全部下载所有权益"
                    placement="top">
          <el-button class="button"
                     icon="el-icon-download"
                     type="success"
                     plain
                     @click.native="downloadAll">
            全部下载
          </el-button>
        </el-tooltip> -->
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
                 @click="download">模版下载</el-link>

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
      <template v-slot:productFirstCategoryListSlot="scope">
        <template v-if="scope.row.productFirstCategoryList && scope.row.productFirstCategoryList.length">
          <el-tooltip placement="top-start"
                      class="hover-text">
            <div slot="content">
              <div v-for="(item,i) of scope.row.productFirstCategoryList"
                   :key="i"
                   style="margin:5px 0;">
                {{ item.label }}
              </div>
            </div>
            <span>
              {{ scope.row.productFirstCategoryList.length }}类产品
            </span>
          </el-tooltip>
        </template>
        <div v-else>
          无
        </div>
      </template>
      <template v-slot:operateSlot="scope">
        <div class="operate-btns">
          <div class="btn"
               style="color:#1890FF;"
               @click="handleEdit(scope.row)">编辑</div>
        </div>
      </template>
    </shun-table>
    <!-- dialog -->
    <el-dialog :title="isEdit?'编辑权益':'新增权益'"
               :visible.sync="showDialog"
               append-to-body
               @closed="handleClosedDialog">
      <el-form ref="formRef"
               label-width="110px"
               :model="addInfo">
        <el-form-item label="权益名称："
                      :rules="[{
                        required: true, message: '请输入权益名称', trigger: 'blur'
                      }]"
                      prop="name">
          <el-input v-model.trim="addInfo.name"
                    show-word-limit
                    style="width:90%;"
                    maxlength="50" />
        </el-form-item>

        <el-form-item label="权益用例："
                      :rules="[{
                        required: true, message: '请选择权益用例', trigger: 'blur'
                      }]"
                      prop="attributionUseCaseList">
          <el-select v-model="addInfo.attributionUseCaseList"
                     multiple
                     style="width:90%;"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in useCaseListOpt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="归属产品："
                      :rules="[{
                        required: true, message: '请选择归属产品', trigger: 'blur'
                      }]"
                      prop="productFirstCategoryList">
          <el-select v-model="addInfo.productFirstCategoryList"
                     multiple
                     style="width:90%;"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in productListOpt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="生效日期："
                      prop="validateDate">
          <el-date-picker v-model="addInfo.validateDate"
                          value-format="yyyy-MM-dd"
                          style="width:300px;"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="权益内容："
                      prop="content">
          <el-input v-model.trim="addInfo.content"
                    style="width:90%;"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    placeholder="请输入权益内容" />
        </el-form-item>
        <el-form-item label="权益说明："
                      prop="description">
          <el-input v-model.trim="addInfo.description"
                    style="width:90%;"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    placeholder="请输入权益说明" />
        </el-form-item>
        <!-- <el-form-item label="参数说明："
                      prop="parameterDescription">
          <el-input v-model.trim="addInfo.parameterDescription"
                    style="width:90%;"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    placeholder="请输入参数说明" />
        </el-form-item> -->
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancelAddList">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoading"
                   @click="ensureAddList">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import {
  getInterestList,
  uploadInterestFile,
  getAttributionUseCaseEnumList,
  getProductCategoryList,
  delInterests,
  updateInterests,
  addInterest
} from '@/api/api'
import UploadButton from '@/components/UploadButton'
import { DESCRIPTION } from '@/utils'

export default {
  name: 'Interest',
  components: {
    ShunTable,
    UploadButton
  },
  props: {
    showSelection: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      DESCRIPTION,
      uploadInterestFile,
      isEdit: false,
      showDialog: false,
      buttonLoading: false,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: {
        name: '',
        attributionUseCaseList: [],
        productFirstCategoryList: [],
        dateRange: []
      },
      useCaseListOpt: [],
      productListOpt: [],
      addInfo: {
        id: '',
        name: '',
        attributionUseCaseList: '',
        productFirstCategoryList: '',
        validateDate: [],
        content: '',
        description: ''
        // parameterDescription: ''
      },
      searchForm: {},
      // typeOpt: [],
      tableColumnList: [
        {
          prop: 'id',
          label: 'ID',
          minWidth: 50
        },
        {
          prop: 'name',
          label: '权益名称',
          minWidth: 200
        },

        {
          prop: 'attributionUseCaseList',
          label: '权益用例',
          minWidth: 100,
          slot: true
        },
        {
          prop: 'productFirstCategoryList',
          label: '关联产品',
          minWidth: 100,
          slot: true
        },
        {
          prop: 'validateStartDate',
          label: '生效时间',
          minWidth: 100
        },
        {
          prop: 'validateEndDate',
          label: '失效时间',
          minWidth: 100
        },
        {
          prop: 'content',
          label: '权益内容',
          minWidth: 300
        },
        {
          prop: 'description',
          label: '权益说明',
          minWidth: 200
        },
        // {
        //   prop: 'parameterDescription',
        //   label: '参数说明',
        //   minWidth: 200
        // },
        {
          prop: 'operate',
          label: '操作',
          width: 120,
          fixed: 'right',
          slot: true
        }
      ],
      tableData: []
    }
  },
  computed: {
    parentRef() {
      return this.$refs.table
    }
  },
  watch: {},
  created() {
    this.search()
    this.attributionUseCaseEnumList()
    this.productCategoryList()
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
      this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
      this.getList(1)
    },
    handleAdd() {
      this.isEdit = false
      this.showDialog = true
    },
    handleEdit(row) {
      this.isEdit = true
      this.showDialog = true
      this.$nextTick(() => {
        this.addInfo = {
          id: row.id,
          name: row.name,
          content: row.content,
          description: row.description,
          attributionUseCaseList: row.attributionUseCaseList?.map(n => n.value),
          productFirstCategoryList: row.productFirstCategoryList?.map(
            n => n.value
          ),
          validateDate: [row.validateStartDate || '', row.validateEndDate || '']
        }
      })
    },
    handleClosedDialog() {
      this.$refs['formRef'].resetFields()
      this.addInfo.id = ''
      this.isEdit = false
    },
    cancelAddList() {
      this.showDialog = false
    },
    ensureAddList() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          // this.buttonLoading = true
          const ajax = this.isEdit ? updateInterests : addInterest
          const data = {
            id: this.addInfo.id,
            name: this.addInfo.name,
            content: this.addInfo.content,
            description: this.addInfo.description,
            attributionUseCaseList: this.addInfo.attributionUseCaseList,
            productFirstCategoryList: this.addInfo.productFirstCategoryList,
            validateStartDate: this.addInfo.validateDate?.[0],
            validateEndDate: this.addInfo.validateDate?.[1]
          }
          ajax(data).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
              this.showDialog = false
              this.getList(1)
            }
          }).finally(() => {
            this.buttonLoading = false
          })
        }
      })
    },
    // 下载模版
    download() {
      window.open('/static/权益库模板.xlsx', '_blank')
      // window.open('http://10.5.14.149:8080/static/权益库模板.xlsx', '_blank')
    },
    downloadAll() {
      // const data = {
      // }
      // downloadFile('/hateSale/downloadAll', data)
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
            delInterests(data).then(res => {
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
          message: '请选择权益',
          type: 'warning',
          duration: '3000'
        })
      }
    },

    // 获取权益用例
    attributionUseCaseEnumList() {
      getAttributionUseCaseEnumList().then(res => {
        this.useCaseListOpt = res.data
      })
    },

    // 获取产品类型
    productCategoryList() {
      getProductCategoryList().then(res => {
        this.productListOpt = res.data.map(n => {
          return Object.assign(
            {},
            {
              label: n.firstCategory.label,
              value: n.firstCategory.value
            }
          )
        })
      })
    },

    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign(
        {
          pageNo: this.currentPage,
          pageSize: this.pageSize
        },
        this.searchForm
      )
      this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      this.loading = true
      getInterestList(data)
        .then(res => {
          this.tableData = res.data.resultList
          this.total = res.pagination.totalItemCount
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    }
    // getVal() {
    //   return this.$refs.table.getVal()
    // }
  }
}
</script>

