<template>
  <div class="container">

    <!-- <div id="thumbs"
         class="swiper-container"
         style="height:100px;">
      <div class="swiper-wrapper">
        <div class="swiper-slide blue-slide">
          slider1</div>
        <div class="swiper-slide red-slide">
          slider2</div>
        <div class="swiper-slide orange-slide">
          slider3</div>
        <div class="swiper-slide purple-slide">
          slider4</div>
      </div>
    </div>
    <div id="gallery"
         class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide blue-slide">
          slider1</div>
        <div class="swiper-slide red-slide">
          slider2</div>
        <div class="swiper-slide orange-slide">
          slider3</div>
        <div class="swiper-slide purple-slide">
          slider4</div>
      </div>
      <div class="swiper-button-next" />
      <div class="swiper-button-prev" />
    </div> -->
    <swiper ref="mySwiper"
            :options="thumbsSwiperOptions">
      <swiper-slide>Slide 1</swiper-slide>
      <swiper-slide>Slide 2</swiper-slide>
      <swiper-slide>Slide 3</swiper-slide>
      <swiper-slide>Slide 4</swiper-slide>
      <swiper-slide>Slide 5</swiper-slide>
      <div slot="pagination"
           class="swiper-pagination" />
    </swiper>
    <swiper ref="mySwiper"
            :options="swiperOptions">
      <swiper-slide>Slide 1</swiper-slide>
      <swiper-slide>Slide 2</swiper-slide>
      <swiper-slide>Slide 3</swiper-slide>
      <swiper-slide>Slide 4</swiper-slide>
      <swiper-slide>Slide 5</swiper-slide>
      <div slot="pagination"
           class="swiper-pagination" />
    </swiper>
  </div>
</template>

<script>
// import Swiper from 'swiper'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
// import 'swiper/css/swiper.css'
// If you use Swiper 6.0.0 or higher
import 'swiper/swiper-bundle.css'

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  },
  data() {
    return {
      thumbsSwiperOptions: {
        watchSlidesVisibility: true
      },

      swiperOptions: {
        // thumbs: {
        //   swiper: thumbsSwiper
        // }
      }
    }
  },
  watch: {},
  mounted() {
    const _this = this

    this.swiperOptions = {
      thumbs: {
        swiper: _this.thumbsSwiperOptions
      }
    }
    var thumbsSwiper = new Swiper('#thumbs', {
      spaceBetween: 10,
      slidesPerView: 4
      // watchSlidesVisibility: true /* 避免出现bug*/
    })
    var gallerySwiper = new Swiper('#gallery', {
      spaceBetween: 10,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      thumbs: {
        swiper: thumbsSwiper
      }
    })
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style>
#shun-list .el-tabs__nav {
  border: 1px solid red;
}
</style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .blue-slide {
    background: blue;
  }

  .red-slide {
    background: red;
  }

  .orange-slide {
    background: orange;
  }

  .purple-slide {
    background: purple;
  }
}
</style>
