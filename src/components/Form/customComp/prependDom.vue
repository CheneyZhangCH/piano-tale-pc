<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 15:15:42
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-10-30 14:30:29
 * @FilePath: /src/components/Form/customComp/prependDom.vue
 * @Description:
-->
<template>
    <div class="prepend-dom">
        <el-button v-if="item.type === 'button'" :type="item.color" @click="item.func ? item.func() : {}">{{ item.text }}</el-button>

        <el-tooltip v-else-if="item.type === 'tooltip'" :effect="item.effect || 'dark'" :content="item.content" :placement="item.placement || 'top'">
            <i class="iconfont" :class="item.icon" />
        </el-tooltip>

        <span v-else :style="item.style">{{ item.text }}</span>
    </div>
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'CustomPrependDom',
    mixins: [compProps]
}
</script>

<style lang="scss" scoped>
    .prepend-dom {
        display: inline-block;
        padding-right: 10px;
    }
</style>
