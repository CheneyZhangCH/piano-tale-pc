<!--
 * @Author: sun.shengjie
 * @Date: 2020-06-01 14:36:47
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-06-01 14:39:01
 * @FilePath: \src\components\Form\elementComp\textarea.vue
 * @Description:
-->

<template>
    <el-input v-model="form[item.prop]" :disabled="item.disabled" :type="item.inputType" :clearable="item.clearable !== undefined ? item.clearable : true" :maxlength="item.maxlength" :placeholder="item.placeholder || '请输入'" :resize="item.resize" :rows="item.rows || 4" :autosize="item.autosize" :show-word-limit="item.showWordLimit" @input="item.func ? item.func($event) : {}" />
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'MklijTextarea',
    mixins: [compProps]
}
</script>
