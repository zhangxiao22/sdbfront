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
        <UploadButton :upload-method="uploadInterestFile"
                      class="button"
                      button-name="批量上传"
                      @afterUploadSuccess="resetAll" />
        <!-- <el-button class="button"
                   type="primary"
                   icon="el-icon-plus"
                   plain
                   @click="handleAddList">
          新增权益
        </el-button>
        <el-tooltip class="item"
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
        <el-button class="button"
                   icon="el-icon-delete"
                   type="danger"
                   plain
                   @click="delSome">
          批量删除
        </el-button>
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
            <div>
              {{ scope.row.attributionUseCaseList.length }}个用例
            </div>
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
            <div>
              {{ scope.row.productFirstCategoryList.length }}个产品
            </div>
          </el-tooltip>
        </template>
        <div v-else>
          无
        </div>
      </template>
    </shun-table>
    <el-dialog title="新增权益"
               :before-close="cancelAddList"
               :visible.sync="showDialog">
      <el-form ref="regFormRef"
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
        <el-form-item label="权益内容："
                      :rules="[{
                        required: true, message: '请输入权益内容', trigger: 'blur'
                      }]"
                      prop="content">
          <el-input v-model.trim="addInfo.content"
                    show-word-limit
                    style="width:90%;"
                    maxlength="50" />
        </el-form-item>
        <el-form-item label="权益说明："
                      prop="desc">
          <el-input v-model.trim="addInfo.desc"
                    show-word-limit
                    style="width:90%;"
                    maxlength="50" />
        </el-form-item>
        <el-form-item label="开始时间："
                      prop="startDate">
          <el-input v-model.trim="addInfo.startDate"
                    show-word-limit
                    style="width:90%;"
                    maxlength="50" />
        </el-form-item>
        <el-form-item label="结束时间："
                      prop="endDate">
          <el-input v-model.trim="addInfo.endDate"
                    show-word-limit
                    style="width:90%;"
                    maxlength="50" />
        </el-form-item>
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
import { getInterestList, uploadInterestFile, getAttributionUseCaseEnumList, getProductCategoryList, delInterests } from '@/api/api'
import UploadButton from '@/components/UploadButton'

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
      uploadInterestFile,
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
        name: '',
        content: '',
        desc: '',
        startDate: '',
        endDate: ''
      },
      searchForm: {},
      // typeOpt: [],
      tableColumnList: [
        {
          prop: 'name',
          label: '权益名称',
          minWidth: 200
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
        {
          prop: 'attributionUseCaseList',
          label: '权益用例',
          minWidth: 100,
          slot: true
        },
        {
          prop: 'productFirstCategoryList',
          label: '归属产品',
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
        }
      ],
      tableData: []
    }
  },
  computed: {
    parentRef() {
      return this.$refs.table
    },
    getData() {
      const data = {}
      data.name = this.addInfo.name
      data.content = this.addInfo.content
      data.desc = this.addInfo.desc
      data.startDate = this.addInfo.startDate
      data.endDate = this.addInfo.endDate
      return data
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
    handleAddList() {
      this.$refs['regFormRef'] && this.$refs['regFormRef'].resetFields()
      this.showDialog = true
    },
    cancelAddList() {
      // this.$refs['regFormRef'].resetFields()
      this.showDialog = false
    },
    ensureAddList() {
      this.$refs['regFormRef'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          // addCustomerToBlackList([this.getData]).then(res => {
          //   this.buttonLoading = false
          //   if (res.code === 200) {
          //     this.$message({
          //       message: '保存成功',
          //       type: 'success',
          //       duration: '3000'
          //     })
          //     this.showDialog = false
          //     this.resetAll()
          //   }
          // }).catch(() => {
          //   this.buttonLoading = false
          // })
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
        this.productListOpt = res.data.map((n) => {
          return Object.assign({}, {
            label: n.firstCategory.label,
            value: n.firstCategory.value
          })
        })
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
      getInterestList(data).then(res => {
        this.tableData = res.data.resultList
        this.total = res.pagination.totalItemCount
        this.loading = false
      }).catch(err => {
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

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
