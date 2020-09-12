<template>
  <div class="ploy-container">
    <el-tabs v-model="groupName"
             :before-leave="beforeHandleGroupTabClick">
      <el-tab-pane v-for="(groupItem,gi) of group"
                   :key="gi"
                   :label="groupItem.name"
                   :name="gi+''">

        <el-form :ref="'form'+gi"
                 :model="group[gi]"
                 label-width="110px">
          <div class="top">
            <div class="left">当前群组人数：<b>{{ animatedNumber }}</b></div>
            <div>
              <el-button icon="el-icon-plus"
                         type="primary"
                         @click="addTab(gi)">
                添加策略
              </el-button>
            </div>

          </div>
          <div v-show="groupItem.desc"
               class="desc">{{ groupItem.desc }}</div>
          <!-- 策略 -->
          <div v-show="groupItem.ployTabs.length">
            <el-tabs v-model="groupItem.ployTabsValue"
                     type="card"
                     closable
                     @tab-remove="removeTab($event,gi)">
              <el-tab-pane v-for="(ployItem,pi) of groupItem.ployTabs"
                           :key="ployItem.name"
                           :label="ployItem.title"
                           :name="ployItem.name">
                <el-form-item required
                              label="策略名称：">
                  <el-input v-model="ployItem.title"
                            style="width:300px"
                            placeholder="请输入策略名称" />
                </el-form-item>
                <!-- :rules="[{
                required: true, message: '值不能为空', trigger: 'blur'
                },{
                validator: validatePass2, trigger: 'change'
                }]" -->
                <el-form-item :prop="'ployTabs.' + pi + '.percent'"
                              :rules="[{
                                required: true, message: '值不能为空', trigger: 'blur'
                              }]"
                              class="shun-label">
                  <div slot="label">
                    <Info content="同一客群下所有策略分发范围总和为100%" />
                    分发范围：
                  </div>
                  <el-input-number v-model="ployItem.percent"
                                   controls-position="right"
                                   style="margin-right:10px;"
                                   :precision="2"
                                   :min="0"
                                   :max="100"
                                   :step="10"
                                   @change="handleChangePercent" />%
                  <el-alert :title="'当前客群总和'+groupItem.totalPercent+'%'"
                            style="display:inline;margin-left:10px;"
                            :closable="false"
                            :type="groupItem.totalPercent===100?'success':'error'" />
                  <!-- {{ groupItem.totalPercen }} -->
                </el-form-item>
                <el-form-item required
                              label="推荐产品：">
                  <el-button icon="el-icon-plus"
                             @click="addProduct(gi,pi)">
                    选择产品
                  </el-button>
                </el-form-item>
                <el-table v-if="JSON.stringify(ployItem.product) !== '{}'"
                          :data="parseTable(ployItem.product)"
                          :span-method="objectSpanMethod"
                          border
                          style="width: 100%;margin-bottom:18px;">
                  <el-table-column prop="groupName"
                                   label="组合" />
                  <el-table-column prop="income"
                                   min-width="100"
                                   label="综合收益" />
                  <el-table-column prop="productName"
                                   min-width="120"
                                   label="产品名称" />
                  <el-table-column prop="productType"
                                   label="产品类型" />
                  <el-table-column prop="risklLevel"
                                   label="风险等级" />
                  <el-table-column prop="rateOfReturn"
                                   min-width="150"
                                   label="收益率/行业比较基准" />
                  <el-table-column prop="minimumPurchaseAmount"
                                   label="起购金额" />
                  <el-table-column prop="begin_time"
                                   label="起息日" />
                  <el-table-column prop="end_time"
                                   label="到期日" />
                  <el-table-column prop="proportion"
                                   label="比例" />
                </el-table>
                <el-form-item required
                              label="推荐权益：">
                  <el-button icon="el-icon-plus"
                             @click="addInterest(ployItem)">
                    选择权益
                  </el-button>
                </el-form-item>
                <div v-show="ployItem.interest.name"
                     class="ploy-card">
                  {{ ployItem.interest.name }}
                </div>
                <el-divider />
                <el-form-item required
                              label="下发渠道：">
                  <el-dropdown trigger="click"
                               size="medium"
                               @command="handleCommandChannel($event,ployItem)">
                    <el-button>
                      选择添加
                      <i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(channelItem,i) of ployItem.channelOpt"
                                        :key="i"
                                        :disabled="channelItem.disabled"
                                        :command="channelItem.value">
                        <svg-icon style="margin-right:10px;"
                                  :icon-class="channelItem.icon" />
                        {{ channelItem.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
                <!-- {{ ployItem.channel }} -->
                <el-card v-for="(channelCardItem,ci) of ployItem.channel"
                         :key="ci"
                         shadow="hover"
                         style="margin-bottom:18px;"
                         class="channel-card">
                  <div slot="header"
                       class="clearfix">
                    <span class="channel-card-title">
                      <svg-icon class="name-icon"
                                :style="{color:channelCardItem.iconColor}"
                                :icon-class="channelCardItem.icon" />
                      <span>{{ channelCardItem.label }}</span>
                    </span>

                    <el-popconfirm title="确定删除改渠道吗？">
                      <el-button slot="reference"
                                 class="channel-card-delete"
                                 type="text">
                        删除
                      </el-button>
                    </el-popconfirm>
                  </div>
                  <el-form-item required
                                label="下发类型：">
                    <el-radio v-for="item of channelCardItem.type"
                              :key="item.id"
                              v-model="channelCardItem.chooseType"
                              style="margin-right:0;"
                              :label="item.id"
                              border>
                      {{ item.name }}
                      <i :class="item.icon" />
                    </el-radio>
                  </el-form-item>
                  <div>
                    <!-- 定时型 -->
                    <template v-if="channelCardItem.chooseType==='1'">
                      <el-form-item required
                                    label="起止日期：">
                        <el-date-picker v-model="channelCardItem.dateRange"
                                        type="daterange"
                                        range-separator="至"
                                        :picker-options="pickerOptions"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期" />
                      </el-form-item>
                      <el-form-item required
                                    label="推送时间：">
                        <el-cascader v-model="channelCardItem.timingDateValue"
                                     style="width:190px;"
                                     :props="{ expandTrigger: 'hover',multiple: true,checkStrictly: false }"
                                     collapse-tags
                                     :options="timingOpt" />
                        <el-time-picker v-model="channelCardItem.timingTimeValue"
                                        style="width:150px;margin-left:10px;"
                                        :picker-options="{
                                          selectableRange: '07:00:00 - 20:00:00'
                                        }"
                                        :clearable="false"
                                        format="HH:mm"
                                        value-format="HH:mm" />
                      </el-form-item>
                    </template>
                    <!-- 规则型 -->
                    <template v-if="channelCardItem.chooseType==='2'">
                      <el-form-item required
                                    class="rule-form"
                                    label="推送时间：">
                        <div v-for="(item,rule_i) of channelCardItem.ruleValue"
                             :key="rule_i"
                             class="rule-item">
                          <Info content="名单生效日" />
                          <span class="text-text">T</span>
                          <span class="plus-text">+</span>
                          <el-input-number v-model="item.date"
                                           style="margin-right:10px;"
                                           controls-position="right"
                                           :min="0" />天
                          <el-time-picker v-model="item.time"
                                          style="width:150px;margin-left:10px;"
                                          :clearable="false"
                                          format="HH:mm"
                                          value-format="HH:mm" />
                          <i v-if="channelCardItem.ruleValue.length > 1"
                             class="el-icon-delete delete"
                             @click="delRuleItem(channelCardItem,rule_i)" />
                        </div>
                        <el-button class="add"
                                   icon="el-icon-plus"
                                   @click="addRuleItem(channelCardItem)" />
                      </el-form-item>
                    </template>
                    <!-- crm -->
                    <template v-if="channelCardItem.value==='1'">
                      <el-form-item required
                                    label="推荐话术：">
                        <el-button icon="el-icon-plus"
                                   @click="addCRMWords(channelCardItem)">
                          选择话术
                        </el-button>
                      </el-form-item>
                    </template>
                    <!-- 短信 -->
                    <template v-if="channelCardItem.value==='2'">
                      <el-form-item required
                                    label="短信模版：">
                        <el-button icon="el-icon-plus"
                                   @click="addSmsWords(channelCardItem)">
                          选择模版
                        </el-button>
                      </el-form-item>
                      <el-form-item :prop="'ployTabs.' + pi + '.channel.' + ci + '.test'"
                                    :rules="[{
                                      validator: testSelectValidator, trigger: 'change'
                                    }]">
                        <div slot="label">
                          <Info content="对当前策略进行测试" />
                          精准内测：
                        </div>
                        <el-select v-model="channelCardItem.test"
                                   style="width:500px;margin-right:10px;float:left;"
                                   multiple
                                   filterable
                                   allow-create
                                   default-first-option
                                   placeholder="请选择电话号码/输入电话号码并按回车添加"
                                   @change="handleTestChange" />
                        <el-button icon="el-icon-thumb"
                                   style="float:left;">
                          测试一下
                        </el-button>
                      </el-form-item>
                    </template>
                    <!-- 微信 -->
                    <template v-if="channelCardItem.value==='3'">
                      <el-form-item required
                                    label="微信模版：">
                        <el-button icon="el-icon-plus"
                                   @click="addWeChatWords(channelCardItem)">
                          选择模版
                        </el-button>
                      </el-form-item>
                    </template>
                    <!-- 渠道：{{ channelCardItem.value }}
                    类型：{{ channelCardItem.chooseType }}
                    定时型的值1（规则）：{{ channelCardItem.timingDateValue }}
                    定时型的值2（时间）：{{ channelCardItem.timingTimeValue }}
                    规则型的值：{{ channelCardItem.ruleValue }} -->
                  </div>
                </el-card>
              </el-tab-pane>
            </el-tabs>
          </div>
          <!-- 策略end -->
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-drawer title="选择产品"
               class="el-drawer_product"
               :visible.sync="showProduct"
               size="80%"
               direction="rtl">
      <div class="drawer-container">
        <Product ref="productRef"
                 :show-selection="true" />
      </div>
      <div class="drawer-bottom">
        <el-button type="primary"
                   @click="submitProduct()">
          确 认
        </el-button>
      </div>
    </el-drawer>

    <el-drawer title="选择权益"
               class="el-drawer_product"
               :visible.sync="showInterest"
               size="80%"
               direction="rtl">
      <div class="drawer-container">
        <Interest ref="interestRef"
                  :show-selection="true" />
      </div>
      <div class="drawer-bottom">
        <el-button type="primary"
                   @click="submitInterest()">
          确 认
        </el-button>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import gsap from 'gsap'
import Info from '@/components/Info'
import Product from '@/views/product/index'
import Interest from '@/views/interest/index'
import { isPhone } from '@/utils/validate'

const CHANNEL_OPT = [
  {
    value: '1',
    label: 'CRM',
    disabled: false,
    icon: 'phone',
    iconColor: '#409eff',
    // 1:定时型 2:规则
    chooseType: '1',
    timingDateValue: [],
    timingTimeValue: '07:00',
    dateRange: [],
    ruleValue: [{
      date: 0,
      time: '00:00'
    }],
    type: [{
      id: '1',
      icon: 'el-icon-alarm-clock',
      name: '定时型'
    }]
  }, {
    value: '2',
    label: '短信',
    disabled: false,
    icon: 'sms',
    iconColor: '#FF9933',
    chooseType: '1',
    // 定时型的值-规则 (每周几或每月几) (暂定多选)
    timingDateValue: [],
    // 定时型的值-时间
    timingTimeValue: '07:00',
    // 定时型的值-起止时间
    dateRange: [],
    // 规则型的值
    ruleValue: [{
      date: 0,
      time: '00:00'
    }],
    // 精准内测
    test: [],
    type: [{
      id: '1',
      name: '定时型',
      icon: 'el-icon-alarm-clock'
    }, {
      id: '2',
      name: '规则型',
      icon: 'el-icon-tickets'
    }]
  }, {
    value: '3',
    label: '微信',
    disabled: false,
    icon: 'wechat',
    iconColor: '#67c23a',
    chooseType: '1',
    timingDateValue: [],
    timingTimeValue: '07:00',
    dateRange: [],
    ruleValue: [{
      date: 0,
      time: '00:00'
    }],
    type: [{
      id: '1',
      name: '定时型',
      icon: 'el-icon-alarm-clock'
    }, {
      id: '2',
      name: '规则型',
      icon: 'el-icon-tickets'
    }]
  }
]
export default {
  components: {
    Product, Info, Interest
  },
  data() {
    return {
      valuex: [],
      // 客群tab对应的值
      groupName: '0',
      // 人数初始值
      tweenedNumber: 0,
      // 产品侧边栏
      showProduct: false,
      // 权益侧边栏
      showInterest: false,
      // 定时型 下拉选项
      timingOpt: [
        {
          value: '1',
          label: '每周',
          children: [{
            value: '1',
            label: '星期一'
          }, {
            value: '2',
            label: '星期二'
          }, {
            value: '3',
            label: '星期三'
          }, {
            value: '4',
            label: '星期四'
          }, {
            value: '5',
            label: '星期五'
          }, {
            value: '6',
            label: '星期六'
          }, {
            value: '7',
            label: '星期日'
          }]
        },
        {
          value: '2',
          label: '每月',
          children: Array.apply(null, Array(31)).map((n, i) => {
            return { value: i + 1, label: i + 1 + '号' }
          })
        }
      ],
      group: [
        {
          name: '群组1',
          people: 221324,
          desc: '客群描述客群描述客群描述客群描述客群描述客群描述客群描述苏打粉',
          // 当前分发范围设置总和
          totalPercent: 100,
          // 策略
          ployTabs: [{
            // 策略名称
            title: '新策略',
            // 策略分发范围
            percent: 100,
            // 策略tab id
            name: '1',
            // 产品
            product: {
              groupName: '组合A',
              income: '3.065-3.385%',
              list: [
                {
                  productName: '顺盈2号',
                  productType: '开放式理财',
                  risklLevel: 'R2',
                  rateOfReturn: '2.8-3.2%',
                  minimumPurchaseAmount: '10000',
                  begin_time: 'XXXX',
                  end_time: 'XXXX',
                  proportion: '50%'
                },
                {
                  productName: '顺盈3号',
                  productType: '开放式理财',
                  risklLevel: 'R2',
                  rateOfReturn: '2.8-3.2%',
                  minimumPurchaseAmount: '10000',
                  begin_time: 'XXXX',
                  end_time: 'XXXX',
                  proportion: '30%'
                },
                {
                  productName: '三年期定期',
                  productType: '存款',
                  risklLevel: '',
                  rateOfReturn: '4.13%',
                  minimumPurchaseAmount: '50',
                  begin_time: 'T',
                  end_time: 'T+3年',
                  proportion: '20%'
                }
              ]
            },
            // 权益
            interest: {},
            channel: [],
            channelOpt: JSON.parse(JSON.stringify(CHANNEL_OPT))
          }],
          // v-model值
          ployTabsValue: '1',
          // 累加数量
          ployTabIndex: 1
        },
        {
          name: '群组2',
          people: 1324123,
          totalPercent: 100,
          ployTabs: [],
          // v-model值
          ployTabsValue: '0',
          // 累加数量
          ployTabIndex: 0
        }
      ],
      tempProduct: {
        gi: null,
        pi: null
      },
      tempPloyItem: null,
      pickerOptions: {
        disabledDate(time) {
          const testStartTime = 1600128000000 // 2020-09-15
          const testEndTime = 1602720000000 // 2020-10-15
          return time.getTime() > testEndTime || time.getTime() < testStartTime
        }
      }

    }
  },
  computed: {
    animatedNumber() {
      return parseInt(this.tweenedNumber.toFixed(0)).toLocaleString()
    }

  },
  watch: {

  },
  created() {
    this.beforeHandleGroupTabClick(0)
  },

  methods: {
    beforeHandleGroupTabClick(activeName, oldActiveName) {
      this.animateNum(+activeName)
    },

    animateNum(i) {
      this.tweenedNumber = 0
      const num = this.group[i].people.toFixed(0)
      gsap.to(this.$data, { duration: 0.5, tweenedNumber: num })
    },
    getTotalPercent(gi) {
      let p = 0
      this.group[gi].ployTabs.forEach((n, i) => {
        p += n.percent
      })
      return p
    },
    addTab(gi) {
      const newTabName = ++this.group[gi].ployTabIndex + ''
      let percent = 100
      this.group[gi].ployTabs.forEach((n, i) => {
        percent = parseFloat((percent - n.percent) < 0 ? 0 : (percent - n.percent).toFixed(2))
      })
      console.log(percent)
      this.group[gi].ployTabs.push({
        title: '新策略' + newTabName,
        name: newTabName,
        percent,
        // 产品
        product: {},
        // 权益
        interest: {},
        // 渠道
        channel: [],
        channelOpt: JSON.parse(JSON.stringify(CHANNEL_OPT))
      })
      this.group[gi].ployTabsValue = newTabName
      this.group[gi].totalPercent = this.getTotalPercent(gi)
      // console.log(typeof this.group[gi].totalPercent, typeof percent)
    },
    removeTab(targetName, gi) {
      this.$confirm('确认删除？')
        .then(() => {
          const tabs = this.group[gi].ployTabs
          let activeName = this.group[gi].ployTabsValue
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

          this.group[gi].ployTabsValue = activeName
          this.group[gi].ployTabs = tabs.filter(tab => tab.name !== targetName)
          this.group[gi].totalPercent = this.getTotalPercent(gi)
        })
        .catch(() => {
        })
    },
    // 分发百分比校验
    // validatePass2(rule, value, callback) {
    //   console.log(this.$refs.form0.validate)
    //   let total = 0
    //   this.group[+this.groupName].ployTabs.forEach((n, i) => {
    //     // console.log(n.percent)
    //     total += n.percent
    //   })
    //   if (total > 100) {
    //     callback(new Error('分发范围总和不能大于100%'))
    //   }
    //   // console.log(valid)
    //   // return valid.
    //   // console.log(rule, value, callback, source, options, caonima)
    // },
    handleChangePercent() {
      let total = 0
      this.group[+this.groupName].ployTabs.forEach((n, i) => {
        // console.log(n.percent)
        total += n.percent
      })
      // console.log(total)
      this.group[+this.groupName].totalPercent = total
    },
    addProduct(gi, pi) {
      // console.log(gi, pi)
      this.tempProduct.gi = gi
      this.tempProduct.pi = pi
      this.showProduct = true
    },
    submitProduct() {
      const val = this.$refs.productRef.getVal()
      console.log(val)
      const { gi, pi } = this.tempProduct
      // this.group[gi].ployTabs[pi].product
      this.showProduct = false
    },
    // 权益
    addInterest(item) {
      this.tempPloyItem = item
      this.showInterest = true
      this.$nextTick(() => {
        this.$refs.interestRef.select(item.interest.id)
      })
    },
    submitInterest() {
      const val = this.$refs.interestRef.getVal()
      this.tempPloyItem.interest = val
      this.showInterest = false
    },
    parseTable(data) {
      return data.list.map((n, i) => {
        return Object.assign({
          groupName: data.groupName,
          income: data.income,
          total: data.list.length
        }, n)
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'groupName' || column.property === 'income') {
        if (rowIndex === 0) {
          return {
            rowspan: row.total,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    handleCommandChannel(index, item) {
      CHANNEL_OPT.forEach((n, i) => {
        if (n.value === index) {
          item.channel.push(JSON.parse(JSON.stringify(n)))
        }
      })
      const tempArr = item.channel.map(n => n.value)
      item.channelOpt.forEach((n, i) => {
        n.disabled = tempArr.includes(n.value)
      })
    },
    addRuleItem(item) {
      item.ruleValue.push({
        date: 0,
        time: '00:00'
      })
    },
    delRuleItem(item, i) {
      item.ruleValue.splice(i, 1)
    },

    // crm话术
    addCRMWords(item) {
      // todo
    },
    // 短信话术
    addSmsWords(item) {
      // todo
    },
    // 微信话术
    addWeChatWords(item) {
      // todo
    },
    handleTestChange(val) {
      console.log(val)
    },
    testSelectValidator(rule, value, callback) {
      // console.log(rule, value, callback)
      const b = value.every((n, i) => {
        console.log(isPhone(n))
        return isPhone(n)
      })
      if (!b) {
        callback(new Error('请输入正确的手机号码'))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.ploy-container {
  padding: 5px 20px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .left {
      color: #888;
      font-size: 14px;
      flex: 1;
      display: flex;
      align-items: center;
      b {
        color: #444;
        font-size: 18px;
      }
    }
  }
  .desc {
    @include shun-text;
  }
  .shun-label ::v-deep .el-form-item__label {
    display: flex;
    justify-content: flex-end;
  }
  .ploy-card {
    @include shun-text;
    border: 1px solid #ebeef5;
    background: #fafafa;
    color: #444;
    margin-bottom: 0;
  }
  .channel-card {
    .name-icon {
      margin-right: 10px;
      color: $blue;
      font-size: 20px;
    }
    .channel-card-title {
      font-weight: bold;
      display: flex;
      align-items: flex-start;
      float: left;
    }
    .channel-card-delete {
      float: right;
      padding: 3px 0;
      color: rgb(245, 108, 108);
      &:hover {
        opacity: 0.8;
      }
    }
    .rule-form {
      width: 470px;
      .rule-item {
        display: flex;
        position: relative;
        margin-bottom: 10px;
        // height: 32px;
        .text-text {
          margin: 0 10px 0 5px;
          font-size: 16px;
        }
        .plus-text {
          font-size: 18px;
          margin-right: 10px;
        }
        // .el-form-item {
        //   flex: 1;
        // }
        // .target-item-input {
        //   width: 100%;
        // }
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
}
.el-drawer_product {
  ::v-deep .el-drawer {
    background: #f8f8fa;
    .el-drawer__body {
      display: flex;
      flex-direction: column;
    }
  }
  .drawer-container {
    padding: 0 20px;
  }
  .drawer-bottom {
    margin-top: auto;
    padding: 0 20px 20px;
  }
}
</style>
