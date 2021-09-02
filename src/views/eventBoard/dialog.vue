<template>
  <el-dialog class="edit-container"
             fullscreen
             :visible="visible"
             append-to-body
             @close="handleClose">
    <Ploy ref="ployRef"
          :passed-id="eventId"
          is-update />
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary"
                 :loading="syncLoading"
                 @click="handleSyncProduct">应用并同步</el-button>
      <el-button type="primary"
                 :loading="buttonLoading"
                 @click="ensureSave">应 用</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Ploy } from '@/views/createEvent/components'
import { updateStrategy, syncProduct } from '@/api/api'

export default {
  components: {
    Ploy
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      eventId: '',
      eventName: '',
      buttonLoading: false,
      syncLoading: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleSyncProduct() {
      const ployRef = this.$refs.ployRef
      ployRef.$refs.customerFormRef.validate((valid, field) => {
        // console.log(valid, field)
        if (valid) {
          // 客群
          // console.log(this.group)
          const data = ployRef.group.map((gn, gi) => {
            return {
              // 客群id
              // customerInfoId: gn.gid,
              // 策略
              strategyDetailList: gn.ployTabs.map((pn, pi) => {
                // console.log('pn', pn)
                return {
                  // 策略id
                  abstractId: pn.abstractId,
                  // 产品id
                  productIdList: pn.product.map(n => n.id),
                  // 权益id
                  couponIdList: pn.interest.map(n => n.id),
                  // 话术
                  scriptList: pn.channel
                    .find(item => {
                      return item.value === 1
                    })
                    ?.model.map(n => {
                      return {
                        scriptId: n.id,
                        scriptContent: n.content,
                        type: n.type
                      }
                    }),
                  // 预热短信
                  advanceList: pn.channel
                    .find(item => {
                      return item.value === 1
                    })
                    ?.beforeSms.map(n => {
                      return {
                        advanceId: n.id,
                        advanceContent: n.content,
                        type: n.type
                      }
                    }),
                  // 跟进短信
                  followList: pn.channel
                    .find(item => {
                      return item.value === 1
                    })
                    ?.afterSms.map(n => {
                      return {
                        followId: n.id,
                        followContent: n.content,
                        type: n.type
                      }
                    })
                }
              })
            }
          })
          console.log('data', data)
          // reject()
          const param = {
            // baseId: this.id,
            strategySaveCriteriaList: data
          }
          // this.buttonLoading = true
          const confirmText = [
            '同步时间较长，请勿重复点击，',
            `是否确认事件【${this.eventName}】同步？`
          ]
          const newDatas = []
          const h = this.$createElement
          for (const i in confirmText) {
            newDatas.push(h('p', null, confirmText[i]))
          }
          this.$confirm('提示', {
            title: '提示',
            message: h('div', null, newDatas),
            type: 'warning'
          })
            .then(() => {
              this.syncLoading = true
              updateStrategy(param).then(res => {
                if (res.code === 200) {
                  syncProduct({ eventId: this.eventId }).then(res => {
                    if (res.code === 200) {
                      this.$message({
                        message: '应用并同步成功',
                        type: 'success',
                        duration: '3000'
                      })
                    }
                  })
                }
              })
            })
            .finally(() => {
              this.$emit('update:visible', false)
              this.syncLoading = false
            })
        } else {
          // console.log(field)
          let errList = Object.keys(field).map(key => ployRef.getIndex(key))
          errList = ployRef.sortIndex(errList)
          // console.log(errList, '???')
          const [gi, pi] = errList[0]
          // console.log(gi, pi)
          ployRef.groupName = gi + ''
          this.$nextTick(() => {
            // console.log(this.group[gi])
            if (!isNaN(pi)) {
              // console.log(this.group[gi].ployTabs[pi].name)
              ployRef.group[gi].ployTabsValue =
                ployRef.group[gi].ployTabs[pi].name
            }
          })
        }
      })
    },
    ensureSave() {
      const ployRef = this.$refs.ployRef
      ployRef.$refs.customerFormRef.validate((valid, field) => {
        if (valid) {
          const ployData = ployRef.getData()
          // console.log('ployData', ployData)
          const data = ployData.map(m => ({
            strategyDetailList: m.strategyDetailList.map(n => {
              return {
                abstractId: n.abstractId,
                productIdList: n.productIdList,
                couponIdList: n.couponIdList,
                strategyInfoList: n.strategyInfoList.map(c => {
                  return Object.assign(
                    { channel: c.channel },
                    c.channel === 1
                      ? {
                        scriptList: c.scriptList,
                        advanceList: c.advanceSMSList,
                        followList: c.followSMSList
                      }
                      : {
                        materialList: c.materialList
                      }
                  )
                })
              }
            })
          }))
          const param = { strategySaveCriteriaList: data }
          console.log(param)
          this.buttonLoading = true
          updateStrategy(param)
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                  duration: '3000'
                })
              }
            })
            .finally(() => {
              this.$emit('update:visible', false)
              this.buttonLoading = false
            })
        } else {
          // console.log(field)
          let errList = Object.keys(field).map(key => ployRef.getIndex(key))
          errList = ployRef.sortIndex(errList)
          // console.log(errList, '???')
          const [gi, pi] = errList[0]
          // console.log(gi, pi)
          ployRef.groupName = gi + ''
          this.$nextTick(() => {
            // console.log(this.group[gi])
            if (!isNaN(pi)) {
              // console.log(this.group[gi].ployTabs[pi].name)
              ployRef.group[gi].ployTabsValue =
                ployRef.group[gi].ployTabs[pi].name
            }
          })
        }
      })
    },
    update(row) {
      this.eventId = row.id + ''
      this.eventName = row.name
    }
  }
}
</script>

<style>
</style>
