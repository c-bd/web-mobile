// 一个专门操作本地存储得API模块
// 拿取数据
export const getItem = name => {
  return JSON.parse(window.localStorage.getItem(name))
}
// 存储数据到本地
export const setItem = (name, data) => {
  return window.localStorage.setItem(name, JSON.stringify(data))
}
// 移除本地存储
export const removeItem = name => {
  window.localStorage.removeItem(name)
}
