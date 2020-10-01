import request from '@/utils/request'

// 查询回调订单列表
export function notifyList(query) {
  return request({
    url: '/notifyInfo/queryNotifyList',
    method: 'post',
    params: query
  })
}


// 导出岗位
export function exportPost(query) {
  return request({
    url: '/system/post/export',
    method: 'get',
    params: query
  })
}