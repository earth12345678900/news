<template>
  <div class="post-detail">
    <div class="header">
      <div class="left" @click="$router.back()">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="center">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="right">
        <div class="followed" v-if="post.has_follow" @click="unfollow">已关注</div>
        <div class="follow" v-else @click="follow">关注</div>
      </div>
    </div>
    <!-- 文章内容 -->
    <div class="content">
        <div class="title">{{post.title}}</div>
        <div class="name">
            <span>{{post.user.nickname}}</span>
            <span>{{post.creat_data | time}}</span>
        </div>
        <div v-if="post.type === 1" class="info" v-html="post.content"></div>
        <video v-else :src="getUrl(post.content)" controls autoplay muted></video>

        <!-- 点赞微信按钮 -->
        <div class="buttons">
            <div class="good" @click="like" :class="{active: post.has_like}">
                <span class="iconfont icondianzan"></span>
                <span>{{post.like_length || 0}}</span>
            </div>
            <div class="share">
                <span class="iconfont iconweixin"></span>
                <span>微信</span>
            </div>
        </div>
    </div>
    <!-- 评论 -->
    <div class="comment-list">
      <h3>精彩跟帖</h3>
      <!-- 父传子 -->
      <hm-comment :comment='comment' v-for="comment in commentList" :key="comment.id" @reply='onReply'></hm-comment>
    </div>

    <!-- 底部评论框 -->
    <div class="footer-textarea" v-if="isShowTextarea">
      <textarea @blur="onBlur" :placeholder="'回复：' + nickname" ref="textarea" v-model="content"></textarea>
      <van-button type="danger" @click="publish">发送</van-button>
    </div>
    <!-- footer -->
    <div class="footer-input" v-else>
      <div class="search">
        <input type="text" placeholder="回复"  @focus="onFocus">
      </div>
      <span class="iconfont iconpinglun-"><i>20</i></span>
      <span class="iconfont iconshoucang" :class="{now: post.has_star}" @click="star"></span>
      <span class="iconfont iconfenxiang"></span>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      post: {
        // 不加user nickname会报错
        user: {}
      },
      commentList: [],
      isShowTextarea: false,
      content: '',
      nickname: '',
      // 回复的id
      replyId: ''
    }
  },
  created () {
    this.getInfo()
    // 获取文章评论列表
    this.getCommentList()

    // 给bus注册自定义事件
    this.$bus.$on('reply', this.onReply)
  },
  destroyed () {
    // 移除$bus的自定义事件(三种传参方式)
    // 移除bus上的reply事件 对应的onReply事件
    this.$bus.$off('reply', this.onReply)
  },
  methods: {
    nologin () {
      // 判断是否登录 亩登录跳转到登录页 已经登录发送请求关注该用户
      const token = localStorage.getItem('token')
      if (!token) {
        // 没登录跳转到登录页面
        this.$router.push({
          path: '/login',
          query: {
            back: true
          }
        })
        return true // 代表没有登录
      } else {
        return false // 代表有登陆
      }
    },
    async getInfo () {
      // 动态路由获取id
      const { id } = this.$route.params
      const res = await this.$axios.get(`/post/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.post = data
        console.log(this.post)
      }
    },
    getUrl (url) {
      const div = document.createElement('div')
      div.innerHTML = url
      return div.innerText
    },
    async follow () {
      if (this.nologin()) return
      // 有token发请求关注
      const res = await this.$axios.get(`/user_follows/${this.post.user.id}`)
      console.log(res.data)
      if (res.data.statusCode === 200) {
        this.$toast.success('关注成功')
        this.getInfo()
      }
    },
    // 发送请求取消关注
    async unfollow () {
      const res = await this.$axios.get(`/user_unfollow/${this.post.user.id}`)
      const { statusCode } = res.data
      if (statusCode === 200) {
        this.$toast.success('取消关注')
        this.getInfo()
      }
    },
    // 能点赞能取消
    async like () {
      // 没有登录 return
      if (this.nologin()) return
      // 登录了发送请求点赞
      const res = await this.$axios.get(`/post_like/${this.post.id}`)
      console.log(res.data)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getInfo()
      }
    },
    // 是否收藏
    async star () {
      // 没有登录 return
      if (this.nologin()) return
      // 登录了收藏
      const res = await this.$axios.get(`/post_star/${this.post.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getInfo()
      }
    },
    async getCommentList () {
      // 通过params获取文章id index页面传递参数
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post_comment/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commentList = data
        console.log(this.commentList)
      }
    },
    async onFocus () {
      this.isShowTextarea = true
      // 等待dom更新
      await this.$nextTick()
      this.$refs.textarea.focus()
    },
    async publish () {
      const res = await this.$axios.post(`post_comment/${this.post.id}`, {
        content: this.content,
        parent_id: this.replyId
      })
      // console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getCommentList()
        this.content = ''
        this.replyId = ''
        this.nickname = ''
        this.isShowTextarea = false
      }
    },
    // 回复评论
    async onReply (id, nickname) {
      this.isShowTextarea = true
      await this.$nextTick()
      // 自动获取焦点
      this.$refs.textarea.focus()
      // 回显nickname
      this.nickname = '@' + nickname
      this.replyId = id
    },
    // 失去焦点事件
    onBlur () {
      if (!this.content) {
        this.isShowTextarea = false
        this.replyId = ''
        this.nickname = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.post-detail {
  padding-bottom: 50px;
}
.header {
  display: flex;
  padding: 0 10px;
  border-bottom: 1px solid #ccc;
  height: 50px;
  align-items: center;
  .left {
    span {
      line-height: 50px;
    }
  }
  .center {
    flex: 1;
    span {
      font-size: 50px;
    }
  }
  .right {
    font-size: 14px;
    div {
      width: 60px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 15px;
    }
    .followed {
      border: 1px solid #ccc;

    }
    .follow {
      color: #fff;
      background-color: #f00;
    }
  }
}
.content {
    padding: 10px;
    border-bottom: 3px solid #ccc;
    .title {
        font-weight: 700;
        font-size: 18px;
    }
    .name {
        font-size: 14px;
        color: #666;
        margin: 10px 0;
        span:first-child {
            margin-right: 20px;
        }
    }
    .info {
        font-size: 14px;
        /deep/ img {
            width: 100%;
        }
    }
    video {
        width: 100%;
    }
    .buttons {
        padding: 20px 0;
        display: flex;
        justify-content: space-around;
        > div {
            width: 120px;
            height: 40px;
            line-height: 40px;
            border-radius: 20px;
            border: 1px solid #ccc;
            text-align: center;
            font-size: 16px;
            .iconfont {
                font-size: 18px;
                margin-right: 5px;
            }
            .iconweixin {
                color: rgb(64, 210, 64);
            }
        }
        .active {
          border-color: red;
          color: red;
        }
    }
}
.comment-list {
  h3 {
    text-align: center;
    padding: 10px 0;
  }
}
.footer-input {
  background-color: #fff;
  width: 100%;
  height: 50px;
  display: flex;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
  .iconfont {
    font-size: 24px;
  }
  .now {
    color: red;
  }
  .iconpinglun- {
    position: relative;
    i {
      position: absolute;
      right: -5px;
      top: 0;
      background-color: red;
      font-size: 10px;
      color: #fff;
      padding: 0 3px;
      border-radius: 5px;
      font-style: normal;
    }
  }
  .search {
    width: 180px;
    padding-right: 10px;
    input {
      height: 30px;
      background-color: #ddd;
      border-radius: 15px;
      width: 100%;
      border: none;
      font-size: 14px;
      padding-left: 20px;
      padding: 3px;
    }
  }
}
.footer-textarea {
  width: 100%;
  height: 100px;
  display: flex;
  position: fixed;
  z-index: 999;
  bottom: 0;
  padding: 10px;
  align-items: flex-end;
  background-color: #fff;
  border-top: 1px solid #ccc;
  justify-content: space-around;
  textarea {
    width: 260px;
    height: 80px;
    background-color: #ccc;
    border-radius: 5px;
    border: none;
    padding: 10px;
    font-size: 14px;
  }
}
</style>
