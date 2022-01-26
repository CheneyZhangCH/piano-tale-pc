<template>
    <el-dialog :modal-append-to-body="false" :title="title" class="aika-dialog-map" :visible.sync="visible" :width="width">
        <div class="main">
            <baidu-map :ak="commonData.baiduAk" :center="center" :zoom="zoom" scroll-wheel-zoom @ready="handler" @click="mpClick">
                <aika-form ref="form" :forms="mapSearchForms" :label-width="'85px'" />
                <!-- 地图容器 -->
                <bm-view class="bm-view" />
                <!-- 缩放 -->
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
                <!-- 定位 -->
                <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
                <!-- 标注 -->
                <!-- <bm-marker v-if="initLocation && zoom > 12" :position="autoLocationPoint" :icon="{url: require('@/assets/images/map-marker-red.png'), size: {width: 24, height: 24}}"></bm-marker> -->
                <!-- 搜索 -->
                <bm-local-search :keyword="keyword" :panel="isShowPanel" :auto-viewport="true" :select-first-result="true" @infohtmlset="infohtmlset" />
            </baidu-map>
        </div>
        <template #footer>
            <div>
                <el-button size="small" @click="close">取消</el-button>
                <el-button size="small" type="primary" @click="handleConfirm">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import commonData from '@/utils/data'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { BmView, BmNavigation, BmGeolocation, // BmMarker,
    BmLocalSearch } from 'vue-baidu-map'
export default {
    name: 'BMap',
    components: {
        BaiduMap,
        BmView,
        BmNavigation,
        BmGeolocation,
        // BmMarker,
        BmLocalSearch
    },
    props: {
        title: {
            type: String,
            default: '系统提示'
        },
        width: {
            type: String,
            default: '365px'
        }
    },
    data() {
        return {
            commonData,
            // 经纬度
            point: null,
            BMap: null,
            // autoLocationPoint: { lng: 0, lat: 0 },
            // initLocation: false,
            mapSearchForms: [
                {
                    type: 'input',
                    label: '关键字',
                    prop: 'keyword',
                    slot: {
                        type: 'button',
                        text: '搜索',
                        func: this.handleFormSearch
                    },
                    func: this.handleFormSearch,
                    sm: 18
                },
                {
                    type: 'text',
                    label: '已选位置',
                    prop: 'currentAddress',
                    text: '暂无',
                    sm: 24,
                    lg: 24
                }
            ],
            isShowPanel: true,

            keyword: '',
            center: '',
            zoom: 0,
            visible: false
        }
    },
    watch: {
        point(newVal) {
            if (newVal) {
                this.mapSearchForms[1].text = `${newVal.title}：${JSON.stringify(newVal.point)}`
            }
        }
    },
    methods: {
        open() {
            this.keyword = ''
            this.visible = true
            // this.$nextTick(() => {
            //     // this.renderMap()
            // })
        },

        close() {
            this.visible = false
        },

        // 初始化地图并根据IP定位当前城市1
        handler({ BMap, map }) {
            const t = this
            var geolocation = new BMap.Geolocation()
            geolocation.getCurrentPosition(function(r) {
                console.log(r)
                t.center = r.point // {lng: r.longitude, lat: r.latitude}
                // t.autoLocationPoint = { lng: r.longitude, lat: r.latitude }
                // t.initLocation = true

                t.zoom = 15
            }, { enableHighAccuracy: true })
        },

        // 查询
        handleFormSearch() {
            this.$refs.form.validate().then(res => {
                this.location = res.location
                this.keyword = res.keyword
            })
        },

        // 标注气泡内容创建后的回调函数
        infohtmlset(poi) {
            this.point = {
                title: poi.title,
                point: poi.point
            }
            this.isShowPanel = true
        },

        // 初始化地图并根据IP定位当前城市2
        renderMap() {
            const t = this
            setTimeout(() => {
                t.BMap = t.$refs.map.BMap
                var myCity = new t.BMap.LocalCity()
                myCity.get((r) => {
                    console.log(r)
                    t.center = r.center
                    // t.autoLocationPoint = r.center
                    // t.initLocation = true

                    t.zoom = 15
                })
            }, 200)
        },

        // 地图点击
        mpClick({ point, overlay }) {
            this.point = {
                title: overlay ? overlay.z.title : '地图选点',
                point
            }
            this.isShowPanel = false
        },

        // 确认
        handleConfirm() {
            if (this.point) {
                this.$emit('confirm', this.point)
            } else {
                this.$message.error('请地图选点')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .bm-view {
        width: 100%;
        height: 350px;
    }
</style>
