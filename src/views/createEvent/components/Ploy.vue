<template>
  <div ref="ployRef"
       class="ploy-container">
    <el-form ref="refCustomerForm"
             :model="{group}"
             label-width="120px">
      <el-tabs v-model="groupName"
               :before-leave="beforeHandleGroupTabClick">
        <!-- {{ groupIndex }}{{ ployIndex }} -->
        <el-tab-pane v-for="(groupItem,gi) of group"
                     :key="gi"
                     :label="groupItem.name"
                     :name="gi+''">
          <div class="top">
            <div class="left">当前群组人数：<b>{{ animatedNumber }}</b></div>
            <div>
              <el-form-item style="margin-bottom:0;"
                            :prop="'group.' + gi + '.ployTabs'"
                            :rules="[{
                              required: true, message: '请添加策略', type: 'array'
                            }]">
                <el-button icon="el-icon-plus"
                           type="primary"
                           @click="addTab">
                  添加策略
                </el-button>
              </el-form-item>
            </div>
          </div>
          <div v-show="groupItem.desc"
               class="desc">{{ groupItem.desc }}</div>
          <!-- 策略 -->
          <div v-show="groupItem.ployTabs.length">
            <!-- {{ groupItem.ployTabsValue }} -->
            <el-tabs v-model="groupItem.ployTabsValue"
                     type="card"
                     closable
                     @tab-click="handleChangeTab"
                     @tab-remove="handleRemoveTab">
              <el-tab-pane v-for="(ployItem,pi) of groupItem.ployTabs"
                           :key="ployItem.name"
                           :label="ployItem.title"
                           :name="ployItem.name">
                <el-form-item label="策略名称："
                              :prop="'group.' + gi + '.ployTabs.' + pi + '.title'"
                              :rules="[{
                                required: true, message: '请输入策略名称', trigger: 'blur'
                              },{
                                validator: validatePloyName, trigger: 'blur'
                              }]">
                  <el-input v-model="ployItem.title"
                            style="width:300px"
                            placeholder="请输入策略名称" />
                </el-form-item>
                <el-form-item :prop="'group.' + gi + '.ployTabs.' + pi + '.percent'"
                              :rules="[{
                                validator: validatePercent
                              }]"
                              class="shun-label">
                  <div slot="label">
                    <Info content="同一客群下所有策略分发范围总和需为100%" />
                    分发范围：
                  </div>
                  <div style="display:flex;">
                    <el-input-number v-model="ployItem.percent"
                                     controls-position="right"
                                     style="margin-right:10px;"
                                     :precision="2"
                                     :min="0"
                                     :max="100"
                                     :step="10"
                                     @blur="handlePercentBlur(ployItem)"
                                     @change="handlePercentChange" />%
                    <el-form-item style="margin-left:10px;margin-bottom:0;"
                                  :prop="'group.' + gi + '.totalPercent'"
                                  :rules="[{
                                    validator: validateTotalPercent
                                  }]">
                      <el-alert :title="'当前客群总和'+groupItem.totalPercent+'%'"
                                style="display:inline"
                                :closable="false"
                                :type="groupItem.totalPercent===100?'success':'error'" />
                    </el-form-item>
                  </div>
                  <!-- {{ groupItem.totalPercen }} -->
                </el-form-item>
                <el-form-item label="推荐产品："
                              :prop="'group.' + gi + '.ployTabs.' + pi + '.product'"
                              :rules="[{
                                required: true, message: '请选择产品', type: 'array'
                              }]">
                  <el-button icon="el-icon-plus"
                             type="primary"
                             plain
                             @click="addProduct()">
                    选择产品
                  </el-button>
                </el-form-item>
                <!-- {{ ployItem.product }} -->
                <el-table v-show="ployItem.product.length"
                          :data="ployItem.product"
                          border
                          style="width: 100%;margin-bottom:18px;">
                  <el-table-column prop="name"
                                   label="产品名称" />
                  <el-table-column prop="classify"
                                   label="产品类型" />
                  <el-table-column prop="riskLevel"
                                   label="风险等级" />
                  <el-table-column prop="returnBenchmark"
                                   label="收益率/行业比较基准" />
                  <el-table-column prop="purchaseAmount"
                                   label="起购金额" />
                  <el-table-column prop="startDate"
                                   label="气息日" />
                  <el-table-column prop="endDate"
                                   label="到期日" />
                </el-table>
                <!-- <el-table v-if="JSON.stringify(ployItem.product) !== '{}'"
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
                </el-table> -->
                <el-form-item label="推荐权益："
                              :prop="'group.' + gi + '.ployTabs.' + pi + '.interest'"
                              :rules="[{
                                required: true, message: '请选择权益', type: 'array'
                              }]">
                  <el-button icon="el-icon-plus"
                             type="primary"
                             plain
                             @click="addInterest(ployItem)">
                    选择权益
                  </el-button>
                </el-form-item>
                <div v-show="ployItem.interest.length"
                     class="ploy-card">
                  <el-table :data="ployItem.interest"
                            border
                            style="width: 100%;margin-bottom:18px;">
                    <el-table-column prop="name"
                                     width="200"
                                     show-overflow-tooltip
                                     label="名称" />
                    <el-table-column prop="content"
                                     show-overflow-tooltip
                                     :min-width="300"
                                     label="内容" />
                  </el-table>
                </div>
                <el-divider />
                <el-form-item label="下发渠道："
                              :prop="'group.' + gi + '.ployTabs.' + pi + '.channel'"
                              :rules="[{
                                required: true, message: '请选择下发渠道', type: 'array'
                              }]">
                  <el-dropdown trigger="click"
                               size="medium"
                               @command="handleCommandChannel($event,ployItem)">
                    <el-button type="primary"
                               plain>
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
                         :id="`channelRef-${gi}-${pi}-${ci}`"
                         :key="`${gi}-${pi}-${ci}`"
                         shadow="hover"
                         style="margin-bottom:18px;"
                         class="channel-card">
                  <div slot="header"
                       class="clearfix">
                    <span class="channel-card-title">
                      <!-- {{ `channelRef-${groupIndex}-${ployIndex}-${ci}` }} -->
                      <svg-icon class="name-icon"
                                :style="{color:channelCardItem.iconColor}"
                                :icon-class="channelCardItem.icon" />
                      <span>{{ channelCardItem.label }}</span>
                    </span>

                    <el-popconfirm title="确定删除该渠道吗？"
                                   @onConfirm="deleteChannel(ployItem,ci)">
                      <el-button slot="reference"
                                 class="channel-card-delete"
                                 type="text">
                        删除
                      </el-button>
                    </el-popconfirm>
                  </div>
                  <el-form-item label="下发类型："
                                :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.chooseType'"
                                :rules="[{
                                  required: true, message: '请选择下发类型', trigger: 'change'
                                }]"
                                @click.native="caonima">
                    <el-radio-group v-model="channelCardItem.chooseType">
                      <el-radio v-for="item of channelCardItem.type"
                                :key="item.id"
                                style="margin-right:0;"
                                :label="item.id"
                                border
                                @change="handleChannelTypeChange($event,ci)">
                        {{ item.name }}
                        <i :class="item.icon" />
                      </el-radio>
                    </el-radio-group>

                  </el-form-item>
                  <div>
                    <!-- 定时型 -->
                    <template v-if="channelCardItem.chooseType===1">
                      <el-form-item label="起止日期："
                                    :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.dateRange'"
                                    :rules="[{
                                      required: true, message: '请选择起止日期', trigger: 'change'
                                    }]">
                        <el-date-picker v-model="channelCardItem.dateRange"
                                        type="daterange"
                                        range-separator="至"
                                        value-format="yyyy-MM-dd"
                                        :picker-options="pickerOptions"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期" />
                      </el-form-item>
                      <el-form-item label="推送时间："
                                    required>
                        <div style="display:flex">
                          <el-form-item style="margin-bottom:0;margin-right:10px;">
                            <el-select v-model="channelCardItem.timingDateType"
                                       style="width:80px;"
                                       @change="channelCardItem.timingDateValue = []">
                              <el-option v-for="item of timingOpt"
                                         :key="item.value"
                                         :label="item.label"
                                         :value="item.value" />
                            </el-select>
                          </el-form-item>
                          <el-form-item :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.timingDateValue'"
                                        :rules="[{
                                          required: true, message: '请选择推送时间', trigger: 'change'
                                        }]"
                                        style="margin-bottom:0;margin-right:10px;">
                            <el-select v-model="channelCardItem.timingDateValue"
                                       multiple
                                       clearable
                                       collapse-tags>
                              <el-option v-for="item of timingOpt.find(n => channelCardItem.timingDateType === n.value).children"
                                         :key="item.value"
                                         :label="item.label"
                                         :value="item.value" />
                            </el-select>
                          </el-form-item>
                          <el-form-item style="margin-bottom:0;">
                            <el-time-select v-model="channelCardItem.timingTimeValue"
                                            style="width:150px;"
                                            :picker-options="{
                                              start: '07:00',
                                              end: '20:00',
                                              step: '00:30',
                                            }"
                                            :clearable="false"
                                            :editable="false"
                                            format="HH:mm"
                                            value-format="HH:mm" />
                          </el-form-item>
                        </div>
                      </el-form-item>

                    </template>
                    <!-- 规则型 -->
                    <template v-if="channelCardItem.chooseType===2">
                      <el-form-item class="rule-form"
                                    label="推送时间："
                                    :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.ruleValue'"
                                    :rules="[{
                                      required: true, message: '请选择推送时间'
                                    }]">
                        <div v-for="(item,rule_i) of channelCardItem.ruleValue"
                             :key="rule_i"
                             class="rule-item">
                          <Info content="名单生效日" />
                          <span class="text-text">T</span>
                          <span class="plus-text">+</span>
                          <el-input-number v-model="item.date"
                                           style="margin-right:10px;"
                                           controls-position="right"
                                           :min="0"
                                           @blur="item.date=item.date||0" />天
                          <el-time-picker v-model="item.time"
                                          style="width:150px;margin-left:10px;"
                                          :clearable="false"
                                          format="HH:mm"
                                          value-format="HH:mm"
                                          @blur="handleTimeBlur($event,item)" />
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
                    <template v-if="channelCardItem.value===1">
                      <el-form-item label="推荐话术："
                                    :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.model'"
                                    :rules="[{
                                      required: true, message: '请选择话术', type: 'array'
                                    }]">
                        <el-button icon="el-icon-plus"
                                   @click="addCRMWords(ci)">
                          选择话术
                        </el-button>
                      </el-form-item>
                      <el-table v-show="channelCardItem.model.length"
                                :data="channelCardItem.model"
                                border
                                style="width: 100%;margin-bottom:18px;">
                        <el-table-column prop="content2"
                                         :min-width="400"
                                         label="话术内容" />
                        <el-table-column prop="category"
                                         show-overflow-tooltip
                                         label="话术分类" />

                      </el-table>
                    </template>
                    <!-- 短信 -->
                    <template v-if="channelCardItem.value===2">
                      <el-form-item label="短信模版："
                                    :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.model'"
                                    :rules="[{
                                      required: true, message: '请选择模版', type: 'array'
                                    }]">
                        <el-button icon="el-icon-plus"
                                   @click="addSmsWords(ci)">
                          选择模版
                        </el-button>
                      </el-form-item>
                      <el-table v-show="channelCardItem.model.length"
                                :data="channelCardItem.model"
                                border
                                style="width: 100%;margin-bottom:18px;">
                        <el-table-column prop="content2"
                                         :min-width="400"
                                         label="短信内容" />
                        <el-table-column prop="category"
                                         show-overflow-tooltip
                                         label="短信分类" />

                      </el-table>
                      <el-form-item :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.test'"
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
                    <template v-if="channelCardItem.value===3">
                      <el-form-item label="微信模版："
                                    :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.model'"
                                    :rules="[{
                                      required: true, message: '请选择模版', type: 'array'
                                    }]">
                        <el-button icon="el-icon-plus"
                                   @click="addWeChatWords(ci)">
                          选择模版
                        </el-button>
                      </el-form-item>
                      <el-table v-show="channelCardItem.model.length"
                                :data="channelCardItem.model"
                                border
                                style="width: 100%;margin-bottom:18px;">
                        <el-table-column prop="content2"
                                         :min-width="400"
                                         label="短信内容" />
                        <el-table-column prop="category"
                                         show-overflow-tooltip
                                         label="短信分类" />
                      </el-table>
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
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- 产品 -->
    <ShunDrawer title="选择产品"
                :show.sync="showProduct"
                @submit="submitProduct()">
      <template v-slot:container>
        <product ref="productRef"
                 :show-selection="true" />
      </template>
    </ShunDrawer>
    <!-- 权益 -->
    <ShunDrawer title="选择权益"
                :show.sync="showInterest"
                @submit="submitInterest()">
      <template v-slot:container>
        <interest ref="interestRef"
                  :show-selection="true" />
      </template>
    </ShunDrawer>
    <!-- 话术 -->
    <ShunDrawer title="选择话术"
                :show.sync="showCRMWord"
                @submit="submitWord()">
      <template v-slot:container>
        <word ref="wordRef"
              :show-selection="true" />
      </template>
    </ShunDrawer>
    <!-- 短信 -->
    <ShunDrawer title="选择短信"
                :show.sync="showSms"
                @submit="submitSms()">
      <template v-slot:container>
        <sms ref="smsRef"
             :show-selection="true" />
      </template>
    </ShunDrawer>
  </div>
</template>

<script>
import { savePloy, getGroupList } from '@/api/api'
import gsap from 'gsap'
import Info from '@/components/Info'
import ShunDrawer from '@/components/ShunDrawer'
import Product from '@/views/product/index'
import Interest from '@/views/interest/index'
import Word from '@/views/word/index'
import Sms from '@/views/sms/index'
import { isPhone } from '@/utils/validate'
import { MessageBox, Message } from 'element-ui'
import { parseTime } from '@/utils'

// import { getWordList } from '@/api/api'
const CHANNEL_OPT = [
  {
    value: 1,
    label: 'CRM',
    disabled: false,
    icon: 'phone',
    iconColor: '#409eff',
    // 1:定时型 2:规则
    chooseType: 1,
    timingDateType: 1,
    timingDateValue: [],
    timingTimeValue: '07:00',
    dateRange: [],
    ruleValue: [{
      date: 0,
      time: '00:00'
    }],
    type: [{
      id: 1,
      icon: 'el-icon-alarm-clock',
      name: '定时型'
    }],
    model: []
  }, {
    value: 2,
    label: '短信',
    disabled: false,
    icon: 'sms',
    iconColor: '#FF9933',
    chooseType: 1,
    // 定时型的值-规则 (每周几或每月)
    timingDateType: 1,
    // 定时型的值-规则 (周几或者几号) (多选)
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
      id: 1,
      name: '定时型',
      icon: 'el-icon-alarm-clock'
    }, {
      id: 2,
      name: '规则型',
      icon: 'el-icon-tickets'
    }],
    model: []
  }, {
    value: 3,
    label: '微信',
    disabled: false,
    icon: 'wechat',
    iconColor: '#67c23a',
    chooseType: 1,
    timingDateType: 1,
    timingDateValue: [],
    timingTimeValue: '07:00',
    dateRange: [],
    ruleValue: [{
      date: 0,
      time: '00:00'
    }],
    type: [{
      id: 1,
      name: '定时型',
      icon: 'el-icon-alarm-clock'
    }, {
      id: 2,
      name: '规则型',
      icon: 'el-icon-tickets'
    }],
    model: []
  }
]
export default {
  components: {
    Product, Info, Interest, Word, ShunDrawer, Sms
  },
  data() {
    const _this = this
    return {
      // 客群tab对应的值
      groupName: '0',
      // 人数初始值
      tweenedNumber: 0,
      // 产品侧边栏
      showProduct: false,
      // 权益侧边栏
      showInterest: false,
      // crm话术侧边栏
      showCRMWord: false,
      // 短信侧边栏
      showSms: false,
      // 定时型 下拉选项
      timingOpt: [
        {
          value: 1,
          label: '每周',
          children: [{
            value: 1,
            label: '星期一'
          }, {
            value: 2,
            label: '星期二'
          }, {
            value: 3,
            label: '星期三'
          }, {
            value: 4,
            label: '星期四'
          }, {
            value: 5,
            label: '星期五'
          }, {
            value: 6,
            label: '星期六'
          }, {
            value: 7,
            label: '星期日'
          }]
        },
        {
          value: 2,
          label: '每月',
          children: Array.apply(null, Array(31)).map((n, i) => {
            return { value: i + 1, label: i + 1 + '号' }
          })
        }
      ],
      group: [
        // {
        //   gid: 1,
        //   name: '群组1',
        //   people: 221324,
        //   desc: '客群描述客群描述客群描述客群描述客群描述客群描述客群描述苏打粉',
        //   // 当前分发范围设置总和
        //   totalPercent: 100,
        //   // 策略
        //   ployTabs: [{
        //     // 策略名称
        //     title: '新策略',
        //     // 策略分发范围
        //     percent: 100,
        //     // 策略tab id
        //     name: '1',
        //     // 产品
        //     product: JSON.parse(JSON.stringify(PRODUCT)),
        //     // 权益
        //     interest: {},
        //     channel: [],
        //     channelOpt: JSON.parse(JSON.stringify(CHANNEL_OPT))
        //   }],
        //   // v-model值
        //   ployTabsValue: '1',
        //   // 累加数量
        //   ployTabIndex: 1
        // },
      ],

      tempPloyItem: null,
      pickerOptions: {
        disabledDate(time) {
          // console.log(_this.$parent.baseInfoDetail.startDate, _this.$parent.baseInfoDetail.endDate)
          const testStartTime = _this.$parent.baseInfoDetail.startDate // 2020-09-15
          const testEndTime = _this.$parent.baseInfoDetail.endDate // 2020-10-15
          return time > testEndTime || time < testStartTime
        }
      },
      channelIndex: null
    }
  },
  computed: {
    id() {
      return +this.$route.query.id
    },
    animatedNumber() {
      return parseInt(this.tweenedNumber.toFixed(0)).toLocaleString()
    },
    groupIndex() {
      return +this.groupName
    },
    ployIndex() {
      return this.group[this.groupIndex].ployTabs.findIndex((n, i) => {
        return n.name === this.group[this.groupIndex].ployTabsValue
      })
    }
  },
  watch: {

  },
  created() {
    if (this.id) {
      this.getCustomer().then(() => {
        this.$nextTick(() => {
          this.beforeHandleGroupTabClick(0)
        })
      })
    }
  },

  methods: {
    // 从字符串中获取gi pi, 如 group.0.ployTabs.0.title => [0,0]
    getIndex(str) {
      const arr = str.split('.')
      return [+arr[1], +arr[3]]
    },
    /**
     * arr [[0,0],[0,1],[1,1]]
     */
    sortIndex(arr) {
      var newArray = arr.sort((a, b) => {
        const aHas = isNaN(a[1])
        const bHas = isNaN(b[1])
        return (aHas - bHas) || (aHas === true && a[1] - b[1]) || 0
      })
      return newArray.sort(function (a, b) {
        return a[0] - b[0]
      })
    },

    getCustomer() {
      return new Promise((resolve, reject) => {
        getGroupList({ baseId: this.id }).then(res => {
          if (res.code === 200) {
            this.group = res.data.customerInfoList.map((n, i) => {
              return {
                gid: n.id,
                name: n.name,
                people: n.count,
                desc: n.desc,
                totalPercent: 100,
                ployTabs: [],
                // v-model值
                ployTabsValue: '0',
                // 累加数量
                ployTabIndex: 0
              }
            })
            resolve()
          } else {
            reject()
          }
        }).catch(() => {
          reject()
        })
      })
    },
    validatePloyName(rule, value, callback) {
      const gi = this.getIndex(rule.field)[0]
      const pi = this.getIndex(rule.field)[1]
      const isSame = this.group[gi].ployTabs.some((n, i) => {
        if (i !== pi && n.title === value) {
          return true
        }
      })
      if (isSame) {
        callback(new Error('该策略名已存在'))
      } else {
        callback()
      }
    },
    // 切换策略
    handleChangeTab() {
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.title`)
    },
    validateAndNext() {
      return new Promise((resolve, reject) => {
        this.$refs.refCustomerForm.validate((valid, field) => {
          // console.log(valid, field)
          if (valid) {
            // 客群
            const data = this.group.map((gn, gi) => {
              return {
                // 客群id
                customerInfoId: gn.gid,
                // 策略
                strategyDetailList: gn.ployTabs.map((pn, pi) => {
                  return {
                    // 策略id
                    abstractId: undefined,
                    // 策略名称
                    name: pn.title,
                    // 分发范围
                    range: pn.percent,
                    // 产品id
                    productIdList: pn.product.map(n => n.id),
                    // 权益id
                    couponIdList: pn.interest.map(n => n.id),
                    // 渠道
                    strategyInfoList: pn.channel.map((cn, ci) => {
                      return {
                        // 渠道id
                        infoId: undefined,
                        // 渠道类型 1:crm 2:短信 3:微信
                        channel: cn.value,
                        // 话术id
                        scriptList: cn.value === 1 ? cn.model.map(n => {
                          return {
                            scriptId: n.id,
                            scriptContent: 'xxx',
                            scriptInstId: 22
                          }
                        }) : undefined,
                        // 模版id
                        materialIdList: cn.value !== 1 ? cn.model.map(n => n.id) : undefined,
                        // 推送类型 1:定时 2:规则
                        pushType: cn.chooseType,
                        pushTimeInfo: {
                          // 定时型的值
                          schedulePushInfo: cn.chooseType === 1 ? {
                            pushTimeId: undefined,
                            startDate: cn.dateRange[0],
                            endDate: cn.dateRange[1],
                            intervalType: cn.timingDateType,
                            interval: cn.timingDateValue,
                            moment: cn.timingTimeValue
                          } : undefined,
                          // 规则型的值
                          rulePushInfoList: cn.chooseType === 2 ? cn.ruleValue.map((ruleItem, rule_i) => {
                            return {
                              pushTimeId: undefined,
                              delay: ruleItem.date,
                              moment: ruleItem.time
                            }
                          }) : undefined
                        }
                      }
                    })
                  }
                })
              }
            })
            // console.log(data)
            // reject()
            const param = {
              baseId: this.id,
              strategySaveCriteriaList: data
            }
            savePloy(param).then(res => {
              resolve()
            }).catch(() => {
              reject()
            })
          } else {
            // console.log(field)
            let errList = Object.keys(field).map(key => this.getIndex(key))
            errList = this.sortIndex(errList)
            console.log(errList, '???')
            const [gi, pi] = errList[0]
            console.log(gi, pi)
            this.groupName = gi + ''
            this.$nextTick(() => {
              // console.log(this.group[gi])
              if (!isNaN(pi)) {
                // console.log(this.group[gi].ployTabs[pi].name)
                this.group[gi].ployTabsValue = this.group[gi].ployTabs[pi].name
              }
            })
            reject()
          }
        })
      })
    },
    beforeHandleGroupTabClick(activeName, oldActiveName) {
      this.animateNum(+activeName)
    },

    animateNum(i) {
      this.tweenedNumber = 0
      const num = this.group[i].people.toFixed(0)
      gsap.to(this.$data, { duration: 0.5, tweenedNumber: num })
    },
    validatePercent(rule, value, callback) {
      // console.log(rule, value, callback)
      if (value === 0) {
        callback(new Error('分发范围需大于0%'))
      } else {
        callback()
      }
    },
    validateTotalPercent(rule, value, callback) {
      // console.log(value)
      if (value !== 100) {
        callback('分发范围总和需等于100%')
      } else {
        callback()
      }
    },
    getTotalPercent(gi) {
      let p = 0
      this.group[gi].ployTabs.forEach((n, i) => {
        p += n.percent
      })
      return p
    },
    addTab() {
      const gi = this.groupIndex
      const newTabName = ++this.group[gi].ployTabIndex + ''
      let percent = 100
      this.group[gi].ployTabs.forEach((n, i) => {
        percent = parseFloat((percent - n.percent) < 0 ? 0 : (percent - n.percent).toFixed(2))
      })
      this.group[gi].ployTabs.push({
        title: '新策略' + newTabName,
        name: newTabName,
        percent,
        // 产品
        product: [],
        // 权益
        interest: [],
        // 渠道
        channel: [],
        channelOpt: JSON.parse(JSON.stringify(CHANNEL_OPT))
      })
      this.group[gi].ployTabsValue = newTabName
      this.group[gi].totalPercent = this.getTotalPercent(gi)
      // console.log(typeof this.group[gi].totalPercent, typeof percent)
      this.$nextTick(() => {
        // 校验策略是否为空
        this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs`)
        // 校验策略名是否重复
        this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.title`)
      })
    },
    handleRemoveTab(targetName) {
      const gi = this.groupIndex
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

          this.$nextTick(() => {
            // 校验策略是否为空
            this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs`)
            // 校验策略名是否重复
            this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.title`)
          })
        })
        .catch(() => {
        })
    },
    caonima() {
      // this.channelIndex = 0

      // this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${this.channelIndex}.model`)
    },
    // 选择推送类型
    handleChannelTypeChange(val, ci) {
      this.channelIndex = ci
      // 校验
      this.$nextTick(() => {
        // 1 定时型 2 规则型
        if (val === 1) {
          this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${this.channelIndex}.dateRange`)
          this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${this.channelIndex}.timingDateValue`)
        } else if (val === 2) {
          this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${this.channelIndex}.ruleValue`)
        }
      })
    },
    handlePercentChange() {
      let total = 0
      this.group[+this.groupName].ployTabs.forEach((n, i) => {
        total += n.percent || 0
      })
      // console.log(total)
      this.group[+this.groupName].totalPercent = total
      // 校验
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.totalPercent`)
    },
    handlePercentBlur(item) {
      if (!item.percent) {
        item.percent = 0
      }
    },
    // 选择产品
    addProduct() {
      this.$refs.productRef && this.$refs.productRef.resetAll()
      this.showProduct = true
    },
    // 选择产品-确定
    submitProduct() {
      const val = this.$refs.productRef.getVal()
      if (val.length) {
        this.showProduct = false
        // this.group[this.groupIndex].ployTabs[this.ployIndex].product = PRODUCT(val[0])
        this.group[this.groupIndex].ployTabs[this.ployIndex].product = val
        // this.group[this.groupIndex].ployTabs[this.ployIndex].productIds = val.map(n => n.id)
        // 校验
        this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.product`)
      } else {
        Message({
          message: '请选择至少一项',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    // 选择权益
    addInterest(item) {
      this.$refs.interestRef && this.$refs.interestRef.resetAll()
      this.showInterest = true
    },
    // 选择权益-确定
    submitInterest() {
      const val = this.$refs.interestRef.getVal()
      if (val.length) {
        this.showInterest = false
        this.group[this.groupIndex].ployTabs[this.ployIndex].interest = val
        // 校验
        this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.interest`)
      } else {
        Message({
          message: '请选择至少一项',
          type: 'error',
          duration: 5 * 1000
        })
      }
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

    // 添加渠道
    handleCommandChannel(index, item) {
      CHANNEL_OPT.forEach((n, i) => {
        if (n.value === index) {
          item.channel.push(JSON.parse(JSON.stringify(n)))
        }
      })
      // 添加之后滚动到对应位置
      this.$nextTick(() => {
        const id = `#channelRef-${this.groupIndex}-${this.ployIndex}-${item.channel.length - 1}`
        const top = document.querySelector(id).getBoundingClientRect().top
        document.querySelector('.content').scrollTop = top
      })
      // 已选择的渠道禁止选择
      const tempArr = item.channel.map(n => n.value)
      item.channelOpt.forEach((n, i) => {
        n.disabled = tempArr.includes(n.value)
      })
      // 校验
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel`)
    },
    // 删除渠道
    deleteChannel(ployItem, ci) {
      // 删除该项
      ployItem.channel.splice(ci, 1)
      // 重新渲染下拉选项
      const tempArr = ployItem.channel.map(n => n.value)
      ployItem.channelOpt.forEach((n, i) => {
        n.disabled = tempArr.includes(n.value)
      })
      // 校验
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel`)
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

    // crm选择话术
    addCRMWords(ci) {
      this.$refs.wordRef && this.$refs.wordRef.resetAll()
      this.showCRMWord = true
      this.channelIndex = ci
    },

    // 短信
    addSmsWords(ci) {
      this.$refs.smsRef && this.$refs.smsRef.resetAll()
      this.showSms = true
      this.channelIndex = ci
    },
    // 微信
    addWeChatWords(ci) {
      this.$refs.smsRef && this.$refs.smsRef.resetAll()
      this.showSms = true
      this.channelIndex = ci
    },
    // 选择话术-确认
    submitWord() {
      const val = this.$refs.wordRef.getVal()
      if (val.length) {
        this.showCRMWord = false
        this.group[this.groupIndex].ployTabs[this.ployIndex].channel[this.channelIndex].model = val
        // 校验
        this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${this.channelIndex}.model`)
      } else {
        Message({
          message: '请选择至少一项',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    // 短信/微信-确认
    submitSms() {
      const val = this.$refs.smsRef.getVal()
      if (val.length) {
        this.showSms = false
        this.group[this.groupIndex].ployTabs[this.ployIndex].channel[this.channelIndex].model = val
        // 校验
        this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${this.channelIndex}.model`)
      } else {
        Message({
          message: '请选择至少一项',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    // handlerTimingTimeBlur(vueComponent) {
    //   console.log(vueComponent)
    //   if (!vueComponent.value) {
    //     // item.value = '07:00'
    //     vueComponent.$emit('emitChange', '07:00')
    //   }
    // },
    handleTimeBlur(vueComponent, item) {
      if (!item.time) {
        item.time = parseTime(new Date(), '{h}:{i}')
      }
    },
    // 精准内测
    handleTestChange(val) {
      console.log(val)
    },
    testSelectValidator(rule, value, callback) {
      // console.log(rule, value, callback)
      const b = value.every((n, i) => {
        // console.log(isPhone(n))
        return isPhone(n)
      })
      if (!b) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
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
    word-break: break-all;
  }
  .shun-label ::v-deep .el-form-item__label {
    display: flex;
    justify-content: flex-end;
  }
  .ploy-card {
    // @include shun-text;
    // border: 1px solid #ebeef5;
    // background: #fafafa;
    // color: #444;
    // margin-bottom: 0;
    // font-size: 13px;
    // display: flex;
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
</style>
