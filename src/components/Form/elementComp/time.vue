<!--
 * @Author: sun.shengjie
 * @Date: 2020-06-08 13:53:45
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-11-04 13:11:24
 * @FilePath: /src/components/Form/elementComp/time.vue
 * @Description:
-->

<template>
    <el-time-select v-model="form[item.prop]" :disabled="item.disabled" :placeholder="item.placeholder || '请选择'" :picker-options="item.options" :default-value="item.defaultValue" :clearable="item.clearable !== undefined ? item.clearable : true" :start-placeholder="item.startPlaceholder || '开始时间'" :end-placeholder="item.startPlaceholder || '结束时间'" @change="item.func ? item.func($event) : {}" />
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'MklijTime',
    mixins: [compProps]
}
</script>
