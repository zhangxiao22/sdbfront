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
          <el-form v-show="fileId"
                   ref="form"
                   :rules="rules"
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
            <el-divider />

            <el-form-item>
              <div slot="label">
                <Info content="客群先后顺序决定客群优先级（客群标签可拖拽排序）" />
                分群：
              </div>
              <el-button icon="el-icon-plus"
                         type="primary"
                         @click="addTab">
                添加客群
              </el-button>

            </el-form-item>
            <el-tabs v-show="labelTabs.length"
                     id="group-tabs"
                     v-model="labelIndex"
                     type="card"
                     @tab-remove="removeTab">

              <el-tab-pane v-for="item of labelTabs"
                           :key="item.name"
                           :closable="item.closable"
                           :label="item.title"
                           :name="item.name">
                <el-form-item required
                              label="群组名称：">
                  <el-input v-model="item.title"
                            style="width:300px"
                            :disabled="!item.closable"
                            placeholder="请输入群组名称" />
                </el-form-item>
                <el-form-item label="群组描述：">
                  <el-input v-model="item.desc"
                            style="width:300px"
                            type="textarea"
                            :disabled="!item.closable"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入群组描述" />
                </el-form-item>
                <Group v-if="item.closable"
                       ref="groupRef"
                       :origin-data="originData">
                  <template slot="button">
                    <el-button icon="el-icon-thumb"
                               @click="predict">
                      预估人数
                    </el-button>
                  </template>
                </Group>
                <el-form-item label="客户人数：">{{ item.people === '' ? '' : parseInt(item.people).toLocaleString() }}</el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form>
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
import Group from './Group'
import Sortable from 'sortablejs'
import { getCustomerLabel, uploadFile, getLabelList, getPeopleCount, saveGroup } from '@/api/api'
import { getToken } from '@/utils/auth'

export default {
  name: 'CustomerGroups',
  components: {
    Info, Group
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
      labelTabs: [
        //   {
        //   title: '其他群组',
        //   desc: '该群组为未被分入任何客群的客户集合，默认为全部，不可修改或删除。',
        //   name: '1',
        //   closable: false,
        //   people: ''
        // }
      ],
      // 值
      labelIndex: '0',
      // 用于计数 累加
      labelTabsCounts: 0,
      rules: {

      },
      paramOpt: [],
      originData: []
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
    this.tabDrop()
  },
  created() {
    this.getParamOpt()
    // this.getRuleList()
  },
  methods: {
    validateAndNext() {
      const data = {
        baseId: this.id,
        loadType: 1,
        fileId: this.fileId,
        supplyIdList: this.paramValue,
        groupSaveCriteriaList: this.labelTabs.map((n, i) => {
          const value = this.$refs.groupRef[i].getVal()
          const ruleList = this.transformData(value)
          return {
            name: n.title,
            groupDesc: n.desc,
            ruleList,
            isRaw: false
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
      // this.$refs.uploadRef.submit()
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
        uploadFile(formData).then(res => {
          // console.log(res)
          this.fileId = res.data.fileId
          this.fileName = res.data.fileName
          this.customerCount = res.data.recordNum
          this.updateTime = res.data.uploadTime
          this.getRuleList()
        }).catch(() => {
          this.resetFile()
        })
      }
    },

    getParamOpt() {
      getLabelList().then(res => {
        this.paramOpt = res.data.slice(0, 10).map((n) => {
          return {
            value: n.id,
            label: n.name
          }
        })
      })
    },

    // 获取规则列表
    getRuleList() {
      const data = {
        baseId: this.id
      }
      getCustomerLabel(data).then(res => {
        this.originData = res.data
      }).catah(() => { })
    },
    transformData(data) {
      return data.map(item => {
        const type = item.type
        let contentWithRelation
        if (type === 5) {
          contentWithRelation = [
            {
              content: item.conditionValue.startDate,
              tagRelation: 3
            },
            {
              content: item.conditionValue.endDate,
              tagRelation: 5
            }
          ]
        } else if (type === 1) {
          contentWithRelation = [
            {
              content: item.conditionValue.toFixed(item.precision),
              tagRelation: item.compare || null
            }
          ]
        } else {
          contentWithRelation = [
            {
              content: item.conditionValue,
              tagRelation: item.compare || null
            }
          ]
        }
        return {
          tagId: item.conditionSelect,
          contentWithRelation,
          combineRelation: item.andOrText === '且' ? 1 : 2
        }
      })
    },
    // 预估人数
    predict() {
      let val = this.$refs.groupRef[this.groupId].getVal()
      val = this.transformData(val)
      const data = {
        baseId: this.id,
        searchRuleList: val
      }
      getPeopleCount(data).then(res => {
        this.labelTabs[this.groupId].people = res.data.count
      })
    },
    // tab拖拽
    tabDrop() {
      const el = document.querySelector('#group-tabs .el-tabs__nav')
      // console.log(el)
      const _this = this
      var sortable = Sortable.create(el, {
        // filter: '#tab-1',
        onEnd({ newIndex, oldIndex }) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          const currRow = _this.labelTabs.splice(oldIndex, 1)[0] // 鼠标拖拽当前的el-tabs-pane
          _this.labelTabs.splice(newIndex, 0, currRow) // tableData 是存放所以el-tabs-pane的数组
        }
      })
    },
    addTab() {
      const newTabName = ++this.labelTabsCounts + ''
      this.labelTabs.push({
        title: '新群组' + newTabName,
        desc: '',
        name: newTabName,
        closable: true,
        people: ''
      })
      this.labelIndex = newTabName
    },
    removeTab(targetName) {
      const tabs = this.labelTabs
      let activeName = this.labelIndex
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }

      this.labelIndex = activeName
      this.labelTabs = tabs.filter(tab => tab.name !== targetName)
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
    .reg-form {
      // width: 800px;
      // margin: 10px auto 0;
    }
    ::v-deep .sortable-drag {
      box-shadow: 0 0 1px 1px rgba(34, 65, 145, 0.1) inset;
    }
  }
}
</style>
