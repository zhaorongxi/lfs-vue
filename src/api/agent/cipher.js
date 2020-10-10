import request from '@/utils/request'

// 查询密钥列表
export function getAccessList(query) {
  return request({
    url: '/agent/queryAgtAccessList',
    method: 'post',
    params: query
  })
}



// 用户密码重置
export function refreshAppKey(agtPhone) {
  const data = {
    agtPhone
  }
  return request({
    url: '/agent/refreshAppKey',
    method: 'put',
    data: data
  })
}
