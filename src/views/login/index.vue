<template>
  <div class="login">
        <ValidationObserver tag="form" ref="loginForm">
            <van-nav-bar title="登录"/>
                <van-cell-group>
                    <ValidationProvider tag="div" name="手机号" rules="required" v-slot="{ errors }">
                <van-field
                    v-model="useForm.mobile"
                    required
                    clearable
                    label="手机"
                    placeholder="请输入手机号"
                    :error-message="errors[0]"
                />
        </ValidationProvider>
        <ValidationProvider tag="div" name="手机号" rules="required" v-slot="{ errors }">
            <van-field
            v-model="useForm.code"
            required
            center
            clearable
            label="短信验证码"
            placeholder="请输入短信验证码"
            :error-message="errors[0]"
            >
            <van-button slot="button" size="small" type="primary" @click="getMobile">发送验证码</van-button>
            </van-field>
            </ValidationProvider>
        </van-cell-group>
      </ValidationObserver>
        <div class="login-btn">
            <van-button round type="info" class="btn" @click="onLogin" :loading='isLoding'>登录</van-button>
        </div>
  </div>
</template>

<script>
// import { mapMutations } from 'vuex'//  -------------引入vuex------
import { login, mobile } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      isLoding: false,
      useForm: {
        mobile: '18334794147',
        code: '246810'

      }
    }
  },
  methods: {
    // 获取验证码
    async getMobile () {
      await mobile(this.useForm)
    //   this.useForm.mobile = ref.data.mobile
    },
    async onLogin () {
      try {
        const isOK = await this.$refs.loginForm.validate()
        // 这里手机表单数据如果表单数据不为空那么isOk就是true true就会进入下面的判断取反为false那么就会执行后面的代码
        if (!isOK) {
          return
        }
        // 在这里显示加载状态
        this.isLoding = true
        // 请求提交表单数据
        const { data } = await login(this.useForm)
        window.localStorage.setItem('user', data.data.token)
        console.log(window.localStorage)
        // 我们这里临时使用本地存储得方法来存储token 来完成后面的逻辑
        this.$toast.success('登陆成功')
        // this.getToken(data.data)//登陆成功吧相应得token存储在vuex中去
        this.$router.push({ name: 'home' })
        // 成功后关闭加载状态
        this.isLoding = false
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.$toast.fail('登陆失败，请重新登录')
        }
      }
      // 不管成功失败都不能在继续加载了
      this.isLoding = false
    }
  }
}
</script>

<style lang="less" scoped>
.login{
    .login-btn{
        padding: 10px;
        .btn{
            width: 100%;
            background-color: rgb(19, 139, 187);
        }
    }
}
</style>
