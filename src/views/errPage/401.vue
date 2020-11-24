<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">

      <div class="bullshit">
        <h2>您没有权限访问该页面</h2>
        <h4>请重新登录或联系管理员</h4>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Page401'
}
</script>

<style lang="scss" scoped>
.wscn-http404-container {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
</style>
