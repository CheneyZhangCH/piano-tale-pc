<!--
 * @Author: sun.shengjie
 * @Date: 2020-02-04 18:57:31
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-05-15 10:54:38
 * @FilePath: \src\components\Dialog\Image.vue
 * @Description:
-->
<template>
    <el-dialog :title="title" :visible.sync="visible" :width="width">
        <el-image :src="imageSrc" lazy-load />
    </el-dialog>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        },
        width: {
            type: String,
            default: '520px'
        }
    },
    data() {
        return {
            visible: false,
            imageSrc: ''
        }
    },
    methods: {
        open(obj) {
            this.visible = true
            this.imageSrc = obj.src
        }
    }
}
</script>
