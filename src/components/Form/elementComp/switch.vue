<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-15 15:34:47
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-05-15 15:36:35
 * @FilePath: \src\components\Form\elementComp\switch.vue
 * @Description:
-->
<template>
    <span>
        <el-switch
            v-model="form[item.prop]"
            :disabled="item.disabled"
            :active-value="item.activeValue"
            :inactive-value="item.inactiveValue"
            :active-text="item.activeText"
            :inactive-text="item.inactiveText"
            @change="item.func ? item.func($event, item, form) : {}"
        />
        <span v-if="item.append" style="margin-left: 10px">{{ item.append }}</span>
    </span>

</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'MklijSwitch',
    mixins: [compProps]
}
</script>
