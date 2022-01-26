<!--
 * @Author: sun.shengjie
 * @Date: 2020-05-25 15:18:35
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-05-29 13:40:54
 * @FilePath: \src\components\Form\customComp\imgList.vue
 * @Description:
-->
<template>
    <div class="img-list">
        <ul class="el-upload-list el-upload-list--picture-card">
            <li v-for="(file,fileIndex) in form[item.prop]" :key="fileIndex" class="el-upload-list__item is-success">
                <img class="el-upload-list__item-thumbnail" :src="file.url" />
                <!-- <a class="el-upload-list__item-name">
                    <i class="el-icon-document" />
                    {{ file.fileName }}
                </a> -->
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePreviewImage(file)">
                        <i class="el-icon-zoom-in" />
                    </span>
                    <!-- <span class="el-upload-list__item-delete" @click="handleDeleteImage(file,fileIndex)">
                        <i class="el-icon-delete" />
                    </span> -->
                </span>
            </li>
        </ul>

        <el-dialog :visible.sync="dialogVisible" :title="title">
            <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
    </div>
</template>

<script>
import compProps from '../mixins/props'
export default {
    mixins: [compProps],
    data() {
        return {
            title: '',
            dialogVisible: false,
            dialogImageUrl: ''
        }
    },
    methods: {
        handlePreviewImage(file) {
            this.title = file.fileName
            this.dialogVisible = true
            this.dialogImageUrl = file.url
        }
    }
}
</script>

<style lang="scss" scoped>
.img-list {
    .el-upload-list--picture-card {
        .el-upload-list__item {
            width: 80px;
            height: 80px;
            border: none;
        }
    }
}
</style>
