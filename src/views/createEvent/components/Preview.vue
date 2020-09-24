<template>
  <div class="preview-container">
    <div class="header">
      <div class="title">
        AUM增长计划
        <el-tag style="margin-left:10px;">什么事件类型</el-tag>
        <div class="main-info-box">
          <div class="label">对照组</div>
          <div class="value">15%</div>
          <div class="value">随机抽样</div>
        </div>
      </div>
      <div class="time">
        <i style="color:#5CB87A;"
           class="el-icon-time" />
        2020-01-11 至 2020-01-22
      </div>
      <div class="group-target">
        <div class="item">
          <el-tag type="success">
            <i class="el-icon-aim" />
            拉新人数 > 300人/月
          </el-tag>
        </div>
        <div class="item">
          <el-tag type="success">
            <i class="el-icon-aim" />
            拉新人数 > 300人/月
          </el-tag>
        </div>
      </div>
      <div class="desc">描述文字描述诉讼法描述大撒发苏打粉描述描述描述大撒发撒的描述描述描述大撒发撒上描述文字描述诉讼法描述大撒发苏打粉描述描述描述大撒发撒的描述描述描述大撒发撒上描述文字描述诉讼法描述大撒发苏打粉描述描述描述大撒发撒的描述描述描述大撒发撒上描述文字描述诉讼法描述大撒发苏打粉描述描述描述大撒发撒的描述描述描述大撒发撒上</div>
    </div>
    <div class="swiper-container overview-swiper-container">
      <div class="swiper-wrapper">
        <div v-for="(item,i) of mainData"
             :key="i"
             class="swiper-slide"
             :class="{active:i===mainSwiper.activeIndex}"
             @click="handleClickSwiperSlider(i)">
          <el-tooltip effect="dark"
                      content="群组名称-策略名称名称"
                      placement="top">
            <div class="tooltip">
              <div class="g-name elip">群组名称是{{ i+1 }}</div>
              <div class="p-name elip">策略名称名称{{ i+1 }}</div>
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="swiper-container main-swiper-container swiper-no-swiping">
      <div class="swiper-wrapper">
        <div v-for="(item,i) of mainData"
             :key="i"
             class="swiper-slide shun-card">
          <div class="group">
            <div class="group-name">
              群组名称是什么{{ i+1 }}
              <span class="counts">（ 12,213<span>人</span> ）</span>
            </div>
            <div class="group-rule">
              <div class="item">
                <el-tag type="warning">
                  <i class="el-icon-tickets" />
                  是否受薪客户：是
                </el-tag>
              </div>
              <div class="item">
                <span class="andor">且</span>
                <el-tag type="warning">
                  <i class="el-icon-tickets" />
                  AUM余额 > 100元
                </el-tag>
              </div>
              <div class="item">
                <span class="andor">或</span>
                <el-tag type="warning">
                  <i class="el-icon-tickets" />
                  定期_当天 购买次数 > 10次
                </el-tag>
              </div>
            </div>
            <div class="desc">群组描述什么群组描述什么群组描述什么群组描述什么群组描述什么群组描述什么群组描述什么</div>
          </div>
          <div class="ploy">
            <div class="name">
              策略名称名称{{ i+1 }}
              <span class="counts">（ 50% ）</span>
            </div>
            <div class="product">
              <div class="left">
                <div class="item">
                  <div class="lab">组合名称</div>
                  <div class="val">{{ product.groupName }}</div>
                </div>
                <div class="item">
                  <div class="lab">综合收益</div>
                  <div class="val">{{ product.income }}</div>
                </div>
              </div>
              <div class="right">
                <el-table :data="product.list"
                          class="product-table"
                          size="mini"
                          style="width: 100%">
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
              </div>
            </div>
            <el-alert title="权益权益权益权益权益苏打粉权益权益权益阿迪撒发多少分权益权益权益大撒发大撒发v"
                      class="interest"
                      type="warning"
                      :closable="false" />
            <div class="channel">
              <div v-for="(item,i) of channel"
                   :key="i"
                   class="channel-item">
                <div class="box">
                  <div class="left"
                       :style="{color:item.iconColor}">
                    <div class="bg abs"
                         :style="{background:item.iconColor}" />
                    <div class="border abs"
                         :style="{border:'1px solid '+item.iconColor}" />
                    <div class="name">
                      <svg-icon class="name-icon"
                                :icon-class="item.icon" />
                      {{ item.label }}
                    </div>
                    <template v-for="(typeItem,x) of item.type">
                      <div v-if="typeItem.id === item.chooseType"
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
                         :style="{background:item.iconColor}" />
                    <div class="border abs"
                         :style="{border:'1px solid '+item.iconColor}" />
                    <div v-if="item.chooseType==='1'"
                         class="timing right-left">
                      <!-- 定时型 -->
                      <div class="range">2020-01-02 <span>至</span> 2020-01-20</div>
                      <div class="item-box"
                           style="margin-top:5px">
                        <div class="item">
                          <div class="date">每月1号</div>
                          <div class="time">09:00</div>
                        </div>
                        <div class="item">
                          <div class="date">每月10号</div>
                          <div class="time">09:00</div>
                        </div>
                        <div class="item">
                          <div class="date">每月10号</div>
                          <div class="time">09:00</div>
                        </div>
                      </div>
                    </div>
                    <div v-if="item.chooseType==='2'"
                         class="rule right-left">
                      <!-- 规则型 -->
                      <div class="item-box">
                        <div class="item">
                          <div class="date">T + 1</div>
                          <div class="time">09:00</div>
                        </div>
                        <div class="item">
                          <div class="date">T + 2</div>
                          <div class="time">09:00</div>
                        </div>
                      </div>
                    </div>
                    <div class="right-right">话术话术模版模版话术话术模版模版话术话术模版模版话术话术模版模版话术话术模版模版</div>
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
      <div v-show="mainSwiper.activeIndex < mainData.length-1"
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
export default {
  name: 'Preview',
  components: {
    // Swiper,
    // SwiperSlide
  },
  directives: {
    // swiper: directive
  },
  data() {
    return {
      mainSwiper: {},
      mainData: [
        {
          active: false
        },
        {
          active: false
        },
        {
          active: false
        },
        {
          active: false
        },
        {
          active: false
        }
      ],
      channel: [
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
          chooseType: '2',
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
      ],
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
      }
    }
  },
  computed: {
    // swiper() {
    //   return this.$refs.mySwiper.$swiper
    // }
  },
  watch: {

  },
  mounted() {
    this.$nextTick(() => {
      // 小图
      this.overviewSwiper = new Swiper('.overview-swiper-container', {
        // loop: true,
        freeMode: true,
        grabCursor: true,
        slidesPerView: 'auto',
        // loop: true
        // centeredSlides: true,
        // slidesPerView: 1.1,
        spaceBetween: 20,
        watchSlidesVisibility: true, // 防止不可点击
        // slideToClickedSlide: true,
        on: {

        }
      })
      this.mainSwiper = new Swiper('.main-swiper-container', {
        autoHeight: true,
        // loop: true,
        // loopAdditionalSlides: 1,
        noSwiping: true,
        centeredSlides: true,
        slidesPerView: 1.1,
        spaceBetween: 20

        // thumbs: {
        //   swiper: overviewSwiper
        // }
        // grabCursor: true
        // observer: true,
        // observeParents: true
      })
    })
  },
  methods: {
    handleClickSwiperSlider(index) {
      console.log(index)
      this.mainSwiper.slideTo(index)
      // this.mainData.forEach((n, i) => {
      //   n.active = (i === index)
      // })
    },
    prev(i) {
      // const index = i - 1 < 0 ? this.mainData.length - 1 :
      // this.handleClickSwiperSlider(i - 1)
      this.mainSwiper.slidePrev()
    },
    next(i) {
      // const index = i + 1 >= this.mainData.length ? 0 :
      // this.handleClickSwiperSlider(i + 1)
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
    .title {
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;
      height: 24px;
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
  .overview-swiper-container {
    font-size: 13px;
    padding: 15px 20px 5px;
    box-sizing: border-box;
    * {
      box-sizing: border-box;
    }
    .swiper-slide {
      width: 120px;
      height: 60px;
      border: 1px solid #cdcdcd;
      border-radius: 4px;
      font-weight: bold;
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
      }
      .tooltip {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 10px;
        justify-content: center;
      }
      .g-name {
        max-width: 100%;
      }
      .p-name {
        max-width: 100%;
        margin-top: 10px;
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
      opacity: 0.8;
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
          margin-top: 3px;
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
      .product {
        border: 1px solid #ebeef5;
        overflow: hidden;
        display: flex;
        min-height: 100px;
        margin-top: 15px;
        border-radius: 4px;
        box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.02);
        .left {
          width: 120px;
          text-align: center;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          &:after {
            content: "";
            position: absolute;
            right: 0;
            top: 15px;
            width: 1px;
            bottom: 15px;
            background: #ebeef5;
          }
          // padding-top: 15px;
          .item {
            .lab {
              font-size: 10px;
              font-weight: lighter;
            }
            .val {
              // font-weight: bold;
              margin-top: 5px;
            }
          }
        }
        .right {
          flex: 1;
          min-width: 0;
          .product-table {
            text-align: center;
            border: none;
            &::before {
              content: none;
            }
            ::v-deep tr:hover > td {
              background: none;
            }
            ::v-deep th.is-leaf,
            ::v-deep td {
              border: none;
              text-align: center !important;
              color: #444;
              // font-weight: bold;
            }
            ::v-deep th.is-leaf {
              font-weight: lighter;
            }
          }
        }
      }
      .interest {
        margin-top: 15px;
        padding: 8px;
        background: #fff4ed;
        color: #f78539;
      }
      .channel {
        margin-top: 15px;
        // display: flex;
        .channel-item {
          // padding: 10px;
          // display: flex;
          margin-bottom: 15px;

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
                .range {
                  font-size: 14px;
                  // font-weight: bold;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  span {
                    font-size: 12px;
                    color: #888;
                    margin: 0 5px;
                  }
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
                    padding: 5px 0;
                    border-radius: 4px;
                    // margin: 0 5px;
                    font-size: 12px;
                    width: 160px;
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
                }
              }
              .right-right {
                z-index: 2;
                flex: 1;
                min-width: 0;
                padding: 10px;
                line-height: 1.5;
                font-size: 15px;
                @include center-center;
              }
            }
          }
        }
      }
    }
  }
}
</style>
