<template>
    <el-dropdown v-if="item.codes" placement="bottom-start">
        <el-button v-if="permission.isVisible" :type="getType()" :loading.sync="item.loading" :size="item.size" :disabled="isDisabled()" @click="handleClick">
            <slot name="label">{{ item.value || permission.name }}</slot>
        </el-button>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for="(l, lIndex) in item.list" :key="lIndex">
                    <el-button :type="getType(l)" :loading.sync="l.loading" :size="l.size" :disabled="isDisabled()" @click="l.func ? l.func() : {}">
                        {{ l.value }}
                    </el-button>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <el-dropdown v-else>
        <el-button :type="getType()" :loading.sync="item.loading" :size="item.size" :disabled="isDisabled()" @click="handleClick">
            <slot name="label">{{ item.value || permission.name }}</slot>
        </el-button>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item v-for="(l, lIndex) in item.list" :key="lIndex">
                    <permissions-btn v-if="l.code" :item="l" @click="l.func ? l.func() : {}">
                        <template #label>
                            <span v-if="l.value">{{ l.value }}</span>
                        </template>
                    </permissions-btn>
                    <el-button v-else :type="getType(l)" :loading.sync="l.loading" :size="l.size" :disabled="isDisabled()" @click="l.func ? l.func() : {}">
                        {{ l.value }}
                    </el-button>
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script>
// import permissionsBtn from '@/components/PermissionsBtn/btn'
import { mapGetters } from 'vuex'
export default {
    components: {
        // permissionsBtn,
    },
    props: {
        type: {
            type: String,
            default: ''
        },
        item: {
            type: Object,
            required: true
        },
        row: {
            type: Object
        },
        // loading: {
        //     type: Boolean,
        //     default: false
        // },
    },
    computed: {
        ...mapGetters(['itemList']),
        permission() {
            const list = this.$store.getters.btnList
            let isVisible = false
            const isExist = list.findIndex(item => Array.isArray(this.item.codes) ? this.item.codes.includes(item.code) : this.item.codes === item.code)
            if (isExist > -1) {
                isVisible = true
            }
            return {
                isVisible,
                name: isExist > -1 ? list[isExist].name : ''
            }

            // return utils.getBtnPermission(this, this.item.code)
        }
    },
    methods: {
        handleClick() {
            this.$emit('click')
        },

        getType(item) {
            const _item = item || this.item
            if (_item.color) return _item.color
            return _item.formatter ? _item.formatter(this.row).type : _item.type
        },

        // disabled判断有问题 现在item.code是找不到的
        isDisabled() {
            if (!this.row) return false
            const { permissionMap } = this.row
            const item = this.item
            const statusDisabled = item.formatter ? item.formatter(this.row).disabled : false
            const dataPermissionDisabled = permissionMap ? !permissionMap[item.code] : false
            return statusDisabled || dataPermissionDisabled
        }
    }
}
</script>
