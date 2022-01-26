<!--
 * @Author: sun.shengjie
 * @Date: 2020-07-01 22:21:55
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-11-04 11:05:02
 * @FilePath: /src/components/Form/customComp/closeTags.vue
 * @Description:
-->
<template>
    <section class="close-tags">
        <el-tag v-for="(tag,i) in form[item.prop]" :key="i" closable @close="closeTags(item,i)">{{ tag }}</el-tag>
        <el-button v-if="item.func && form[item.prop] && form[item.prop].length < (item.max || 5)" type="text" icon="el-icon-plus" @click="item.func(item)">添加</el-button>
    </section>
</template>

<script>
import compProps from '../mixins/props'
export default {
    mixins: [compProps],
    methods: {
        // 移除tags
        closeTags(item, i) {
            item.close && item.close(i)
            this.form[item.prop].splice(i, 1)
        },
    }
}
</script>

<style lang="scss" scoped>
.close-tags {
    .el-tag {
        +.el-tag,
        +.el-button {
            margin-left: 10px;
        }
    }
}
</style>
