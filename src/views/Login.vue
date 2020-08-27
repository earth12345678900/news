<template>
    <div>
        <hm-header>登陆</hm-header>
        <hm-logo></hm-logo>
        <!-- 登录表单 -->
        <van-form @submit="login">
            <van-field
                v-model="username"
                name="用户名"
                label="用户名"
                placeholder="请输入账号"
                :rules='rules.username'
            />
            <van-field
                v-model="password"
                type="password"
                name="密码"
                label="密码"
                placeholder="请输入密码"
                :rules="rules.password"
            />
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">
                提交
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
// 导入axios
import axios from 'axios'

export default {
  data () {
    return {
      username: '',
      password: '',
      rules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'onChange' },
          { pattern: /^\d{5,11}$/, message: '用户名长度为5-11位数字', trigger: 'onChange' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'onChange' },
          { pattern: /^\d{3,9}$/, message: '密码长度是3-9位的数字', trigger: 'onChange' }
        ]
      }
    }
  },
  methods: {
    async login () {
      const res = await axios.post('http://localhost:3000/login', {
        // console.log(this.username) 只有用户名
        username: this.username,
        password: this.password
      })
      //   console.log(res.data)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        // 在组件中使用this.$Toast
        this.$toast.success(message)
        // 保存token
        // 跳转到个人中心
        this.$router.push('/user')
      } else {
        this.$toast.fail('登陆失败')
      }
    }
  }
}

</script>

<style lang="less">

</style>
