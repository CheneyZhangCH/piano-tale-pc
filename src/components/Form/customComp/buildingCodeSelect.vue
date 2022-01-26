<!--
 * @Author: ge.rongyin
 * @Date: 2020-05-15 17:52:53
 * @LastEditors: ge.rongyin
 * @LastEditTime: 2020-05-15 17:52:53
 * @FilePath: \src\components\Form\customComp\buildingCodeSelect.vue
 * @Description: 楼栋编号，可选数字、大写英文
-->
<template>
    <div class="building-code-select">
        <el-select v-model="form[item.prop]" :style="item.val1Style" filterable default-first-option placeholder="请选择" @change="handleSelectChange('buildingCode',$event,item.prop)">
            <el-option v-for="(opt,optIndex) in [{ label: '数字',value: 1 },{ label: '大写英文',value: 2 }]" :key="optIndex" :label="opt.label" :value="opt.value" />
        </el-select>
        <span v-if="form[item.prop] == 1">
            <span class="building-code-from">从</span>
            <el-input-number v-model="form[item.prop + '_start']" controls-position="right" :min="1" :max="form[item.prop + '_end'] - 1" :precision="0" />
            <span class="building-code-to">到</span>
            <el-input-number v-model="form[item.prop + '_end']" controls-position="right" :min="form[item.prop + '_start']" :max="999" />
            <el-checkbox v-model="form[item.prop + '_check']" class="building-code-check">自动补0</el-checkbox>
        </span>
        <span v-else-if="form[item.prop] == 2">
            <span class="building-code-from">从</span>
            <el-select v-model="form[item.prop + '_start']" class="building-code-range" filterable default-first-option placeholder="请选择">
                <el-option v-for="(opt,optIndex) in buildingLetterList" :key="optIndex" :disabled="optIndex >= form[item.prop + '_end']" :label="opt.label" :value="opt.value" />
            </el-select>
            <span class="building-code-to">到</span>
            <el-select v-model="form[item.prop + '_end']" class="building-code-range" filterable default-first-option placeholder="请选择">
                <el-option v-for="(opt,optIndex) in buildingLetterList" :key="optIndex" :disabled="optIndex <= form[item.prop + '_start']" :label="opt.label" :value="opt.value" />
            </el-select>
        </span>
    </div>
</template>

<script>
import dict from '@/common/data/dict'
import compProps from '../mixins/props'
export default {
    name: 'CustomBuildingCodeSelect',
    mixins: [compProps],
    data() {
        return {
             buildingLetterList: dict.buildingLetterList,
        }
    },
    methods: {
        handleSelectChange(type, value, filedName) {
            switch (type) {
                case 'buildingCode':
                    if (value === 1) {
                        // 数字
                        this.form[filedName + '_start'] = 1
                        this.form[filedName + '_end'] = 10
                    } else if (value === 2) {
                        // 大写英文
                        this.form[filedName + '_start'] = 0
                        this.form[filedName + '_end'] = 25
                    }
                    this.form[filedName + '_check'] = false

                    break
                default:
                    break
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.building-code-select {
    .building-code-from,
    .building-code-to {
        margin: 0 16px;
    }
    .building-code-check {
        margin-left: 16px;
    }
    ::v-deep .el-input-number,
    ::v-deep .el-select.building-code-range {
        width: 100px;
        .el-input {
            width: 100% !important;
            &__inner {
                width: 100% !important;
            }
        }
    }
}
</style>
