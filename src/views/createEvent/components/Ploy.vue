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
              <el-tab-pane v-for="(item,pi) of groupItem.ployTabs"
                           :key="item.name"
                           :label="item.title"
                           :name="item.name">
                <el-form-item label="策略名称：">
                  <el-input v-model="item.title"
                            style="width:300px"
                            placeholder="请输入策略名称" />
                </el-form-item>
                <el-form-item label="推荐产品：">
                  <el-button icon="el-icon-plus"
                             @click="addProduct(gi,pi)">
                    选择产品
                  </el-button>
                </el-form-item>
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
          确认
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import gsap from 'gsap'
import Product from '@/views/product/index'
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
            name: '1'
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
      ]

      //
      // editableTabsValue: '0',
      // editableTabs: [],
      // tabIndex: 0
    }
  },
  computed: {
    animatedNumber: function () {
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
        name: newTabName
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
      console.log(gi, pi)
      this.showProduct = true
    },
    submitProduct() {
      const val = this.$refs.productRef.getVal()
      console.log(val)
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
