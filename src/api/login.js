import request from '@/utils/request.js'

export function login(username, password, code) {
    return request({
        url: '/admin/login',
        method: 'post',
        data: {
            username,
            password,
            code
        }
    })
}

export function logout() {
    return request({
      url: '/admin/logout',
      method: 'post'
    })
  }

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get'
  })
}

export function fetchList(params) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: params
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/admin/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function getRoleByAdmin(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function deleteAdmin(id) {
  return request({
    url: '/admin/delete/' + id,
    method: 'post'
  })
}

export function updateAdmin(id, data) {
  return request({
    url: '/admin/update/' + id,
    method: 'post',
    data: data
  })
}

export function createAdmin(data) {
  return request({
    url: '/admin/register',
    method: 'post',
    data: data
  })
}

export function allocRole(data) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data: data
  })
}