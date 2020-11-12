<template>
  <div class="container">
    {{ JSON.stringify(form) }}
    <el-form ref="form"
             :model="form"
             label-width="80px">
      <el-form-item label="活动名称"
                    prop="value1">
        <el-date-picker v-model="form.value1"
                        type="daterange"
                        clearable
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" />
      </el-form-item>

    </el-form>

    <el-button @click="reset">reset</el-button>
    <el-button @click="form.value1=null">setUnll</el-button>
  </div>
</template>

<script>

export default {
  components: {
  },

  data() {
    return {
      form: {
        value1: []
      }
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
    reset() {
      this.$refs['form'].resetFields()
    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
