<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 16:02:24
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-11-03 19:59:58
 * @FilePath: /src/components/Form/ownFormComp/inputGroup.vue
 * @Description: 多选经纪人
-->
<template>
    <div class="own-form-list">
        <template v-for="(sub,subIndex) in item.list">
            <el-form-item v-if="!sub.hidden" :key="subIndex" :class="sub.className" :label="`${sub.label}`" :prop="sub.prop" :rules="sub.rules" :label-width="sub.labelWidth" :style="sub.style">
                <template #label>
                    <span v-if="!sub.label" />
                </template>

                <!-- 输入框 -->
                <template v-if="sub.type === 'input'">
                    <mklij-textarea v-if="sub.inputType === 'textarea'" :item="sub" :form="form" />
                    <mklij-input-number v-else-if="sub.inputType === 'number'" :item="sub" :form="form" />
                    <mklij-input v-else :item="sub" :form="form" />
                </template>

                <mklij-select v-else-if="sub.type === 'select'" :item="sub" :form="form" />

                <!-- 日期|日期范围 date|daterange|datetime|datetimerange|week|month|year|dates -->
                <mklij-date v-else-if="sub.type === 'date'" :item="sub" :form="form" />

                <!-- 时间 -->
                <mklij-time v-else-if="sub.type === 'time'" :item="sub" :form="form" />

                <!-- 时间 -->
                <mklij-time-picker v-else-if="sub.type === 'timePicker'" :item="sub" :form="form" />

                <custom-text v-else-if="sub.type === 'text'" :class-name="sub.className" :item="sub" :form="form" />

                <mklij-input-number v-else-if="sub.type === 'inputNumber'" :item="sub" :form="form" />

                <!-- 多选框 -->
                <template v-else-if="sub.type === 'checkbox'">
                    <el-checkbox v-for="(opt, optIndex) in sub.opts" :key="optIndex" v-model="form[sub.prop]" :disabled="sub.disabled" :label="opt.value" @change="sub.func ? sub.func($event) : {}">{{ opt.label }}</el-checkbox>
                </template>

                <!-- 跟在表单内容后（可用于单位显示，解释说明） -->
                <custom-append-dom v-if="sub.appendDom" :item="sub.appendDom" />
            </el-form-item>
        </template>
    </div>
</template>

<script>
import compProps from '../mixins/props'
import {
    mklijInput,
    mklijTextarea,
    mklijInputNumber,
    mklijSelect,
    mklijDate,
    mklijTime,
    mklijTimePicker,
} from '../elementComp'

import {
    CustomAppendDom,
    customText,
} from '../customComp'
export default {
    name: 'OwnformInputGroup',
    components: {
        mklijInput,
        mklijTextarea,
        mklijInputNumber,
        mklijSelect,
        mklijDate,
        mklijTime,
        mklijTimePicker,
        CustomAppendDom,
        customText,
    },
    mixins: [compProps]
}
</script>

<style lang="scss" scoped>
    .own-form-list {
        ::v-deep
        .el-form-item {
            display: inline-block;
            margin-right: 10px;
        }
    }
</style>
