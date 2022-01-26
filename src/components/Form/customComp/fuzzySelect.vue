<!--
 * @Author: sun.shengjie
 * @Date: 2020-07-01 22:21:55
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-10-27 14:35:24
 * @FilePath: /src/components/Form/customComp/fuzzySelect.vue
 * @Description:
-->
<template>
    <section class="section-item">
        <el-tooltip v-model="item.wheatherShowTooltip" popper-class="custom-tooltip" manual effect="dark" placement="top">
            <el-autocomplete
                :ref="item.prop"
                v-model="form[item.prop]"
                :value-key="item.valueKey || 'label'"
                :value="item.value || 'value'"
                :trigger-on-focus="item.triggerOnFocus || false"
                :disabled="item.disabled"
                :clearable="item.clearable !== undefined ? item.clearable : true"
                :maxlength="item.maxlength"
                :debounce="item.debounce || 300"
                :placeholder="item.placeholder || '请输入'"
                :fetch-suggestions="item.fetchSuggestions"
                :title="item.showTitle && form[item.prop]"
                :popper-class="subTitle ? ('aika-autocomplete ' + item.className) : ''"
                @clear="item.clear ? item.clear() : null"
                @change="item.change ? item.change($event) : null"
                @select="item.func ? item.func($event) : null"
                @keyup.enter.native="item.func ? item.func($event) : null"
                @input="item.input ? item.input($event) : null"
                @blur="item.blur ? item.blur($event) : null"
                @focus="item.focus ? item.focus($event) : null"
            >
                <!-- 新增房源专用 -->
                <template v-if="item.optionCustomTipClick" #default="scope">
                    <div v-if="scope.item.type === 'customTipClick'" class="custom-tips-top">
                        <span>{{ scope.item.text }}</span>
                        <span class="custom-tips-btn" @click="scope.item.func">{{ scope.item.btn }}</span>
                    </div>
                    <div v-else>
                        <div v-if="scope.item.itemIndex === 0 && item.optionCustomTipVisible" class="custom-tips-empty" v-html="item.optionCustomTip" />
                        <template v-if="item.subTitle">
                            <div class="name" :class="{ showTips: scope.item.itemIndex === 0 && item.optionCustomTipVisible }">
                                <span>{{ scope.item[item.valueKey] }}</span>
                                <!-- 是否有额外的内容 => 别名-->
                                <span v-if="item.alias && scope.item[item.alias]" class="alias">{{ `（${scope.item[item.alias]}）` }}</span>
                            </div>
                            <span class="addr">{{ subTitle(scope.item) }}</span>
                        </template>
                        <template v-else>
                            <div :class="{ 'showTips': scope.item.itemIndex === 0 && item.optionCustomTipVisible }">{{ scope.item[item.valueKey] }}</div>
                        </template>
                    </div>
                </template>
                <template v-else #default="scope">
                    <div v-if="scope.item.itemIndex === 0 && item.optionCustomTipVisible && item.optionCustomTip" class="custom-tips" v-html="item.optionCustomTip" />
                    <template v-if="item.subTitle">
                        <div class="name" :class="{ showTips: scope.item.itemIndex === 0 && item.optionCustomTipVisible }">
                            <span>{{ scope.item[item.valueKey] }}</span>
                            <!-- 是否有额外的内容 => 别名-->
                            <span v-if="item.alias && scope.item[item.alias]" class="alias">{{ `（${scope.item[item.alias]}）` }}</span>
                        </div>
                        <span class="addr">{{ subTitle(scope.item) }}</span>
                    </template>
                    <template v-else>
                        <div :class="{ 'showTips': scope.item.itemIndex === 0 && item.optionCustomTipVisible && item.optionCustomTip }">{{ scope.item[item.valueKey] }}</div>
                    </template>
                </template>
            </el-autocomplete>
            <template #content>
                <div>
                    <span>{{ item.tooltipContent }}</span>
                    <i class="el-icon-close toptipclose" @click="item.wheatherShowTooltip = false" />
                </div>
            </template>

        </el-tooltip>
    </section>
</template>

<script>
import compProps from '../mixins/props'
export default {
    mixins: [compProps],
    mounted() {
        if (this.item.width) {
            this.$refs[this.item.prop].$el.childNodes[0].style.width = this.item.width
        }
    },
    methods: {
        subTitle(item) {
            const titles = this.item.subTitle.split(',')
            let text = ''
            titles.forEach(i => {
                text += item[i] + ' '
            })
            return text
        }
    }
}
</script>

<style lang="scss">
.aika-autocomplete {
    li {
        padding: 7px;
        line-height: normal;
        .name {
            overflow: hidden;
            font-size: 14px;
            color: $theme-font-dark-2;
            text-overflow: ellipsis;
            .alias {
                color: $theme-font-white-7;
            }
        }
        .addr {
            font-size: 12px;
            color: $theme-font-white-7;
        }
        .highlighted .addr {
            color: $theme-font-white-8;
        }
    }
}
.custom-tooltip {
    .toptipclose {
        margin-left: 5px;
        cursor: pointer;
    }
}
.custom-tips-top {
    //position: absolute;
    //top: 0;
    //right: 0;
    width: 100%;
    padding: 0px;
    font-size: 12px;
    line-height: 14px;
    color: $theme-font-red;
    word-break: break-all;
    background: $theme-bg-white;
    .custom-tips-btn {
        color: $theme-font-blue-1;
    }
}
.custom-tips-empty {

}
.showTips {
    margin-top: 24px;
}
.estateName {
    .el-autocomplete-suggestion__wrap {
        max-height: calc(100vh - 320px);
    }
}
</style>
