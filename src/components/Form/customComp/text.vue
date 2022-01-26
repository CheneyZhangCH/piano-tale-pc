<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 15:06:47
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-09-01 09:57:16
 * @FilePath: \src\components\Form\customComp\text.vue
 * @Description: 表单文本
-->
<template>
    <div :class="className" :title="className ? item.formatter ? item.formatter(form) : ($isNullOrEmpty(form[item.prop]) ? (item.text || '-') : form[item.prop]) : ''">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-if="form[item.prop] && item.textType === 'html'" v-html="form[item.prop].replace(/\n/g, '<br>')" />

        <span v-else-if="form[item.prop] && item.textType === 'link'" class="link" :style="item.textStyle" href="javascript:void(0);" @click="item.func ? item.func(form) : ''">
            {{ item.formatter ? item.formatter(form) : ($isNullOrEmpty(form[item.prop]) ? (item.text || '-') : form[item.prop]) }}
        </span>

        <span v-else :style="item.textStyle">
            {{ item.formatter ? item.formatter(form) : ($isNullOrEmpty(form[item.prop]) ? (item.text || '-') : form[item.prop]) }}
        </span>

        <template v-if="item.slot">
            <span v-if="item.slot.type === 'string'" @click="item.slot.func ? item.slot.func(form) : {}">{{ item.slot.text }}</span>
            <span v-else-if="item.slot.type === 'icon' && item.formatter ? item.formatter(form) : ($isNullOrEmpty(form[item.prop]) ? (item.text || '-') : form[item.prop])" :style="item.slot.style" @click="item.slot.func ? item.slot.func() : {}">
                {{ item.slot.text }}<i v-if="item.slot.icon" class="slot-icon iconfont" :class="item.slot.icon" />
            </span>
            <el-button
                v-if="item.slot.type === 'btn' && (item.slot.btnCode ? btnAccess[item.slot.btnCode] : true)"
                :type="item.slot.btnType"
                :size="item.slot.btnSize"
                :disabled="item.slot.formatter ? item.slot.formatter(form).disabled : false"
                :style="item.slot.style"
                @click="item.slot.func ? item.slot.func(form) : {}"
            >{{ item.slot.btnText }}</el-button>
        </template>
    </div>
</template>

<script>
import compProps from '../mixins/props'
import { mapGetters } from 'vuex'
export default {
    name: 'CustomText',
    mixins: [compProps],
    props: {
        className: String
    },
    computed: {
        ...mapGetters(['btnAccess']),
    },
}
</script>

<style lang="scss" scoped>
.slot-icon {
    font-size: 14px;
    color: $theme-color-primary;
}
.link {
    color: $theme-font-dark-1;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
        color: $theme-color-primary;
    }
}
.inline {
    display: inline-block;
}
</style>
