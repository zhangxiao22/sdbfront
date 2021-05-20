<template>
  <div v-loading="mainLoading"
       class="container">
    <div class="whitelist">
      <el-upload ref="uploadRef"
                 class="upload"
                 drag
                 :on-change="handleFileChange"
                 :show-file-list="false"
                 :http-request="uploadFile"
                 :accept="accept.map(n => `.${n}`).join(',')"
                 action="">
        <svg-icon class="el-icon-upload"
                  icon-class="upload-file" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip"
             class="el-upload__tip">
          请上传xls/xlsx文件
          <el-link type="primary"
                   @click="download">模版下载</el-link>
        </div>
      </el-upload>
    </div>
    <div v-show="fileId">
      <el-form ref="form"
               label-width="110px"
               class="form">
        <el-form-item label="文件名称：">
          {{ fileName }}
        </el-form-item>
        <el-form-item label="上传时间：">
          {{ updateTime }}
        </el-form-item>
        <el-form-item label="客户数量：">
          {{ customerCount | formatMoney }}
        </el-form-item>
        <el-form-item label="对照组人数：">
          {{ compareCount | formatMoney }}
        </el-form-item>
        <el-form-item>
          <div slot="label">
            <Info content="可选择多个维度" />
            维度补充：
          </div>
          <div class="param-box">
            <el-select v-model="paramValue"
                       style="max-width:800px;width:100%;"
                       multiple
                       :multiple-limit="10"
                       filterable
                       placeholder="可输入搜索匹配项">
              <el-option v-for="item in paramOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>
            <el-button type="text"
                       class="text-button"
                       @click="clickChooseAll">{{ paramValue.length === paramOpt.length ? '取消全选' : '全选' }}</el-button>
          </div>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table :data="tableData"
                  size="medium"
                  style="width:100%;"
                  class="whitelist-table"
                  @cell-mouse-enter="handleMouseEnter"
                  @cell-mouse-leave="handleMouseLeave">
          <el-table-column prop="name"
                           label="群组名称"
                           width="180" />
          <el-table-column prop="count"
                           label="人数"
                           width="180" />
          <el-table-column label="备注">
            <div slot-scope="scope"
                 class="desc">
              <span>{{ scope.row.desc }}</span>
              <el-popover v-model="scope.row.isEdit"
                          placement="top"
                          width="300">
                <el-input v-model.trim="scope.row._desc"
                          type="textarea"
                          :rows="5"
                          style="margin-bottom:10px;"
                          placeholder="请输入内容" />
                <div style="text-align: right; margin: 0">
                  <el-button size="mini"
                             type="text"
                             @click="scope.row.isEdit = false">取消</el-button>
                  <el-button type="primary"
                             size="mini"
                             @click="scope.row.desc = scope.row._desc;scope.row.isEdit = false">确定</el-button>
                </div>
                <div v-show="scope.row.isHover"
                     slot="reference"
                     class="table-edit touch-tap"
                     @click="scope.row._desc = scope.row.desc">
                  <i class="el-icon-edit" />
                </div>
              </el-popover>
            </div>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Info from '@/components/Info'
import bus from '../bus'
// import Group from './Group'
import Sortable from 'sortablejs'
import { getCustomerLabel, uploadFile, getLabelList, getPeopleCount, saveGroup, getGroup } from '@/api/api'
import { Notification } from 'element-ui'

export default {
  name: 'WhiteList',
  components: {
    Info
  },
  data() {
    return {
      mainLoading: false,
      groupDetail: {},
      originFileId: null,
      fileId: null,
      accept: ['xls', 'xlsx'],
      file: '',
      // fileList: [],
      fileName: '',
      // 总数
      customerCount: '',
      // 对照组人数
      compareCount: '',
      // 实际人数
      realPeopleNum: '',
      updateTime: '',
      // 维度补充
      paramValue: [],
      tableData: [],
      paramOpt: []
    }
  },
  computed: {
    id() {
      return +this.$route.query.id
    }
  },
  watch: {
    fileId() {
      this.groupDetail.peopleNum = this.customerCount
      this.groupDetail.comparePeopleNum = this.compareCount
      this.groupDetail.realPeopleNum = this.realPeopleNum
      this.groupDetail.groupNum = this.tableData.length
      bus.$emit('setGroupDetail', this.groupDetail)
    },
    customerCount() {

    },
    tableData() {

    }
  },
  mounted() {
  },
  created() {
    // this.getParamOpt()
    // this.reset()
  },
  methods: {
    init(data) {
      // 获取维度补充options
      this.getParamOpt()
      this.render(data)
    },
    reset() {
      this.getDetail()
    },
    render(data) {
      const base = data.abstractDetail
      this.originFileId = base.fileId
      this.fileId = base.fileId
      this.fileName = base.fileName
      this.customerCount = base.recordNum
      this.updateTime = base.uploadTime
      this.paramValue = data.supplyDetailList.map(n => n.id)
      this.tableData = data.infoDetailList.map(n => {
        return Object.assign({}, n, {
          // desc: '',
          _desc: n.desc,
          isEdit: false,
          isHover: false
        })
      })
      this.realPeopleNum = 0
      data.infoDetailList.forEach(item => {
        this.realPeopleNum += item.count
      })
      this.compareCount = this.customerCount - this.realPeopleNum
    },
    // 获取详情
    getDetail() {
      this.mainLoading = true
      getGroup({ baseId: this.id }).then(res => {
        this.render(res.data)
      }).finally(() => {
        this.mainLoading = false
      })
    },

    validateAndNext() {
      const fn = () => {
        const data = {
          baseId: this.id,
          loadType: 1,
          fileId: this.fileId,
          supplyIdList: this.paramValue,
          groupSaveCriteriaList: this.tableData.map((n, i) => {
            return {
              id: n.id,
              name: n.name,
              count: n.count,
              desc: n.desc
            }
          })
        }
        return new Promise((resolve, reject) => {
          saveGroup(data).then(res => {
            if (res.code === 200) {
              resolve()
            } else {
              reject()
            }
          }).catch(() => {
            reject()
          })
        })
      }
      return new Promise((resolve, reject) => {
        if (!this.fileId) {
          this.$message({
            message: '请添加客群',
            type: 'error',
            duration: 5 * 1000
          })
          reject()
        } else if (this.originFileId && this.originFileId !== this.fileId) {
          this.$confirm('客群变化可能导致策略变化，是否继续？')
            .then(() => {
              fn().then(() => {
                resolve()
              }).catch(() => {
                reject()
              })
            })
            .catch(() => {
              reject()
            })
        } else {
          fn().then(() => {
            resolve()
          }).catch(() => {
            reject()
          })
        }
      })
    },
    clickChooseAll() {
      const flag = this.paramValue.length === this.paramOpt.length
      if (flag) {
        this.paramValue = []
      } else {
        this.paramValue = this.paramOpt.map(n => n.value)
      }
    },
    download() {
      window.open('/static/template.xlsx', '_self')
    },
    handleFileChange(file) {
      this.file = file.raw
    },
    resetFile() {
      this.file = ''
      this.$refs.uploadRef.clearFiles()
    },
    uploadFile() {
      const index = this.file.name.lastIndexOf('.')
      const suffix = this.file.name.substr(index + 1)
      // console.log(suffix)
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
        this.mainLoading = true
        uploadFile(formData).then(res => {
          if (res.code === 200) {
            this.fileId = res.data.fileId
            this.fileName = res.data.fileName
            this.customerCount = res.data.recordNum
            this.realPeopleNum = 0
            res.data.groupInfoWithCount.forEach(item => {
              this.realPeopleNum += item.count
            })
            this.compareCount = this.customerCount - this.realPeopleNum

            this.updateTime = res.data.uploadTime
            this.tableData = res.data.groupInfoWithCount.map((n) => {
              return Object.assign({}, n, {
                desc: '',
                _desc: '',
                isEdit: false,
                isHover: false
              })
            })
            this.mainLoading = false
            this.$message({
              message: '上传成功',
              type: 'success',
              duration: '3000'
            })
          } else {
            Notification.closeAll()
            this.$notify({
              title: '警告',
              message: res.msg,
              // dangerouslyUseHTMLString: true,
              type: 'warning',
              duration: 0
            })
          }
        }).catch(() => {
          this.resetFile()
          this.mainLoading = false
        })
      }
    },

    getParamOpt() {
      getLabelList().then(res => {
        this.paramOpt = res.data.map((n) => {
          return {
            value: n.id,
            label: n.name
          }
        })
      })
    },
    handleMouseEnter(row, column, cell, event) {
      // console.log(row)
      row.isHover = true
    },
    handleMouseLeave(row, column, cell, event) {
      // console.log(row)
      row.isHover = false
    },
    handleEdit(index, row) {

    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  padding: 5px 20px;
  .whitelist {
    .upload {
      width: 600px;
      margin: 0 auto;
      ::v-deep .el-upload-dragger {
        width: 600px;
      }
      .el-icon-upload {
        font-size: 58px;
      }
      .el-upload__tip {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .download {
          color: $blue;
          text-decoration: underline;
        }
      }
    }
  }
  .form {
    width: 600px;
    margin: 20px auto 0;
    .param-box {
      display: flex;
      .text-button {
        padding-left: 10px;
      }
    }
  }
  .table-container {
    width: 100%;
    margin: 20px 0;
    .whitelist-table {
      ::v-deep tr {
        height: 52px;
      }
      .desc {
        // display: flex;
        // align-items: center;
      }
      .table-edit {
        display: inline-block;
        cursor: pointer;
        margin-left: 10px;
        i {
          color: $blue;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
