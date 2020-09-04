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
                 label-width="100px">
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
                  <el-table-column prop="amount1"
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
                              label="下发渠道：">
                  <el-dropdown trigger="click"
                               size="medium"
                               @command="handleCommandChannel($event,ployItem)">
                    <el-button>
                      选择添加<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-for="(channelItem,i) of ployItem.channelOpt"
                                        :key="i"
                                        :disabled="channelItem.disabled"
                                        :command="channelItem.value">
                        <svg-icon style="margin-right:4px;"
                                  :icon-class="channelItem.icon" />
                        {{ channelItem.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
                <!-- {{ ployItem.channel }} -->
                <el-card v-for="(channelCardItem,i) of ployItem.channel"
                         :key="i"
                         shadow="hover"
                         style="margin-bottom:18px;"
                         class="channel-card">
                  <div slot="header"
                       class="clearfix">
                    <span style="font-weight:bold;">
                      <svg-icon class="name-icon"
                                :style="{color:channelCardItem.iconColor}"
                                :icon-class="channelCardItem.icon" />
                      {{ channelCardItem.label }}
                    </span>

                    <el-popconfirm title="确定删除改渠道吗？">
                      <el-button slot="reference"
                                 class="channel-card-delete"
                                 type="text">
                        删除
                      </el-button>
                    </el-popconfirm>

                  </div>
                  <template v-if="channelCardItem.value==='1'">
                    1111crm
                    <div>
                      {{ channelCardItem.name }}</div>
                  </template>
                  <template v-if="channelCardItem.value==='2'">
                    2222 微信
                    <div>{{ channelCardItem.name }}</div>
                  </template>
                  <template v-if="channelCardItem.value==='3'">
                    3333 短信
                    <div>{{ channelCardItem.name }}</div>
                  </template>
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
  </div>
</template>

<script>
import gsap from 'gsap'
import Product from '@/views/product/index'
const CHANNEL_OPT = [{
  value: '1',
  label: 'CRM',
  disabled: false,
  icon: 'phone',
  iconColor: '#409eff',
  type: [{
    id: '1',
    name: '定时型_CRM'
  }]
}, {
  value: '2',
  label: '短信',
  disabled: false,
  icon: 'sms',
  iconColor: '#FF9933',
  type: [{
    id: '1',
    name: '定时型_短信'
  }]
}, {
  value: '3',
  label: '微信',
  disabled: false,
  icon: 'wechat',
  iconColor: '#67c23a',
  type: [{
    id: '1',
    name: '定时型_微信'
  }]
}]
export default {
  components: {
    Product
  },
  data() {
    return {
      groupName: '0',
      // 人数初始值
      tweenedNumber: 0,
      // 产品侧边栏
      showProduct: false,
      group: [
        {
          name: '群组1',
          people: 221324,
          desc: '客群描述客群描述客群描述客群描述客群描述客群描述客群描述苏打粉',
          ployTabs: [{
            title: '新策略',
            name: '1',
            product: {
              groupName: '组合A',
              amount1: '3.065-3.385%',
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
      }
      // activeNames: []
      //
      // editableTabsValue: '0',
      // editableTabs: [],
      // tabIndex: 0
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
    addTab(gi) {
      const newTabName = ++this.group[gi].ployTabIndex + ''
      this.group[gi].ployTabs.push({
        title: '新策略' + newTabName,
        name: newTabName,
        // 产品
        product: {},
        // 渠道
        channel: [],
        channelOpt: JSON.parse(JSON.stringify(CHANNEL_OPT))
      })
      this.group[gi].ployTabsValue = newTabName
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
        })
        .catch(() => {
        })
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
    parseTable(data) {
      return data.list.map((n, i) => {
        return Object.assign({
          groupName: data.groupName,
          amount1: data.amount1,
          total: data.list.length
        }, n)
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'groupName' || column.property === 'amount1') {
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
          item.channel.push(n)
        }
      })
      const tempArr = item.channel.map(n => n.value)
      item.channelOpt.forEach((n, i) => {
        n.disabled = tempArr.includes(n.value)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.ploy-container {
  padding: 0 20px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .left {
      color: #888;
      font-size: 14px;
      flex: 1;
      b {
        color: #444;
        font-size: 18px;
      }
    }
  }
  .desc {
    padding: 8px 16px;
    background: #ecf5ff;
    border-radius: 4px;
    font-size: 12px;
    color: $blue;
    line-height: 1.5;
    margin-bottom: 15px;
  }
  .channel-card {
    .name-icon {
      margin-right: 5px;
      color: $blue;
      font-size: 20px;
    }
    .channel-card-delete {
      float: right;
      padding: 3px 0;
      color: rgb(245, 108, 108);
      &:hover {
        opacity: 0.8;
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
