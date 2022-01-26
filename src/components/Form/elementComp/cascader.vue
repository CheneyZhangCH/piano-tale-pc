<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 15:48:40
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-05-15 16:18:04
 * @FilePath: \src\components\Form\elementComp\cascader.vue
 * @Description: el 级联封装
-->
<template>
    <el-cascader v-model="form[item.prop]" :disabled="item.disabled" clearable :style="'width:' + item.width" :options="item.opts" :change-on-select="item.changeSelect" :show-all-levels="item.showLevel" />
</template>
<script>
import compProps from '../mixins/props'
export default {
    name: 'MklijCascader',
    mixins: [compProps]
}
</script>
