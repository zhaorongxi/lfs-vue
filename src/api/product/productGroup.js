import request from '@/utils/request'
import {praseStrEmpty} from "@/utils/lfs";

// 查询产品组列表
export function productGroupList(query) {
  return request({
    url: '/productGroup/queryProductGroupList',
    method: 'post',
    params: query
  })
}

// 查询产品下拉列表
export function getProductList() {
  return request({
    url: '/product/getProductList',
    method: 'post'
  })
}

// 查询产品下拉列表
export function getSelectProduct(groupNum) {
  const data = {
    groupNum
  }
  return request({
    url: '/product/getSelectProduct',
    method: 'post',
    params: data
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

// 新增产品到产品组
export function addProductToGroup(productNums,groupNum) {
  const data = {
    productNums,
    groupNum
  }
  return request({
    url: '/productGroup/addProductToGroup',
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

// 产品组下产品状态修改
export function changeProductToGroupStatus(id, productState) {
  const data = {
    id,
    productState
  }
  return request({
    url: '/productGroup/changeProductToGroupStatus',
    method: 'put',
    data: data
  })  
}

// 查询产品组下产品列表
export function getProductToGroup(query) {
  return request({
    url: '/productGroup/getProductToGroup',
    method: 'post',
    params: query
  })
}

// 修改产品组下产品折扣
export function updateDiscount(groupNum,productNum,discount) {
  const data = {
    groupNum,
    productNum,
    discount
  }
  return request({
    url: '/productGroup/updateDiscount',
    method: 'put',
    data: data
  })
}

// 删除产品组下产品
export function delProductToGroup(ids) {
  return request({
    url: '/productGroup/delProductToGroup/' + ids,
    method: 'delete'
  })
}


