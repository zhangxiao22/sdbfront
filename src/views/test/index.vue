<template>
  <div class="container">
    {{ activeName }}
    <el-tabs v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane label="用户管理">用户管理</el-tab-pane>
      <el-tab-pane label="配置管理"
                   name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理"
                   name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿"
                   name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Swiper from 'swiper'
// import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
// import 'swiper/css/swiper.css'
// If you use Swiper 6.0.0 or higher
import 'swiper/swiper-bundle.css'

import ShunTable from '@/components/ShunTable/index'

export default {
  components: {
    // Swiper
    // SwiperSlide
    // ShunTable
  },
  directives: {
    // swiper: directive
  },
  data() {
    return {
      activeName: 'second'
    }
  },
  watch: {},
  mounted() {
    this.overviewSwiper = new Swiper('.group-swiper-container', {
      // loop: true,
      // freeMode: true,
      grabCursor: true,
      // slidesPerView: 'auto',
      // loop: true
      // centeredSlides: true,
      slidesPerView: 3,
      spaceBetween: 20,
      watchSlidesVisibility: true, // 防止不可点击
      on: {

      }
    })
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    click() {
      this.arr = [
        { name: 'a' },
        { name: 'b' },
        { name: 'c' },
        { name: 'd' },
        { name: 'e' },
        { name: 'f' },
        { name: 'g' }
      ]
    },
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
