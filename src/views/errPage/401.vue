<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="12">
        <h2>你没有权限去该页面</h2>
        <h4>请重新登录或联系管理员</h4>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'Page401',
  data() {
    return {
      // errGif: errGif + '?' + +new Date(),
      // ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
      // dialogVisible: false
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
}
</style>
