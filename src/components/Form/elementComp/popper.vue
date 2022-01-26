<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 15:48:40
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-06-18 13:12:54
 * @FilePath: \src\components\Form\elementComp\popper.vue
 * @Description: el 弹出层
-->
<template>
    <el-popover :placement="item.placement || 'bottom-start'" :title="item.title" :width="item.popperWidth" :trigger="item.trigger || 'hover'">
        <template #reference>
            <el-button>hover 激活</el-button>
        </template>
    </el-popover>
</template>
<script>
import compProps from '../mixins/props'
export default {
    name: 'MklijPopper',
    mixins: [compProps]
}
</script>
