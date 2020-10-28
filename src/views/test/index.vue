<template>
  <div class="container">

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
      <template slot="reference">
        <el-switch v-model="value1"
                   active-text="按月付费"
                   inactive-text="按年付费"
                   @change="handleChange" />
      </template>

    </el-popover>

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
      value1: false,
      visible: false
    }
  },
  watch: {},
  mounted() {

  },
  methods: {
    handleChange(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
}
</style>
