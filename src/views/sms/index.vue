<template>
  <div class="container">
    <shun-table ref="table"
                title="短信库"
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
                      :upload-method="uploadSmsFile"
                      @afterUploadSuccess="resetAll" />
        <el-button class="button"
                   type="primary"
                   icon="el-icon-plus"
                   plain
                   @click="handleAdd">
          新增短信
        </el-button>
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
                 class="filter-container"
                 @submit.native.prevent>
          <el-form-item label="短信内容："
                        prop="content">
            <el-input v-model.trim="filterForm.content"
                      style="width:300px"
                      placeholder="请输入短信内容"
                      clearable
                      @keyup.enter.native="search" />
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
      <template v-slot:parameterDescriptionSlot="props">
        <pre>{{ props.row.parameterDescription }}</pre>
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
    <el-dialog :title="isEdit ? '编辑短信' : '新增短信'"
               :visible.sync="showDialog"
               append-to-body
               @closed="handleClosed">
      <el-form ref="formRef"
               label-width="110px"
               :model="addInfo">
        <el-form-item label="短信内容："
                      prop="content"
                      :rules="[{
                        required: true, message: '请输入短信内容', trigger: 'blur'
                      }]">
          <el-input v-model.trim="addInfo.content"
                    style="width:90%;"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    placeholder="请输入短信内容" />
        </el-form-item>
        <el-form-item label="短信描述："
                      prop="description">
          <el-input v-model.trim="addInfo.description"
                    style="width:90%;"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    placeholder="请输入短信描述" />
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoading"
                   @click="ensure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getSmsList, uploadSmsFile, delSms, editSms, addSms } from '@/api/api'
import UploadButton from '@/components/UploadButton'
import { DESCRIPTION } from '@/utils'

export default {
  name: 'Sms',
  components: {
    ShunTable,
    UploadButton
  },
  props: {
    showSelection: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: true
    },
    //
    commonTemplate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDialog: false,
      isEdit: false,
      buttonLoading: false,
      DESCRIPTION,
      uploadSmsFile,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: {
        content: ''
      },
      searchForm: {},
      addInfo: {
        id: '',
        content: '',
        description: ''
      },
      tableColumnList: [
        // {
        //   prop: 'id',
        //   label: 'ID',
        //   minWidth: 50
        // },
        {
          prop: 'content',
          label: '短信内容',
          minWidth: 300,
          notShowOverflowTooltip: true
        },
        {
          prop: 'description',
          label: '短信描述',
          minWidth: 200
        },
        {
          prop: 'businessScenario',
          label: '业务场景',
          minWidth: 200
        },
        {
          prop: 'parameterDescription',
          label: '参数说明',
          minWidth: 200,
          slot: true,
          notShowOverflowTooltip: true
        },
        {
          prop: 'operate',
          label: '操作',
          width: 120,
          fixed: 'right',
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
    }
  },
  watch: {},
  created() {
    this.search()
  },
  methods: {
    handleClose() {
      this.showDialog = false
    },
    handleClosed() {
      this.$refs.formRef.resetFields()
      this.addInfo.id = ''
      this.isEdit = false
    },
    ensure() {
      console.log(this.addInfo)
      this.$refs.formRef.validate(valid => {
        if (valid) {
          const fn = this.isEdit ? editSms : addSms
          this.buttonLoading = true
          fn(this.addInfo).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: '3000'
              })
              this.handleClose()
              this.search()
            }
          }).finally(() => {
            this.buttonLoading = false
          })
        }
      })
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
          content: row.content,
          description: row.description
        }
      })
    },
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

    getList(pageNo) {
      this.currentPage = pageNo || this.currentPage
      const data = Object.assign(
        {
          pageNo: this.currentPage,
          pageSize: this.pageSize
        },
        this.searchForm
      )
      this.loading = true
      getSmsList(data)
        .then(res => {
          this.tableData = this.commonTemplate
            ? res.data.resultList.filter(n => n.commonTemplate === true)
            : res.data.resultList
          this.total = res.pagination.totalItemCount
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 下载模版
    downloadModel() {
      window.open('/static/短信库模板.xlsx', '_blank')
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
            delSms(data).then(res => {
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
          message: '请选择短信',
          type: 'warning',
          duration: '3000'
        })
      }
    }
  }
}
</script>

