<template>
  <div class="container">
    <shun-table title="测试">
      <template v-slot:filter>
        <el-form :inline="true"
                 :model="filterForm"
                 class="filter-container">
          123
          <el-form-item class="filter-item-end">
            <el-button type="primary"
                       icon="el-icon-search">
              搜索
            </el-button>
            <el-button icon="el-icon-refresh">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </template>
    </shun-table>

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
    ShunTable
  },
  directives: {
    // swiper: directive
  },
  data() {
    return {
      filterForm: {}
    }
  },
  watch: {},
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
