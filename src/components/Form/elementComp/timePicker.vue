<!--
 * @Author: sun.shengjie
 * @Date: 2020-06-08 13:53:45
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-11-03 19:59:05
 * @FilePath: /src/components/Form/elementComp/timePicker.vue
 * @Description:
-->

<template>
    <el-time-picker v-model="form[item.prop]" :disabled="item.disabled" :is-range="item.isRange" :placeholder="item.placeholder || '请选择'" :picker-options="item.options" :default-value="item.defaultValue" :value-format="item.valueFormat" :clearable="item.clearable !== undefined ? item.clearable : true" unlink-panels range-separator="-" :start-placeholder="item.startPlaceholder || '开始时间'" :end-placeholder="item.startPlaceholder || '结束时间'" @change="item.func ? item.func($event) : {}" />
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'MklijTimePicker',
    mixins: [compProps]
}
</script>
