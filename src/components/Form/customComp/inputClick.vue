<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 14:59:59
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-06-10 11:29:28
 * @FilePath: \src\components\Form\customComp\inputClick.vue
 * @Description: 可点击输入框
-->
<template>
    <el-tooltip
        v-if="item.showTooltipManual || (item.showTooltip && form[item.prop])"
        v-model="item.showTooltipManualVisible"
        class="item"
        effect="dark"
        :manual="item.showTooltipManual || false"
        :content="item.showTooltipContent || form[item.prop]"
        :placement="item.showTooltipPlacement || 'top-start'"
    >
        <span
            class="input-click"
            :class="{ 'is-placeholder': !form[item.prop],'is-disabled': item.disabled,'widthMedium': item.widthMedium }"
            :title="form[item.prop]"
            @click="!item.disabled ? item.func ? item.func($event) : {} : {}"
            @mouseenter="active = true"
            @mouseleave="active = false"
        >
            {{ form[item.prop] || item.placeholder }}
            <i v-if="item.icon" :class="item.icon" />
            <i
                v-if="!item.disabled && item.showDelete && active"
                class="el-icon-error delete"
                @click="item.delFunc ? item.delFunc($event) : {} "
            />
        </span>
    </el-tooltip>
    <span v-else class="input-click" :title="form[item.prop] || item.text" :class="{ 'is-placeholder': !form[item.prop] && !item.text,'is-disabled': item.disabled,'widthMedium': item.widthMedium }" :style="item.valStyle" @click="!item.disabled ? item.func ? item.func($event) : {} : {}">
        {{ form[item.prop] || item.text || item.placeholder }}
        <i v-if="item.icon" :class="item.icon" />
    </span>
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'CustomInputClick',
    mixins: [compProps],
    data() {
        return {
            active: false,
        }
    },
}
</script>

<style lang="scss" scoped>
    .input-click {
        position: relative;
        display: block;
        width: $ui-width--small;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        background-color: $theme-bg-white;
        border-radius: 4px;
        padding: 0 30px 0 15px;
        border: 1px solid $theme-border-white-2;
        color: $theme-font-grey;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &.is-placeholder {
            color: $theme-font-grey-4;
        }
        &.is-disabled {
            cursor: not-allowed;
            background-color: $theme-bg-white-1;
            border-color: $theme-border-white-10;
            color: $theme-font-grey-4;
        }
        &.widthMedium {
            width: $ui-width--medium;
        }
        i {
            color: $theme-font-grey-4;
            font-size: 16px;
            margin-top: 8px;
            margin-right: 8px;
            position: absolute;
            right: 0;
        }
        .delete {
            position: absolute;
            right: 16px;
            top: 8px;
            transform: translateY(-50%);
        }
    }
</style>
