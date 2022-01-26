<template>
  <!-- 普通表单 -->
  <el-form
    ref="form"
    :rules="rules"
    :model="form"
    :disabled="disabled"
    :label-position="labelPosition"
    :label-width="labelWidth"
    :size="size"
    :hide-required-asterisk="hideRequiredAsterisk"
    class="aika-form clearfix"
    :class="{ 'detail-form': isView,'dialog-form': isDialog }"
    :style="formStyle"
    @submit.native.prevent
  >
    <slot name="header" />
    <slot name="custom" />
    <template v-for="(item, index) in forms">
      <el-col v-if="!item.hidden" :key="index" :span="item.span || spanCount" :style="item.colStyle" :class="item.className">
        <el-form-item v-if="!item.ownForm" :class="item.className || item.inputType || item.type" :label="`${item.label || ''}`" :prop="item.prop" :rules="item.rules" :label-width="item.labelWidth" :style="item.style">
          <custom-prepend-dom v-if="item.prependDom" :item="item.prependDom" />
          <template v-if="!item.label || item.labelStyle || item.requiredSign || item.tooltip || item.type === 'subTitle' || item.labelIcon" #label>
            <span v-if="!item.label" />
            <!-- 带样式的label -->
            <span v-if="item.labelStyle" :style="item.labelStyle">{{ item.label }}</span>
            <!-- 带星号的label -->
            <span v-if="item.requiredSign"><span style="margin-right: 5px; color: red;">*</span>{{ item.label }}</span>
            <!-- tooltip -->
            <span v-if="item.tooltip" style="display: flex; align-items: center;">
              <span>{{ item.label }}</span>
              <el-tooltip v-if="item.tooltip" :content="item.tooltipContent" :popper-class="item.tooltip.popperClass" :placement="item.tooltipPlacement">
                <template>
                  <i class="el-icon-warning-outline" style="margin-left: 5px;" />
                </template>
                <template v-if="item.tooltipSlot" #content>
                  <div v-for="item in item.tooltipContentList" :key="item">{{ item }}</div>
                </template>
              </el-tooltip>
              <i v-if="!item.iconHidden" class="iconfont" :class="item.iconName" />
            </span>
            <!-- 小标题 -->
            <span v-if="item.type === 'subTitle'" class="subtitle" :style="item.labelStyle">{{ item.label }}</span>
            <!-- 带icon的label -->
            <span v-if="item.labelIcon"><span v-if="item.labelIconRequired" style="margin-right: 5px; color: red;">*</span>{{ item.label }}<i v-if="!item.iconHidden" class="iconfont" :class="item.iconName" /></span>
          </template>

          <!-- 户型 -->
<!--          <custom-house-type v-if="item.type === 'houseType'" :item="item" :form="form" />-->

          <!-- 输入框 -->
          <template v-else-if="item.type === 'input'">
            <mklij-textarea v-if="item.inputType === 'textarea'" :item="item" :form="form" />
            <mklij-input-number v-else-if="item.inputType === 'number'" :item="item" :form="form" />
            <mklij-input v-else :item="item" :form="form" />
          </template>

          <!-- 输入框-数字 -->
          <mklij-input-number v-else-if="item.type === 'inputNumber'" :item="item" :form="form" @change="item.func ? item.func($event) : {}" />

          <!-- 日期|日期范围 date|daterange|datetime|datetimerange|week|month|year|dates -->
          <mklij-date v-else-if="item.type === 'date'" :item="item" :form="form" />

          <!-- 时间 -->
          <mklij-time v-else-if="item.type === 'time'" :item="item" :form="form" />

          <!-- 开关 -->
          <mklij-switch v-else-if="item.type === 'switch'" :item="item" :form="form" />

          <!-- 下拉框 -->
          <mklij-select v-else-if="item.type === 'select'" :ref="item.prop" :item="item" :form="form" />

          <!-- 单选按钮 -->
          <template v-else-if="item.type === 'radio'">
            <el-radio v-for="(opt, optIndex) in item.opts" :key="optIndex" v-model="form[item.prop]" :disabled="item.disabled" :label="item.optVal ? opt[item.optVal] : opt.value" @change="item.func ? item.func($event) : {}">{{ item.optLabel ? opt[item.optLabel] : opt.label }}</el-radio>
          </template>

          <!-- 单选按钮组 -->
          <mklij-radio-group v-else-if="item.type === 'radioList'" :item="item" :form="form" />

          <!-- 多选框 -->
          <template v-else-if="item.type === 'checkbox'">
            <el-checkbox v-for="(opt, optIndex) in item.opts" :key="optIndex" v-model="form[item.prop]" :disabled="item.disabled" :label="opt.value" @change="item.func ? item.func($event) : {}">{{ opt.label }}</el-checkbox>
          </template>

          <!-- 多选框组 -->
          <mklij-checkbox-group v-else-if="item.type === 'checkboxList'" :item="item" :form="form" />

          <!-- 级联 -->
          <mklij-cascader v-else-if="item.type === 'cascader'" :item="item" :form="form" />

          <!-- 单个图片上传 -->
          <template v-else-if="item.type === 'upload'">
            <el-upload class="avatar-uploader" :headers="item.headers" :action="item.action" :data="item.data" list-type="picture" accept="image/gif,image/jpeg,image/jpg,image/png" :on-success="uploadSuccess" :before-upload="beforeUpload">
              <img v-if="form[item.prop]" :src="form[item.prop]" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
              <template #tip>
                <div class="el-upload__tip">{{ item.tip }}</div>
              </template>
            </el-upload>
          </template>

          <!-- 文件编辑上传 -->
<!--          <custom-upload-file-->
<!--            v-else-if="item.type === 'uploadFile'"-->
<!--            :headers="item.headers"-->
<!--            :show-upload-btn="item.showUploadBtn"-->
<!--            :max-size="item.maxSize"-->
<!--            :multiple="item.multiple"-->
<!--            :action="item.action"-->
<!--            :data="item.data"-->
<!--            :show-file-list="item.showFileList"-->
<!--            :file-list="form[item.prop] || []"-->
<!--            :accept="item.accept"-->
<!--            :exceed-tips="item.exceedTips"-->
<!--            :limit="item.limit"-->
<!--            @handleDeleteUploadedFile="handleDeleteUploadedFile($event, item, index)"-->
<!--            @newUploadSuccess="newUploadSuccess($event,item)"-->
<!--            @preview="url => {$emit('preview',url)}"-->
<!--          />-->

          <!-- 图片上传 -->
<!--          <mklij-new-upload-->
<!--            v-else-if="item.type === 'newUpload'"-->
<!--            :headers="item.headers"-->
<!--            :max-size="item.maxSize"-->
<!--            :multiple="item.multiple"-->
<!--            :action="item.action"-->
<!--            :data="item.data"-->
<!--            :show-file-list="item.showFileList"-->
<!--            :file-list="form[item.prop]"-->
<!--            :accept="item.accept"-->
<!--            :exceed-tips="item.exceedTips"-->
<!--            :limit="item.limit"-->
<!--            @newUploadSuccess="newUploadSuccess($event, item)"-->
<!--            @preview="url => {$emit('preview', url)}"-->
<!--          >-->
<!--            <i class="el-icon-plus" />-->
<!--          </mklij-new-upload>-->

<!--          &lt;!&ndash; 图片上传 &ndash;&gt;-->
<!--          <mklij-new-upload-oss v-else-if="item.type === 'newUploadOss'" :item="item" :attachment-list="form[item.prop]" @reset="item.reset() || reset">-->
<!--            <div v-if="item.btnText" class="upload-code">-->
<!--              <i class="el-icon-plus" />-->
<!--              <span>{{ item.btnText }}</span>-->
<!--            </div>-->
<!--            <i v-else class="el-icon-plus" />-->
<!--          </mklij-new-upload-oss>-->

          <!-- 图片列表展示 -->
<!--          <custom-imgList v-else-if="item.type === 'imgList'" :item="item" :form="form" />-->

          <!-- 树形 :check-strictly="true" -->
          <el-tree v-else-if="item.type === 'tree'" ref="tree" :data="item.data" show-checkbox :node-key="item.nodeKey || 'id'" :props="item.props || defaultProps" />

          <!-- 文字（固定|动态） -->
          <custom-text v-else-if="item.type === 'text'" :class-name="item.className" :item="item" :form="form" />

          <custom-html v-else-if="item.type === 'html'" :item="item" :form="form" />

          <!-- 可点击文本框 -->
          <custom-input-click v-else-if="item.type === 'inputClick'" :item="item" :form="form" :style="item.style" />

          <!-- 导入文件 -->
          <custom-import v-else-if="item.type === 'import'" :ref="item.prop" :item="item" :form="form" @file="file => {$emit('file', file)}" />

          <!-- 按钮 -->
          <mklij-button v-else-if="item.type === 'button'" :item="item" :form="form" />

          <!-- 区域 -->
          <custom-mixin-select v-else-if="item.type === 'mixin-select'" :item="item" :form="form" />

          <!-- 用户 -->
          <custom-mulit-employee v-else-if="item.type === 'mulit-employee'" :item="item" :form="form" />

          <!-- 楼栋编号，可选数字、大写英文-->
          <custom-building-code-select v-else-if="item.type === 'buildingCode-select'" :item="item" :form="form" />

          <!-- 添加多个内容，比如多个地址 -->
          <custom-mulit-input v-else-if="item.type === 'multi-input'" v-model="form[item.prop]" :item="item" />

          <!-- 弹出框 -->
          <mklij-popper v-else-if="item.type === 'popper'" :item="item" :form="form" />

          <!-- treeselect -->
          <custom-treeselect v-else-if="item.type === 'treeselect'" :item="item" :form="form" />

          <!-- 模糊搜索 -->
          <custom-fuzzy-select v-else-if="item.type === 'autocomplete'" :ref="item.prop" :item="item" :form="form" />

          <aika-attachmentTooltip v-else-if="item.type === 'attachmentTooltip'" :item="item" :attachment-list="form[item.prop]" />

          <aika-attachmentTooltipOss
            v-else-if="item.type === 'attachmentTooltipOss'"
            :ref="item.prop"
            :item="item"
            :attachment-list="form[item.prop]"
            @fakeUploadClick="handleFakeUploadClick"
          />

          <!--富文本-->
          <mklij-editor
            v-else-if="item.type === 'editor'"
            :item="item"
            :form="form"
            :value="form[item.prop]"
            :disabled="item.disabled"
          />

          <!-- close tags -->
          <custom-close-tags v-else-if="item.type === 'close-tags'" :item="item" :form="form" />

          <!-- 可点击的tags -->
          <template v-else-if="item.type === 'text-tags'">
            <el-tag v-for="(tag,i) in item.opts" :key="i" :class="[tag.selected ? 'selected' : '', tag.active ? 'active-tag' : '', tag.disabled ? 'disabled-tag' : '']" @click="item.func ? item.func(tag, i) : {}">{{ tag.label }}</el-tag>
          </template>

          <!--
                        自定义模板
                        1. js
                        scopedSlot: 'demoSlot'
                        2. template
                        <template v-slot="demoSlot">
                            <div class="demo">
                                这个是内容
                            </div>
                        </template>
                    -->
          <slot v-if="item.scopedSlots && item.scopedSlots.customRender" :name="item.scopedSlots.customRender" />

          <slot v-if="item.scopedSlot" :name="item.scopedSlot" :item="item" :form="form" />

          <!-- 这个组件位置不要动，保证在最后面 -->
          <!-- 跟在表单内容后（可用于单位显示，解释说明） -->
          <custom-append-dom v-if="item.appendDom" :item="item.appendDom" :index="index" :origin="item" />
        </el-form-item>
        <template v-else>
          <ownform-input-group v-if="item.type === 'inputGroup'" :item="item" :form="form" />
        </template>
      </el-col>
    </template>
    <slot name="footer" />
  </el-form>
</template>

<script>
import {
  mklijInput,
  mklijTextarea,
  mklijInputNumber,
  mklijDate,
  mklijTime,
  mklijSwitch,
  mklijSelect,
  mklijRadioGroup,
  mklijCheckboxGroup,
  mklijCascader,
  // mklijNewUpload,
  // mklijNewUploadOss,
  mklijButton,
  mklijPopper
  // mklijEditor
} from './elementComp'

import {
  customInputClick,
  customImport,
  customText,
  customMixinSelect,
  customMulitEmployee,
  customMulitInput,
  CustomBuildingCodeSelect,
  CustomHouseType,
  CustomImgList,
  customHtml,
  // customTreeselect,
  CustomAppendDom,
  CustomPrependDom,
  // CustomUploadFile,
  CustomFuzzySelect,
  CustomCloseTags
} from './customComp'

import {
  ownformInputGroup
} from './ownFormComp'
export default {
  name: 'Form',
  components: {
    mklijInput,
    mklijTextarea,
    mklijInputNumber,
    mklijDate,
    mklijTime,
    mklijSwitch,
    mklijSelect,
    mklijRadioGroup,
    mklijCheckboxGroup,
    mklijCascader,
    // mklijNewUpload,
    // mklijNewUploadOss,
    mklijButton,
    mklijPopper,
    // mklijEditor,

    customInputClick,
    customImport,
    customText,
    customMixinSelect,
    customMulitEmployee,
    customMulitInput,
    CustomBuildingCodeSelect,
    CustomHouseType,
    CustomImgList,
    customHtml,
    // customTreeselect,
    CustomAppendDom,
    CustomPrependDom,
    ownformInputGroup,
    // CustomUploadFile,
    CustomFuzzySelect,
    CustomCloseTags
  },
  props: {
    isDialog: { type: Boolean, default: false },
    isView: { type: Boolean, default: false },
    hideRequiredAsterisk: { type: Boolean, default: false },
    disabled: { type: Boolean },
    size: { type: String, default: 'small' },
    labelPosition: { type: String, default: 'left' },
    labelWidth: { type: String, default: '92px' },
    formStyle: { type: Object },
    rules: { type: Object },
    spanCount: { type: Number, default: 24 },
    forms: { type: Array }, // 表单组
    initialValues: { type: Object, default: () => { return {} } } // 初始值
  },
  data() {
    return {
      form: {
        houseType: {}
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init(obj) {
      const form = {}
      const forms = this.forms
      if (forms && forms.length > 0) {
        forms.forEach(item => {
          if (!item.prop || item.hidden) return
          if (
            ['checkboxList', 'checkbox', 'cascader', 'multi-input', 'newUpload', 'newUploadOss', 'attachmentTooltip', 'attachmentTooltipOss', 'close-tags'].includes(item.type) || (item.type === 'date' && (item.dateType === 'daterange' || item.dateType === 'datetimerange')) || (item.type === 'select' && item.multiple) || (item.type === 'treeselect' && item.multiple)
          ) {
            form[item.prop] = []
          } else if (item.type === 'tree') {
            this.$nextTick(() => {
              this.$refs.tree[0].setCheckedKeys([])
              const list = obj ? obj.resourceCode : []
              list.forEach(k => {
                this.$refs.tree[0].setChecked(k, true)
              })
            })
          } else if (item.type === 'houseType') {
            form[item.prop] = {}
          } else if (item.type === 'buildingCode-select') {
            form[item.prop] = ''
            form[item.prop + '_start'] = ''
            form[item.prop + '_end'] = ''
            form[item.prop + '_check'] = false
          } else if (item.type === 'treeselect') { // treeselect 初始化赋值如果为''出现unknown
            form[item.prop] = null
          } else if (item.type === 'mulit-employee') {
            form[item.prop] = [{ memberType: item.prop }]
          } else {
            if (item.type === 'import') {
              this.$nextTick(() => {
                this.$refs[item.prop][0].resetFile()
              })
            }
            form[item.prop] = ''
          }
        })
      }
      if (obj) {
        this.form = Object.assign(form, obj)
      } else {
        this.form = Object.assign({}, form)
      }

      if (this.initialValues) {
        this.form = Object.assign({}, this.form, this.initialValues)
      }
      if (this.$refs.form && this.$refs.form.clearValidate) {
        this.$refs.form.clearValidate()
      }
      // this.form.fileList = []
    },

    // 给部分字段赋值
    initFieldsObj(obj) {
      for (const key in obj) {
        this.$set(this.form, key, obj[key])
        // this.form[key] = obj[key]
      }
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },

    // 给部分字段赋值-备份，后期调整
    initFieldsObjBak(obj) {
      const { forms } = this
      for (var i = 0; i < forms.length; i++) {
        const { prop } = forms[i]
        if (typeof obj[prop] !== 'undefined') {
          this.$set(this.form, prop, obj[prop])
        }
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },

    disableField(filedName, flag) {
      const field = this.forms.filter(item => item.prop === filedName)[0]
      this.$set(field, 'disabled', flag)
    },

    // 初始化单个值
    initField(fieldName, val) {
      this.$set(this.form, fieldName, val)
    },

    // 校验表单
    validate() {
      const { forms, form } = this
      const _form = JSON.parse(JSON.stringify(form))

      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid, obj) => {
          let _valid = true
          let errorMsg = ''
          let errField = null
          for (let i = 0; i < forms.length; i++) {
            let breakFori = false
            if (forms[i].customRules && !forms[i].hidden) {
              const customRules = forms[i].customRules
              for (let j = 0; j < customRules.length; j++) {
                const rule = customRules[j]
                if (
                  rule.type === 'max' &&
                                    !this.$isNullOrEmpty(_form[rule.being]) &&
                                    +_form[forms[i].prop] > +_form[rule.being]
                ) {
                  _valid = false
                  errorMsg = rule.errorMsg
                  errField = forms[i]

                  breakFori = true
                  break
                } else if (
                  rule.type === 'min' &&
                                    !this.$isNullOrEmpty(_form[rule.being]) &&
                                    +_form[forms[i].prop] < +_form[rule.being]
                ) {
                  _valid = false
                  errorMsg = rule.errorMsg
                  errField = forms[i]
                  breakFori = true
                  break
                }
              }
            }
            if (breakFori) {
              break
            }
          }

          if (valid && _valid) {
            // 树形
            if (this.$refs.tree) {
              const halfChecks = this.$refs.tree[0].getHalfCheckedKeys()
              const checks = this.$refs.tree[0].getCheckedKeys()
              const Ids = [...new Set(checks.concat(halfChecks))]
              this.form.resourceCode = Ids
            }
            resolve(this.form)
          } else {
            if (obj && JSON.stringify(obj) !== '{}') {
              for (const key in obj) {
                this.$message.error(obj[key][0].message)
                break
              }
            } else {
              if (errField) {
                this.$message.error(errorMsg)
              }
            }
            reject('validErr')
          }
        })
      })
    },

    // 重置表单
    reset() {
      this.$refs.form.resetFields()
      this.form.houseType = {}
      // this.form.fileList = []
    },

    // 清除校验
    clearValidate(propArr) {
      if (this.$refs.form) this.$refs.form.clearValidate(propArr)
    },

    // 上传成功
    newUploadSuccess(e, item) {
      // console.log(this.form)
      // console.log(e)
      // console.log(item)
      // this.form[item.prop] = e
      this.$set(this.form, item.prop, e)
      console.log(this.form)
      if (item.handleUploadSuccess) item.handleUploadSuccess(e)
    },

    // 主动删除已上传文件
    handleDeleteUploadedFile(e, item, index) {
      console.log(e)
      // this.form[item.prop] = e.fileList
      this.$set(this.form, item.prop, e.fileList)

      console.log(this.form)
      if (item.handleDeleteUploadedFile) item.handleDeleteUploadedFile(e.deletedItem)
    },

    // 上传成功回调
    uploadSuccess(res) {
      if (res.ok) {
        this.form.employeeWeChat = Object.prototype.toString.call(res.data) === '[object Object]' ? (res.data.fileUrl || '') : (res.data || '')
        // res.data ? this.form.fileList.push({ url: res.data }) : false
      } else {
        this.$message.error(res.message)
      }
    },

    // 上传前回调
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传二维码图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // removeHandle(d) {
    //     this.form.fileList.filter(i => {
    //         return i.url !== d.response.data
    //     })
    // }
    handleFakeUploadClick(item) {
      this.$emit('akiFakeUploadClick', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './styles/index';
</style>
