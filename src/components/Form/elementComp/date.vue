<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 15:24:16
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-06-08 16:02:08
 * @FilePath: \src\components\Form\elementComp\date.vue
 * @Description: el 日期封装
-->
<template>
    <el-date-picker
        v-model="form[item.prop]"
        :popper-class="item.myClass"
        :disabled="item.disabled"
        :type="item.dateType || 'date'"
        :placeholder="item.placeholder || '请选择'"
        :picker-options="item.options"
        :default-value="item.defaultValue"
        :default-time="item.defaultTime"
        :format="item.format"
        :value-format="item.valueFormat"
        :clearable="item.clearable !== undefined ? item.clearable : true"
        :unlink-panels="item.unlinkPanels !== undefined ? item.unlinkPanels : true"
        :range-separator="item.rangeSeparator || '-'"
        :start-placeholder="item.startPlaceholder || '开始日期'"
        :end-placeholder="item.startPlaceholder || '结束日期'"
        @change="item.func ? item.func($event) : {}"
    />
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'MklijDate',
    mixins: [compProps]
}
</script>
