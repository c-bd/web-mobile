import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 按需加载
import rTime from 'dayjs/plugin/relativeTime' // 相对时间插件
dayjs.locale('zh-cn') // 全局使用中文语言
dayjs.extend(rTime) // 配置使用相对时间插件
export const relativeTime = time => {
  // 给time传入人一种格式都可以 计算并返回指定时间到现在最新时间得相对时间
  return dayjs().from(dayjs(time))
}
