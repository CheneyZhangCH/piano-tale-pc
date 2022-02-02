<template>
  <div v-if="!column.hidden" class="field-item" :class="{ 'no-hover': noHover }">
    <span v-if="column.name && column.tooltip" class="field-item--name" :style="column.labelStyle">
      <el-tooltip effect="dark" :content="column.tooltip.content" :placement="column.tooltip.placement" :popper-class="column.tooltip.popperClass">
        <span class="field-item--tip"><i class="iconfont iconfont-gantanhao" /></span>
      </el-tooltip>
      <span>{{ column.name + '：' }}</span>
    </span>
    <span v-else-if="column.name && column.tooltipAfterLabel" class="field-item--name" :style="column.labelStyle">
      <span>{ column.name }}</span>{
      <el-tooltip effect="dark" :content="column.tooltipAfterLabel.content" :placement="column.tooltipAfterLabel.placement" :popper-class="column.tooltipAfterLabel.popperClass">
        <span class="field-item--tip" style="padding-left: 0;">
          <i class="iconfont iconfont-gantanhao" />
        </span>
        <template v-if="column.tooltipAfterLabel.contentType === 'html'" #content>
          <div v-html="column.tooltipAfterLabel.content" />
        </template>
      </el-tooltip>
      :
    </span>
    <span v-else-if="column.name" class="field-item--name" :style="column.labelStyle">
      <span v-if="showWeiHu" class="field-item--name-pre-icon">
        <el-tooltip v-if="column.heShiFlag !== undefined" class="item" effect="dark" :content="column.heShiFlag ? '维护人已核实有效' : '维护人暂未核实'" placement="top">
          <i class="iconfont weihu-flag-icon" :class="column.heShiFlag ? 'iconfont-dg' : 'iconfont-sjzs'" />
        </el-tooltip>
      </span>
      <span>{{ column.name + '：' }}</span>
    </span>

    <aika-attachmentTooltipOss v-if="column.type === 'attachmentTooltipOss'" :item="column" :attachment-list="data[column.val]" empty-text="暂无" />
    <mklij-switch v-else-if="column.type === 'switch'" :item="column" :form="data" />

    <!-- 自定义html内容 -->
    <template
      v-else-if="column.customHtmlContent"
    >
      <span class="field-item--val">
        <span class="value" v-html="column.customHtmlContent(data)" />
      </span>
    </template>

    <span v-else :title="showVal" class="field-item--val" :class="{ 'scroll': column.val === 'remark' }">
      <span v-if="Array.isArray(showVal.split('\n')) && showVal.split('\n').length > 1" class="multi-value" @click="column.func ? column.func(data) : ''">
        <span v-for="s in showVal.split('\n')">{{ s }}</span>
      </span>
      <span v-else class="value" :class="showVal ? column.customClass : ''" @click="column.func ? column.func(data) : ''">{{ showVal }}</span>

      <span v-if="column.appendDom" @click="column.func ? column.func(data) : ''">
        <span :style="column.appendDom.style">{{ column.appendDom.text }}</span>
      </span>
      <el-tooltip v-if="column.showCustomTooltip" effect="dark" :content="column.tipContent" placement="top">
        <span class="field-item--tip" @click="column.func ? column.func(data) : ''"><i class="iconfont iconfont-gantanhao" /></span>
      </el-tooltip>
      <span v-if="column.slot" @click="column.func ? column.func(data) : ''">
        <template v-if="Array.isArray(column.slot)">
          <span v-for="s in column.slot" class="button-wrap">
            <el-button
              v-if="s.type === 'button' && (s.btnCode ? btnAccess[s.btnCode] : true) && !s.hidden"
              class="btn-edit"
              type="text"
              @click="s.func(showVal,data,$event)"
            >{{ s.textFunc ? s.textFunc(data) : (s.text || '修改') }}</el-button>

            <el-link v-else-if="s.type === 'link'" type="primary" :href="s.href" target="_blank">{{ s.text }}</el-link>

            <span v-else :class="column.slot.className" @click="column.slot.func ? column.slot.func(val,data,formItemIndex,fieldItemIndex) : ''">
              {{ column.slot.name }}
            </span>

          </span>
        </template>
        <template v-else>
          <el-button
            v-if="column.slot.type === 'button' && (column.slot.btnCode ? btnAccess[column.slot.btnCode] : true)"
            class="btn-edit"
            type="text"
            @click="column.slot.func(showVal,data,$event)"
          >{{ column.slot.text || '修改' }}</el-button>

          <span v-else :class="column.slot.className" @click="column.slot.func ? column.slot.func(val,data,formItemIndex,fieldItemIndex) : ''">
            {{ column.slot.name }}
          </span>
        </template>
      </span>
      <el-button
        v-if="column.buttonFunc && !column.hideButton && (column.btnCode ? btnAccess[column.btnCode] : true)"
        v-bind="column.buttonProps"
        class="btn-edit"
        :class="column.buttonProps && column.buttonProps.disabled ? 'btn-edit-disabled' : ''"
        :type="column.buttonProps && column.buttonProps.type ? column.buttonProps.type : 'text'"
        :disabled="column.buttonProps && column.buttonProps.disabled ? column.buttonProps.disabled : false"
        @click="column.buttonFunc(showVal,data,$event)"
      >{{ column.buttonName || '修改' }}</el-button>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mklijSwitch from '@/components/Form/elementComp/switch'

export default {
  components: { mklijSwitch },
  props: {
    column: { type: Object, default: () => {} },
    val: { type: [String, Number, Array], default: '' },
    // 父组件的Index
    formItemIndex: Number,
    // 用于标识父组件传入时Data对应的Index
    fieldItemIndex: Number,
    data: { type: Object, default: () => {} },
    noHover: { type: Boolean, default: false },
    showWeiHu: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters(['btnAccess']),
    showVal() {
      const { val } = this
      let result = ''
      if (!this.$isNullOrEmpty(val)) {
        result = result + val
        if (this.column.unit) {
          result = result + this.column.unit
        }
      }

      return result || (this.column.customEmptyText ?? '-')
    }
  },
  mounted() {
    // console.log('this.data', this.data)
    // console.log('this.val', this.val)
  }
}
</script>

<style lang="scss" scoped>
.field-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    &:hover {
        background-color: $theme-bg-white-12;
    }
    &.no-hover:hover {
        background-color: transparent;
    }
    &:last-child {
        margin-bottom: 0;
    }
    &--name {
        min-width: 70px;
        color: $theme-font-grey;
        white-space: nowrap;
        &-pre-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 12px;
            height: 12px;
            margin-right: 6px;
            .iconfont {
                font-size: 12px !important;
            }
        }
    }
    &--val {
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        flex: 1;
        flex-wrap: wrap;
        font-size: 14px;
        font-weight: 400;
        color: $theme-font-forth-color;
        &:empty {
            &::before {
                font-size: 14px;
                font-weight: 400;
                color: $theme-font-forth-color;
                content: '-';
            }
        }
        &.value {
            display: inline-flex;
            flex: 1;
            flex-direction: column;
        }
        .link {
            color: $theme-link-btn-color;
            cursor: pointer;
        }
        .multi-value {
            display: inline-flex;
            flex-direction: column;
        }
        .button-wrap {
            display: inline-flex;
            .el-link {
                height: 16px;
                font-size: 14px;
                font-weight: 400 !important;
                line-height: 16px;
                color: $theme-font-blue-1 !important;
            }
        }
        .button-wrap:not(:first-child) {
            .el-button {
                margin-left: 8px;
            }
        }
    }
    &--val.scroll {
        max-height: 100px;
        overflow-y: scroll;
    }
    &--tip {
        padding-left: 6px;
        i {
            font-size: 15px;
        }
    }
    .btn-edit {
        display: inline-flex;
        align-items: center;
        height: 20px;
        padding: 0;
        margin-left: 8px;
        font-size: 14px;
        font-weight: 400;
        color: $theme-font-blue-1;
        cursor: pointer;
        border-radius: 0;
    }
    .btn-edit-disabled {
        color: $theme-font-grey-4;
        cursor: not-allowed;
        background-image: none;
    }
}
</style>
