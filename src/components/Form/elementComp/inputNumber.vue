<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 15:30:05
 * @LastEditors: ge.rongyin
 * @LastEditTime: 2020-08-24 19:26:58
 * @FilePath: \src\components\Form\elementComp\inputNumber.vue
 * @Description:
-->
<template>
    <span>
        <el-input-number
            v-model="form[item.prop]"
            class="mklaj-input-number"
            :controls="false"
            :class="{ 'has-unit--append': item.slot && item.slot.type === 'string' && item.slot.slot !== 'prepend', 'input-num': true }"
            :style="[{ width: item.inputType === 'textarea' ? '760px' : '' }, item.valStyle]"
            :readonly="item.readonly"
            :disabled="item.disabled"
            :type="item.inputType || ''"
            :clearable="item.clearable !== undefined ? item.clearable : true"
            :maxlength="item.maxlength"
            :placeholder="item.placeholder || '请输入'"
            :max="item.max"
            :min="item.min"
            :precision="item.precision"
            @change="item.func ? item.func($event) : {}"
            @blur="validateVal(item) || item.always"
        />
        <template v-if="item.slot">
            <span style="margin-left: 5px">
                <el-button v-if="item.slot.type === 'button'" :icon="item.slot.icon" @click="item.slot.func">{{ item.slot.text }}</el-button>
                <span v-else-if="item.slot.type === 'string'">{{ item.slot.text }}</span>
            </span>
        </template>
    </span>
    <!-- <el-input v-else-if="item.type === 'inputNumber'" v-model="form[item.prop]" :class="{ 'has-unit--append': item.slot && item.slot.type === 'string' && item.slot.slot !== 'prepend', 'input-num': true }" :style="[{ width: item.inputType === 'textarea' ? '760px' : '' }, item.valStyle]" :disabled="item.disabled" :type="item.inputType || ''" :clearable="item.clearable !== undefined ? item.clearable : true" :maxlength="item.maxlength" :placeholder="item.placeholder || '请输入'" :resize="item.resize" :autosize="item.autosize" :show-word-limit="item.showWordLimit" @blur="validateVal(item)">
        <template v-if="item.slot" :slot="item.slot.slot || 'append'">
            <el-button v-if="item.slot.type === 'button'" :icon="item.slot.icon" @click="item.slot.func">{{ item.slot.text }}</el-button>
            <span v-else-if="item.slot.type === 'string'">{{ item.slot.text }}</span>
        </template>
    </el-input> -->
</template>

<script>
import Decimal from 'decimal.js'
import compProps from '../mixins/props'
export default {
    name: 'MklijInputNumber',
    mixins: [compProps],
    data: function() {
        return {
            oldVal: 0
        }
    },
    mounted() {
        this.form[this.item.prop] = undefined
        this.$nextTick(() => {
            if (this.$parent.clearValidate) this.$parent.clearValidate()
        })
    },
    methods: {
        validateVal(field, type) {
            return
            const { prop, min = 0, max, precision = 0 } = field
            const setVal = val => {
                let result, flag
                const arr = val ? val.split('.') : []
                this.oldVal = val
                const oldValArr = val ? val.split('.') : []
                if (oldValArr.length > 1 && oldValArr[1]) {
                    flag = true
                } else {
                    flag = false
                }
                if (arr.length === 2 && !flag) {
                    result = (arr[0] ? Number(arr[0]) : min) + '.' + (arr[1] ? Number(arr[1]) : min)
                } else {
                    result = val
                }
                this.form[prop] = Number(result)
                this.$nextTick(() => {
                    if (this.item.always) this.item.func(result)
                })
            }

            const val = this.form[prop]
            let newVal = val

            if (newVal === '') {
                if (this.item.always) {
                    return true
                } else {
                    return
                }
            }
            if (typeof newVal !== 'number') {
                setVal(newVal)
                if (this.item.always) {
                    return true
                } else {
                    return
                }
            }
            // 大于
            if (
                typeof min !== 'undefined' &&
                new Decimal(newVal).lessThan(min)
            ) {
                setVal(min)
                if (this.item.always) {
                    return true
                } else {
                    return
                }
            }
            // 小于
            if (
                typeof max !== 'undefined' &&
                new Decimal(newVal).greaterThan(max)
            ) {
                setVal(max)
                if (this.item.always) {
                    return true
                } else {
                    return
                }
            }

            if (precision === 0) {
                if ((parseInt(newVal) + '').length !== (newVal + '').length) {
                    newVal = parseInt(newVal)
                }
            }

            if (precision > 0) {
                if (
                    (newVal + '').split('.').length > 1 &&
                    (newVal + '').split('.')[1].length > precision
                ) {
                    newVal = [
                        parseInt(newVal),
                        (newVal + '').split('.')[1].substr(0, 2)
                    ].join('.')
                }
            }

            setVal(String(Number(newVal)))
            return true
        },
    }
}
</script>
<style lang="scss">
.el-input-number.mklaj-input-number {
  .el-input__inner {
    text-align: left;
  }
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
      color: $theme-font-dark-1;
    }
  }
  // &__inner {
  //     width: 180px
  // }
  &.input-num {
    width: auto;
  }
}
</style>
