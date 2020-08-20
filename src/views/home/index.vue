<template>
  <div class="container">
    <div v-for="(box,pi) of cardList"
         :key="pi"
         class="box">
      <div class="box-title">{{ box.main_title }}</div>
      <div class="card-container">
        <div v-for="(item,i) of box.list"
             :key="i"
             class="card"
             :class="item.type"
             :style="{backgroundImage:'url('+item.img+')'}"
             @click="handleClick(item.path)">
          <div class="title">{{ item.title }}</div>
          <div class="desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>
    <div class="button-box">
      <div class="box-title">常用工具</div>
      <div class="button-container">
        <el-button v-for="(item,i) of buttonList"
                   :key="i"
                   type="primary"
                   class="button">
          {{ item.name }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cardList: [
        {
          main_title: '营销事件管理',
          list: [
            {
              img: require('../../assets/home/1-1.png'),
              title: '',
              desc: '',
              path: '/createEvent'
            },
            {
              img: require('../../assets/home/1-2.png'),
              title: '营销结果看板',
              desc: '营销结果的综合分析、反馈数据收集、为策略调整提供依据'
            },
            {
              img: require('../../assets/home/1-2.png'),
              title: '事件看板',
              desc: '营销结果的综合分析、反馈数据收集、为策略调整提供依据'
            }
          ]
        },
        {
          main_title: '营销资源管理',
          list: [
            {
              img: require('../../assets/home/1-2.png'),
              title: '可用模型',
              desc: ''
            },
            {
              img: require('../../assets/home/1-2.png'),
              title: '可用策略',
              desc: ''
            },
            {
              img: require('../../assets/home/1-2.png'),
              title: '产品库',
              desc: ''
            },
            {
              img: require('../../assets/home/1-2.png'),
              title: '话术库',
              desc: ''
            },
            {
              img: require('../../assets/home/1-2.png'),
              title: '渠道管理',
              desc: ''
            }
          ]
        },
        {
          main_title: '系统参数设置',
          list: [
            {
              img: require('../../assets/home/1-2.png'),
              title: '用户角色设置',
              desc: '',
              type: 'small'
            },
            {
              img: require('../../assets/home/1-2.png'),
              title: '参数设置',
              desc: '',
              type: 'small'
            },
            {
              img: require('../../assets/home/1-2.png'),
              title: '其他设置',
              desc: '',
              type: 'small'
            }
          ]
        }
      ],
      buttonList: [
        {
          name: 'CRM',
          path: ''
        },
        {
          name: '数据中台',
          path: ''
        },
        {
          name: '大零售系统',
          path: ''
        },
        {
          name: '其他',
          path: ''
        }
      ]
    }
  },
  watch: {},
  methods: {
    handleClick(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

@mixin top-line {
  position: relative;
  padding-top: 28px;

  &:before {
    content: "";
    position: absolute;
    height: 0;
    border-bottom: 2px solid #f0f2f5;
    top: 0;
    left: -28px;
    right: -28px;
  }
}

.container {
  padding: 28px;
  background: #fff;

  .box {
    margin-bottom: 28px;

    &:nth-of-type(3) {
      @include top-line;
    }

    .box-title {
      font-size: 18px;
      font-weight: bold;
    }

    .card-container {
      display: flex;
      flex-wrap: wrap;

      .card {
        width: 240px;
        height: 132px;
        margin-right: 20px;
        margin-top: 20px;
        padding: 16px;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
        border-radius: 4px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        /*border: 1px solid transparent;*/
        &.small {
          height: 108px;
        }

        &:hover {
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.35);

          .title {
            font-weight: bolder;
          }

          .desc {
            display: block;
          }
        }

        /*&:first-of-type {*/
        /*margin-left: 0;*/
        /*}*/

        .title {
          font-size: 18px;
        }

        .desc {
          font-weight: light;
          font-size: 12px;
          line-height: 1.5;
          display: none;
        }
      }
    }
  }

  .button-box {
    @include top-line;

    .button-container {
      margin-top: 15px;
    }

    .button {
      margin-right: 20px;
      margin-left: 0;
      background: #668ae9;
      border-color: #668ae9;
    }
  }
}
</style>
