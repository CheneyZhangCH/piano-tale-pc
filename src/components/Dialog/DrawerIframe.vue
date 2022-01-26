<template>
    <el-drawer :visible.sync="visible" :with-header="false" :modal="false" size="415px">
        <div class="block">
            <iframe :src="iframeSrc" frameborder="0" width="375" height="535" />
        </div>
    </el-drawer>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            iframeSrc: ''
        }
    },
    methods: {
        open(obj) {
            this.iframeSrc = ''
            this.visible = true
            this.$nextTick(() => {
                this.iframeSrc = obj.src
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .block {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 1;
        box-sizing: border-box;
        width: 360px;
        min-width: 360px;
        overflow: hidden;
        background: $theme-bg-white-6;
        border-radius: 6px;
        box-shadow: $theme-border 0 4px 12px;
    }
</style>
