<!--
 * @Description: 多个输入，比如输入多个地址
 * @Author: ge.rongyin
 * @Date: 2020-04-15 15:18:40
 * @Last Modified by: ge.rongyin
 * @Last Modified time: Do not edit
 -->
<template>
    <div class="multi-input">
        <el-tag
            v-for="(tag,index) in dynamicTags"
            :key="index"
            :closable="!item.disabled"
            :disable-transitions="false"
            @close="handleClose(tag)"
        >
            {{ tag }}
        </el-tag>
        <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
        />
        <el-button v-else-if="!item.disabled" class="button-new-tag" size="small" @click="showInput">+ 添加</el-button>
    </div>
</template>

<script>
import compProps from '../mixins/props'

export default {
    mixins: [compProps],
    props: {
        value: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dynamicTags: [],
            inputVisible: false,
            inputValue: ''
        }
    },
    watch: {
        value(newVal) {
            this.dynamicTags = newVal
        }
    },
    methods: {
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
            this.$emit('input', this.dynamicTags)
        },

        showInput() {
            this.inputVisible = true
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },

        handleInputConfirm() {
            const inputValue = this.inputValue.replace(/\,/g, '')
            if (inputValue) {
                this.dynamicTags.push(inputValue)
            }
            this.inputVisible = false
            this.inputValue = ''
            this.$emit('input', this.dynamicTags)
        }
    }
}
</script>

<style lang="scss" scoped>
    .el-tag{
        border: 0;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
        border: 0;
        background: $theme-bg-white-22;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>
