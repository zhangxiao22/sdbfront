<template>
  <div class="preview-container">
    <div v-if="detail.id"
         class="header">
      <div class="title">
        <div class="status"
             :style="{background:colors[detail.largeStatus.value-2]}">{{ detail.status.label }}</div>
        {{ detail.name }}
        <div v-show="detail.trial"
             class="main-info-box">
          <div class="label">对照组</div>
          <div class="value">{{ detail.control }}%</div>
          <div class="value">{{ detail.sample.label }}</div>
        </div>
      </div>
      <div class="time">
        <i class="el-icon-time"
           style="margin-right:5px;" />
        {{ detail.startDate || '未知时间' }} 至 {{ detail.endDate || '未知时间' }}
        <div class="param">
          <div v-for="(item,i) of paramValue"
               :key="i"
               class="param-item">
            <el-tag type="warning">
              <i class="el-icon-price-tag" />
              {{ item.name }}
            </el-tag>
          </div>
        </div>
      </div>
      <div v-show="detail.eventAchieveList.length"
           class="group-target">
        <div v-for="(item,i) of detail.eventAchieveList"
             :key="i"
             class="item">
          <el-tag>
            <i class="el-icon-aim" />
            {{ item.name }} ≥ {{ item.value }}
          </el-tag>
        </div>
      </div>
      <div v-show="detail.desc"
           class="desc">{{ detail.desc }}</div>
    </div>
    <!-- group -->
    <div class="swiper-container group-swiper-container">
      <div class="swiper-wrapper">
        <div v-for="(item,i) of groups"
             :key="i"
             class="swiper-slide"
             :class="{active:item.active}"
             @click="handleClickSwiperSlider(i)">
          <div class="tooltip">
            <div class="g-name">{{ item.groupName }}</div>
            <el-tooltip class="item"
                        effect="dark"
                        :content="item.desc"
                        placement="top-start">
              <div class="g-desc elip">{{ item.desc }}</div>
            </el-tooltip>
            <div class="p-name elip">{{ item.count }}人</div>
            <div class="p-name-2 elip">策略：{{ groupActiveIndex === i ? mainSwiper.activeIndex + 1 : 1 }} / {{ item.ploy.length }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- swiper-no-swiping -->
    <div class="swiper-container main-swiper-container swiper-no-swiping">
      <div class="swiper-wrapper">
        <div v-for="(item,i) of ploy"
             :key="i"
             class="swiper-slide shun-card">
          <div class="ploy">
            <div class="name">
              {{ item.ployName }}
              <span class="counts">（ {{ item.range }}% ）</span>
            </div>
            <!-- 产品 -->
            <div class="preview-table-contaiber">
              <el-table :data="item.product"
                        class="preview-table"
                        size="mini"
                        style="width: 100%"
                        @expand-change="handleExpandChange">
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-form label-position="left"
                             size="mini"
                             inline
                             class="demo-table-expand">
                      <div v-for="(selfItem,selfItemIndex) of getTableColumnListByType(scope.row.firstCategory.value)"
                           :key="selfItemIndex">
                        <el-form-item :label="selfItem.label + '：'">
                          <span>{{ scope.row[selfItem.prop] }}</span>
                        </el-form-item>
                      </div>
                    </el-form>
                  </template>
                </el-table-column>
                <template v-for="(commonItem,commonItemIndex) of COMMON_COLUMN_LIST.filter(n => !n.hide)">
                  <el-table-column v-if="commonItem.prop === 'attributionUseCaseList'"
                                   :key="commonItemIndex"
                                   :show-overflow-tooltip="!item.notShowOverflowTooltip"
                                   :prop="commonItem.prop"
                                   :label="commonItem.label"
                                   :min-width="commonItem.minWidth">
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
                                   :key="commonItemIndex"
                                   :prop="commonItem.prop"
                                   :label="commonItem.label"
                                   :show-overflow-tooltip="!item.notShowOverflowTooltip"
                                   :min-width="commonItem.minWidth" />
                </template>
              </el-table>
            </div>
            <!-- 权益 -->
            <div v-show="item.interest.length"
                 class="preview-table-contaiber">
              <el-table :data="item.interest"
                        class="preview-table"
                        size="mini"
                        style="width: 100%">
                <el-table-column prop="name"
                                 min-width="120"
                                 show-overflow-tooltip
                                 label="权益名称" />
                <el-table-column prop="content"
                                 min-width="300"
                                 show-overflow-tooltip
                                 label="权益内容" />
              </el-table>
            </div>

            <!-- {{ item.channels }} -->
            <div class="channel">
              <div v-for="(channelItem,ci) of item.channels"
                   :key="ci"
                   class="channel-item">
                <div class="box">
                  <div class="left"
                       :style="{color:channelItem.iconColor}">
                    <div class="bg abs"
                         :style="{background:channelItem.iconColor}" />
                    <div class="border abs"
                         :style="{border:'1px solid '+channelItem.iconColor}" />
                    <div class="name">
                      <svg-icon class="name-icon"
                                :icon-class="channelItem.icon" />
                      {{ channelItem.label }}
                    </div>
                    <template v-for="(typeItem,x) of channelItem.type">
                      <div v-if="typeItem.id === channelItem.pushType.value"
                           :key="x"
                           class="type">
                        <i class="icon"
                           :class="typeItem.icon" />
                        {{ typeItem.name }}
                      </div>
                    </template>

                  </div>
                  <div class="right">
                    <div class="bg abs"
                         :style="{background:channelItem.iconColor}" />
                    <div class="border abs"
                         :style="{border:'1px solid '+channelItem.iconColor}" />
                    <div v-if="channelItem.pushType.value===1"
                         class="timing right-left">
                      <!-- 定时型 -->
                      <div class="range">{{ channelItem.pushTimeInfo.scheduelPushInfoVO.startDate || '未知时间' }} 至 {{ channelItem.pushTimeInfo.scheduelPushInfoVO.endDate || '未知时间' }}</div>
                      <div v-show="channelItem.timingDateValue&&channelItem.timingDateValue.length"
                           class="item-box"
                           style="margin-top:5px">
                        <div v-for="(timeItem,timeIndex) of channelItem.timingDateValue"
                             :key="timeIndex"
                             class="item">
                          <div class="date">{{ timeItem.timerTime }} </div>
                          <div class="time">{{ channelItem.pushTimeInfo.scheduelPushInfoVO.moment }}</div>
                        </div>
                      </div>
                      <div class="mode">{{ channelItem.sendMode.label }}</div>
                    </div>
                    <div v-if="channelItem.pushType.value === 2"
                         class="rule right-left">
                      <!-- 规则型 -->
                      <div class="item-box">
                        <div v-for="(timeItem,timeIndex) of channelItem.ruleValue"
                             :key="timeIndex"
                             class="item">
                          <div class="date">T + {{ timeItem.delay }}</div>
                          <div class="time">{{ timeItem.moment }}</div>
                        </div>
                      </div>
                    </div>
                    <div v-if="channelItem.pushType.value === 3"
                         class="rule right-left">
                      <!-- 触发型 -->
                      <div class="range">{{ channelItem.pushTimeInfo.triggerInfoList.startDate || '未知时间' }} 至 {{ channelItem.pushTimeInfo.triggerInfoList.endDate || '未知时间' }}</div>
                      <div class="item-box trigger">
                        <div v-for="(ruleItem,ruleIndex) of channelItem.pushTimeInfo.triggerInfoList.triggerRuleList"
                             :key="ruleIndex"
                             class="item">
                          <!-- 触发型规则名字 -->
                          <el-tooltip effect="dark"
                                      placement="top">
                            <div slot="content">
                              {{ ruleItem.triggerId.name }}
                            </div>
                            <div class="rule-name elip">
                              {{ ruleItem.triggerId.name }}
                            </div>
                          </el-tooltip>
                          <div class="time-block">
                            <div class="date">T + {{ ruleItem.triggerDate }}</div>
                            <div class="time">{{ ruleItem.triggerTime }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="right-right">
                      <!-- crm 话术 -->
                      <div v-if="channelItem.value===1"
                           class="preview-table-contaiber model">
                        <el-table :data="channelItem.scriptInfoList"
                                  class="preview-table"
                                  size="mini"
                                  style="width: 100%;">
                          <el-table-column prop="content"
                                           show-overflow-tooltip
                                           label="话术内容" />
                          <el-table-column prop="category.label"
                                           width="150"
                                           label="话术分类" />
                        </el-table>
                        <el-table v-show="channelItem.advanceSMSInfoList.length"
                                  :data="channelItem.advanceSMSInfoList"
                                  class="preview-table"
                                  size="mini"
                                  style="width: 100%;border-top:1px solid #eaeef4">
                          <el-table-column prop="content"
                                           show-overflow-tooltip
                                           label="预热短信内容" />
                          <el-table-column prop="category.label"
                                           width="100"
                                           label="话术分类" />
                        </el-table>
                        <el-table v-show="channelItem.followSMSInfoList.length"
                                  :data="channelItem.followSMSInfoList"
                                  class="preview-table"
                                  size="mini"
                                  style="width: 100%;border-top:1px solid #eaeef4;">
                          <el-table-column prop="content"
                                           show-overflow-tooltip
                                           label="跟进短信内容" />
                          <el-table-column prop="category.label"
                                           width="100"
                                           label="话术分类" />
                        </el-table>
                      </div>
                      <!-- 短信、微信 模版 -->
                      <div v-if="channelItem.value===2||channelItem.value===3"
                           class="preview-table-contaiber model">
                        <el-table :data="channelItem.meterialInfoList"
                                  class="preview-table"
                                  size="mini"
                                  style="width: 100%">
                          <el-table-column prop="content"
                                           show-overflow-tooltip
                                           label="短信内容" />
                          <el-table-column prop="category.label"
                                           width="100"
                                           label="短信分类" />
                        </el-table>
                      </div>
                      <!-- stm -->
                      <div v-if="channelItem.value===5">
                        <div style="font-size:14px;color:#888;">智能柜面助手</div>
                      </div>
                      <!-- AI -->
                      <div v-if="channelItem.value===6">
                        <div style="font-size:14px;color:#888;">智能客服</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
      <div v-show="mainSwiper.activeIndex > 0"
           class="swiper-button-prev"
           @click="prev" />
      <div v-show="mainSwiper.activeIndex < ploy.length-1"
           class="swiper-button-next"
           @click="next" />
    </div>
  </div>
</template>

<script>
// import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
// import 'swiper/css/swiper.css'
// If you use Swiper 6.0.0 or higher
import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'
import { getEventPreview } from '@/api/api'
import { CHANNEL_OPT, TIMING_OPT } from '../constant'
import { SELF_COLUMN_LIST, COMMON_COLUMN_LIST } from '@/utils'

export default {
  name: 'Preview',
  components: {
    // Swiper,
    // SwiperSlide
  },
  directives: {
    // swiper: directive
  },
  props: {
    notAutoRender: {
      type: Boolean,
      default: false
    },
    previewData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      colors: ['#ff9900', '#1890FF', '#67c23a', '#aaaaaa'],
      SELF_COLUMN_LIST,
      COMMON_COLUMN_LIST,
      groupActiveIndex: 0,
      groupSwiper: {},
      mainSwiper: {},
      detail: {},
      groups: [],
      ploy: []
    }
  },
  computed: {
    id() {
      return +this.$route.query.id
    }
  },
  watch: {
    previewData: {
      handler() {
        if (JSON.stringify(this.previewData) !== '{}') {
          this.init(this.previewData)
        }
      },
      // immediate: true,
      deep: true
    }
  },
  created() {
    if (!this.notAutoRender) {
      this.getDetail()
    }
    // this.getDetail().then(() => {
    //   this.renderSwiper()
    //   this.handleClickSwiperSlider(this.groupActiveIndex)
    // })
  },
  mounted() {
    // this.mainSwiper.update()
  },
  methods: {
    init(data) {
      this.tranform(data)
      this.$nextTick(() => {
        // 渲染swiper
        this.renderSwiper()
        this.handleClickSwiperSlider(this.groupActiveIndex)
      })
    },
    getDetail() {
      getEventPreview({ baseId: this.id }).then(res => {
        // this.previewData = res.data
        this.init(res.data)
      })
    },
    tranform(data) {
      this.detail = data.eventBaseInfo
      // 获取维度补充标签
      this.paramValue = data.groupInfo.supplyDetailList
      this.groups = data.groupInfo.groupDetailList.map((n, i) => {
        return {
          active: false,
          groupName: n.groupDetail.name,
          count: n.groupDetail.count,
          desc: n.groupDetail.desc,
          ploy: n.strategyDetailList.map(m => {
            return {
              ployName: m.name,
              range: m.range,
              product: m.productInfoList.map((product) => {
                return Object.assign({}, product, product.extraField)
              }),
              interest: m.couponInfoList,
              channels: m.strategyInfoList.map(x => {
                const item = CHANNEL_OPT.find(item => item.value === x.channel.value)
                return Object.assign({}, item, x, {
                  timingDateValue: x.pushType.value === 1
                    ? x.pushTimeInfo.scheduelPushInfoVO.interval.map(a => {
                      let timerTime
                      TIMING_OPT.forEach(b => {
                        if (b.value === x.pushTimeInfo.scheduelPushInfoVO.intervalType.value) {
                          b.children.forEach(c => {
                            if (c.value === a) {
                              timerTime = `${b.label}${c.label}`
                            }
                          })
                        }
                      })
                      return Object.assign(a, {
                        timerTime
                      })
                    }) : undefined,
                  ruleValue: x.pushType.value === 2
                    ? x.pushTimeInfo.rulePushInfoList : undefined
                })
              })
            }
          })
        }
      })
    },
    handleExpandChange() {
      this.$nextTick(() => {
        this.mainSwiper.update()
      })
    },
    getTableColumnListByType(type) {
      return SELF_COLUMN_LIST.find(n => {
        return n.type === type
      }).columnList
    },
    renderSwiper() {
      // 客群
      this.groupSwiper = new Swiper('.group-swiper-container', {
        freeMode: true,
        grabCursor: true,
        slidesPerView: 'auto',
        // loop: true
        // centeredSlides: true,
        // slidesPerView: 1.1,
        spaceBetween: 15
      })

      this.mainSwiper = new Swiper('.main-swiper-container', {
        autoHeight: true,
        // loop: true,
        // loopAdditionalSlides: 1,
        // noSwiping: true,
        // centeredSlides: true,
        slidesPerView: 1,
        spaceBetween: 20,

        observer: true,
        observeParents: true
      })
    },
    handleClickSwiperSlider(index) {
      this.groupActiveIndex = index
      this.groups.forEach((n, i) => {
        n.active = (i === index)
      })
      this.ploy = this.groups[index].ploy
      this.$nextTick(() => {
        this.mainSwiper.update()
      })
      // this.groupSwiper.slideTo(index)
      // this.mainSwiper.slideTo(index)
    },
    prev(i) {
      // this.overviewSwiper.slidePrev()
      this.mainSwiper.slidePrev()
    },
    next(i) {
      // this.overviewSwiper.slideNext()
      this.mainSwiper.slideNext()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.preview-container {
  font-size: 14px;
  padding: 20px 0;
  .header {
    padding: 0 20px;
    .status {
      height: 30px;
      border-radius: 0 20px 20px 0;
      background-color: $blue;
      color: #fff;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      padding: 0 15px;
      font-weight: bold;
      margin-left: -20px;
      margin-right: 15px;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;
      height: 24px;
      // margin-bottom: 15px;
      .main-info-box {
        height: 100%;
        display: flex;
        margin-left: 10px;
        height: 100%;
        border: 1px solid #ebeef5;
        padding: 0 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        font-size: 12px;
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.02);
        .label {
          color: #aaa;
          border-right: 1px solid #ebeef5;
          padding-right: 6px;
        }
        .value {
          padding-left: 6px;
          color: #444;
        }
      }
    }
    .time {
      font-size: 14px;
      color: #888;
      margin-top: 15px;
      display: flex;
      // align-items: center;
      align-items: baseline;
      .param {
        margin-left: 10px;
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: -8px;
        .param-item {
          margin-right: 8px;
          margin-bottom: 8px;
        }
      }
    }
    .block {
      margin-top: 15px;
      display: flex;
      font-size: 12px;
      .item {
        margin-right: 10px;
      }
    }
    .group-target {
      display: flex;
      margin-top: 15px;
      flex-wrap: wrap;

      .item {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        margin-right: 8px;
      }
    }
    .desc {
      line-height: 1.5;
      color: #aaa;
      margin-top: 3px;
      font-size: 13px;
    }
  }
  .group-swiper-container {
    font-size: 13px;
    padding: 15px 20px 5px;
    box-sizing: border-box;
    * {
      box-sizing: border-box;
    }
    .swiper-slide {
      width: 160px;
      // height: 100px;
      border: 1px solid #cdcdcd;
      border-radius: 4px;
      opacity: 0.5;
      transform: scale(0.95);
      transition: transform 0.3s;
      position: relative;
      color: #666;
      &.active {
        border: 1px solid rgba(34, 65, 145, 0.4);
        box-shadow: 0 1px 5px rgba(34, 65, 145, 0.05);
        opacity: 1;
        transform: scale(1);
        color: #444;
        .g-name {
          color: $blue;
        }
      }
      .tooltip {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 10px;
        justify-content: center;
      }
      .g-name {
        font-weight: bold;
        font-size: 14px;
        max-width: 100%;
      }
      .g-desc {
        max-width: 100%;
        margin-top: 5px;
        font-weight: 300;
        // color: #aaa;
        font-size: 10px;
      }
      .p-name {
        max-width: 100%;
        margin-top: 10px;
        font-size: 14px;
      }
      .p-name-2 {
        max-width: 100%;
        margin-top: 5px;
        font-size: 10px;
      }
    }
  }
  .main-swiper-container {
    width: 100%;
    box-sizing: border-box;
    padding: 15px 20px 20px;
    --swiper-navigation-color: #fff; /* 单独设置按钮颜色 */
    --swiper-navigation-size: 20px; /* 设置按钮大小 */
    .swiper-button-prev,
    .swiper-button-next {
      opacity: 0.3;
      transition: opacity 0.3s;
      width: 40px;
      height: 40px;
      // border: 1px solid #c6cee3;
      border-radius: 4px;
      background: $blue;
      &:hover {
        opacity: 1;
      }
    }
    .swiper-button-prev {
      left: 15px;
    }
    .swiper-button-next {
      right: 15px;
    }
    * {
      box-sizing: border-box;
    }
    .swiper-slide {
      // opacity: 0;
      // &.swiper-slide-active {
      //   opacity: 1;
      // }
      border: 1px solid #ebeef5;
      .swiper-no-swiping {
        cursor: text;
      }
      .group {
        background: #fbfcfd;
        padding: 18px;
        border-bottom: 1px solid #ebeef5;
        .group-name {
          font-size: 16px;
          font-weight: bold;
          border-left: 4px solid $blue;
          padding-left: 5px;
          color: $blue;
          display: flex;
          align-items: center;
          .counts {
            font-size: 14px;
            color: #888;
            font-weight: bold;
            span {
              font-size: 12px;
              margin-left: 4px;
            }
          }
        }

        .group-rule {
          display: flex;
          flex-wrap: wrap;
          margin-top: 15px;

          .item {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            .andor {
              margin: 0 10px;
              color: #e6a23c;
              font-size: 12px;
            }
          }
        }
        .desc {
          margin-top: 10px;
          line-height: 1.5;
          color: #888;
          font-size: 10px;
        }
      }
      .ploy {
        padding: 18px;
        .name {
          font-weight: bold;
          display: flex;
          align-items: center;
          .counts {
            font-size: 12px;
            color: #888;
            font-weight: bold;
          }
        }
      }
      .preview-table-contaiber {
        border: 1px solid #ebeef5;
        overflow: hidden;
        // display: flex;
        // min-height: 100px;
        margin-top: 15px;
        border-radius: 4px;
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.02);
        padding: 5px 0;
        background: #fbfcfd;
        &.model {
          margin-top: 0;
          background: #fff;
          .preview-table {
            ::v-deep tr:hover > td {
              background: #fff;
            }
            ::v-deep th.is-leaf,
            ::v-deep td {
              background: #fff;
            }
          }
        }

        .preview-table {
          text-align: center;
          border: none;
          &::before {
            content: none;
          }
          // ::v-deep .table-row {
          //   background: #fbfcfd;
          // }
          ::v-deep tr:hover > td {
            background: #fbfcfd;
          }
          ::v-deep th.is-leaf,
          ::v-deep td {
            border: none;
            // text-align: center;
            color: #444;
            background: #fbfcfd;
            &.el-table__expanded-cell {
              padding: 10px 50px;
              text-align: left;
              &:hover {
                background: #fbfcfd !important;
              }
              .el-form-item {
                margin: 0;
                font-weight: normal;
                .el-form-item__label {
                  font-size: 12px;
                  font-weight: 300;
                }
                .el-form-item__content {
                  font-size: 12px;
                }
              }
            }
          }
          ::v-deep th.is-leaf {
            font-weight: 300;
          }
        }
      }
      .interest {
        margin-top: 15px;
        display: flex;
        align-items: center;
        background: #fbfcfd;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        padding: 10px;
        color: #666;

        .icon {
          font-size: 30px;
          margin-right: 10px;
          color: #ccc;
        }
        .text {
          flex: 1;
          .name {
            font-size: 13px;
            line-height: 18px;
            font-weight: bold;
          }
          .desc {
            font-size: 12px;
            margin-top: 5px;
            line-height: 1.2;
          }
        }
      }
      .channel {
        margin-top: 15px;
        // display: flex;
        .channel-item {
          // padding: 10px;
          // display: flex;
          margin-bottom: 15px;
          &:last-of-type {
            margin-bottom: 0;
          }

          .box {
            display: flex;
            align-items: center;
            // position: relative;
            .left {
              z-index: 2;
              text-align: center;
              width: 80px;
              height: 60px;
              background: #fff;
              border-radius: 4px;
              text-align: center;
              display: flex;
              flex-direction: column;
              // justify-content: space-between;
              padding: 12px 0;
              position: relative;
              // overflow: hidden;
              font-weight: bold;
              text-shadow: 0 0 3px rgba(0, 0, 0, 0.1);

              .bg {
                opacity: 0.1;
                z-index: -1;
              }
              .border {
                opacity: 0.2;
                border-radius: 4px;
              }
              .name {
                display: flex;
                align-self: center;
                justify-content: center;
                font-size: 16px;
                .name-icon {
                  font-size: 13px;
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  font-size: 44px;
                  z-index: -1;
                  opacity: 0.1;
                }
              }
              .type {
                font-size: 12px;
                font-weight: normal;
                margin-top: 6px;
              }
            }
            .right {
              flex: 1;
              min-width: 0;
              min-height: 80px;
              margin-left: -40px;
              // border: 1px solid #ebeef5;
              border-radius: 4px;
              padding: 10px 10px 10px 40px;
              // box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.05);
              position: relative;
              // text-align: center;
              display: flex;
              .bg {
                opacity: 0.02;
              }
              .border {
                opacity: 0.15;
                border-radius: 4px;
              }
              .right-left {
                width: 200px;
                border-right: 1px solid #ebeef5;
                z-index: 2;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .range {
                  font-size: 14px;
                  // font-weight: bold;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .item-box {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  .item {
                    background: #fff;
                    margin-top: 5px;
                    border: 1px solid #ebeef5;
                    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.02);
                    border-radius: 4px;
                    font-size: 12px;
                    width: 160px;
                    padding: 5px 0;
                    display: inline-flex;
                    align-items: center;
                    .date {
                      width: 60%;
                      text-align: center;
                      border-right: 1px solid #ebeef5;
                      // padding-right: 10px;
                    }
                    .time {
                      width: 40%;
                      // padding-right: 10px;
                      text-align: center;
                    }
                  }
                  &.trigger {
                    .item {
                      .rule-name {
                        text-align: center;
                        border-bottom: 1px solid #ebeef5;
                        padding: 5px 10px;
                      }
                      .time-block {
                        // padding-top: 5px;
                        display: flex;
                        align-items: center;
                        .date {
                          padding: 5px 0;
                          width: 50%;
                          text-align: center;
                          border-right: 1px solid #ebeef5;
                        }
                        .time {
                          padding: 5px 0;
                          width: 50%;
                          text-align: center;
                        }
                      }
                    }
                  }
                }
                .mode {
                  font-size: 14px;
                  // font-weight: bold;
                  margin-top: 5px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              }
              .right-right {
                z-index: 2;
                flex: 1;
                min-width: 0;
                padding-left: 10px;
                line-height: 1.5;
                font-size: 15px;
                display: flex;
                flex-direction: column;
                justify-content: center;
              }
            }
          }
        }
      }
    }
  }
}
</style>
