<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 15:59:44
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-05-15 16:17:56
 * @FilePath: \src\components\Form\elementComp\button.vue
 * @Description: el 按钮封装
-->
<template>
    <el-button :size="item.size" :disabled="item.disabled" :type="item.color" @click="item.func ? item.func() : {}">{{ item.text }}</el-button>
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'MklijDate',
    mixins: [compProps]
}
</script>
