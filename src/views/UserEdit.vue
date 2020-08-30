<template>
  <div class="user-edit">
      <hm-header>编辑资料</hm-header>
      <!-- 头像 -->
      <div class="avatar">
          <img :src="$axios.defaults.baseURL + user.head_img" alt="">
      </div>
      <!-- 导航栏 -->
      <hm-nav @click='showNickName'>
          <template>昵称</template>
          <template #content>{{user.nickname}}</template>
      </hm-nav>
      <hm-nav @click='showPassWord'>
          <template>密码</template>
          <template #content>******</template>
      </hm-nav>
      <hm-nav @click='showGender'>
          <template>性别</template>
          <template #content>{{user.gender === 1 ? '男' : '女'}}</template>
      </hm-nav>

      <!-- 渲染dialog组件 修改昵称-->
      <van-dialog v-model="isShowNickName" title="编辑昵称" show-cancel-button @confirm='updateNickName'>
        <van-field v-model="nickname" placeholder="请输入用户名" />
      </van-dialog>

      <!-- 渲染dialog组件 修改密码-->
      <van-dialog v-model="isShowPassword" title="编辑密码" show-cancel-button @confirm='updatePassword'>
        <van-field v-model="password" placeholder="请输入密码" />
      </van-dialog>
      <!-- 修改性别组件 -->
      <van-dialog v-model="isShowGender" title="修改性别" show-cancel-button @confirm='updateGender'>
        <van-radio-group v-model="gender">
            <van-cell-group>
                <van-cell title="男" clickable @click="gender = 1">
                <template #right-icon>
                    <van-radio :name="1" />
                </template>
                </van-cell>
                <van-cell title="女" clickable @click="gender = 0">
                <template #right-icon>
                    <van-radio :name="0" />
                </template>
                </van-cell>
            </van-cell-group>
        </van-radio-group>
      </van-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: '',
      isShowNickName: false,
      nickname: '',
      isShowPassword: false,
      password: '',
      isShowGender: false,
      gender: 0
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo () {
      // 获取个人信息
      const userId = localStorage.getItem('userId')
      const res = await this.$axios.get(`/user/${userId}`)
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.user = data
      }
    },

    // 封装更新数据的方法
    async updateUser (data) {
      const userId = localStorage.getItem('userId')
      const res = await this.$axios.post(`/user_update/${userId}`, data)
      console.log(res)
      if (res.data.statusCode === 200) {
        this.getUserInfo()
        this.$toast.success('修改成功')
      }
    },

    showNickName () {
      this.isShowNickName = true
      this.nickname = this.user.nickname
    },

    async updateNickName () {
      this.updateUser({ nickname: this.nickname })
    //   const userId = localStorage.getItem('userId')
    //   const res = await this.$axios.post(`/user_update/${userId}`, {
    //     nickname: this.nickname
    //   })
    //   console.log(res)
    //   if (res.data.statusCode === 200) {
    //     this.getUserInfo()
    //     this.$toast.success('修改成功')
    //   }
    },
    showPassWord () {
      this.isShowPassword = true
      this.password = this.user.password
    },
    async updatePassword () {
      this.updateUser({ password: this.password })
    },
    showGender () {
      this.isShowGender = true
      this.gender = this.user.gender
    },
    async updateGender () {
      this.updateUser({ gender: this.gender })
    }
  }
}
</script>

<style lang='less' scoped>
.avatar {
    padding: 40px 0;
    text-align: center;
    img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
}
// 深度作用选择器
/deep/ .van-dialog__content {
    padding: 15px;
    .van-field {
        border: 1px solid #ccc;
    }
}

</style>
