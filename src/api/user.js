import request from '@/utils/request'
export const login = ({ mobile, code }) => {
  return request({
    method: 'POSt',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
export const mobile = data => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${data.mobile}`
  })
}
