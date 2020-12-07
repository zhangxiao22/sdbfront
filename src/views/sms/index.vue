<template>
  <div class="container">
    <shun-table ref="table"
                title="短信库"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="短信内容："
                        prop="content">
            <el-input v-model.trim="filterForm.content"
                      style="width:300px"
                      placeholder="请输入短信内容"
                      clearable
                      @keyup.enter.native="search" />
          </el-form-item>

          <el-form-item label="短信用例："
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
        <!-- <UploadButton :upload-method="uploadSmsFile"
                      class="button"
                      button-name="批量上传"
                      @afterUploadSuccess="resetAll" /> -->
        <!-- <el-button class="button"
                   type="primary"
                   icon="el-icon-plus"
                   plain
                   @click="handleAddList">
          新增短信
        </el-button>
        <el-tooltip class="item"
                    effect="dark"
                    content="全部下载所有短信"
                    placement="top">
          <el-button class="button"
                     icon="el-icon-download"
                     type="success"
                     plain
                     @click.native="downloadAll">
            全部下载
          </el-button>
        </el-tooltip> -->
        <!-- <el-link type="primary"
                 @click="download">模版下载</el-link> -->

      </template>
      <template v-slot:paramsSlot="props">
        <pre>{{ props.row.params }}</pre>
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
              {{ scope.row.productFirstCategoryList.length }}类产品
            </div>
          </el-tooltip>
        </template>
        <div v-else>
          无
        </div>
      </template>
    </shun-table>
    <el-dialog title="新增短信"
               :before-close="cancelAddList"
               :visible.sync="showDialog">
      <el-form ref="regFormRef"
               label-width="110px"
               :model="addInfo">
        <el-form-item label="短信内容："
                      :rules="[{
                        required: true, message: '请输入短信内容', trigger: 'blur'
                      }]"
                      prop="content">
          <el-input v-model.trim="addInfo.content"
                    show-word-limit
                    style="width:90%;"
                    maxlength="50" />
        </el-form-item>
        <el-form-item label="短信分类："
                      :rules="[{
                        required: true, message: '请输入短信分类', trigger: 'blur'
                      }]"
                      prop="category">
          <el-input v-model.trim="addInfo.category"
                    show-word-limit
                    style="width:90%;"
                    maxlength="50" />
        </el-form-item>
        <el-form-item label="短信描述："
                      :rules="[{
                        required: true, message: '请输入短信描述', trigger: 'blur'
                      }]"
                      prop="desc">
          <el-input v-model.trim="addInfo.desc"
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
import { getSmsList, uploadSmsFile, getAttributionUseCaseEnumList, getProductCategoryList } from '@/api/api'
import UploadButton from '@/components/UploadButton'

export default {
  name: 'Sms',
  components: {
    ShunTable
    // UploadButton
  },
  props: {
    showSelection: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadSmsFile,
      showDialog: false,
      buttonLoading: false,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      useCaseListOpt: [],
      productListOpt: [],
      filterForm: {
        content: '',
        attributionUseCaseList: [],
        productFirstCategoryList: []
      },
      addInfo: {
        content: '',
        category: '',
        desc: ''
      },
      searchForm: {},
      typeOpt: [],
      tableColumnList: [
        {
          prop: 'content',
          label: '短信内容',
          minWidth: 300,
          notShowOverflowTooltip: true
        },
        {
          prop: 'category.label',
          label: '短信分类'
          // sortable: true
        },
        {
          prop: 'attributionUseCaseList',
          label: '短信用例',
          slot: true
        },
        {
          prop: 'productFirstCategoryList',
          label: '归属产品',
          slot: true
        },
        {
          prop: 'description',
          label: '短信说明',
          minWidth: 200,
          notShowOverflowTooltip: true
        }
      ],
      tableData: [],
      selection: []
    }
  },
  computed: {
    parentRef() {
      return this.$refs.table
    },
    getData() {
      const data = {}
      data.content = this.addInfo.content
      data.category = this.addInfo.category
      data.desc = this.addInfo.desc
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
      window.open('/static/template.xlsx', '_blank')
    },
    downloadAll() {
      // const data = {
      //   category: this.category
      // }
      // downloadFile('/hateSale/downloadAll', data)
    },

    // 获取短信用例
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
      this.loading = true
      getSmsList(data).then(res => {
        this.tableData = res.data.resultList
        this.total = res.pagination.totalItemCount
        this.loading = false
      }).catch(() => {
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
