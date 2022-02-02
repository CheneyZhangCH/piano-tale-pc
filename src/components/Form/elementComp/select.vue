<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 15:36:59
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-06-23 13:31:11
 * @FilePath: \src\components\Form\elementComp\select.vue
 * @Description:
-->
<template>
  <span>
    <el-select
      :ref="item.prop"
      v-model="form[item.prop]"
      :disabled="item.disabled"
      filterable
      :filter-method="item.filterMethod"
      :clearable="item.clearable !== undefined ? item.clearable : true"
      :multiple="item.multiple"
      :multiple-limit="item.multipleLimit || 0"
      :remote="item.remote"
      :remote-method="item.remoteMethod"
      :reserve-keyword="item.reserveKeyword"
      :collapse-tags="item.collapseTags"
      :placeholder="item.placeholder || '请选择'"
      :loading="item.loading"
      :popper-class="item.optionCustomTipVisible && item.optionCustomTipBtn ? 'showTips showTipsBtn' : item.optionCustomTipVisible ? 'showTips' : item.optionCustomTipBtn ? 'showTipsBtn' : ''"
      @change="item.func ? item.func($event, index) : {}"
      @blur="item.blur ? item.blur($event) : {}"
      @clear="item.clear ? item.clear() : null"
    >
      <div v-if="Array.isArray(item.opts) && item.opts.length > 0 && item.optionCustomTipVisible" class="custom-tips">
        <span>{{ item.optionCustomTip }}</span>
        <span v-if="item.optionCustomTipBtn" class="custom-tips-btn" @click="item.optionCustomTipBtnFunc ? item.optionCustomTipBtnFunc() : {}">{{ item.optionCustomTipBtnText }}</span>
      </div>
      <el-option
        v-for="(opt, optIndex) in item.opts"
        :key="opt.id || optIndex"
        :label="item.optLabel ? opt[item.optLabel] : opt.label"
        :value="item.optVal ? opt[item.optVal] : opt.value"
        :disabled="opt.disabled"
      />
    </el-select>
    <span v-if="item.append" style="margin-left: 10px;">{{ item.append }}</span>
  </span>
</template>

<script>
import compProps from '../mixins/props'
export default {
  name: 'MklijSelect',
  mixins: [compProps],
  props: {
    index: { type: Number }
  }
}
</script>
<style lang="scss">
.custom-tips {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    width: 100%;
    padding: 7px;
    font-size: 12px;
    line-height: normal;
    color: $theme-font-red;
    background: $theme-bg-white;
    .custom-tips-btn {
        color: $theme-font-blue-1;
    }
}
.el-select-dropdown.showTips {
    &.showTips {
        .el-scrollbar .el-select-dropdown__wrap .el-select-dropdown__list {
            padding-top: 30px;
        }
    }
    &.showTipsBtn {
        min-width: 415px !important;
        cursor: pointer;
    }
}

</style>

