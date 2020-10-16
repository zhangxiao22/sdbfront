<template>
  <div class="container">
    <el-form ref="form"
             :model="{arr}"
             label-width="110px">
      <div v-for="(item,i) of arr"
           v-show="i===0"
           :key="i">
        <el-form-item label="事件名称："
                      :rules="[{
                        required: true, message: '请输入事件名称', trigger: 'blur'
                      }]"
                      :prop="'arr.'+i+'.name'">
          <el-input v-model="item.name" />
        </el-form-item>

        <el-form-item label="测试数组"
                      :rules="[{
                        required: true, message: 'test', type: 'array'
                      }]"
                      :prop="'arr.'+i+'.testArr'">
          123
        </el-form-item>
        <el-form-item label="测试radio"
                      :rules="[{
                        required: true, message: 'test', trigger: 'change'
                      }]"
                      :prop="'arr.'+i+'.radio'">
          <el-radio-group v-model="item.radio"
                          @change="handleChange">
            <el-radio :label="3"
                      border>备选项</el-radio>
            <el-radio :label="6"
                      border>备选项</el-radio>
            <el-radio :label="9"
                      border>备选项</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="item.radio===3">
          <el-form-item label="起止日期："
                        :prop="'arr.' + i + '.date'"
                        :rules="[{
                          required: true, message: '请选择起止日期', trigger: 'change'
                        }]">
            <el-date-picker v-model="item.date"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" />
          </el-form-item>
        </template>
        <template v-if="item.radio===6">
          <el-form-item label="起止日期："
                        :prop="'arr.' + i + '.time'"
                        :rules="[{
                          required: true, message: '请选择起止日期222', trigger: 'change'
                        }]">
            <el-time-select v-model="item.time"
                            :picker-options="{
                              start: '07:00',
                              end: '20:00',
                              step: '00:30',
                            }"
                            :clearable="false"
                            :editable="false"
                            format="HH:mm"
                            value-format="HH:mm" />
          </el-form-item>
        </template>

      </div>
    </el-form>
    <el-button @click="change">change</el-button>
    <el-button @click="ok">ok</el-button>

    <el-popover v-model="visible"
                placement="top"
                width="160">
      <p>这是一段内容这是一段内容确定删除吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini"
                   type="text"
                   @click="visible = false">取消</el-button>
        <el-button type="primary"
                   size="mini"
                   @click="visible = false">确定</el-button>
      </div>
      <el-button slot="reference">删除</el-button>
    </el-popover>
  </div>
</template>

<script>
// import Swiper from 'swiper'
// import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
// import 'swiper/css/swiper.css'
// If you use Swiper 6.0.0 or higher
// import 'swiper/swiper-bundle.css'

import ShunTable from '@/components/ShunTable/index'

export default {
  components: {
    // Swiper,
    // SwiperSlide
    // ShunTable
  },
  directives: {
    // swiper: directive
  },
  data() {
    return {
      visible: false,
      arr: [
        {
          name: '2',
          testArr: [1],
          radio: 3,
          date: [],
          time: ''
        }, {
          name: '2',
          testArr: [2],
          radio: 3,
          date: [],
          time: ''
        }
      ]

    }
  },
  watch: {},
  mounted() {

  },
  methods: {
    handleChange(val) {
      console.log(val)
      // if (val === 3) {
      this.$refs.form.validateField(`arr.0.date`)
      // } else {
      this.$refs.form.validateField(`arr.0.time`)
      // }
    },
    validateTest(rule, value, callback) {
      console.log(rule, '???', value)
    },
    change() {
      this.arr[0].testArr = [{}]
    },
    ok() {
      this.$refs.form.validate((valid, a) => {
        console.log(valid, a)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
