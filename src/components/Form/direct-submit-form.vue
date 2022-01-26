/*
 * @Author: sun.shengjie
 * @Date: 2019-11-26 11:36:57
 * @Last Modified by: sun.shengjie
 * @Last Modified time: 2020-04-20 15:14:40
 */

<template>
  <!-- 直接提交表单 -->
  <el-form ref="form" inline :model="form" :label-position="labelPosition" label-suffix="：" :size="size" :class="{ 'aika-form': true, 'aika-form-direct-submit': true, 'clearfix': true, 'none-form-style': !formCommonStyle }" :style="formStyle" @submit.native.prevent>
    <template v-for="(item, index) in forms">
      <el-form-item v-if="item.code ? btnAccess[item.code] && !item.hidden : !item.hidden" :key="index" :class="item.className || item.type" :label="`${item.label || ''}`" :label-width="item.labelWidth" :prop="item.prop" :rules="item.rules" :style="item.style">
        <!-- 输入框 -->
        <el-input
          v-if="item.type === 'input'"
          v-model="form[item.prop]"
          :type="item.inputType || ''"
          :disabled="item.disabled"
          :clearable="item.clearable !== undefined ? item.clearable : true"
          :maxlength="item.maxlength"
          :placeholder="item.placeholder || '请输入'"
          :style="itemStyle"
          @input="item.input ? item.input($event) : null"
@clear="handleSearch"
          @keyup.enter.native="item.enter ? item.enter() : handleSearch"
        >
          <template v-if="item.slot && item.slot.slot" #[item.slot.slot]>
            <span>{{ item.slot.text }}</span>
          </template>
          <template v-else-if="item.slot" #append>
            <span>{{ item.slot.text }}</span>
          </template>
        </el-input>

        <!-- 输入框-带输入提示 -->
        <el-tooltip v-if="item.type === 'inputWithTip'" class="item" effect="dark" :content="item.tooltip.content || '请输入'" :placement="item.tooltip.placement || 'right'">
          <el-input v-model="form[item.prop]" :disabled="item.disabled" :clearable="item.clearable !== undefined ? item.clearable : true" :maxlength="item.maxlength" :placeholder="item.placeholder || '请输入'" :style="itemStyle" @clear="handleSearch" @keyup.enter.native="handleSearch" />
        </el-tooltip>

        <!-- 远程搜索 -->
        <el-autocomplete
          v-if="item.type === 'autocomplete'"
          v-model="form[item.prop]"
          :value-key="item.valueKey || 'label'"
          :value="item.value || 'value'"
          :trigger-on-focus="item.triggerOnFocus || false"
          :disabled="item.disabled"
          :clearable="item.clearable !== undefined ? item.clearable : true"
          :maxlength="item.maxlength"
          :placeholder="item.placeholder || '请输入'"
          :style="itemStyle"
          :fetch-suggestions="item.fetchSuggestions"
          @change="item.change ? item.change($event) : () => {}"
          @clear="item.clear ? item.clear($event) : handleSearch"
          @select="item.func ? item.func($event) : handleSearch()"
          @keyup.enter.native="handleSearch"
        />

        <custom-fuzzy-select v-else-if="item.type === 'autocomplete-new'" :item="item" :form="form" />

        <custom-fuzzy-multi-select v-else-if="item.type === 'autocomplete-multi'" :item="item" :form="form" />

        <!-- 日期|日期范围 date|daterange|datetime|datetimerange|week|month|year|dates -->
        <el-date-picker
          v-else-if="item.type === 'date'"
          v-model="form[item.prop]"
          :disabled="item.disabled"
          :type="item.dateType || 'date'"
          :placeholder="item.placeholder || '请选择'"
          :picker-options="item.options"
          :format="item.format"
          :value-format="item.valueFormat"
          :default-time="item.defaultTime"
:clearable="item.clearable !== undefined ? item.clearable : true"
          unlink-panels
          range-separator="-"
          :start-placeholder="item.startPlaceholder || '开始日期'"
          :end-placeholder="item.startPlaceholder || '结束日期'"
          :default-value="item.devalue"
          @change="handleSearch"
        />

        <!-- 下拉框 -->
        <el-select
          v-else-if="item.type === 'select'"
          v-model="form[item.prop]"
          :disabled="item.disabled"
          :style="itemStyle"
          filterable
          :clearable="item.clearable !== undefined ? item.clearable : true"
          :multiple="item.multiple"
          :multiple-limit="item.multipleLimit || 0"
          :collapse-tags="item.collapseTags"
:placeholder="item.placeholder || '请选择'"
          @change="item.func ? item.func($event) : handleSearch()"
          @clear="item.clear ? item.clear() : null"
        >
          <el-option v-for="(opt, optIndex) in item.opts" :key="optIndex" :label="opt.label" :value="opt.value" />
        </el-select>

        <!-- 单选按钮 -->
        <template v-else-if="item.type === 'radio'">
          <span v-if="item.label" class="radio-label">{{ item.label }}</span>
          <el-radio v-for="(opt, optIndex) in item.opts" :key="optIndex" v-model="form[item.prop]" :label="opt.value" @change="handleSearch">{{ opt.label }}</el-radio>
        </template>

        <!-- 单选按钮组 -->
        <template v-else-if="item.type === 'radioList'">
          <!-- 是否带有不限选项 -->
          <span v-if="item.noLimit" class="no-limit" :class="{ selected: form[item.prop] === '' }" @click="handleNoLimitSearch({ prop: item.prop, value: '', func: item.noLimitFunc })">不限</span>
          <el-radio-group v-model="form[item.prop]" :disabled="item.disabled" @change="item.func ? item.func($event) : handleSearch()">
            <el-radio v-for="(opt, optIndex) in item.opts" :key="optIndex" :label="opt.value" :disabled="opt.disabled">{{ opt.label }}</el-radio>
          </el-radio-group>
        </template>

        <!-- 多选框 -->
        <template v-else-if="item.type === 'checkbox'">
          <el-checkbox v-for="(opt, optIndex) in item.opts" :key="optIndex" v-model="form[item.prop]" :label="opt.value" @change="handleSearch">{{ opt.label }}</el-checkbox>
        </template>

        <!-- 多选框组 -->
        <template v-else-if="item.type === 'checkboxList'">
          <!-- 是否带有不限选项 -->
          <span v-if="item.noLimit" class="no-limit" :class="{ selected: form[item.prop] && form[item.prop].length === 0 }" @click="handleNoLimitSearch({ prop: item.prop, value: [] })">不限</span>
          <el-checkbox-group v-model="form[item.prop]" :min="item.min" :max="item.max" @change="handleSearch">
            <el-checkbox v-for="(opt, optIndex) in item.opts" :key="optIndex" :label="opt.value">{{ opt.label }}</el-checkbox>
          </el-checkbox-group>
        </template>

        <!-- 级联 -->
        <el-cascader v-else-if="item.type === 'cascader'" v-model="form[item.prop]" :style="'width:' + item.width" :options="item.opts" :change-on-select="item.changeSelect" :show-all-levels="item.showLevel" @change="handleSearch" />

        <!-- 可显示点击文本框样式 -->
        <span v-else-if="item.type === 'inputClick'" class="input-click" :class="{ 'is-disabled': item.disabled,'is-placeholder': !form[item.prop] && !item.text }" @click="!item.disabled ? item.func ? item.func($event) : {} : {}">
          {{ form[item.prop] || item.text || item.placeholder }}
          <i v-if="!$isNullOrEmpty(form[item.prop]) && item.clear" class="el-icon-circle-close" style="position: absolute; right: 20px; cursor: pointer;" @click.stop.prevent="item.clear ? item.clear($event, item) : {}" />
          <i v-if="item.icon" :class="item.icon" />
        </span>

        <!-- 按钮 -->
        <template v-else-if="item.type === 'button'">
          <!-- 权限按钮 -->
          <permissions-btn v-if="item.code" :item="item" @click="item.func ? item.func() : handleSearch()">
            <template v-if="item.value" #label>
              <span>{{ item.value }}</span>
            </template>
          </permissions-btn>
          <!-- 普通按钮 -->
          <el-button v-else :icon="item.icon" :type="item.color" :size="item.size" :loading="item.loading" @click="item.func ? item.func() : handleSearch()">
            {{ item.value }}
          </el-button>
        </template>

        <!-- dropdown按钮 -->
        <dropdown-button v-else-if="item.type === 'dropdownButton'" :item="item" :form="form" />

        <!--
                    上传按钮
                    added by gry 2020年06月10日11:37:34
                    例子：
                    {
                        type: 'upload',
                        value: '导入',
                        accept: '.xls,.xlsx',
                        action: (process.env.VUE_APP_CURRENTMODE === 'dev' ? '/api' : process.env.VUE_APP_API_ROOT) + '/api-channel/applyManager/import',
                        success: this.handleImport
                    }
                -->
        <template v-else-if="item.type === 'upload'">
          <upload-file
            :url="item.action || ''"
            :accept-type="item.accept || ''"
            :btn-type="item.type || ''"
            :btn-size="item.size || ''"
            :text="item.value"
            :show-list="false"
            @success="item.success ? item.success() : null"
            @fail="item.fail ? item.fail() : null"
          />
        </template>

        <!--按钮组-->
        <template v-else-if="item.type === 'buttonGroup'">
          <template v-for="(btn, i) in item.btnlist">
            <!-- 权限按钮 -->
            <!--                        <permissions-btn v-if="btn.code" :key="i" :item="btn" @click="btn.func ? btn.func() : handleSearch()">-->
            <!--                            <template v-if="btn.value" #label>-->
            <!--                                <span>{{ btn.value }}</span>-->
            <!--                            </template>-->
            <!--                        </permissions-btn>-->
            <!-- 普通按钮 -->
            <el-button :key="i" :icon="btn.icon" :type="btn.color" :size="btn.size" :loading="btn.loading" @click="btn.func ? btn.func() : handleSearch()">
              {{ btn.value }}
            </el-button>
          </template>
        </template>
        <!-- 按钮样式 -->
        <template v-else-if="item.type === 'radioGroup'">
          <el-radio-group v-model="form[item.prop]" :disabled="item.disabled" @change="item.func ? item.func(form[item.prop]) : handleSearch">
            <el-radio-button v-for="(opt, optIndex) in item.opts" :key="optIndex" :label="opt.value">{{ opt.label }}</el-radio-button>
          </el-radio-group>
        </template>

        <!--区域-->
        <template v-else-if="item.type === 'area'">
          <customArea :item="item" :form="form" @select="doSelect" />
        </template>
        <!-- 这个组件位置不要动，保证在最后面 -->
        <!-- 跟在表单内容后（可用于单位显示，解释说明） -->
        <custom-append-dom v-if="item.appendDom" :item="item.appendDom" />
      </el-form-item>
      <div v-if="item.isNewline" :key="item.prop" />
    </template>
  </el-form>
</template>

<script>
import dropdownButton from './customComp/dropdownButton'
// import permissionsBtn from '../PermissionsBtn/btn'
import customArea from './customComp/area'
import uploadFile from '@/components/UploadBtn/uploadFile'

import { mapGetters } from 'vuex'
import { CustomAppendDom, CustomFuzzySelect, CustomFuzzyMultiSelect } from './customComp'

export default {
  name: 'DirectSubmitForm',
  components: {
    // permissionsBtn,
    customArea,
    uploadFile,
    dropdownButton,
    CustomAppendDom,
    CustomFuzzySelect,
    CustomFuzzyMultiSelect
  },
  props: {
    size: { type: String, default: 'small' },
    labelPosition: { type: String, default: 'left' },
    // labelWidth: { type: String },
    formStyle: { type: Object },
    initialValues: { type: Object },
    forms: { type: Array }, // 表单组
    itemStyle: { type: Object },

    // 奇葩需求，不能用form部分公共样式 ？？！！！
    formCommonStyle: { type: Boolean, default: true }
  },
  data() {
    return {
      form: {}
    }
  },
  computed: {
    ...mapGetters(['btnAccess'])
  },
  watch: {
    $route(to, from) {
      // console.log('to', to)
      // console.log('from', from)
      this.init()
    }
  },
  created() {
    this.init()
  },
  // mounted() {
  //     this.init()
  // },
  methods: {
    // 初始化
    init(obj, clear = false) {
      // 使用query初始化form
      const { searchParam } = this.$route.query
      const query = searchParam ? JSON.parse(searchParam) : {}

      const form = {}
      const forms = this.forms
      if (forms && forms.length > 0) {
        forms.forEach(item => {
          if (!item.prop || item.hidden) return
          if (
            (item.type === 'date' &&
                            item.dateType === 'daterange') ||
                        item.type === 'checkboxList' ||
                        item.type === 'cascader' ||
                        (item.type === 'select' && item.multiple)
          ) {
            form[item.prop] = !clear ? (query[item.prop] ?? []) : []
          } else if (item.type === 'area' && item.list && item.list.length > 0) {
            item.list.map((L) => {
              form[L.prop] = !clear ? (query[item.prop] ?? '') : ''
              clear && L.clear && L.clear()
            })
          } else {
            form[item.prop] = !clear ? (query[item.prop] ?? '') : ''
            if (item.subProp) {
              if (Array.isArray(item.subProp)) {
                item.subProp.forEach(subPropItem => {
                  form[subPropItem] = !clear ? (query[subPropItem] ?? '') : ''
                })
              } else {
                form[item.subProp] = !clear ? (query[item.subProp] ?? (item.multi ? [] : '')) : ''
              }
            }
          }
        })
      }
      if (obj) {
        this.form = Object.assign(form, obj)
      } else {
        this.form = form
      }

      if (this.$refs.form && this.$refs.form.clearValidate) {
        this.$refs.form.clearValidate()
      }
    },

    // 给部分字段赋值
    initFieldsObj(obj) {
      for (const key in obj) {
        this.$set(this.form, key, obj[key])
        // this.form[key] = obj[key]
        this.setUrlQuery()
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },

    // 重置表单
    reset(obj = {}, searchTrigger = true) {
      this.init(obj, true)
      this.setUrlQuery(true)
      if (searchTrigger) {
        this.handleSearch()
      }
    },

    // 点击不限查询
    handleNoLimitSearch({ prop, value, func }) {
      this.form[prop] = value
      this.setUrlQuery()
      // 不限按钮点击触发其他变动的事件
      if (func) { func() }
      this.$emit('handleSearch', this.form)
    },
    // 查询
    handleSearch() {
      this.setUrlQuery()
      this.$emit('handleSearch', this.form)
    },

    doSelect({ prop, value }) {
      this.form[prop] = value
      this.setUrlQuery()
      this.$emit('handleSearch', this.form)
    },

    isNullOrEmpty(val) {
      return val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)
    },

    setUrlQuery(clear) {
      // const query = {}
      // Object.keys(this.form).forEach(key => {
      //     if (!this.isNullOrEmpty(this.form[key])) {
      //         query[key] = this.form[key]
      //     }
      // })
      const { searchParam = '{}', ...rest } = this.$route.query

      if (clear) {
        const _searchParam = JSON.stringify({ ...this.form })
        this.$router.push({
          name: this.$route.name,
          query: {
            searchParam: _searchParam,
            ...rest,
            pageNo: 1
          }
        }).catch(() => {})
        return
      }

      const _searchParam = JSON.stringify({ ...JSON.parse(searchParam), ...this.form })
      this.$router.push({
        name: this.$route.name,
        query: {
          searchParam: _searchParam,
          ...rest
        }
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>

.aika-form-direct-submit {
    padding: 16px 0 0;
    margin-bottom: 0;
    // 添加背景色
    background: $theme-bg-white-9;
    &.none-form-style {
        padding-top: 0;
        background: $theme-bg-white;
        ::v-deep.el-form-item {
            margin-bottom: 16px;
        }
    }
    .input-click {
        position: relative;
        display: block;
        width: $ui-width--small;
        height: 32px;
        padding: 0 30px 0 15px;
        overflow: hidden;
        font-size: 14px;
        line-height: 32px;
        color: $theme-font-grey;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        background-color: $theme-bg-white;
        border: 1px solid $theme-border-white-2;
        border-radius: 4px;
        &.is-placeholder {
            color: $theme-font-grey-4;
        }
        &.is-disabled {
            color: $theme-font-grey-4;
            cursor: not-allowed;
            background-color: $theme-bg-white-1;
            border-color: $theme-border-white-10;
        }
        i {
            position: absolute;
            right: 0;
            margin-top: 8px;
            margin-right: 8px;
            font-size: 16px;
            color: $theme-font-grey-4;
        }
    }
    .radio-label {
        display: inline-flex;
        min-width: 92px;
    }
    ::v-deep {
        @import "~./direct-submit-form";
    }
    ::v-deep.el-form-item {
        margin-right: 24px;
        .el-form-item__label {
            width: auto;
            padding-right: 0;
            color: $theme-font-dark;
        }
    }
    ::v-deep .radioList,
    ::v-deep .checkboxList {
        .el-form-item__content {
            .no-limit {
                margin-right: 25px;
                font-size: 14px;
                color: $theme-font-dark;
                cursor: pointer;
            }
            .no-limit.selected {
                font-weight: 600;
                color: $theme-color-primary;
            }
            .el-radio-group {
                display: inline-block;
                .el-radio {
                    font-weight: 400;
                }
            }
            .el-checkbox-group {
                display: inline-block;
                .el-checkbox {
                    font-weight: 400;
                }
            }
        }
    }
}
</style>
