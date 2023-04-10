import request from '@/utils/request.js'

export function fetchList(params) {
    return request({
      url:'/product/list',
      method:'get',
      params:params
    })
}

export function updatePublishStatus(params) {
    return request({
      url:'/product/update/publishStatus',
      method:'post',
      params:params
    })
  }

  export function updateNewStatus(params) {
    return request({
      url:'/product/update/newStatus',
      method:'post',
      params:params
    })
  }

  export function updateRecommendStatus(params) {
    return request({
      url:'/product/update/recommendStatus',
      method:'post',
      params:params
    })
  }

  export function updateDeleteStatus(params) {
    return request({
      url:'/product/update/deleteStatus',
      method:'post',
      params:params
    })
  }

  export function updateProduct(id,data) {
    return request({
      url:'/product/update/'+id,
      method:'post',
      data:data
    })
  }

  export function createProduct(data) {
    return request({
      url:'/product/create',
      method:'post',
      data:data
    })
  }