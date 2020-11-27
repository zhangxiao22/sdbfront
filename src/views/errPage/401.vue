<template>
  <div class="wscn-http401-container">
    <div class="wscn-http404">

      <div class="bullshit">
        <div class="center-center"
             style="font-size:20px;font-weight:bold;margin:20px 0;">
          <svg-icon class="lock"
                    :style="lockStyle"
                    icon-class="lock" />
          您没有权限访问该页面
        </div>
        <h4 style="padding-left:60px;">请重新登录或联系管理员</h4>
      </div>
    </div>
  </div>
</template>

<script>

// const getRandomColor = () => {
//   let x = Math.floor(Math.random() * 16777215).toString(16)
//   if (x === 'ffffff' || x === '000000') {
//     x = getRandomColor()
//   }
//   return '#' + x
// }

const COLORS = ['#FF3300', '#FF00FF', '#FF6600', '#FF9900', '#66CC33', '#66CCFF', '#660099', '#660000']

export default {
  name: 'Page401',
  data() {
    return {
      index: 0,
      lockStyle: {
        color: COLORS[0]
      }
    }
  },
  computed: {
  },
  mounted() {
    this.time = setInterval(() => {
      if (this.index >= COLORS.length - 1) {
        this.index = 0
      } else {
        this.index += 1
      }
      this.lockStyle.color = this.getColor()
    }, 2000)
  },
  destroyed() {
    clearInterval(this.time)
  },
  methods: {
    getColor() {
      return COLORS[this.index]
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http401-container {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
  .lock {
    font-size: 40px;
    margin-right: 20px;
    transition: all 0.3s;
  }
}
</style>
