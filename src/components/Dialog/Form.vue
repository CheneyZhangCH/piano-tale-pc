<!--
 * @Author: sun.shengjie
 * @Date: 2020-02-04 18:57:31
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-11-18 16:30:54
 * @FilePath: /src/components/Dialog/Form.vue
 * @Description:
 -->
<template>
  <el-dialog
    :modal-append-to-body="modalAppendToBody"
    :append-to-body="appendToBody"
    :lock-scroll="lockScroll"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :title="title"
    class="aika-dialog-form"
    :class="{ 'body-no-padding': bodyNoPadding }"
    :visible.sync="visible"
    :width="width"
    :show-close="showClose"
    :top="top"
    @close="handleCloseBtn"
    @closed="handleClosed"
  >
    <slot slot="title" name="customTitle" />
    <slot name="customTip" />
    <main class="main" :class="{ 'max-height': maxHeight, 'insert-tip-warning': insertTipWarning }">
      <slot name="custom" />
      <aika-form
        ref="form"
        :is-dialog="true"
        :disabled="disabled"
        :initial-values="initialValues"
        :rules="rules"
        :forms="forms"
        :label-width="labelWidth"
        :span-count="spanCount"
        :hide-required-asterisk="hideRequiredAsterisk"
        @preview="url => {$emit('preview',url)}"
      >
        <template #custom>
          <slot name="form-custom" />
        </template>
        <template #footer>
          <slot name="form-footer" />
        </template>
      </aika-form>
    </main>

    <template #footer>
      <div>
        <slot v-if="footerConfig.operate && footerConfig.operate.show" name="btngroup" />
        <el-button v-if="!hideOperate" size="small" @click="handleOperate">{{ footerConfig.operate && footerConfig.operate.label }}</el-button>
        <slot v-if="footerConfig.cancel.show" name="btngroup" />
        <el-button v-if="!hideCancel" size="small" @click="handleClose">{{ cancelButtonText || footerConfig.cancel.label }}</el-button>
        <slot v-if="footerConfig.submit.show" name="btngroup-center" />
        <el-button v-if="!hideConfirm" size="small" :loading="loading" type="primary" @click="handleConfirm">
          {{ confirmButtonText || footerConfig.submit.label }}
        </el-button>
        <slot name="btngroup-after" />
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'Form',
  props: {
    title: { type: String, default: '系统提示' },
    width: { type: String, default: '360px' },
    labelWidth: { type: String, default: '92px' },
    top: { type: String, default: '15vh' },
    maxHeight: Boolean,
    insertTipWarning: { type: Boolean, default: false },
    disabled: Boolean,
    spanCount: Number,
    forms: Array,
    rules: Object,
    hideRequiredAsterisk: { type: Boolean, default: false },
    initialValues: { type: Object }, // 初始值
    bottomRight: { type: Boolean, default: false },
    bodyNoPadding: { type: Boolean, default: false },
    footerConfig: {
      type: Object,
      default: () => {
        return {
          cancel: { label: '取消', show: true },
          submit: { label: '确定', show: true }
        }
      }
    },
    confirmButtonText: { type: String, default: '' },
    cancelButtonText: { type: String, default: '' },
    confirm: Boolean,
    hideConfirm: { type: Boolean, default: false },
    lockScroll: { type: Boolean, default: true },
    hideCancel: { type: Boolean, default: false },
    showClose: { type: Boolean, default: true },
    modalAppendToBody: { type: Boolean, default: false },
    appendToBody: { type: Boolean, default: false },
    hideOperate: { type: Boolean, default: true }
  },
  data() {
    return {
      loading: false,
      visible: false
    }
  },
  methods: {
    open(obj) {
      this.loading = false
      this.visible = true
      this.$nextTick(() => {
        this.$refs.form.init(obj)
      })
    },
    handleClose() {
      const done = () => {
        this.$refs.form.reset()
        this.visible = false
        this.$emit('close')
      }
      if (this.confirm) {
        this.$confirm('取消后填写的信息将不会保存，确定取消吗', '信息未保存')
          .then(_ => {
            done()
          })
          .catch(_ => {
          })
          .finally(() => {
            this.isSuccess = false
          })
      } else {
        done()
      }
    },
    close() {
      this.$refs.form?.reset()
      this.visible = false
      this.$emit('close')
    },

    handleCloseBtn() {
      this.$emit('handleClose')
    },
    handleClosed() {
      this.$emit('handleClosed')
    },
    // 给部分字段赋值
    initFieldsObj(obj) {
      this.$refs.form.initFieldsObj(obj)
    },
    // 获取表单数据
    getFormData() {
      return this.$refs.form ? this.$refs.form.form : {}
    },

    stopLoading() {
      this.loading = false
    },

    handleConfirm() {
      if (this.forms) {
        this.$refs.form.validate().then(form => {
          this.loading = true
          this.$emit('handleConfirm', form)
        }).catch(err => {
          this.loading = false
          console.log(err)
        })
      } else {
        this.$emit('handleConfirm')
      }
    },
    handleReset() {
      this.$refs.form.reset()
    },
    handleOperate() {
      if (this.forms) {
        this.$refs.form.validate().then(form => {
          this.$emit('handleOperate', form)
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$emit('handleOperate')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.max-height {
  max-height: 400px;
  overflow-y: auto;
}

::v-deep.el-form-item:not(.is-required) > .el-form-item__label {
  padding-left: 9px;
}

.insert-tip-warning {
  margin-top: 20px;
}

.aika-dialog-form {
  ::v-deep .el-dialog__body {
    position: relative;
  }
}
</style>
