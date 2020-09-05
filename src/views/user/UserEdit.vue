<template>
  <div class="user-edit">
      <hm-header>编辑资料</hm-header>
      <!-- 头像 -->
      <div class="avatar">
          <img :src="$axios.defaults.baseURL + user.head_img" alt="">
          <van-uploader :after-read="afterRead" />
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
        <van-field v-model="nickname" ref="nickname" placeholder="请输入用户名" />
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
      <!-- 裁剪的模态框 -->
      <div class="mask" v-show="isShowMask">
        <van-button type="primary" class="crop" @click='crop'>裁剪</van-button>
        <van-button type="danger" class="cancel" @click='isShowMask = false'>取消</van-button>
        <VueCropper
        ref="crop"
        :img='img'
        autoCrop
        autoCropWidth='100'
        autoCropHeight='100'
        fixed
        ></VueCropper>
      </div>
  </div>
</template>

<script>
// 引入组件
import { VueCropper } from 'vue-cropper'

export default {
  // 局部注册组件
  components: {
    VueCropper
  },
  data () {
    return {
      user: '',
      isShowNickName: false,
      nickname: '',
      isShowPassword: false,
      password: '',
      isShowGender: false,
      gender: 0,
      isShowMask: false,
      img: ''
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

    async showNickName () {
      this.isShowNickName = true
      this.nickname = this.user.nickname
      // 等待DOM更新
      await this.$nextTick()
      // 自动获取焦点
      this.$refs.nickname.focus()
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
    },
    isImg (name) {
      if (name.endsWith('.gif') || name.endsWith('.jpg') || name.endsWith('.png') || name.endsWith('.jpeg')) {
        return true
      } else {
        return false
      }
    },
    // 上传头像的方法
    afterRead (file) {
      // 此时可以自行将文件上传至服务器
      // console.log(file)
      if (!this.isImg(file.file.name)) {
        return this.$toast.fail('请上传正确的文件格式')
      }
      if (file.file.size >= 1024 * 1024) {
        return this.$toast.fail('文件太大')
      }
      this.isShowMask = true
      // 裁剪要给base64格式的图片
      this.img = file.content
      // ajax请求上传文件得是一个formdata对象
      // const fd = new FormData()
      // fd.append('file', file.file)
      // const res = await this.$axios.post('/upload', fd)
      // const { statusCode, data } = res.data
      // if (statusCode === 200) {
      //   this.updateUser({
      //     head_img: data.url
      //   })
      // }
    },
    crop () {
      this.$refs.crop.getCropBlob(async blob => {
        // console.log(blob)
        const fd = new FormData()
        fd.append('file', blob)
        const res = await this.$axios.post('/upload', fd)
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          this.updateUser({
            head_img: data.url
          })
        }
        this.isShowMask = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
.avatar {
    padding: 40px 0;
    text-align: center;
    position: relative;
    img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
    .van-uploader {
      position: absolute;
      left: 50%;
      top: 40px;
      transform: translate(-50%);
      width: 100px;
      height: 100px;
      opacity: 0;
    }
}
// 深度作用选择器
/deep/ .van-dialog__content {
    padding: 15px;
    .van-field {
        border: 1px solid #ccc;
    }
}
.mask {
  width: 100%;
  height: 100%;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  .crop,
  .cancel {
    position: fixed;
    top: 0;
    z-index: 1;
  }
  .cancel {
    right: 0;
  }
}

</style>
