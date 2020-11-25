<template>
  <div class="container">
    {{ form.value }}
    <el-form ref="form"
             :model="form"
             label-width="80px">
      <el-form-item label="活动名称"
                    prop="value"
                    :rules="[{
                      required: true, message: '请选择规则标签',trigger:'change'
                    }]">
        <el-cascader v-model="form.value"
                     :options="options"
                     clearable />
      </el-form-item>

    </el-form>

  </div>
</template>

<script>

export default {
  components: {
  },

  data() {
    return {
      form: {
        // value: [[1, 2]]
      },
      // props: { multiple: true },
      options: [{
        value: 1,
        label: '东南',
        children: [{
          value: 2,
          label: '上海',
          children: null
        }, {
          value: 7,
          label: '江苏',
          children: [
            { value: 8, label: '南京' },
            { value: 9, label: '苏州' },
            { value: 10, label: '无锡' }
          ]
        }, {
          value: 12,
          label: '浙江',
          children: [
            { value: 13, label: '杭州' },
            { value: 14, label: '宁波' },
            { value: 15, label: '嘉兴' }
          ]
        }]
      }, {
        value: 17,
        label: '西北',
        children: [{
          value: 18,
          label: '陕西',
          children: [
            { value: 19, label: '西安' },
            { value: 20, label: '延安' }
          ]
        }, {
          value: 21,
          label: '新疆维吾尔族自治区',
          children: [
            { value: 22, label: '乌鲁木齐' },
            { value: 23, label: '克拉玛依' }
          ]
        }]
      }]
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
