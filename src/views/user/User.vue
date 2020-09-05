<template>
  <div class="user">
      <div class="header" @click="$router.push('/user-edit')">
          <div class="avatar">
              <img :src="$axios.defaults.baseURL + user.head_img" alt="">
          </div>
          <div class="info">
              <div class="name">
                  <span v-if="user.gender === 1" class="iconfont iconxingbienan"></span>
                  <span v-else class="iconfont iconxingbienv"></span>
                  <span>{{user.nickname}}</span>
              </div>
              <div class="time">
                  {{user.create_data | time}}
              </div>
          </div>
          <div class="arrow">
              <span class="iconfont iconjiantou1"></span>
          </div>
      </div>

      <!-- 导航条 -->
      <hm-nav to="/myfollow">
        <template>我的关注</template>
        <template #content>关注的内容</template>
      </hm-nav>
      <hm-nav to="/mycomment">
        <template>我的跟帖</template>
        <template #content>跟帖回复</template>
      </hm-nav>
      <hm-nav to="/mystar">
        <template>我的收藏</template>
        <template #content>文章/视频</template>
      </hm-nav>
      <hm-nav to="/user-edit">
        <template>设置</template>
      </hm-nav>
      <!-- 退出按钮 -->
      <div style="margin: 15px">
        <van-button type="info" block @click='logout'>退出</van-button>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: ''
    }
  },
  async created () {
    const userId = localStorage.getItem('userId')
    // 发送get请求并携带token
    const res = await this.$axios.get(`/user/${userId}`)
    // console.log(res)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.user = data
    }
  },
  methods: {
    async logout () {
      // 弹窗提醒
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '确认退出？'
        })
      } catch (error) {
        return
      }
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      this.$router.push('/login')
      this.$toast.success('退出成功')
    }
  }
}
</script>

<style lang='less' scoped>
.user {
    .header {
        display: flex;
        align-items: center;
        padding: 20px 10px;
        border-bottom: 3px solid #ccc;
        .avatar{
            width: 70px;
            height: 70px;
            img{
                border-radius: 50%;
                width: 100%;
                height: 100%;
            }
        }
        .info {
            flex: 1;
            padding-left: 20px;
            font-size: 14px;
            .time {
                margin-top: 10px;
                color: #666;
            }
        }
        .iconxingbienan {
            color: #7bbcec;
        }
        .iconxingbienv {
            color: pink;
        }
    }
}
</style>
