<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="白名单上传"
                   name="1">
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
              请上传xls/xlsx/csv文件
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
                <Info content="维度不能超过10个" />
                维度补充：
              </div>
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
                    <el-input v-model="scope.row._desc"
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

      </el-tab-pane>
      <!-- <el-tab-pane label="CRM导入"
                   name="second">CRM导入</el-tab-pane>
      <el-tab-pane label="模型导入"
                   name="third">模型导入</el-tab-pane> -->

    </el-tabs>
  </div>
</template>

<script>
import Info from '@/components/Info'
// import Group from './Group'
import Sortable from 'sortablejs'
import { getCustomerLabel, uploadFile, getLabelList, getPeopleCount, saveGroup, getGroup } from '@/api/api'
import { getToken } from '@/utils/auth'

export default {
  name: 'CustomerGroups',
  components: {
    Info
  },
  data() {
    return {
      activeName: '1',
      originFileId: null,
      fileId: null,
      accept: ['xls', 'xlsx', 'csv'],
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
    },
    groupId() {
      return this.labelIndex - 1
    }
  },
  watch: {
    fileId() {
      this.$parent.groupDetail.peopleNum = this.customerCount
      this.$parent.groupDetail.comparePeopleNum = this.compareCount
      this.$parent.groupDetail.realPeopleNum = this.realPeopleNum
      this.$parent.groupDetail.groupNum = this.tableData.length
    },
    customerCount() {

    },
    tableData() {

    }
  },
  mounted() {
  },
  created() {
    this.getParamOpt()
    this.reset()
  },
  methods: {
    reset() {
      this.getDetail()
    },
    // 获取详情
    getDetail() {
      this.$parent.mainLoading = true
      getGroup({ baseId: this.id }).then(res => {
        this.$parent.mainLoading = false
        const base = res.data.abstractDetail
        this.originFileId = base.fileId
        this.fileId = base.fileId
        this.fileName = base.fileName
        this.customerCount = base.recordNum
        this.updateTime = base.uploadTime
        this.paramValue = res.data.supplyDetailList.map(n => n.id)
        this.tableData = res.data.infoDetailList.map(n => {
          return Object.assign({}, n, {
            // desc: '',
            _desc: n.desc,
            isEdit: false,
            isHover: false
          })
        })
        this.realPeopleNum = 0
        res.data.infoDetailList.forEach(item => {
          this.realPeopleNum += item.count
        })
        this.compareCount = base.recordNum - this.realPeopleNum
      }).catch(() => {
        this.$parent.mainLoading = false
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
          this.abc = '上传成功'
        }).then(() => {
          this.$notify({
            title: '提示',
            message: this.abc,
            dangerouslyUseHTMLString: true,
            // type: 'success',
            duration: 0
          })
        }).catch(() => {
          this.resetFile()
          this.$parent.mainLoading = false
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
