import Vue from 'vue'
import Vuex from 'vuex'
// import { getItem, setItem } from '@/utils/storage'// 引入存储到本地得方法
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 我们把token存到vuex中，无论是直接使用还是在模板中使用都十分方便，所以我们吧token存到vuex中
    // user: getItem('user')
  },
  mutations: {
    // getToken (state, user) {
    //   state.user = user
    //   // 存储的同时把数据页放到本地存储中
    //   // setItem('user', state.user)
    // }
  },
  // context环境  上下文
  actions: {
  }

})
