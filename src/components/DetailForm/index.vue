<template>
  <div class="detail-form" :class="{ 'no-hover': noHover }">
    <template v-if="Array.isArray(buttonName) && showButton" class="btn-wrap">
      <template v-for="(b, i) in buttonName" class="btn-wrap-inner">
        <el-button v-if="!b.hidden" :key="i" class="btn-edit" :class="b.className" type="text" @click="func[i](data)">
          <i class="iconfont iconfont-icon_icon_biji_s" />{{ b.text || '修改' }}
        </el-button>
      </template>
    </template>
    <el-button v-else-if="func && showButton" class="btn-edit" type="text" @click="func(data)">
      <i class="iconfont iconfont-icon_icon_biji_s" />{{ buttonName || '修改' }}
    </el-button>
    <field-item
      v-for="(item,index) in columns"
      v-show="checkConflict(item)"
      :key="item.val + '_' + index"
      :data="data"
      :class="[item.span ? 'col col-' + item.span : 'col col-12', item.className]"
      :column="item"
      :no-hover="noHover"
      :show-wei-hu="showWeiHu"
      :val="item.formatter ? item.formatter(data) : data[item.val]"
      :form-item-index="formItemIndex"
      :field-item-index="fieldItemIndex"
    />
  </div>
</template>

<script>
import FieldItem from './FieldItem'

export default {
  components: { FieldItem },
  props: {
    columns: { type: Array, default: () => [] },
    // 用于标识父组件传入对应data标志位，子组件记住便于通过这个标志位去修改父组件传入的data
    formItemIndex: Number,
    fieldItemIndex: Number,
    data: { type: Object, default: () => {} },
    func: [Function, Array],
    buttonName: [String, Array],
    showButton: { type: Boolean, default: true },
    noHover: { type: Boolean, default: false },
    showWeiHu: { type: Boolean, default: false },
    conflict: Object
  },
  mounted() {
    // console.log('this.func', this.func)
    // console.log('this.buttonName', this.buttonName)
  },
  methods: {
    checkConflict(item) {
      if (!this.conflict) {
        return true
      }
      if (!Array.isArray(Object.keys(this.conflict))) {
        return true
      }
      if (Object.keys(this.conflict).includes(item.name)) {
        const rule = this.conflict[item.name]
        return !rule.value.includes(this.data[rule.key])
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-form {
    position: relative;
    &:hover {
        background-color: $theme-bg-white-9;
        // .btn-edit {
        //     display: block;
        // }
    }
    &.no-hover:hover {
        background-color: transparent;
    }
    .btn-edit {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 100;
        // display: none;
        display: block;
        height: 20px;
        padding: 0 12px;
        margin: 0;
        font-size: 12px;
        font-weight: 400;
        color: $theme-font-blue-1;
        cursor: pointer;
        border-radius: 0;
        i {
            margin-right: 4px;
        }
        + .btn-edit {
            right: 100px;
        }
    }
    .col {
        display: inline-flex;
        width: 100%;
        &-8 {
            width: 33.3%;
        }
        &-12 {
            width: 50%;
        }
        &-24 {
            width: 100%;
        }
    }
}
</style>
