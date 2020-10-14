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
      </div>
    </el-form>
    <el-button @click="change">change</el-button>
    <el-button @click="ok">ok</el-button>
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
      arr: [
        {
          name: '',
          testArr: []
        }, {
          name: '',
          testArr: []
        }
      ]

    }
  },
  watch: {},
  mounted() {

  },
  methods: {
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
