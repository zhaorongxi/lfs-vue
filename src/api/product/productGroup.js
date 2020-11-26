import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/lfs";

// 查询产品组列表
export function productGroupList(query) {
  return request({
    url: '/productGroup/queryProductGroupList',
    method: 'post',
    params: query
  })
}

// 查询产品组详细
export function getProductGroup(id) {
  return request({
    url: '/productGroup/getProductGroup/' + praseStrEmpty(id),
    method: 'get'
  })
}

// 新增产品组
export function addProductGroup(data) {
  return request({
    url: '/productGroup/addProductGroup',
    method: 'post',
    data: data
  })
}

// 修改产品组
export function updateProductGroup(data) {
  return request({
    url: '/productGroup/updateProductGroup',
    method: 'put',
    data: data
  })
}

// 删除产品组
export function delProductGroup(ids) {
  return request({
    url: '/productGroup/delProductGroup/' + ids,
    method: 'delete'
  })
}

// 产品组状态修改
export function changeGroupStatus(id, groupState) {
  const data = {
    id,
    groupState
  }
  return request({
    url: '/productGroup/changeGroupStatus',
    method: 'put',
    data: data
  })
}
