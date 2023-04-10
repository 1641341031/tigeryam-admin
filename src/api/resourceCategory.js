import request from '@/utils/request.js'

export function listAllCate() {
    return request({
        url: '/resourceCategory/listAll',
        method: 'get'
    })
}

export function deleteResourceCategory(id) {
    return request({
      url: '/resourceCategory/delete/' + id,
      method: 'post'
    })
}

export function updateResourceCategory(id, data) {
    return request({
      url: '/resourceCategory/update/' + id,
      method: 'post',
      data: data
    })
  }

  export function createResourceCategory(data) {
    return request({
      url: '/resourceCategory/create',
      method: 'post',
      data: data
    })
  }