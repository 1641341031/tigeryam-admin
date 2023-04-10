import request from '@/utils/request.js'

export function fetchList(params) {
    return request({
      url:'/subject/list',
      method:'get',
      params:params
    })
  }

  export function fetchListAll() {
    return request({
      url:'/subject/listAll',
      method:'get',
    })
  }