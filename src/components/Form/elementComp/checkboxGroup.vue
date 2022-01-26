<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 15:43:02
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-05-15 16:18:15
 * @FilePath: \src\components\Form\elementComp\checkboxGroup.vue
 * @Description: el 表单复选封装
-->
<template>
    <el-checkbox-group v-model="form[item.prop]" :disabled="item.disabled" :min="item.min" :max="item.max" @change="item.func ? item.func($event) : {}">
        <el-checkbox v-for="(opt, optIndex) in item.opts" :key="optIndex" :label="opt.value">{{ opt.label }}</el-checkbox>
    </el-checkbox-group>

</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'MklijDate',
    mixins: [compProps]
}
</script>
