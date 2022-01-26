<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 16:02:24
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-05-15 16:15:30
 * @FilePath: \src\components\Form\customComp\mixinSelect.vue
 * @Description: 多选区域商圈
-->
<template>
    <div class="mixin-select-wrap">
        <span v-for="(col,colIndex) in form.areaCount" :key="`area_${colIndex}`">
            <el-select v-model="form.areaList[colIndex].area" filterable default-first-option placeholder="请选择" @change="() => { form.areaList[colIndex].businessCircle = [] }">
                <el-option v-for="(opt,optIndex) in item.opts" :key="optIndex" :label="opt.label" :value="opt.value" />
            </el-select>

            <el-select v-model="form.areaList[colIndex].businessCircle" filterable multiple :multiple-limit="4" default-first-option placeholder="请选择">
                <el-option v-for="(opt,optIndex) in filterBusinessCircleList(item.opts,form.areaList[colIndex].area)" :key="optIndex" :label="opt.label" :value="opt.value" />
            </el-select>

            <el-button v-if="form.areaCount > 1" icon="el-icon-minus" @click="minusArea(colIndex)" />
            <el-button v-if="form.areaCount === 1 || colIndex > 0" icon="el-icon-plus" @click="addArea" />
        </span>
    </div>
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'CustomMixinSelect',
    mixins: [compProps],
    methods: {
        filterBusinessCircleList(list, area) {
            if (!area) {
                return []
            }
            const temp = list.filter(item => {
                return item.value === area
            })
            return temp.length > 0 ? temp[0].children : []
        },

        // 服务区域新增
        addArea() {
            if (this.form.areaCount > 1) {
                this.$message.error('服务区域不可超过2个！')
                return false
            }
            this.form.areaCount++
            this.form.areaList.push({
                area: '',
                businessCircle: []
            })
        },

        // 服务区域移除
        minusArea(index) {
            this.form.areaCount--
            this.form.areaList.splice(index, 1)
        }
    }
}
</script>

<style lang="scss" scoped>
    .mixin-select-wrap {
        > span {
            display: inline-block;
            &:not(:first-child) {
                margin-top: 10px;
            }
            .el-select {
                width: 180px;
                margin-right: 15px;
            }
            .el-button {
                padding: 9px 10px;
                + .el-button {
                    margin-left: 5px;
                }
            }
        }
    }
</style>
