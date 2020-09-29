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
              只能上传xls/xlsx/cvs文件
              <el-link type="primary"
                       @click="download">模版下载</el-link>
            </div>
          </el-upload>
        </div>
        <el-form v-show="fileId"
                 ref="form"
                 label-width="110px"
                 class="reg-form">
          <el-form-item label="文件名称：">
            {{ fileName }}
          </el-form-item>
          <el-form-item label="客户数量：">
            {{ customerCount ? parseInt(customerCount).toLocaleString() : '' }}
          </el-form-item>
          <el-form-item label="上传时间：">
            {{ updateTime }}
          </el-form-item>
          <el-form-item>
            <div slot="label">
              <Info content="维度不能超过10个" />
              维度补充：
            </div>
            <el-select v-model="paramValue"
                       style="max-width:800px;width:100%;"
                       multiple
                       filterable
                       placeholder="可输入匹配项并搜索选择">
              <el-option v-for="item in paramOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value" />
            </el-select>

          </el-form-item>
          <div class="table-container">
            <el-table :data="tableData"
                      style="width:100%;"
                      class="table">
              <el-table-column prop="name"
                               label="群组名称"
                               width="180" />
              <el-table-column prop="count"
                               label="人数"
                               width="180" />
              <el-table-column label="备注">
                <div slot-scope="scope"
                     class="desc">
                  <template v-if="!scope.row.isEdit">
                    <div v-show="scope.row._desc.length"
                         style="margin-right:10px;">{{ scope.row._desc }}</div>
                    <el-button size="mini"
                               class="button"
                               icon="el-icon-edit"
                               @click="scope.row.isEdit=true">编辑</el-button>
                  </template>
                  <template v-else>
                    <el-input v-model="scope.row._desc"
                              type="textarea"
                              style="margin-right:10px;"
                              autosize
                              placeholder="请输入内容" />
                    <el-button size="mini"
                               class="button"
                               type="success"
                               icon="el-icon-check"
                               @click="scope.row.desc=scope.row._desc;scope.row.isEdit=false">确认</el-button>
                  </template>

                </div>
              </el-table-column>
            </el-table>
          </div>
        </el-form>

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
import Group from './Group'
import Sortable from 'sortablejs'
import { getCustomerLabel, uploadFile, getLabelList, getPeopleCount, saveGroup } from '@/api/api'
import { getToken } from '@/utils/auth'

export default {
  name: 'CustomerGroups',
  components: {
    Info
  },
  data() {
    return {
      //
      activeName: '1',
      fileId: null,
      accept: ['xls', 'xlsx', 'cvs'],
      file: '',
      // fileList: [],
      fileName: '',
      customerCount: '',
      updateTime: '',
      paramValue: '',
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
    // form: {
    //   handler(newVal, oldVal) {
    //     // console.log(newVal, '??')
    //     const data = {
    //       customerCount: 0
    //     }
    //     data.customerCount = newVal.customerCount
    //     console.log(data)
    //     this.$emit('renderSteps', data)
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  mounted() {
  },
  created() {
    this.getParamOpt()
    // this.tableData = [{ 'name': '娱乐需求客户', 'count': 283 }, { 'name': '教育需求客户', 'count': 276 }, { 'name': '公积金客群', 'count': 68 }, { 'name': '理财投资需求客户', 'count': 271 }, { 'name': '生活服务需求客户', 'count': 75 }, { 'name': '村居分红客群', 'count': 418 }].map((n) => {
    //   return Object.assign(n, { desc: '', _desc: '', isEdit: false })
    // })
  },
  methods: {
    validateAndNext() {
      const data = {
        baseId: this.id,
        loadType: 1,
        fileId: this.fileId,
        supplyIdList: this.paramValue,
        groupSaveCriteriaList: this.tableData.map((n, i) => {
          return {
            name: n.name,
            count: n.count,
            dec: n.desc
          }
        })
      }
      // console.log(data)
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
    },
    download() {
      window.open('/assets/template.xlsx', '_blank')
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
            return Object.assign(n, {
              desc: '',
              _desc: '',
              isEdit: false
            })
          })
          this.$parent.mainLoading = false
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
  .table-container {
    width: 100%;
    margin: 20px 0;
    .desc {
      display: flex;
      align-items: center;
    }
  }
}
</style>
