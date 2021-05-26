<template>
  <div class="dialog-container">
    <el-dialog :title="isEdit?'修改产品':'新增产品'"
               :visible.sync="showDialogTest"
               @open="dialogOpen">
      <el-form ref="regFormRef"
               label-width="110px"
               :model="addInfo">
        <el-form-item label="产品名称："
                      :rules="[{
                        required: true, message: '请输入产品名称', trigger: 'blur'
                      }]"
                      prop="name">
          <el-input v-model.trim="addInfo.name"
                    show-word-limit
                    style="width:90%;"
                    maxlength="50" />
        </el-form-item>
        <el-form-item label="产品类型："
                      prop="category"
                      label-width="110px">
          <el-cascader v-model="addInfo.category"
                       style="width:300px;"
                       :options="categoryOpt"
                       :props="{ expandTrigger: 'hover' }"
                       clearable
                       @change="changeProductParams" />
        </el-form-item>
        <el-form-item label="产品用例："
                      prop="attributionUseCaseList">
          <el-select v-model="addInfo.attributionUseCaseList"
                     multiple
                     style="width:300px;"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in useCaseListOpt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品说明："
                      prop="description">
          <el-input v-model.trim="addInfo.description"
                    style="width:90%;"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    placeholder="请输入产品说明" />
        </el-form-item>
        <div v-for="(pItem,pi) of productParams"
             :key="pi"
             class="condition-item">
          <!-------------------------- input -------------------------->
          <template v-if="pItem.formatType==='input'">
            <el-form-item :prop="`${pItem.fieldName}`"
                          :label="`${pItem.desc}:`"
                          class="shun-label"
                          :rules="[{
                            // required: true, validator: (rule, value, callback) => {validateNumber(rule, value, callback,pItem.type,pItem.range,pItem.name)},trigger: 'blur'
                            required: true, message: '请填写'
                          }]">
              <el-input v-model="addInfo[pItem.fieldName]"
                        style="width:90%;"
                        controls-position="right" />
            </el-form-item>
          </template>
          <!-------------------------- rate -------------------------->
          <template v-if="pItem.formatType==='rate'">
            <el-form-item :prop="`${pItem.fieldName}`"
                          :label="`${pItem.desc}:`"
                          class="shun-label"
                          :rules="[{
                            // required: true, validator: (rule, value, callback) => {validateNumber(rule, value, callback,pItem.type,pItem.range,pItem.name)},trigger: 'blur'
                            required: true, message: '请填写'
                          }]">
              <el-input-number v-model="addInfo[pItem.fieldName]"
                               :precision="2"
                               :step="0.1"
                               controls-position="right" />
            </el-form-item>
          </template>
          <!-------------------------- date -------------------------->
          <template v-if="pItem.formatType==='date'">
            <el-form-item :prop="`${pItem.fieldName}`"
                          :label="`${pItem.desc}:`"
                          class="shun-label"
                          :rules="[{
                            // required: true, validator: (rule, value, callback) => {validateNumber(rule, value, callback,pItem.type,pItem.range,pItem.name)},trigger: 'blur'
                            required: true, message: '请填写'
                          }]">
              <el-date-picker v-model="addInfo[pItem.fieldName]"
                              type="date"
                              placeholder="选择日期" />
            </el-form-item>
          </template>
          <!-------------------------- select -------------------------->
          <template v-if="pItem.formatType==='select'">
            <el-form-item :prop="`${pItem.fieldName}`"
                          :label="`${pItem.desc}:`"
                          class="shun-label"
                          :rules="[{
                            // required: true, validator: (rule, value, callback) => {validateNumber(rule, value, callback,pItem.type,pItem.range,pItem.name)},trigger: 'blur'
                            required: true, message: '请填写'
                          }]">
              <el-select v-model="addInfo[pItem.fieldName]"
                         placeholder="请选择">
                <el-option v-for="(item,i) of [1]"
                           :key="i"
                           :label="item"
                           :value="item" />
              </el-select>
            </el-form-item>
          </template>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="cancelEditTest">取 消</el-button>
        <el-button type="primary"
                   :loading="buttonLoading"
                   @click="ensureEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    showDialogTest: {
      type: Boolean,
      default: false
    },
    // 全部参数
    allParams: {
      type: Array,
      default() {
        return []
      }
    },
    // 对应参数
    productParams: {
      type: Array,
      default() {
        return []
      }
    },
    // category
    categoryOpt: {
      type: Array,
      default() {
        return []
      }
    },
    // useCaseList
    useCaseListOpt: {
      type: Array,
      default() {
        return []
      }
    },
    // quxiao
    cancelEditTest: {
      type: Function,
      default() {
        return
      }
    }
  },
  data() {
    return {
      buttonLoading: false,
      addInfo: {
        id: '',
        name: '',
        category: [],
        attributionUseCaseList: [],
        description: ''
      }
    }
  },
  watch: {

  },

  methods: {
    dialogOpen() {
      this.$refs['regFormRef'] && this.$refs['regFormRef'].resetFields()
    },
    changeProductParams(val) {
      console.log(val)
      if (this.addInfo.category[0]) {
        this.productParams = this.allParams.find(n => n.type === this.addInfo.category[0]).array
      } else {
        this.productParams = this.allParams.find(n => n.type === this.addInfo.category[0]).array
      }
      console.log(this.productParams)
    },
    cancelEdit() {
      // this.$refs['regFormRef'].resetFields()
      this.showDialogTest = false
    },
    ensureEdit() {
      console.log(this.addInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
</style>
