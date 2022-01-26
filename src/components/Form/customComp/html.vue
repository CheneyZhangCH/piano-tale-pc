<!--
 * @Author: sun.shengjie
 * @Date: 2020-06-10 10:40:57
 * @LastEditors: sun.shengjie
 * @LastEditTime: 2020-06-10 11:05:25
 * @FilePath: \src\components\Form\customComp\html.vue
 * @Description:
-->
<template>
    <div :class="item.className" v-html="item.render(form)" />
</template>

<script>
import compProps from '../mixins/props'
export default {
    name: 'CustomHtml',
    mixins: [compProps]
}
</script>

<style lang="scss" scoped>
    .report-rules {
        ::v-deep
        .rule-item-content {
            .rule-item-rule-wrap {
                padding-top: 2px;
                .sub-rule{
                    width: 250px;
                    height: 20px;
                    display: inline-flex;
                    align-items: center;
                    font-size: 14px;
                    font-weight: 400;
                    &:first-child{
                        width: 160px;
                    }
                }
                .rule-item-remark {
                    line-height: 20px;
                    font-size: 14px;
                    font-weight: 400;
                }
            }
        }
    }
</style>
