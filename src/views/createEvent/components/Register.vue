<template>
  <div class="container">
    <el-form ref="regFormRef"
             :model="baseInfo"
             :rules="rules"
             label-width="110px"
             class="reg-form">
      <el-form-item label="事件名称"
                    prop="eventName">
        <el-input v-model="baseInfo.eventName" />
      </el-form-item>
      <el-form-item label="事件类型"
                    prop="eventCategory">
        <el-select v-model="baseInfo.eventCategory"
                   style="width:100%"
                   placeholder="请选择事件类型">
          <el-option v-for="item in eventCategoryOpt"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="起止日期"
                    prop="eventDate">
        <el-date-picker v-model="baseInfo.eventDate"
                        style="width:100%"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item label="事件描述"
                    prop="desc">
        <el-input v-model="baseInfo.eventDescription"
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
      baseInfo: this.$parent.eventData.baseInfo,
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
        eventDate: [
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
    baseInfo: {
      handler(newVal, oldVal) {
        // console.log(newVal)
        this.changePicker()
        this.changeEventCategory()
        // this.assignDate()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
    // console.log(2, this.$root)
  },
  methods: {
    validateAndNext() {
      return new Promise((resolve, reject) => {
        this.$refs.regFormRef.validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
    },
    changeEventCategory() {
      this.eventCategoryOpt.forEach((n, i) => {
        if (n.value === this.baseInfo.eventCategory) {
          this.baseInfo.eventCategoryValue = n.label
        }
      })
    },
    changePicker() {
      if (this.baseInfo.eventDate) {
        [this.baseInfo.eventStartDate, this.baseInfo.eventEndDate] = this.baseInfo.eventDate
      } else {
        this.baseInfo.eventStartDate = ''
        this.baseInfo.eventEndDate = ''
      }
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
