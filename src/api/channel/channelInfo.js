import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/lfs";

// 查询通道列表
export function queryChannelInfoList(query) {
  return request({
    url: '/channel/queryChannelInfoList',
    method: 'post',
    params: query
  })
}

// 查询通道详细
export function getChannelInfo(id) {
  return request({
    url: '/channel/getChannelInfo/' + praseStrEmpty(id),
    method: 'get'
  })
}

// 新增通道
export function addChannelInfo(data) {
  return request({
    url: '/channel/addChannelInfo',
    method: 'post',
    data: data
  })
}

// 通道状态修改
export function changeChannelStatus(id, channelSt) {
  const data = {
    id,
    channelSt
  }
  return request({
    url: '/channel/changeChannelStatus',
    method: 'put',
    data: data
  })  
}

// 修改通道信息
export function updateChannelInfo(data) {
  return request({
    url: '/channel/updateChannelInfo',
    method: 'put',
    data: data
  })
}

// 删除通道
export function delChannelInfo(ids) {
  return request({
    url: '/channel/delChannelInfo/' + ids,
    method: 'delete'
  })
}
