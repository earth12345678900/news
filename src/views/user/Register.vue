<template>
    <div>
        <hm-header>注册</hm-header>
        <hm-logo></hm-logo>
        <!-- 登录表单 -->
        <van-form @submit="register">
            <van-field
                v-model="user.username"
                label="账号"
                placeholder="请输入账号"
                :rules='rules.username'
            />
            <van-field
                v-model="user.nickname"
                label="昵称"
                placeholder="请输入昵称"
                :rules='rules.nickname'
            />
            <van-field
                v-model="user.password"
                type="password"
                label="密码"
                placeholder="请输入密码"
                :rules="rules.password"
            />
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">
                注册
                </van-button>
            </div>
        <p class="tips">已有账号去<router-link to="/login">登录</router-link></p>
        </van-form>
    </div>
</template>

<script>
// import axios from 'axios'
// 挂载到原型上不需要引入了
export default {
  data () {
    return {
      user: {
        username: '',
        nickname: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'onChange' },
          { pattern: /^\d{5,11}$/, message: '用户名长度为5-11位数字', trigger: 'onChange' }
        ],
        nickname: [
          { required: true, message: '昵称不能为空', trigger: 'onChange' },
          { pattern: /^[\u4e00-\u9fa5]{2,6}$/, message: '昵称必须是2-6位的中文', trigger: 'onChange' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'onChange' },
          { pattern: /^\d{3,9}$/, message: '密码长度是3-9位的数字', trigger: 'onChange' }
        ]
      }
    }
  },
  methods: {
    async register () {
      const res = await this.$axios.post('/register', this.user)
      //   console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        // 跳转到登录页面
        // console.log(this)
        this.$router.push({
          name: 'login',
          params: this.user
        })
      } else {
        this.$toast.fail(message)
      }
    }
  }

}
</script>

<style lang="less" scoped>
  .tips{
    padding: 15px;
    font-size: 16px;
    text-align: right;
    a {
      color: blue
    }
  }

</style>
