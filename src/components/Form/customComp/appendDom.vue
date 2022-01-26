<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 15:15:42
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-10-30 14:30:29
 * @FilePath: /src/components/Form/customComp/appendDom.vue
 * @Description:
-->
<template>
    <div class="append-dom">
        <el-button v-if="item.type === 'button'" :type="item.color" @click="item.func ? item.func(index, origin) : {}">{{ item.text }}</el-button>

        <el-tooltip v-else-if="item.type === 'tooltip'" :effect="item.effect || 'dark'" :content="item.content" :placement="item.placement || 'top'">
            <i class="iconfont" :class="item.icon" />
        </el-tooltip>

        <span v-else-if="item.type === 'icon' && !item.hidden" :style="item.style" :class="item.className">
            <i class="iconfont" :class="item.iconName" />
        </span>

        <span v-else-if="item.html" :style="item.style" @click="item.func ? item.func(index, origin) : {}" v-html="item.html" />

        <span v-else :style="item.style" @click="item.func ? item.func(index, origin) : {}">{{ item.text }}</span>
    </div>
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'CustomAppendDom',
    mixins: [compProps],
    props: {
        index: {
            type: Number,
        },
        origin: {
            type: Object,
            default: () => ({}),
        },
    }
}
</script>

<style lang="scss" scoped>
    .append-dom {
        display: inline-block;
        padding-left: 10px;
    }
</style>
