<template>
  <div class="container">
    <div class="box">
      <div class="item" />
      <span class="item" />
      <span class="item" />
      <span class="item" />
      <span class="item" />
      <span class="item aaa" />
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },

  data() {
    return {

    }
  },
  computed: {

  },

  watch: {

  },
  created() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  .box {
    display: flex;
    width: 1000px;
    height: 500px;
    border: 1px solid;
    // position: relative;
    // flex-direction: column;
    // flex-wrap: wrap;
    // flex-flow
    justify-content: space-around;
    align-items: center;
    // align-content
    .item {
      height: 100px;
      width: 100px;
      margin: 0 10px;
      border: 1px solid red;
    }
    .aaa {
      // position: absolute;
      // left: 0;
      // border: 1px solid blue;
    }
  }
}
</style>
