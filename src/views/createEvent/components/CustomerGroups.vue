<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="白名单上传"
                   name="1">
        <div class="whitelist">
          <el-upload class="upload"
                     drag
                     action="https://jsonplaceholder.typicode.com/posts/"
                     multiple>
            <!-- <i class="el-icon-upload" /> -->
            <svg-icon class="el-icon-upload"
                      icon-class="upload-file" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip"
                 class="el-upload__tip">
              只能上传xls/cvs文件
              <a class="download">模版下载</a>
            </div>
          </el-upload>
          <el-form ref="form"
                   :model="form"
                   :rules="rules"
                   label-width="100px"
                   class="reg-form">
            <el-form-item label="客户数量：">
              {{ form.customerNumber }}
            </el-form-item>
            <el-form-item label="上传时间：">
              {{ form.updateTime }}
            </el-form-item>
            <el-form-item label="目标设置：">
              <el-input v-model="form.traget"
                        placeholder="请输入内容"
                        class="input-with-select">
                <el-select slot="prepend"
                           v-model="form.select"
                           placeholder="请选择">
                  <el-option label="餐厅名"
                             value="1" />
                  <el-option label="订单号"
                             value="2" />
                  <el-option label="用户电话"
                             value="3" />
                </el-select>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="CRM导入"
                   name="second">CRM导入</el-tab-pane>
      <el-tab-pane label="模型导入"
                   name="third">模型导入</el-tab-pane> -->

    </el-tabs>
  </div>
</template>

<script>

export default {
  data() {
    return {
      activeName: '1',
      form: {
        fileName: 'dsafdasfasd.ss',
        customerNumber: '1000',
        updateTime: '2020-09-09 09:09:09',
        traget: '',
        select: ''
      },
      rules: {

      }
    }
  },
  computed: {
  },
  watch: {

  },

  methods: {
    next(cb) {

    }

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.container {
  padding: 0 20px;
  .whitelist {
    .upload {
      width: 360px;
      margin: 0 auto;
      .el-icon-upload {
        font-size: 58px;
      }
      .el-upload__tip {
        display: flex;
        justify-content: space-between;
        .download {
          color: $blue;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
