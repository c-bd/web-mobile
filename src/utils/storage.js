// 存入token
export const getItem = name => {
  return JSON.parse(window.localStorge.getItem(name))
}
// 取出token
export const setItem = (name, data) => {
  return window.localStorge.setItem(name, JSON.stringify(data))
}
// 退出移除本地token
export const remove = name => {
  return window.localStorage.removeItem(name)
}
