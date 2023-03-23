import request from '@/utils/request.js'

export function fetchAllRoleList() {
    return request({
      url: '/role/listAll',
      method: 'get'
    })
  }