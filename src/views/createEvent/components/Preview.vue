<template>
  <div class="container">
    <div class="header">
      <div class="title">
        AUM增长计划
        <el-tag style="margin-left:10px;">事件类型</el-tag>
      </div>
      <div class="time">
        <i style="color:#5CB87A;"
           class="el-icon-time" />
        2020-01-11 至 2020-01-22
      </div>
      <div class="desc">描述文字描述诉讼法描述大撒发苏打粉描述描述描述大撒发撒的描述描述描述大撒发撒上描述文字描述诉讼法描述大撒发苏打粉描述描述描述大撒发撒的描述描述描述大撒发撒上描述文字描述诉讼法描述大撒发苏打粉描述描述描述大撒发撒的描述描述描述大撒发撒上描述文字描述诉讼法描述大撒发苏打粉描述描述描述大撒发撒的描述描述描述大撒发撒上</div>
    </div>

    <swiper ref="mySwiper"
            class="main-swiper-container"
            :options="swiperOptions">
      <swiper-slide>
        <div style="height:500px;">111</div>
      </swiper-slide>
      <swiper-slide>
        <div style="height:800px;">222</div>
      </swiper-slide>
      <swiper-slide>
        <div style="height:400px;">333</div>
      </swiper-slide>
      <swiper-slide>
        <div style="height:600px;">444</div>
      </swiper-slide>
      <swiper-slide>
        <div style="height:500px;">555</div>
      </swiper-slide>
      <div slot="pagination"
           class="swiper-pagination" />
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
// import 'swiper/css/swiper.css'
// If you use Swiper 6.0.0 or higher
import 'swiper/swiper-bundle.css'
export default {
  name: 'Preview',
  components: {
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  },
  data() {
    return {
      swiperOptions: {
        autoHeight: true
        // Some Swiper option/callback...
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
  },
  watch: {

  },
  mounted() {
    console.log('Current Swiper instance object', this.swiper)
    // this.swiper.slideTo(3, 1000, false)
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.container {
  padding: 20px;
  font-size: 14px;
  .header {
    .title {
      font-size: 20px;
      font-weight: bold;
      display: flex;
      align-items: center;
    }
    .time {
      font-size: 14px;
      color: #888;
      margin-top: 10px;
    }
    .desc {
      line-height: 1.5;
      color: #888;
      margin-top: 10px;
    }
  }
  .main-swiper-container {
    width: 100%;
    box-sizing: border-box;
    * {
      box-sizing: border-box;
    }
    .swiper-slide {
      border: 1px solid;
    }
  }
}
</style>
