<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 15:15:42
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-06-24 15:36:43
 * @FilePath: \src\components\Form\elementComp\input.vue
 * @Description:
-->
<template>
    <!-- 允许输入空格 -->
    <el-input v-if="item.noTrim" v-model="form[item.prop]" :class="{ 'has-unit--append': item.slot && item.slot.type === 'string' && item.slot.slot !== 'prepend' }" :readonly="item.readonly" :style="item.valStyle" :disabled="item.disabled" :type="item.inputType || ''" :clearable="item.clearable !== undefined ? item.clearable : true" :maxlength="item.maxlength" :placeholder="item.placeholder || '请输入'" :resize="item.resize" :show-password="item.showPassword" @input="item.func ? item.func($event) : {}" @blur="item.blur ? item.blur(form, $event) : {}">
        <template v-if="item.slot && item.slot.slot" #[item.slot.slot]>
            <el-button v-if="item.slot.type === 'button'" :icon="item.slot.icon" @click="item.slot.func">{{ item.slot.text }}</el-button>
            <span v-else-if="item.slot.type === 'string'">{{ item.slot.text }}</span>
        </template>
        <template v-else-if="item.slot" #append>
            <el-button v-if="item.slot.type === 'button'" :icon="item.slot.icon" @click="item.slot.func">{{ item.slot.text }}</el-button>
            <span v-else-if="item.slot.type === 'string'">{{ item.slot.text }}</span>
        </template>
    </el-input>
    <el-input v-else v-model.trim="form[item.prop]" :class="{ 'has-unit--append': item.slot && item.slot.type === 'string' && item.slot.slot !== 'prepend' }" :readonly="item.readonly" :style="item.valStyle" :disabled="item.disabled" :type="item.inputType || ''" :clearable="item.clearable !== undefined ? item.clearable : true" :maxlength="item.maxlength" :placeholder="item.placeholder || '请输入'" :resize="item.resize" :show-password="item.showPassword" @input="item.func ? item.func($event) : {}" @blur="item.blur ? item.blur(form, $event) : {}">
        <template v-if="item.slot && item.slot.slot" #[item.slot.slot]>
            <el-button v-if="item.slot.type === 'button'" :icon="item.slot.icon" @click="item.slot.func">{{ item.slot.text }}</el-button>
            <span v-else-if="item.slot.type === 'string'">{{ item.slot.text }}</span>
        </template>
        <template v-else-if="item.slot" #append>
            <el-button v-if="item.slot.type === 'button'" :icon="item.slot.icon" @click="item.slot.func">{{ item.slot.text }}</el-button>
            <span v-else-if="item.slot.type === 'string'">{{ item.slot.text }}</span>
        </template>
    </el-input>
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'MklijInput',
    mixins: [compProps]
}
</script>

<style lang="scss" scoped>
    .el-input {
        &.has-unit--append {
            position: relative;
            .el-input__inner {
                border-radius: 4px;
            }
            .el-input-group__append {
                padding: 0 10px;
                background-color: transparent;
                border: 0;
                font-size: 14px;
            }
        }
        // &__inner {
        //     width: 180px
        // }
        &.input-num {
            width: auto;
            .el-input__inner {
                width: 100px;
            }
        }
    }
</style>
