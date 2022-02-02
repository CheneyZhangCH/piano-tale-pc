<template>
  <el-card :body-style="{ padding: '0px' }" shadow="hover">
    <div class="image">
      <img :src="item.coverUrl">
    </div>
    <div style="padding: 14px;">
      <div class="top">
        <h3>{{ item.bookName }}</h3>
        <span class="actions">
          <el-button type="text" class="button" @click="$emit('toggle', item)">{{ item.active ? '关闭' : '开启' }}</el-button>
          <el-button type="text" class="button" @click="$emit('detail', item)">查看</el-button>
        </span>
      </div>
      <div class="bottom clearfix">
        <span class="field-item">
          <span class="field-item--name">状态：</span>
          <span class="field-item--val">{{ item.active ? '启用' : '停用' }}</span>
        </span>
        <span class="field-item">
          <span class="field-item--name">单元数：</span>
          <span class="field-item--val">{{ item.unitNum }}</span>
        </span>
        <span class="field-item">
          <span class="field-item--name">曲目数：</span>
          <span class="field-item--val">{{ item.chapterNum }}</span>
        </span>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'BookCard',
  props: {
    item: { type: Object, default: () => ({}) }
  },
  data() {
    return { }
  },
  methods: { }
}
</script>

<style lang="scss" scoped>
.el-card {
  width: 375px;
  margin-bottom: 16px;
  margin-right: 16px;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.field-item {
  width: 33.33%;
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  &--name {
    color: $theme-font-grey;
    white-space: nowrap;
  }

  &--val {
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 400;
    color: $theme-font-forth-color;
  }
}

</style>
