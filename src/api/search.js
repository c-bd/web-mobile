import request from '@/utils/request'
export function getSuggestion (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params
  })
}
export function getSearch (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
