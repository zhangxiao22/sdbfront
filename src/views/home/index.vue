<template>
  <div class="container shun-card">
    <div v-for="(box,pi) of realTabList"
         :key="pi"
         class="box">
      <div class="box-title">{{ box.mainTitle }}</div>
      <div class="card-container">
        <div v-for="(item,i) of box.list"
             :key="i"
             class="card"
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
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      cardList: [
        {
          mainTitle: '营销事件管理',
          list: [
            {
              img: require('../../assets/home/1-1.png'),
              title: '',
              desc: '',
              path: '/createEvent',
              roles: ['事件注册']
            },
            {
              img: require('../../assets/home/1-2.png'),
              title: '事件看板',
              path: '/eventBoard',
              desc: '营销结果的综合分析、反馈数据收集、为策略调整提供依据'
            },
            {
              img: require('../../assets/home/1-2.png'),
              title: '线索发布总览',
              path: '/totalBoard',
              desc: '线索发布总览的综合分析、反馈数据收集、为策略调整提供依据'
            }
          ]
        },
        {
          mainTitle: '营销资源管理',
          list: [
            {
              img: require('../../assets/home/1-2.png'),
              title: '用例库',
              desc: '',
              path: '/useCase',
              roles: ['用例管理', '线索统筹', '业务管理']

            },
            {
              img: require('../../assets/home/1-2.png'),
              title: '产品库',
              desc: '',
              path: '/product',
              roles: ['事件注册', '用例管理']

            },
            {
              img: require('../../assets/home/1-2.png'),
              title: '话术库',
              desc: '',
              path: '/word',
              roles: ['事件注册', '用例管理']

            },
            {
              img: require('../../assets/home/1-2.png'),
              title: '权益库',
              desc: '',
              path: '/interest',
              roles: ['事件注册', '用例管理']

            },
            {
              img: require('../../assets/home/1-2.png'),
              title: '短信库',
              desc: '',
              path: '/sms',
              roles: ['事件注册', '用例管理']
            }
          ]
        },
        {
          mainTitle: '系统参数设置',
          list: [
            {
              img: require('../../assets/home/1-2.png'),
              title: '系统设置',
              desc: '',
              path: '/config',
              roles: ['事件注册', '用例管理', '线索统筹', '业务管理']
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
  computed: {
    ...mapGetters([
      'roles'
    ]),
    realTabList() {
      return this.cardList.map(m => {
        return Object.assign({
          list: m.list.filter(n => {
            if (this.roles === 'admin') {
              return true
            } else {
              return n.roles ? n.roles.includes(this.roles) : true
            }
          })
        }, {
          mainTitle: m.mainTitle
        })
      })
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
    border-bottom: 1px solid #f0f2f5;
    top: 0;
    left: 0;
    right: 0;
  }
}

.container {
  padding: 28px;

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
        transition: all 0.3s;
        /*border: 1px solid transparent;*/

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);

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
  }
}
</style>
