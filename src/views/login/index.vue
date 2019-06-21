<template>
  <div class='appLogin'>
    <!-- 给组件加 class，会把这个 class 作用到组件的根元素上 -->
    <div class='form-wrap'>
      <div class='form-head'>
        <img src='./logo_index.png' alt='黑马头条号'>
      </div>
      <el-form class='form-content' ref='form'>
        <el-form-item>
          <el-input placeholder='手机号' v-model='loginForm.mobile'></el-input>
        </el-form-item>
        <el-form-item>
          <!-- el-col 栅格布局，一共 24 列，:span 用来指定占用的大小，:offset 用来指定偏移量 -->
          <el-col :span='14'>
            <el-input placeholder='验证码' v-model='loginForm.code'></el-input>
          </el-col>
          <el-col :offset='1' :span='9'>
            <el-button @click='handleGetCode'>获取验证码</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button class='btn-login' type='primary' @click='handleLogin'>登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt'
export default {
  data() {
    return {
      loginForm: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    handleGetCode() {
      const { mobile } = this.loginForm
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const { data } = res.data
        window.initGeetest(
          {
            gt: data.gt,
            challenge: data.challenge,
            new_captcha: data.new_captcha,
            offline: !data.success,
            product: 'bind'
          },
          function(captchaObj) {
            captchaObj.appendTo('#captchaBox')
            captchaObj
              .onReady(function() {
                captchaObj.verify()
              })
              .onSuccess(function() {
                const {
                  geetest_challenge: challenge,
                  geetest_seccode: seccode,
                  geetest_validate: validate
                } = captchaObj.getValidate()
                axios({
                  method: 'GET',
                  url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
                  params: {
                    challenge, seccode, validate
                  }
                }).then(res => {
                  console.log(res.data)
                })
              })
              .onError(function() {
              })
          }
        )
      })
    },
    handleLogin() {
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.loginForm
      }).then(res => {
        console.log(res.data)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.$router.push({
          name: 'home'
        })
      }).catch(e => {
        this.$message.error('登录失败，手机号或验证码错误')
      })
    }
  }
}
</script>

<style lang='less' scoped>
.appLogin {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  background: url('./pool_party.jpg') center no-repeat;
}
</style>
