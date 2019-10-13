import Vue from 'vue'
import Vuex from 'vuex'
import { getItem } from '@/utils/storage'// 引入存储到本地得方法
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 我们把token存到vuex中，无论是直接使用还是在模板中使用都十分方便，所以我们吧token存到vuex中
    user: getItem('user')
  },
  mutations: {
    // 默认参数state，传入形参user
    getToken (state, user) {
      state.user = user
    }
  },
  // context环境  上下文
  actions: {
  }

})
