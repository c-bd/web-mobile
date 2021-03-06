import axios from 'axios'
import JSONbig from 'json-bigint'
// 因为现在的token存储在vuex得数据data中所以我们这里需要引入然后从这里获取user得数据也就是token令牌
import store from '@/store'

// axios.create (创造)方法
// 建议使用 create 方式，我们可以拥有
// 说白了就是复制了一个 axios，拥有和 axios 完全一样的功能，但是配置可以不一样
// 例如我们可以创建多个请求对象，而不同的请求对象拥有不同的 baseURL
// 例如我们可以有 a 请求的拦截器，也可以专门定制 b 请求的拦截器
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})
// 处理大数字的问题
request.defaults.transformResponse = [function (data) {
  return data ? JSONbig.parse(data) : {}
  // try {
  //   // data 数据可能不是标准的 JSON 格式字符串，否则会导致 JSONbig.parse(data) 转换失败报错
  //   return JSONbig.parse(data)
  // } catch (err) {
  //   // 无法转换的数据直接原样返回
  //   return data
  // }
}]
// 设置请求拦截器
request.interceptors.request.use(function (config) {
  const user = store.state.user// vuex得方式来处理\
  // const token = window.localStorage.getItem('user')
  // 则合理我们判断一下如果有token那么在将请求头放入请求体中
  if (user) {
    config.headers['Authorization'] = `Bearer ${user.token}`
    return config
  }
}, function (error) {
  // 对请求失败做处理
  return Promise.reject(error)
})

export default request
