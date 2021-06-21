<template>
  <div class="edit-container">
    <el-dialog title="编辑事件"
               width="80%"
               :visible="visible"
               :append-to-body="true"
               @close="handleClose">
      <div ref="ployRef"
           class="ploy-container">
        <el-form ref="refCustomerForm"
                 :model="{group}"
                 label-width="120px"
                 @validate="validateForm">
          <el-tabs v-model="groupName"
                   :before-leave="beforeHandleGroupTabClick">
            <!-- {{ groupIndex }}{{ ployIndex }} -->
            <el-tab-pane v-for="(groupItem,gi) of group"
                         :key="gi"
                         :name="gi+''">
              <div slot="label"
                   class="tab-label">
                {{ groupItem.name }}
                <!-- <el-tag size="mini"
                        style="margin-left:5px;">
                  {{ groupItem.people }}
                </el-tag> -->
              </div>
              <div v-show="groupItem.desc"
                   class="desc">{{ groupItem.desc }}</div>
              <!-- 策略 -->
              <div v-show="groupItem.ployTabs.length">
                <el-tabs v-model="groupItem.ployTabsValue"
                         type="card"
                         @tab-click="handleChangeTab">
                  <!-- {{ groupItem.ployTabs.map(n => n.name) }} -->
                  <el-tab-pane v-for="(ployItem,pi) of groupItem.ployTabs"
                               :key="ployItem.name"
                               :label="ployItem.title"
                               :name="ployItem.name">
                    <el-form-item label="推荐产品："
                                  :prop="'group.' + gi + '.ployTabs.' + pi + '.product'"
                                  :rules="[{
                                    required: true, message: '请选择产品', type: 'array'
                                  }]">
                      <el-button icon="el-icon-plus"
                                 type="primary"
                                 plain
                                 @click="addProduct(ployItem)">
                        添加产品
                      </el-button>
                    </el-form-item>
                    <el-table v-show="ployItem.product.length"
                              :data="ployItem.product"
                              border
                              style="width: 100%;margin-bottom:18px;">
                      <el-table-column type="expand">
                        <template slot-scope="scope">
                          <el-form label-position="left"
                                   inline
                                   class="demo-table-expand">
                            <div v-for="(item,i) in getTableColumnListByType(scope.row.firstCategory.value)"
                                 :key="i">
                              <el-form-item :label="item.label+'：'">
                                <span>{{ scope.row[item.prop] }}</span>
                              </el-form-item>
                            </div>
                          </el-form>
                        </template>
                      </el-table-column>
                      <template v-for="(item,i) of COMMON_COLUMN_LIST">
                        <el-table-column v-if="item.prop === 'attributionUseCaseList'"
                                         :key="i"
                                         :prop="item.prop"
                                         :label="item.label"
                                         :min-width="item.minWidth">
                          <template slot-scope="scope">
                            <template>
                              <template v-if="scope.row.attributionUseCaseList && scope.row.attributionUseCaseList.length">
                                <el-tooltip placement="top-start"
                                            class="hover-text">
                                  <div slot="content">
                                    <div v-for="(useItem,useItemIndex) of scope.row.attributionUseCaseList"
                                         :key="useItemIndex"
                                         style="margin:5px 0;">
                                      {{ useItem.label }}
                                    </div>
                                  </div>
                                  <span>
                                    {{ scope.row.attributionUseCaseList.length }}个用例
                                  </span>
                                </el-tooltip>
                              </template>
                              <div v-else>
                                无
                              </div>
                            </template>
                          </template>
                        </el-table-column>
                        <el-table-column v-else
                                         :key="i"
                                         :prop="item.prop"
                                         :label="item.label"
                                         :width="item.width"
                                         :min-width="item.minWidth" />
                      </template>
                      <el-table-column fixed="right"
                                       label="操作"
                                       width="100">
                        <template slot-scope="scope">
                          <el-popconfirm title="确定删除吗？"
                                         @onConfirm="deleteProduct(ployItem,scope.$index)">
                            <el-button slot="reference"
                                       type="text"
                                       style="color:#f56c6c;"
                                       size="small">删除</el-button>
                          </el-popconfirm>
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- :rules="[{
                                required: true, message: '请选择权益', type: 'array'
                              }]" -->
                    <el-form-item label="推荐权益："
                                  :prop="'group.' + gi + '.ployTabs.' + pi + '.interest'">
                      <el-button icon="el-icon-plus"
                                 type="primary"
                                 plain
                                 @click="addInterest(ployItem)">
                        添加权益
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
                                         :min-width="300"
                                         label="内容" />
                        <el-table-column fixed="right"
                                         label="操作"
                                         width="100">
                          <template slot-scope="scope">
                            <el-popconfirm title="确定删除吗？"
                                           @onConfirm="deleteInterest(ployItem,scope.$index)">
                              <el-button slot="reference"
                                         type="text"
                                         style="color:#f56c6c;"
                                         size="small">删除</el-button>
                            </el-popconfirm>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <!-- {{ ployItem.channel }} -->
                    <el-card v-for="(channelCardItem,ci) of ployItem.channel"
                             v-show="channelCardItem.value === 1"
                             :id="`channelRef-${gi}-${pi}-${ci}`"
                             :key="`${gi}-${pi}-${ci}`"
                             shadow="hover"
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
                      </div>
                      <div class="card-body">
                        <!-- crm -->
                        <template v-if="channelCardItem.value===1">
                          <el-form-item label="推荐话术："
                                        :prop="'group.' + gi + '.ployTabs.' + pi + '.channel.' + ci + '.model'"
                                        :rules="[{
                                          required: true, message: '请选择话术', type: 'array'
                                        }]">
                            <el-button icon="el-icon-plus"
                                       @click="addCRMWords(channelCardItem,ci)">
                              添加话术
                            </el-button>
                          </el-form-item>
                          <el-table v-show="channelCardItem.model.length"
                                    :data="channelCardItem.model"
                                    border
                                    style="width: 100%;margin-bottom:18px;"
                                    @cell-mouse-enter="handleMouseEnter"
                                    @cell-mouse-leave="handleMouseLeave">
                            <el-table-column label="话术内容"
                                             :min-width="400">
                              <div slot-scope="scope"
                                   class="table-desc">
                                <span>{{ scope.row.content }}</span>
                                <el-popover v-model="scope.row.isEdit"
                                            placement="top"
                                            width="300">
                                  <el-input v-model.trim="scope.row._content"
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
                                               @click="scope.row.content = scope.row._content;scope.row.isEdit = false">确定</el-button>
                                  </div>
                                  <div v-show="true"
                                       slot="reference"
                                       class="table-edit touch-tap-x"
                                       @click="scope.row._content = scope.row.content">
                                    <i class="el-icon-edit" />
                                  </div>
                                </el-popover>
                              </div>
                            </el-table-column>
                            <el-table-column prop="category.label"
                                             show-overflow-tooltip
                                             label="话术分类" />
                            <el-table-column label="操作"
                                             width="100">
                              <template slot-scope="scope">
                                <el-popconfirm title="确定删除吗？"
                                               @onConfirm="deleteWord(channelCardItem,ci,scope.$index)">
                                  <el-button slot="reference"
                                             type="text"
                                             style="color:#f56c6c;"
                                             size="small">删除</el-button>
                                </el-popconfirm>
                              </template>
                            </el-table-column>
                          </el-table>
                        </template>
                      </div>
                    </el-card>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <!-- 策略end -->
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoading"
                   @click="ensureSave">确 定</el-button>
      </div>
    </el-dialog>
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
  </div>
</template>

<script>
import { savePloy, getPloyDetail, testSms } from '@/api/api'
import gsap from 'gsap'
import Info from '@/components/Info'
import ShunDrawer from '@/components/ShunDrawer'
import TextToHtml from '@/components/TextToHtml'
import Strategy from '@/views/strategy/index'
import Product from '@/views/product/index'
import Interest from '@/views/interest/index'
import Word from '@/views/word/index'
import Sms from '@/views/sms/index'
import { isPhone } from '@/utils/validate'
import { MessageBox, Message } from 'element-ui'
import { parseTime, SELF_COLUMN_LIST, COMMON_COLUMN_LIST } from '@/utils'
import { CHANNEL_OPT } from '@/views/createEvent/constant'

export default {
  components: {
    Product, Interest, Word, ShunDrawer
  },
  props: {
    visible: {
      type: Boolean,
      default() {
        return false
      }
    }
  },

  data() {
    const _this = this
    return {
      buttonLoading: false,
      SELF_COLUMN_LIST,
      COMMON_COLUMN_LIST,
      // 单个校验时零时存放数组
      validateList: [],
      // 客群tab对应的值
      groupName: '0',
      // 人数初始值
      tweenedNumber: 0,
      // 策略侧边栏
      showStrategy: false,
      // 产品侧边栏
      showProduct: false,
      // 权益侧边栏
      showInterest: false,
      // crm话术侧边栏
      showCRMWord: false,
      // crm预热短信侧边栏
      showBeforeSms: false,
      // crm跟尾短信侧边栏
      showAfterSms: false,
      // 短信侧边栏
      showSms: false,
      // 短信发送模式的选项
      smsSendModeOpt: [
        { label: '重复下发', value: 0 },
        { label: '均分下发', value: 1 }
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
          const testStartTime = _this.$parent.baseInfoDetail.startDate
          const testEndTime = _this.$parent.baseInfoDetail.endDate
          const dateTime = parseTime(time, '{y}-{m}-{d}')
          return dateTime > testEndTime || dateTime < testStartTime
        }
      },
      channelIndex: null
    }
  },
  computed: {

    groupIndex() {
      return +this.groupName
    },
    ployIndex() {
      return this.group[this.groupIndex].ployTabs.findIndex((n, i) => {
        return n.name === this.group[this.groupIndex].ployTabsValue
      })
    },
    ployCounts() {
      let count = 0
      this.group.forEach(n => {
        count += n.ployTabs.length
      })
      return count
    }
  },
  created() {
    // this.reset()
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      // this.$refs['formRef'].resetFields()
    },
    update(row) {
      console.log('row', row)
      this.reset(row.id)
    },
    reset(id) {
      this.ployDetail(id).then(() => {
        this.$nextTick(() => {
          // 客群tab跳转到第一个
          this.beforeHandleGroupTabClick(0)
          // 清除校验
          this.$refs['refCustomerForm'].clearValidate()
        })
      })
    },
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
    // translate(obj, paramPropStr) {
    //   let val = obj
    //   paramPropStr.split('.').forEach(n => {
    //     val = val[n]
    //   })
    //   return val
    // },
    ployTranslate(ployObj, ployName) {
      // console.log(ployObj, ployIndex)
      // ployIndex tab的index下标
      return {
        abstractId: ployObj.abstractId,
        // 策略名称
        title: ployObj.name,
        // 策略tab id
        name: ployName + '',
        // 产品
        product: ployObj.productInfoList.map((product) => {
          return Object.assign({}, product, product.extraField)
        }),
        // 权益
        interest: ployObj.couponInfoList,
        channel: ployObj.strategyInfoList.filter(item => {
          if (item.channel.value === 1) {
            return true
          }
        }).map(m => {
          console.log(m)
          return Object.assign({}, CHANNEL_OPT.find(x => {
            return x.value === m.channel.value
          }), {
            // validPeriod: m.clueEffectDays,
            model: m.channel.value === 1 ? m.scriptInfoList.map(n => {
              return Object.assign({}, n, {
                _content: n.content,
                isEdit: false,
                isHover: false
              })
            }) : m.meterialInfoList
          }, (() => {
            const obj = {}
            return obj
          })())
        })
      }
    },
    ployDetail(id) {
      return new Promise((resolve, reject) => {
        getPloyDetail({ baseId: id }).then(res => {
          if (res.code === 200) {
            this.group = res.data.strategyQueryVOList.map((n, i) => {
              return {
                gid: n.customeInfoId,
                name: n.name,
                // people: n?.count,
                desc: n.desc,
                totalPercent: 100,
                ployTabs: n.strategyDetailVOList.map((n, i) => {
                  return this.ployTranslate(n, i + 1)
                }),
                // v-model值：控制策略tab显示
                ployTabsValue: '1',
                // 累加数量：策略数量的累加,用于显示‘新策略几’
                ployTabIndex: n.strategyDetailVOList.length
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
    // 切换策略
    handleChangeTab() {
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.title`)
    },
    validateForm(rule, validate, message) {
      // console.log(a, b, c)
      this.validateList.push({
        rule,
        validate,
        message
      })
    },
    ensureSave() {
      this.$refs.refCustomerForm.validate((valid, field) => {
        // console.log(valid, field)
        if (valid) {
          // 客群
          // console.log(this.group)
          const data = this.group.map((gn, gi) => {
            return {
              // 客群id
              // customerInfoId: gn.gid,
              // 策略
              strategyDetailList: gn.ployTabs.map((pn, pi) => {
                return {
                  // 策略id
                  abstractId: pn.abstractId,
                  // 产品id
                  productIdList: pn.product.map(n => n.id),
                  // 权益id
                  couponIdList: pn.interest.map(n => n.id),
                  // 渠道
                  strategyInfoList: pn.channel.map((cn, ci) => {
                    // console.log(cn)
                    return {
                      // 渠道id
                      // infoId: cn.infoId,
                      // 渠道类型 1:crm 2:短信 3:微信
                      channel: cn.value,
                      // 话术id
                      scriptList: cn.value === 1 ? cn.model.map(n => {
                        return {
                          scriptId: n.id,
                          scriptContent: n.content,
                          scriptInstId: n.scriptInstId
                        }
                      }) : undefined
                    }
                  })
                }
              })
            }
          })
          // console.log(data)
          // reject()
          const param = {
            // baseId: this.id,
            strategySaveCriteriaList: data
          }
          console.log('param', param)
          savePloy(param).then(res => {
          }).catch(() => {
          })
        } else {
          // console.log(field)
          let errList = Object.keys(field).map(key => this.getIndex(key))
          errList = this.sortIndex(errList)
          // console.log(errList, '???')
          const [gi, pi] = errList[0]
          // console.log(gi, pi)
          this.groupName = gi + ''
          this.$nextTick(() => {
            // console.log(this.group[gi])
            if (!isNaN(pi)) {
              // console.log(this.group[gi].ployTabs[pi].name)
              this.group[gi].ployTabsValue = this.group[gi].ployTabs[pi].name
            }
          })
          this.isSubmit = false
        }
      })
    },

    beforeHandleGroupTabClick(activeName, oldActiveName) {
      this.animateNum(+activeName)
    },

    animateNum(i) {
      this.tweenedNumber = 0
      // const num = this.group[i].people.toFixed(0)
      // gsap.to(this.$data, { duration: 0.5, tweenedNumber: num })
      gsap.to(this.$data, { duration: 0.5 })
    },

    // 选择产品
    addProduct(item) {
      // console.log(item.product)
      // this.$refs.productRef && this.$refs.productRef.resetAll()
      this.showProduct = true
      this.$nextTick(() => {
        this.$refs.productRef.reset()
        this.$refs.productRef.parentRef.setSelection(item.product)
      })
    },
    // 删除产品
    deleteProduct(item, i) {
      // console.log(item.product, row)
      item.product.splice(i, 1)
      // 校验
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.product`)
    },
    // 选择产品-确定
    submitProduct() {
      const val = this.$refs.productRef.parentRef.getVal()
      if (val.length) {
        this.showProduct = false
        this.group[this.groupIndex].ployTabs[this.ployIndex].product = val
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
    getTableColumnListByType(type) {
      return SELF_COLUMN_LIST.find(n => {
        return n.type === type
      }).columnList
    },

    // 选择权益
    addInterest(item) {
      this.showInterest = true
      this.$nextTick(() => {
        this.$refs.interestRef.reset()
        this.$refs.interestRef.parentRef.setSelection(item.interest)
      })
    },
    // 删除权益
    deleteInterest(item, i) {
      item.interest.splice(i, 1)
      // 校验
      // this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.interest`)
    },
    // 选择权益-确定
    submitInterest() {
      const val = this.$refs.interestRef.parentRef.getVal()
      if (val.length) {
        this.showInterest = false
        this.group[this.groupIndex].ployTabs[this.ployIndex].interest = val
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

    // 话术
    handleMouseEnter(row, column, cell, event) {
      // console.log(row)
      row.isHover = true
    },
    handleMouseLeave(row, column, cell, event) {
      // console.log(row)
      row.isHover = false
    },
    // crm选择话术
    addCRMWords(item, ci) {
      this.showCRMWord = true
      this.$nextTick(() => {
        this.$refs.wordRef.reset()
        this.$refs.wordRef.parentRef.setSelection([])
      })
      this.channelIndex = ci
    },

    // 删除话术
    deleteWord(item, ci, i) {
      item.model.splice(i, 1)
      this.channelIndex = ci

      // 校验
      this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${this.channelIndex}.model`)
    },
    // 选择话术-确认
    submitWord() {
      const val = this.$refs.wordRef.parentRef.getVal()
      if (val.length) {
        this.showCRMWord = false
        this.group[this.groupIndex].ployTabs[this.ployIndex].channel[this.channelIndex].model.push(
          ...val.map(n => {
            return Object.assign({}, n, {
              _content: n.content,
              isEdit: false,
              isHover: false
            })
          })
        )
        // 校验
        this.$refs.refCustomerForm.validateField(`group.${this.groupIndex}.ployTabs.${this.ployIndex}.channel.${this.channelIndex}.model`)
      } else {
        Message({
          message: '请选择至少一项',
          type: 'error',
          duration: 5 * 1000
        })
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
  ::v-deep th.is-leaf,
  ::v-deep td {
    &.el-table__expanded-cell {
      padding: 10px 50px;
      text-align: left;
      .el-form-item {
        margin: 0;
        font-weight: normal;
        .el-form-item__label {
          font-size: 12px;
          color: #909399;
        }
        .el-form-item__content {
          font-size: 12px;
        }
      }
    }
  }
  .tab-label {
    display: flex;
    align-items: center;
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
    background: #fefdfc;
    margin-bottom: 18px;
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
    ::v-deep .el-card__body {
      padding-bottom: 2px;
    }
    .table-desc {
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
