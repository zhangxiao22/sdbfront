<template>
  <div v-loading="mainLoading"
       class="container">
    <el-form>
      <Group ref="totalRuleRef"
             :condition="totalCondition"
             :rule-opt="ruleOpt"
             :origin-data="originData"
             :button-loading="totalButtonLoading"
             :total-group-length="totalCondition.length + Math.max(0, ...labelTabs.map(n => {return n.condition.length}))"
             required
             :min-length="0"
             label="整体规则"
             @check="checkAll" />
      <!-- {{ Math.max(0,...labelTabs.map(n => {return n.condition.length})) }} -->
      <el-form-item label="客户人数：">{{ totalPeople }}</el-form-item>
    </el-form>
    <el-form ref="modelFormRef"
             :model="modelForm"
             label-width="100px"
             class="modelForm">
      <Info content="选择整体规则后进行模型分群" />
      添加模型：
      <el-button icon="el-icon-plus"
                 type="primary"
                 @click="addModel()">
        选择模型
      </el-button>
    </el-form>
    <div v-show="modelForm.model && modelForm.model.length"
         class="ploy-card">
      <el-table :data="modelForm.model"
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
        <el-table-column fixed="right"
                         label="操作"
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
    <!-- 权益 -->
    <ShunDrawer title="选择模型"
                :show.sync="showModel"
                @submit="submitModel()">
      <template v-slot:container>
        <model ref="modelRef"
               :show-selection="true" />
      </template>
    </ShunDrawer>

  </div>
</template>

<script>
import Info from '@/components/Info'
import Group from './Group'
import bus from '../bus'
import Sortable from 'sortablejs'
import ShunDrawer from '@/components/ShunDrawer'
import Model from '@/views/model/index'
import { Message } from 'element-ui'
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
      modelForm: {
      },
      showModel: false,
      beforeCondition: [],
      totalButtonLoading: false,
      groupButtonLoading: false,
      mainLoading: false,
      ruleOpt: [],
      originData: [],
      totalDetail: [],
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
      totalCondition: [],
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
      // 传递整体规则ID以及且或符号
      this.totalDetail = data.abstractDetail.tagList.map(n => {
        return { tagId: n.tagId, combineRelation: n.combineRelation }
      })
      // 传递整体规则比较符号和值
      this.valDetail = data.abstractDetail.tagList.map(n => {
        return n.tagContentUnitVOList.map((m) => {
          return { content: m.content, compare: m.tagRelation }
        })
      })
      this.getAllData(this.totalDetail, this.valDetail)
      this.totalCondition = this.beforeCondition
    },
    // 获取规则信息
    getDetail() {
      this.mainLoading = true
      getGroup({ baseId: this.id }).then(res => {
        if (res.data.abstractDetail.lodeType?.value === 2) {
          this.render(res.data)
        } else {
          this.labelTabs = []
          this.totalCondition = []
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
    checkAll(val) {
      this.totalButtonLoading = true
      getPeopleCount({ baseId: this.id, rawSearchRuleList: this.transferDataByType(val) }).then(res => {
        this.totalPeople = res.data.count
      }).finally(() => {
        this.totalButtonLoading = false
      })
    },
    checkGroup(item, ti) {
      this.groupButtonLoading = true
      getPeopleCount({ baseId: this.id, rawSearchRuleList: this.transferDataByType(item.condition), searchRuleList: this.transferDataByType(this.totalCondition) }).then(res => {
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
            count: this.totalPeople,
            tagList: this.transferDataByType(this.totalCondition)
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
          if (Math.max(...this.labelTabs.map(n => { return n.condition.length })) + this.totalCondition.length < 6) {
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
          // 校验整体规则
          this.$refs.totalRuleRef.$form.validate(),
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
    // 选择模型
    addModel() {
      console.log(this.modelForm.model)

      this.showModel = true
      this.$nextTick(() => {
        // this.$refs.modelRef.reset()
        // this.$refs.modelRef.parentRef.setSelection(this.modelForm.model)
      })
    },
    // 选择模型-确定
    submitModel() {
      const val = this.$refs.modelRef.parentRef.getVal()
      if (val.length) {
        this.showModel = false
        this.modelForm.model = val
        console.log(this.modelForm.model)
        // this.group[this.groupIndex].ployTabs[this.ployIndex].interest = val
        // 校验
        // this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.interest`)
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
      item.model.splice(i, 1)
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  overflow: auto;
}
</style>
