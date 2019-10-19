import Vue from 'vue'
import Router from 'vue-router'
import Tabbar from '@/views/tabbar'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Tabbar,
      children: [
        {
          name: 'home',
          path: '', // 什么都不写默认子路由
          component: () => import('@/views/home')
        },

        // 我的页面
        {
          name: 'my',
          path: '/my',
          component: () => import('@/views/my')
        }
      ]
    },
    // 文章列表详情
    {
      name: 'artilce',
      path: '/artilce/:article_id',
      component: () => import('@/views/article')

    },
    // 搜索结果
    {
      name: 'search-result',
      path: '/search/:q',
      component: () => import('@/views/search-result')
    },
    // 登陆页面
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    },
    // 修改个人信息页面
    {
      name: 'user',
      path: '/user', // 什么都不写默认子路由
      component: () => import('@/views/user')
    },
    // 搜索页面
    {
      name: 'search',
      path: '/search',
      component: () => import('@/views/search')
    }

    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ './views/About.vue')

  ]
})
