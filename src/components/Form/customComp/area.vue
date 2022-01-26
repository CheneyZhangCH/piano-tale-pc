<!--
 * @Author: sun.shengjie
 * @Date: 2020-07-01 22:21:55
 * @LastEditors: ge.rongyin
 * @LastEditTime: 2020-07-23 10:06:40
 * @FilePath: \src\components\Form\customComp\area.vue
 * @Description:
-->
<template>
    <section class="section-item">
        <template v-for="(sub,i) in item.list">
            <div v-if="sub.opts && sub.opts.length > 0" :key="i" class="section-item-sub">
                <span :class="{ selected: form[sub.prop] === '' }" @click="handleClear(sub)">不限</span>

                <span v-for="(val,j) in sub.opts" :key="j" :class="{ selected: form[sub.prop] === (!sub.props ? val : val[sub.props.value]) }" @click="handleSelect(sub,val)">{{ !sub.props ? val : val[sub.props.label] }}</span>
            </div>
        </template>
    </section>
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'CustomArea',
    mixins: [compProps],
    methods: {
        handleClear(sub) {
            sub.clear && sub.clear()
            this.$emit('select', { prop: sub.prop, value: '' })
        },

        handleSelect(sub, val) {
            sub.func && sub.func(val)
            this.$emit('select', { prop: sub.prop, value: !sub.props ? val : val[sub.props.value] })
        }
    },
}
</script>

<style lang="scss" scoped>
    @import '../styles/section';
</style>
