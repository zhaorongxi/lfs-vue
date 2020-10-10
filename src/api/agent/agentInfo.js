import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/lfs";

// 查询用户列表
export function agentList(query) {
  return request({
    url: '/agent/queryAgentList',
    method: 'post',
    params: query
  })
}

// 查询商户详细
export function getAgent(id) {
  return request({
    url: '/agent/getAgentInfo/' + praseStrEmpty(id),
    method: 'get'
  })
}

// 新增用户
export function addAgent(data) {
  return request({
    url: '/agent/addAgentInfo',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateAgentInfo(data) {
  return request({
    url: '/agent/updateAgentInfo',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delAgent(userId) {
  return request({
    url: '/agent/deleteAgentInfo/' + userId,
    method: 'delete'
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params: query
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeAgentStatus(id, state) {
  const data = {
    id,
    state
  }
  return request({
    url: '/agent/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}
