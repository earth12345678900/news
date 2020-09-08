<template>
  <div class="my-comment">
    <hm-header>我的评论</hm-header>
    <div class="list">
      <!-- 下拉刷新 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <!-- 上拉加载 -->
          <van-list
            v-model="loading"
            :finished="finished"
            :immediate-check='false'
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div class="item" v-for="item in commentList" :key="item.id">
              <div class="time">{{item.create_date | time('YYYY-MM-DD HH:mm')}}</div>
              <div class="comment" v-if="item.parent">
                <div class="name">回复:{{item.parent.user.nickname}}</div>
                <div class="comment_content">{{item.parent.content}}</div>
              </div>
              <div class="content">{{item.content}}</div>
              <div class="origin">
                <span class="one-txt-cut" @click="$router.push(`/post-detail/${item.post.id}`)">原文:{{item.post.title}}</span>
                <span class="iconfont iconjiantou1"></span>
              </div>
            </div>
          </van-list>
      </van-pull-refresh>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      commentList: [],
      // 表示当前页
      pageIndex: 1,
      // 每页的条数
      pageSize: 5,
      list: [],
      // 加载状态 true时代表正在加载数据onload不会重复触发
      // 触发onload时候自动把loading改为true
      // 加载完成吧loading改为false
      loading: false,
      // 代表是否还有数据 false还有数据 true没有数据 没有数据不会触发load事件
      // 加载数据时候判断是否还有更多数据 没有把finished改为true
      finished: false,
      // 代表是否正在下拉刷新
      refreshing: false
    }
  },
  created () {
    this.getCommentList()
  },
  methods: {
    async getCommentList () {
      const res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // console.log(this.commentList)
        // this.commentList = data
        // 原来的覆盖改成 每一页追加数据
        this.commentList = [...this.commentList, ...data]
        // 加载完成吧loading改为false
        this.loading = false
        // 如果没有更多数据吧finished改为true
        if (data.length < this.pageSize) {
          this.finished = true
        }

        // 结束下拉刷新
        this.refreshing = false
      }
    },
    onLoad () {
      // 异步更新数据
      // 加载下一页数据
      setTimeout(() => {
        this.pageIndex++
        this.getCommentList()
      }, 1000)
    },
    onRefresh () {
      // console.log('下拉刷新')
      setTimeout(() => {
        // 初始化所有数据
        this.pageIndex = 1
        // 把loading改为true 表示正在加载状态
        this.loading = true
        this.finished = false
        this.commentList = []
        this.getCommentList()
      }, 1000)
    }
  }
}
</script>

<style lang='less' scoped>
.item {
  border-bottom: 1px solid #ccc;
  padding: 10px 20px;
  .time {
    color: #666;
    padding: 10px 0;
  }
  .comment {
    background-color: #ddd;
    padding: 10px;
    .name {
      color: #666;
      font-size: 14px;
    }
    .comment_content {
      color: #999;
      line-height: 30px;
      margin-top: 10px;
    }
  }
  .content {
    margin: 10px 0;
  }
  .origin {
    font-size: 14px;
    color: #999;
    display: flex;
    justify-content: space-between;
  }
}
</style>
