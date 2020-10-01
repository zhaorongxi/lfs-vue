import request from '@/utils/request'

// 查询订单列表
export function orderList(query) {
  return request({
    url: '/order/queryOrderInfo',
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