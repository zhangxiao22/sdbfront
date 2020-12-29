<template>
  <div v-loading="mainLoading"
       class="container">
    <el-form ref="modelFormRef"
             :model="{modelForm}"
             label-width="110px">
      <el-form-item class="shun-label"
                    prop="modelForm"
                    :rules="[{
                      required: true, message: '请选模型', type: 'array'
                    }]">
        <div slot="label">
          <Info content="请选择模型分群" />
          添加模型：
        </div>
        <el-button icon="el-icon-plus"
                   class="add"
                   @click="addModel()">
          选择模型
        </el-button>
      </el-form-item>
    </el-form>
    <div v-show="modelForm && modelForm.length"
         class="ploy-card">
      <el-table :data="modelForm"
                border
                style="width: 100%;margin-bottom:18px;">
        <el-table-column prop="modelName"
                         width="200"
                         show-overflow-tooltip
                         label="模型名称" />
        <el-table-column prop="modelId"
                         :min-width="200"
                         label="模型ID" />
        <el-table-column prop="modelDsc"
                         :min-width="200"
                         label="模型描述" />
        <el-table-column label="操作"
                         width="100">
          <template slot-scope="scope">
            <el-popconfirm title="确定删除吗？"
                           @onConfirm="deleteModel(modelForm,scope.$index)">
              <el-button slot="reference"
                         type="text"
                         style="color:#f56c6c;"
                         size="small">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 模型 -->
    <ShunDrawer title="选择模型"
                :show.sync="showModel"
                @submit="submitModel()">
      <template v-slot:container>
        <model ref="modelRef"
               :show-selection="true" />
      </template>
    </ShunDrawer>
    <el-form ref="form"
             :model="{labelTabs}"
             label-width="100px"
             class="form">
      <el-form-item class="shun-label"
                    prop="labelTabs"
                    :rules="[{
                      required: true, message: '请分客群', type: 'array'
                    }]">
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
        <el-tab-pane v-for="(item, ti) of labelTabs"
                     :key="item.name"
                     :closable="item.closable"
                     :label="item.title"
                     :name="item.name">
          <el-form-item :prop="'labelTabs.' + ti + '.title'"
                        :rules="[{
                          required: true, message: '请填写客群名称', trigger:'blur'
                        }]"
                        label="客群名称：">
            <el-input v-model.trim="item.title"
                      style="width:300px"
                      :disabled="!item.closable"
                      placeholder="请输入客群名称" />
          </el-form-item>
          <el-form-item label="客群描述：">
            <el-input v-model.trim="item.desc"
                      style="width:300px"
                      type="textarea"
                      :disabled="!item.closable"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入客群描述" />
          </el-form-item>
          <!-- {{ labelTabs }} -->
          <Group v-if="item.closable"
                 ref="groupRuleRef"
                 required
                 :condition="item.condition"
                 :rule-opt="ruleOpt"
                 :origin-data="originData"
                 :total-group-length="item.condition.length"
                 :button-loading="groupButtonLoading"
                 @check="checkGroup(item, ti)" />
          <el-form-item label="客户人数：">{{ item.people === '' ? '' : parseInt(item.people).toLocaleString() }}</el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

  </div>
</template>

<script>
import ShunDrawer from '@/components/ShunDrawer'
import Model from '@/views/model/index'
import { Message } from 'element-ui'
import Info from '@/components/Info'
import Group from './Group'
import bus from '../bus'
import Sortable from 'sortablejs'
import { getPeopleCount, saveGroup, getGroup, getCustomerLabel } from '@/api/api'
import { valid } from 'mockjs'
const _ = require('lodash')

export default {
  name: 'WhiteList',
  components: {
    Group,
    ShunDrawer,
    Model,
    Info
  },
  data() {
    return {
      modelForm: [],
      showModel: false,
      beforeCondition: [],
      groupButtonLoading: false,
      mainLoading: false,
      ruleOpt: [],
      originData: [],
      valDetail: [],
      totalPeople: '',
      fileId: null,
      labelTabs: [
      ],
      // 值
      labelIndex: '0',
      people: '0',
      // 用于计数 累加
      labelTabsCounts: 0,
      supplyIdList: []
    }
  },
  computed: {
    id() {
      return +this.$route.query.id
    }
  },
  watch: {
  },
  mounted() {
    this.tabDrop()
  },
  created() {
  },
  methods: {
    init(data) {
      this.getRuleOpt().then(() => {
        if (data.abstractDetail.lodeType?.value === 2) {
          this.render(data)
        }
      })
    },
    reset() {
      this.labelTabsCounts = 0
      this.getDetail()
    },
    getAllData(totoalDetail, valDetail) {
      let vals = []
      this.beforeCondition = []
      for (let i = 0; i < totoalDetail.length; i++) {
        this.originData.find((n) => {
          if (n.id === totoalDetail[i].tagId) {
            vals = [n.tagCtgryNm, n.tagPrimClNm, n.tagScdClNm, totoalDetail[i].tagId]
            return true
          }
        })
        this.beforeCondition.splice(i, 1, this.setOpt(totoalDetail[i], vals, valDetail[i]))
      }
    },
    setOpt(optValue, conditionSelectVal, valDetail) {
      if (!optValue) {
        return {
          conditionSelect: [],
          andOrText: {
            value: 1,
            label: '且'
          }
        }
      } else {
        const item = this.originData.find((n) => {
          return n.id === optValue.tagId
        })
        let conditionValue
        let conditionCompare
        if (item.type === '数值型') {
          conditionValue = {
            numberVal: valDetail[0].content
          }
          conditionCompare = item.relations
        }
        if (item.type === '字符串型') {
          conditionValue = {
            stringVal: valDetail[0].content
          }
          conditionCompare = item.relations
        }
        if (item.type === '枚举型') {
          conditionValue = {
            selectVal: valDetail[0].content.value
          }
          conditionCompare = [
            {
              value: 1,
              label: '是'
            }
          ]
        }
        if (item.type === '日期型') {
          conditionValue = {
            dateVal: valDetail[0].content
          }
          conditionCompare = item.relations
        }
        if (item.type === '布尔型') {
          conditionValue = {
            booleanVal: +valDetail[0].content
          }
          conditionCompare = [{
            value: 1,
            label: '请选择'
          }]
        }
        const data = {
          // 规则选中选项的值
          conditionSelect: conditionSelectVal,
          // 规则选中的名称
          conditionLabel: item.name,
          // 类型
          type: item.type,
          // 比较符号的选项
          compareOpt: conditionCompare,
          // 比较符号的值
          compare: valDetail[0].compare.value,
          // 枚举型可选项
          selectOpt: item.enumCandidateList,
          // 布尔型可选项
          booleanOpt: item.booleanOpt,
          // 数字型-单位
          unit: item.unit,
          // 规则的值
          conditionValue,
          // andOrText: '且'
          andOrText: this.englishAndOr(optValue.combineRelation)
          // andOrText: optValue.combineRelation
        }
        return data
      }
    },
    // 将andOr转换为中文
    englishAndOr(value) {
      if (value) {
        return value.value === 1 ? { value: 1, label: '且' } : { value: 2, label: '或' }
      } else return null
    },
    render(data) {
      this.labelTabs = data.infoDetailList.map((n) => {
        return {
          title: n.name,
          name: ++this.labelTabsCounts + '',
          desc: n.desc,
          people: n.count,
          closable: true,
          condition: [],
          // 传递客群规则ID以及且或符号
          groupDetail: n.tagList.map((m) => {
            return { tagId: m.tagId, combineRelation: m.combineRelation }
          }),
          // 传递客群规则比较符号和值
          valDetail: n.tagList.map((m) => {
            return m.tagContentUnitVOList.map((k) => {
              return { content: k.content, compare: k.tagRelation }
            })
          })
        }
      })
      for (let i = 0; i < this.labelTabs.length; i++) {
        this.getAllData(this.labelTabs[i].groupDetail, this.labelTabs[i].valDetail)
        this.labelTabs[i].condition = this.beforeCondition
      }
      this.labelIndex = '1'
    },
    // 获取规则信息
    getDetail() {
      this.mainLoading = true
      getGroup({ baseId: this.id }).then(res => {
        if (res.data.abstractDetail.lodeType?.value === 2) {
          this.render(res.data)
        } else {
          this.labelTabs = []
        }
      }).finally(() => {
        this.mainLoading = false
      })
    },
    getOriginOptData() {
      return new Promise((resolve, reject) => {
        getCustomerLabel().then(res => {
          this.originData = res.data.map(n => {
            return Object.assign({}, n, {
              booleanOpt: [{
                label: '是',
                value: 1
              }, {
                label: '否',
                value: 0
              }]
            })
          })
          this.originOptData = res.data.map(n => {
            return {
              first: n.tagCtgryNm,
              second: n.tagPrimClNm,
              third: n.tagScdClNm,
              fourth: n.name,
              id: n.id
            }
          })
          resolve()
        })
      })
    },
    // 整理数据
    getList() {
      var tempList = []
      this.originOptData.forEach((n, i) => {
        tempList.push({
          value: n.first,
          pid: { Fid: '', Cid: n.first, FFid: '', FFFid: '' },
          label: n.first
        }, {
          value: n.second,
          pid: { Fid: n.first, Cid: n.second, FFid: '', FFFid: '' },
          label: n.second
        }, {
          value: n.third,
          pid: { Fid: n.second, Cid: n.third, FFid: n.first, FFFid: '' },
          label: n.third
        }, {
          value: n.id,
          pid: { Fid: n.third, Cid: n.fourth, FFid: n.second, FFFid: n.first },
          label: n.fourth
        })
      })
      return tempList
    },
    // 列表转tree
    listToTree(oldArr) {
      oldArr.forEach(element => {
        const pid = element.pid
        if (pid.Fid !== '') {
          oldArr.forEach(ele => {
            if (ele.value === pid.Fid && ele.pid.Fid === pid.FFid && ele.pid.FFid === pid.FFFid) { // 当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
              if (!ele.children) {
                ele.children = []
              }
              ele.children.push(element)
            }
          })
        }
      })
      oldArr = oldArr.filter(ele => ele.pid.Fid === '') // 这一步是过滤，按树展开，将多余的数组剔除；
      return oldArr
    },
    getRuleOpt() {
      return new Promise((resolve, reject) => {
        this.getOriginOptData().then(() => {
          this.listChange = _.uniqWith(
            this.getList(),
            _.isEqual
          )
          this.listChangeAgain = _.uniqBy(
            this.listChange, 'pid'
          )
          this.ruleOpt = this.listToTree(this.listChangeAgain)
          resolve()
        })
        // todo
        // console.log(this.ruleOpt)
      })
    },
    transferDataByType(val) {
      const data = val.map((n) => {
        return {
          tagId: n.conditionSelect[3],
          contentWithRelation: [{ content: JSON.stringify(n.conditionValue.numberVal) || n.conditionValue.stringVal || n.conditionValue.selectVal || n.conditionValue.dateVal || n.conditionValue.booleanVal || 0, tagRelation: n.compare }],
          combineRelation: n.andOrText.value
        }
      })
      return data
    },
    checkGroup(item, ti) {
      this.groupButtonLoading = true
      getPeopleCount({ baseId: this.id, rawSearchRuleList: this.transferDataByType(item.condition) }).then(res => {
        this.labelTabs[ti].people = res.data.count
      }).finally(() => {
        this.groupButtonLoading = false
      })
    },

    validateAndNext() {
      const fn = () => {
        const data = {
          baseId: this.id,
          loadType: 2,
          fileId: this.fileId,
          supplyIdList: this.supplyIdList,
          userId: 1,
          subBranchId: 1000,
          rawGroup: {
            count: this.totalPeople
          },
          groupSaveCriteriaList: this.labelTabs.map((n, i) => {
            return {
              name: n.title,
              count: n.people,
              desc: n.desc,
              tagList: this.transferDataByType(n.condition)
            }
          })
        }
        return new Promise((resolve, reject) => {
          if (Math.max(...this.labelTabs.map(n => { return n.condition.length })) < 6) {
            saveGroup(data).then(res => {
              if (res.code === 200) {
                resolve()
              } else {
                reject()
              }
            }).catch(() => {
              reject()
            })
          } else {
            this.$message({
              message: '整体和分群规则总和不能超过5个',
              type: 'warning',
              duration: '3000'
            })
            reject()
            return
          }
        })
      }
      return new Promise((resolve, reject) => {
        const promiseArray = [
          // 校验模型
          this.$refs.modelFormRef.validate(),
          // 校验客群
          this.$refs.form.validate(),
          // 校验客群中的规则
          ...this.labelTabs.map((n, i) => {
            return this.$refs.groupRuleRef[i].$form.validate()
          })
        ]
        Promise.allSettled(promiseArray).then((result) => {
          if (result.every(n => n.status === 'fulfilled')) {
            fn().then(() => {
              resolve()
            }).catch(() => {
              reject()
            })
          } else {
            const index = result.slice(2).findIndex(r => r.status === 'rejected')
            this.labelIndex = index + 1 + ''
            reject()
          }
        }).catch(() => {
          reject()
        })
      })
    },
    // tab拖拽
    tabDrop() {
      const el = document.querySelector('#group-tabs .el-tabs__nav')
      const _this = this
      var sortable = Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          const currRow = _this.labelTabs.splice(oldIndex, 1)[0] // 鼠标拖拽当前的el-tabs-pane
          _this.labelTabs.splice(newIndex, 0, currRow) // tableData 是存放所以el-tabs-pane的数组
        }
      })
    },
    addTab() {
      const newTabName = ++this.labelTabsCounts + ''
      this.labelTabs.push({
        title: '新客群' + newTabName,
        desc: '',
        name: newTabName,
        closable: true,
        // 规则
        condition: [],
        people: ''
      })
      this.labelIndex = newTabName
      // 校验
      this.$refs.form.validateField('labelTabs')
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

      // 校验
      this.$nextTick(() => {
        this.$refs.form.validateField('labelTabs')
      })
    },
    // 选择模型
    addModel() {
      console.log(this.modelForm)
      this.showModel = true
      this.$nextTick(() => {
        if (this.modelForm.length) {
          this.$refs.modelRef.parentRef.setSelection(this.modelForm)
        } else {
          this.$refs.modelRef.reset()
          this.$refs.modelRef.parentRef.setSelection(this.modelForm)
        }
      })
    },
    // 选择模型-确定
    submitModel() {
      const val = this.$refs.modelRef.parentRef.getVal()
      if (val.length) {
        this.showModel = false
        this.modelForm = val
        console.log(this.modelForm)
        // 校验
        this.$nextTick(() => {
          this.$refs.modelFormRef.validateField('modelForm')
        })
      } else {
        Message({
          message: '请选择至少一项',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    // 删除权益
    deleteModel(item, i) {
      item.splice(i, 1)
      // 校验
      this.$nextTick(() => {
        this.$refs.modelFormRef.validateField('modelForm')
      })
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  overflow: auto;
  .add {
    border-style: dashed;
  }
}
</style>
