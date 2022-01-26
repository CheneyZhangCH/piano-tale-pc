<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 15:41:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-26 13:09:29
 * @FilePath: \src\components\Form\elementComp\radioGroup.vue
 * @Description:
-->
<template>
    <el-radio-group v-model="form[item.prop]" :disabled="item.disabled" @change="item.func ? item.func($event) : {}">
        <el-radio v-for="(opt, optIndex) in item.opts" :key="optIndex" :label="opt.value" :disabled="opt.disabled">{{ opt.label }}</el-radio>
    </el-radio-group>
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'MklijRadioGroup',
    mixins: [compProps]
}
</script>
