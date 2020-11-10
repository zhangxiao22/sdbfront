<template>
  <div class="container">
    <shun-table ref="table"
                title="厌恶营销名单"
                :loading="loading"
                :show-selection="showSelection"
                :page-size.sync="pageSize"
                :current-page.sync="currentPage"
                :total="total"
                :is-card="false"
                multiple
                :table-data="tableData"
                :table-column-list="tableColumnList"
                @render="getList">
      <template v-slot:filter>
        <el-form ref="filterRef"
                 :inline="true"
                 :model="filterForm"
                 class="filter-container">
          <el-form-item label="客户号："
                        prop="customerAccount">
            <el-input v-model.trim="filterForm.customerAccount"
                      style="width:200px"
                      placeholder="请输入客户号"
                      clearable
                      @keyup.enter.native="search" />
          </el-form-item>
          <el-form-item label="客户姓名："
                        prop="name">
            <el-input v-model.trim="filterForm.name"
                      style="width:200px"
                      placeholder="请输入客户姓名"
                      clearable
                      @keyup.enter.native="search" />
          </el-form-item>
          <el-form-item label="日期范围："
                        prop="dateRange">
            <el-date-picker v-model="filterForm.dateRange"
                            value-format="yyyy-MM-dd"
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
                       @click="resetAll">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:main-buttons>
        <UploadButton name="xxxx" />
        <el-button class="button"
                   type="primary"
                   icon="el-icon-plus"
                   plain
                   @click="handleAddList">
          新增名单
        </el-button>
        <el-upload ref="uploadRef"
                   :disabled="uploading"
                   :on-change="handleFileChange"
                   class="upload button"
                   :http-request="file=>handleUploadFileAll(file,1)"
                   :show-file-list="false"
                   :accept="accept.map(n => `.${n}`).join(',')"
                   action="">
          <el-button :loading="uploading"
                     :disabled="uploading"
                     icon="el-icon-upload2"
                     type="primary"
                     plain>
            全量更新
          </el-button>
        </el-upload>
        <el-upload ref="uploadRef"
                   :disabled="uploading"
                   :on-change="handleFileChange"
                   class="upload button"
                   :http-request="file=>handleUploadFileAll(file,0)"
                   :show-file-list="false"
                   :accept="accept.map(n => `.${n}`).join(',')"
                   action="">
          <el-button :loading="uploading"
                     :disabled="uploading"
                     icon="el-icon-upload2"
                     type="primary"
                     plain>
            批量更新
          </el-button>
        </el-upload>
        <el-tooltip class="item"
                    effect="dark"
                    content="全部下载所有名单"
                    placement="top">
          <el-button class="button"
                     icon="el-icon-download"
                     type="success"
                     plain
                     @click.native="downloadAll">
            全部下载
          </el-button>
        </el-tooltip>
        <el-link type="primary"
                 @click="download">模版下载</el-link>

      </template>
      <template v-slot:operateSlot="scope">
        <div class="btn"
             style="color:#f56c6c;"
             @click="handleDelete(scope.row)">删除</div>
      </template>
      <template v-slot:paramsSlot="props">
        <pre>{{ props.row.params }}</pre>
      </template>
    </shun-table>
    <el-dialog title="新增名单"
               :before-close="cancelAddList"
               :visible.sync="showDialog">
      <el-form ref="regFormRef"
               :model="addInfo"
               label-width="220px"
               class="reg-form">
        <el-form-item class="target-form-item">
          <div v-for="(addItem,i) of addInfo.add"
               :key="i"
               class="target-item">
            <el-form-item :prop="'add.'+i+'.customerAccount'"
                          label="客户号："
                          :rules="{
                            required: true, message: '请输入客户号', trigger: 'change'
                          }">
              <el-tooltip :content="'请输入客户号'"
                          placement="left">
                <el-input v-model="addItem.customerAccount"
                          show-word-limit
                          class="target-item-input"
                          maxlength="50" />
              </el-tooltip>
            </el-form-item>
            <el-form-item :prop="'add.'+i+'.name'"
                          label="客户姓名："
                          :rules="{
                            required: true, message: '请输入客户姓名', trigger: 'change'
                          }">
              <el-input v-model="addItem.name"
                        class="target-item-input"
                        show-word-limit
                        maxlength="50" />
            </el-form-item>
            <i v-if="addInfo.add.length > 1"
               class="el-icon-delete delete"
               @click="delAddItem(i)" />
          </div>
          <el-button v-if="addInfo.add.length > 0"
                     class="add"
                     icon="el-icon-plus"
                     @click="addNewItem" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancelAddList">取 消</el-button>
        <el-button type="primary"
                   @click="ensureAddList">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getHateMarketingList, addCustomerToBlackList, batchUploadFile, deleteHateMarketingListById } from '@/api/api'
import { Notification } from 'element-ui'
import qs from 'qs'
import UploadButton from '@/components/UploadButton'
export default {
  name: 'HateMarketingCRM',
  components: {
    ShunTable,
    UploadButton
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
      accept: ['xls', 'xlsx', 'csv'],

      uploading: false,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      category: 1,
      showDialog: false,
      total: 0,
      filterForm: {
        customerAccount: '',
        name: '',
        dateRange: []
      },
      searchForm: {
      },
      addInfo: {
        add: [{
          customerAccount: '',
          name: ''
        }]
      },

      tableColumnList: [
        {
          prop: 'customerAccount',
          label: '客户号',
          minWidth: 150
        },
        {
          prop: 'name',
          label: '客户姓名'
          // sortable: true
        },
        {
          prop: 'createTime',
          label: '加入日期'
        },
        {
          prop: 'operate',
          label: '操作',
          slot: true
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
      data.useCaseAchieveList = this.addInfo.add.map(n => {
        return {
          name: n.name,
          customerAccount: n.customerAccount,
          category: this.category
        }
      })
      return data
    }
  },
  watch: {

  },
  created() {
    this.search()
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
        customerAccount: this.filterForm.customerAccount,
        startDate: this.filterForm.dateRange ? this.filterForm.dateRange[0] : null,
        endDate: this.filterForm.dateRange ? this.filterForm.dateRange[1] : null
      }
      // this.searchForm = JSON.parse(JSON.stringify(this.filterForm))
      this.getList(1)
    },
    addNewItem() {
      this.addInfo.add.push({
        customerAccount: '',
        name: ''
      })
    },
    delAddItem(i) {
      this.addInfo.add.splice(i, 1)
      this.resetAddOpt()
    },
    resetAddOpt() {
      const temp = []
      this.addInfo.add.forEach((n, i) => {
        n.customerAccount && temp.push(n.customerAccount)
      })
    },
    handleAddList() {
      this.showDialog = true
    },
    cancelAddList() {
      this.$refs['regFormRef'].resetFields()
      this.showDialog = false
    },
    ensureAddList() {
      this.$refs['regFormRef'].validate((valid) => {
        if (valid) {
          addCustomerToBlackList(this.getData.useCaseAchieveList).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
              this.showDialog = false
              this.$refs['regFormRef'].resetFields()
              this.resetAll()
            }
          })
        }
      })
    },
    handleFileChange(file) {
      this.file = file.raw
    },
    resetFile() {
      this.file = ''
      this.$refs.uploadRef.clearFiles()
    },
    handleUploadFileAll(file, type) {
      const index = this.file.name.lastIndexOf('.')
      const suffix = this.file.name.substr(index + 1)
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
        formData.append('category', this.category)
        formData.append('updateType', type)

        this.uploading = true
        Notification.closeAll()
        batchUploadFile(formData).then(res => {
          this.uploading = false
          if (res.data.length) {
            this.$notify({
              title: '提示',
              message: (res.data).join('<br/>'),
              dangerouslyUseHTMLString: true,
              type: 'warning',
              duration: 0
            })
          } else {
            this.$message({
              message: '上传成功',
              type: 'success',
              duration: '3000'
            })
          }
          this.resetAll()
        }).catch(() => {
          this.uploading = false
          this.resetFile()
        })
      }
    },
    // 下载模版
    download() {
      window.open('/static/template.xlsx', '_blank')
    },
    downloadAll() {
      const data = {
        category: this.category
      }
      const url = process.env.VUE_APP_BASE_API + '/hateSale/downloadAll?' + qs.stringify(data)
      window.open(url, '_self')
    },
    handleDelete(row) {
      this.$confirm(`是否确认删除客户（${row.name}）？`)
        .then(() => {
          deleteHateMarketingListById({ hateSaleId: row.id }).then(res => {
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
        .catch(() => { })
    },
    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        category: this.category
      }, this.searchForm)
      this.filterForm = {
        name: this.searchForm.name,
        customerAccount: this.searchForm.customerAccount,
        dateRange: this.searchForm.startDate && this.searchForm.endDate ? [this.searchForm.startDate, this.searchForm.endDate] : []
      }
      // this.filterForm = JSON.parse(JSON.stringify(this.searchForm))
      this.loading = true
      getHateMarketingList(data).then(res => {
        this.tableData = res.data.resultList
        this.total = res.pagination.totalItemCount
        this.loading = false
      }).catch(() => {
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
  .target-form-item {
    width: 600px;
    .target-item {
      // display: flex;
      // position: relative;

      .delete {
        color: $red;
        display: inline-block;
        width: 20px;
        cursor: pointer;
        height: 32px;
        margin-left: 10px;
        font-size: 18px;
        line-height: 32px;
        position: absolute;
        right: -30px;
        top: 0;
        &:hover {
          opacity: 0.8;
        }
      }
    }
    .add {
      width: 100%;
      border-style: dashed;
    }
  }
}
</style>
