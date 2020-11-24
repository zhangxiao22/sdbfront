<template>
  <div class="wscn-http401-container">
    <div class="wscn-http404">

      <div class="bullshit">
        <h2 class="center-center">
          <svg-icon class="lock"
                    :style="lockStyle"
                    icon-class="lock" />
          您没有权限访问该页面
        </h2>
        <h4 style="padding-left:60px;">请重新登录或联系管理员</h4>
      </div>
    </div>
  </div>
</template>

<script>

const getRandomColor = () => {
  let x = Math.floor(Math.random() * 16777215).toString(16)
  if (x === 'ffffff') {
    x = Math.floor(Math.random() * 16777215).toString(16)
  }
  return '#' + x
}

export default {
  name: 'Page401',
  data() {
    return {
      lockStyle: {
        color: getRandomColor()
      }
    }
  },
  computed: {
  },
  mounted() {
    setInterval(() => {
      this.lockStyle.color = getRandomColor()
    }, 3000)
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
    transition: all 1s;
  }
}
</style>
