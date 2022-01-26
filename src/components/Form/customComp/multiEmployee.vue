<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 16:02:24
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-06-22 14:21:43
 * @FilePath: \src\components\Form\customComp\multiEmployee.vue
 * @Description: 多选经纪人
-->
<template>
    <div class="multi-employee">
        <span v-for="(col,colIndex) in form[item.prop]" :key="`project_${item.prop}_${colIndex}`" class="multi-employee-wrap">
            <el-radio-group v-if="item.prop === 'caseReceptionInner'" v-model="form[item.prop][colIndex].memberType">
                <el-radio :label="'caseReceptionOut'">外部</el-radio>
                <el-radio :label="'caseReceptionInner'">内部</el-radio>
            </el-radio-group>

            <span class="multi-employee-wrap-item">
                <el-input v-if="item.prop === 'developsOrDockerOut' || (item.prop === 'caseReceptionInner' && form[item.prop][colIndex].memberType === 'caseReceptionOut')" v-model="form[item.prop][colIndex].memberName" maxlength="20" placeholder="请输入（20字以内）" />

                <el-form-item v-else :prop="`${item.prop}[${colIndex}].emp`" :rules="item.rules">
                    <el-tooltip v-if="form[item.prop][colIndex].emp" class="item" effect="dark" :content="form[item.prop][colIndex].emp" placement="top-start">
                        <span
                            class="input-click"
                            :class="{ 'is-placeholder': !form[item.prop],'is-disabled': item.disabled,'widthMedium': item.widthMedium }"
                            @click="!item.disabled ? item.func ? item.func(colIndex) : {} : {}"
                            @mouseenter="active = true"
                            @mouseleave="active = false"
                        >
                            {{ form[item.prop][colIndex].emp || item.placeholder }}
                            <i v-if="item.icon" :class="item.icon" />
                            <i
                                v-if="!item.disabled && item.showDelete && active"
                                class="el-icon-error delete"
                                @click="item.delFunc ? item.delFunc($event) : {} "
                            />
                        </span>
                    </el-tooltip>
                    <span v-else class="input-click" :class="{ 'is-placeholder': !form[item.prop],'is-disabled': item.disabled,'widthMedium': item.widthMedium }" @click="!item.disabled ? item.func ? item.func(colIndex) : {} : {}">
                        {{ form[item.prop][colIndex].emp || item.placeholder }}
                        <i v-if="item.icon" :class="item.icon" />
                    </span>
                </el-form-item>

                <el-form-item :prop="`${item.prop}[${colIndex}].telephone`" :rules="item.telRules">
                    <el-input v-model="form[item.prop][colIndex].telephone" placeholder="手机号/座机需要填区号" />
                </el-form-item>

                <el-button v-if="form[item.prop].length > 1" icon="el-icon-minus" @click="minusRow(colIndex)" />
                <el-button v-if="form[item.prop].length - 1 === colIndex && colIndex < 4" icon="el-icon-plus" @click="addRow" />
            </span>
        </span>
    </div>
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'CustomMixinSelect',
    mixins: [compProps],
    data() {
        return {
            active: false,
        }
    },
    methods: {
        // 新增
        addRow() {
            this.form[this.item.prop].push({
                memberType: this.item.prop
            })
        },

        // 移除
        minusRow(index) {
            this.form[this.item.prop].splice(index, 1)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/styles/vars";

    .multi-employee {
        .multi-employee-wrap {
            &:first-child {
                .multi-employee-wrap-item {
                    margin-top: 0;
                }
            }
        }
        &-wrap {
            &-item {
                display: flex;
                margin-top: 10px;

                .el-input {
                    width: 180px;
                    margin-right: 15px;
                }
                .el-form-item {
                    margin-bottom: 0 !important;
                }
                .el-button {
                    padding: 9px 10px;
                    margin-left: 5px;
                    height: 32px;
                }
            }
        }
    }
</style>

<style lang="scss" scoped>
@import "@/styles/vars";
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
    margin-right: 15px;
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
