<template>
    <el-dialog :title="title" :visible.sync="visible" width="520px" class="qr-dialog" @close="close">
        <div v-if="initObj.text" id="qrCode" class="qr-code" />
        <div v-if="initObj.page" class="mp-code">
            <img :src="imgSrc" alt="" />
        </div>
        <p class="qr-weixin-text">{{ description }}</p>
        <slot name="foot" />
    </el-dialog>
</template>

<script>
import QRCode from 'qrcodejs2'
import { HousePropertyModel } from '@/api/fangyuan'
export default {
    props: {
        title: {
            type: String,
            default: '微信扫码'
        },
        description: {
            type: String,
            default: '微信扫一扫，分享给好友'
        },
    },
    data() {
        return {
            visible: false,
            initObj: {},
            imgSrc: '',
        }
    },
    methods: {
        async open(obj) {
            this.visible = true
            this.initObj = obj
            if (obj.text) {
                this.$nextTick(() => {
                    document.getElementById('qrCode').innerHTML = ''
                    new QRCode(document.getElementById('qrCode'), {
                        text: obj.text,
                        width: 170,
                        height: 170,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.H
                    })
                })
            } else if (obj.page) {
                const res = await HousePropertyModel.sharePictureTransform({
                    page: obj.page,
                    scene: obj.scene,
                })
                this.imgSrc = `data:image/jpeg;base64,${res.data}`
            }
        },

        close() {
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss" scoped>
    .qr-dialog {
        ::v-deep
        .el-dialog__body {
            padding: 10px 0 0 0;
        }
    }
    .qr-code {
        ::v-deep
        img {
            padding: 6px;
            margin: 0 auto;
        }
    }
    .qr-weixin-text {
        padding-bottom: 48px;
        margin-top: 20px;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
    }
    .mp-code {
        text-align: center;
        img {
            width: 170px;
            height: 170px;
        }
    }
</style>
