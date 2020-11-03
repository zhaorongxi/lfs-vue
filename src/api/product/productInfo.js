import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/lfs";

// 查询产品列表
export function productList(query) {
  return request({
    url: '/product/queryProductList',
    method: 'post',
    params: query
  })
}

// 查询产品详细
export function getProductInfo(id) {
  return request({
    url: '/product/getProductInfo/' + praseStrEmpty(id),
    method: 'get'
  })
}

// 新增产品
export function addProductInfo(data) {
  return request({
    url: '/product/addProductInfo',
    method: 'post',
    data: data
  })
}

// 修改产品
export function updateProductInfo(data) {
  return request({
    url: '/product/updateProductInfo',
    method: 'put',
    data: data
  })
}

// 删除产品
export function delProductInfo(userId) {
  return request({
    url: '/product/delProductInfo/' + userId,
    method: 'delete'
  })
}
