<template>
  <div class="hm-comment">
      <div class="title">
          <div class="left">
              <img :src="'/api' + comment.user.head_img" alt="">
          </div>
          <div class="center">
              <p>{{comment.user.nickname}}</p>
              <p>{{comment.create_date | now}}</p>
          </div>
          <div class="right" @click="reply">回复</div>
      </div>
      <hm-floor @reply='onReply' :count='count' v-if="comment.parent" :comment='comment.parent'></hm-floor>
      <div class="content">{{comment.content}}</div>
  </div>
</template>

<script>
export default {
  props: {
    comment: Object
  },
  data () {
    return {
      // 递归得到评论数
      count: this.getCount(0, this.comment)
    }
  },
  created () {},
  methods: {
    getCount (num, data) {
      if (!data.parent) return num
      return this.getCount(num + 1, data.parent)
    },
    reply () {
      // 子传父
      // 把id和nickname传递给父组件
      // this.$emit('reply', this.comment.id, this.comment.user.nickname)
      this.$bus.$emit('reply', this.comment.id, this.comment.user.nickname)
    },
    onReply (id, nickname) {
      // 接受floor 再将接收到的数据交给其父组件
      this.$emit('reply', id, nickname)
    }
  }
}
</script>

<style lang="less" scoped>
.hm-comment {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  .title {
    display: flex;
    .left {
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .center {
      padding-left: 10px;
      flex: 1;
      font-size: 14px;
      p {
        line-height: 24px;
      }
    }
    .right {
      font-size: 14px;
      color: #666;
    }
  }
  .content {
    font-size: 18px;
  }
}
</style>
