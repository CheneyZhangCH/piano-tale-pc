<!--
 * @Author: ge.rongyin
 * @Date: 2020-05-15 17:56:48
 * @LastEditors: ge.rongyin
 * @LastEditTime: 2020-08-11 15:43:13
 * @FilePath: \src\components\Form\customComp\houseType.vue
 * @Description: 户型组件
-->
<template>
    <div style="display: flex;">
        <div class="house-type-item">
            <el-select v-model="form.houseType.countRoom" style="width: 100px;" :style="item.valStyle" :disabled="item.disabled">
                <el-option v-for="x in (item.countRoomEnum || zero2TwentyEnum)" :key="x.value" :label="x.label" :value="x.value" />
            </el-select>
            <p class="unit">{{ item.countRoomLabel || '房' }}</p>
        </div>

        <div class="house-type-item">
            <el-select v-model="form.houseType.countHall" style="width: 100px;" :style="item.valStyle" :disabled="item.disabled">
                <el-option v-for="x in zero2TwentyEnum" :key="x.value" :label="x.label" :value="x.value" />
            </el-select>
            <p class="unit">厅</p>
        </div>

        <div class="house-type-item">
            <el-select v-model="form.houseType.countBathroom" style="width: 100px;" :style="item.valStyle" :disabled="item.disabled">
                <el-option v-for="x in zero2TwentyEnum" :key="x.value" :label="x.label" :value="x.value" />
            </el-select>
            <p class="unit">卫</p>
        </div>

        <div class="house-type-item">
            <el-select v-model="form.houseType.countKitchen" style="width: 100px;" :style="item.valStyle" :disabled="item.disabled">
                <el-option v-for="x in zero2TwentyEnum" :key="x.value" :label="x.label" :value="x.value" />
            </el-select>
            <p class="unit">厨</p>
        </div>

        <div class="house-type-item">
            <el-select v-model="form.houseType.countBalcony" style="width: 100px;" :style="item.valStyle" :disabled="item.disabled">
                <el-option v-for="x in zero2TwentyEnum" :key="x.value" :label="x.label" :value="x.value" />
            </el-select>
            <p class="unit">阳台</p>
        </div>
    </div>
</template>

<script>
import compProps from '../mixins/props'
import { zero2TwentyEnum } from '@/utils/enum'
export default {
    name: 'CustomHouseType',
    mixins: [compProps],
    data() {
        return {
            zero2TwentyEnum
        }
    }
}
</script>

<style lang="scss" scoped>
.house-type-item {
    display: flex;
    .unit {
        display: inline-flex;
        margin-right: 8px;
        margin-left: 8px;
    }
    ::v-deep .el-input {
        &--small {
            width: 100px !important;
        }
        &__inner {
            width: 100px !important;
        }
    }
}
</style>
