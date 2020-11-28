<template>
  <div class="container">
    <div>
      <el-button @click="show3 = !show3">Click Me</el-button>
      <el-row>
        <el-col :span="24">
          <div style="height:100px;border:1px solid red;"
               class="grid-content bg-purple-dark">111</div>
        </el-col>
      </el-row>

      <el-collapse-transition>
        <div v-show="show3">
          <el-col style="height:100px;border:1px solid blue;">222</el-col>
        </div>
      </el-collapse-transition>

    </div>

  </div>
</template>

<script>

export default {
  components: {
  },

  data() {
    return {
      show3: true
    }
  },
  computed: {

  },

  watch: {},
  created() {
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
