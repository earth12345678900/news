<template>
  <div>
    <hm-floor :count='count - 1' :comment='comment.parent' v-if="comment.parent"></hm-floor>
    <div class="hm-floor">
      <div class="title">
        <div class="left">{{count}}.{{comment.user.nickname}}</div>
        <div class="center">{{comment.creat_date | now}}</div>
        <div class="right" @click="reply">回复</div>
      </div>
      <div class="content">{{comment.content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  // 递归组件自己渲染自己 必须要有name
  // name: 'hm-floor',
  props: {
    comment: Object,
    count: Number
  },
  data: function () {
    return {}
  },
  created () {},
  methods: {
    reply () {
      // this.$emit('reply', this.comment.id, this.comment.user.nickname)
      this.$bus.$emit('reply', this.comment.id, this.comment.user.nickname)
    }
  }
}
</script>

<style lang='less' scoped>
.hm-floor {
  margin-top: -1px;
  border: 1px solid red;
  padding: 10px;
  .title {
    display: flex;
    font-size: 14px;
    .center {
      flex: 1;
      font-size: 12px;
      color: #666;
      padding-left: 10px;
    }
    .right {
      color: #666;
    }
  }
  .content {
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>
