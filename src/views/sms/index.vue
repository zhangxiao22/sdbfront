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
    </shun-table>
  </div>
</template>

<script>
import ShunTable from '@/components/ShunTable'
import { getSmsList, uploadSmsFile, delSms } from '@/api/api'
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
      tableColumnList: [
        {
          prop: 'id',
          label: 'ID',
          minWidth: 50
        },
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
      const data = Object.assign({
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }, this.searchForm)
      this.loading = true
      getSmsList(data).then(res => {
        this.tableData = this.commonTemplate ? res.data.resultList.filter(n => n.commonTemplate === true) : res.data.resultList
        this.total = res.pagination.totalItemCount
        this.loading = false
      }).catch(() => {
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

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
