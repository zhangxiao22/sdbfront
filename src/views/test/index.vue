<template>
  <div class="container">
    {{ ruleForm }}
    <el-form ref="ruleForm"
             :model="ruleForm"
             label-width="100px">
      <el-form-item label="活动名称"
                    :rules="[{
                      required: true, message: '请输入值',trigger: 'blur'
                    }]"
                    prop="number.0">
        <el-input-number v-model="ruleForm.number[0]"
                         controls-position="right" />
      </el-form-item>

    </el-form>

  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
  },
  data() {
    return {
      ruleForm: {
        number: []
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
    click() {
      this.arr.push({
        val: []
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .box {
    width: 400px;
    display: inline-flex;
    flex-wrap: wrap;
    span {
      height: 30px;
      border: 1px solid;
      margin: 0 20px;
    }
  }
}
</style>
