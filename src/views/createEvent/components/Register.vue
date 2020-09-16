<template>
  <div class="container">
    <el-form ref="form"
             :model="form"
             :rules="rules"
             label-width="110px"
             class="reg-form">
      <el-form-item label="事件名称"
                    prop="eventName">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="事件类型"
                    prop="eventCategory">
        <el-select v-model="form.type"
                   style="width:100%"
                   placeholder="请选择事件类型">

          <el-option v-for="item in eventCategoryOpt"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value" />

        </el-select>
      </el-form-item>
      <el-form-item label="起止日期"
                    prop="time">
        <el-date-picker v-model="form.time"
                        style="width:100%"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item label="事件描述"
                    prop="desc">
        <el-input v-model="form.desc"
                  type="textarea" />
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
        type: '',
        time: [],
        desc: ''
      },
      rules: {
        eventName: [
          { required: true, message: '请输入事件名称', trigger: 'blur' }
        ],
        eventCategory: [
          { required: true, message: '请选择事件类型', trigger: 'change' }
        ],
        time: [
          { required: true, message: '请选择起止日期', trigger: 'change' }
        ]
      },
      eventCategoryOpt: [
        {
          value: 1,
          label: '事件类型1'
        },
        {
          value: 2,
          label: '事件类型2'
        }
      ]
    }
  },
  computed: {

  },
  watch: {
    // form: {
    //   handler(newVal, oldVal) {
    //     // console.log(newVal)
    //     const data = {
    //       name: '',
    //       type: '',
    //       time: []
    //     }
    //     data.name = newVal.name
    //     this.typeOpt.forEach((n, i) => {
    //       if (n.value === newVal.type) {
    //         data.type = n.label
    //       }
    //     })
    //     data.time = newVal.time || []
    //     console.log(data)
    //     this.$emit('renderSteps', data)
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  created() {
    console.log(1, this.$root)
  },
  mounted() {
    // console.log(2, this.$root)
  },
  methods: {
    next(cb) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          cb()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  padding: 50px 20px;
  .reg-form {
    width: 500px;
    // margin: 0 auto;
  }
}
</style>
