<template>
  <div class="container">
    <div class="timeline-container">
      <div v-for="(item,i) of visibleList"
           :key="i"
           :class="{last:!copy_showHistory&&i === visibleList.length-1}"
           class="item">
        <div class="content-box">
          <b class="title">{{ item.title }}</b>
          <span class="user">（张三）</span>
          <span class="time">{{ item.timestamp }}</span>
        </div>
        <div class="desc">{{ item.desc }}</div>
      </div>
      <div>
        <el-collapse-transition>
          <div v-show="showHistory">
            <div v-for="(item,i) of hiddenList"
                 :key="i"
                 :class="{last:copy_showHistory&&i === hiddenList.length-1}"
                 class="item">
              <div class="content-box">
                <b class="title">{{ item.title }}</b>
                <span class="user">（张三）</span>
                <span class="time">{{ item.timestamp }}</span>
              </div>
              <div class="desc">{{ item.desc }}</div>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <el-button class="more"
                 type="text"
                 @click="showHistory=!showHistory">{{ showHistory?'收起':'查看更多' }}
        <i :class="showHistory?'el-icon-arrow-up':'el-icon-arrow-down'"
           style="margin-left:5px;" />
      </el-button>
    </div>

  </div>
</template>

<script>

export default {
  components: {
  },

  data() {
    return {
      showHistory: true,
      copy_showHistory: true,
      list: [{
        title: '活动按期开始',
        desc: '大法的 aside大撒发大法的 aside大撒',
        timestamp: '2018-04-15',
        user: ['dasfdas', 'asdfdasf']
      }, {
        title: '通过审核',
        desc: '大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的',
        user: ['dasfdas'],
        timestamp: '2018-04-13'
      }, {
        desc: '大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的',
        title: '创建成功',
        timestamp: '2018-04-11'
      },
      {
        desc: '大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的',
        title: '创建成功',
        timestamp: '2018-04-11'
      }, {
        desc: '大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的',
        title: '创建成功',
        timestamp: '2018-04-11'
      }, {
        desc: '大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的',
        title: '创建成功',
        timestamp: '2018-04-11'
      }, {
        desc: '大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的 aside大撒发大法的',
        title: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  },
  computed: {
    visibleList() {
      return this.list.slice(0, 3)
    },
    hiddenList() {
      return this.list.slice(3)
    }

  },

  watch: {
    showHistory() {
      setTimeout(() => {
        this.copy_showHistory = this.showHistory
      }, this.showHistory ? 300 : 0)
    }
  },
  created() {
    setTimeout(() => {
      // this.form.name = 'aaaaa'
    }, 3000)
  },
  mounted() {

  },
  methods: {
    click() {
      // this.form.id = '11'
      // this.form.name = '22'
      // this.form.role = '333'
      // this.form = {
      //   name: '222'
      // }
      console.log(this.$refs['formRef'])
      this.showDialog = !this.showDialog
      setTimeout(() => {
        this.form.name = 'aaaaa'
      })
    },
    change(aa) {
      // console.log(aa)
      // this.form.name = 'aaaaa'
    },
    cancelAddList() {
      console.log(this.$refs['formRef'])
      this.$refs['formRef'].resetFields()
      // this.showDialog = false
    },
    cancelAddList111() {
      console.log(this.$refs['formRef'])
      this.$refs['formRef'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .timeline-container {
    position: relative;
    padding-left: 20px;
    .item {
      width: 500px;
      margin-bottom: 15px;
      // border: 1px solid;
      position: relative;
      &::after {
        position: absolute;
        content: "";
        left: -20px;
        width: 1px;
        top: 10px;
        bottom: -25px;
        background: $blue;
        transform: translateX(4px);
      }
      &.last {
        margin-bottom: 0;
        &::after {
          content: none;
        }
      }
      .content-box {
        display: flex;
        height: 16px;
        position: relative;
        &::before {
          position: absolute;
          content: "";
          left: -20px;
          width: 10px;
          height: 10px;
          top: 50%;
          background: $blue;
          border-radius: 50%;
          transform: translateY(-50%);
        }
        .title {
          font-size: 14px;
        }
        .user {
        }
        .time {
          margin-left: auto;
        }
      }
      .desc {
        font-size: 11px;
        margin-top: 5px;
        color: #888;
      }
    }
    .more {
      // position: absolute;
    }
  }
}
</style>
