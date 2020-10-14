<template>
  <div class="container">
    <el-form ref="form"
             :model="mydata"
             label-width="110px">
      <div v-for="(item,i) of mydata.arr"
           :key="i">
        <el-form-item label="事件名称："
                      :rules="[{
                        required: true, message: '请输入事件名称', trigger: 'blur'
                      }]"
                      :prop="'arr.'+i+'.name'">
          <el-input v-model="item.name" />
        </el-form-item>
      </div>
    </el-form>
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
      mydata: {
        arr: [
          {
            name: ''
          }, {
            name: ''
          }
        ]
      }

    }
  },
  watch: {},
  mounted() {

  },
  methods: {
    ok() {
      this.$refs.form.validate((valid) => {
        console.log(valid)
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
