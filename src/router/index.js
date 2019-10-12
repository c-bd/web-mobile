import Vue from 'vue'
import Router from 'vue-router'
import Tabbar from '@/views/tabbar'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Tabbar,
      children: []
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }

    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ './views/About.vue')

  ]
})
