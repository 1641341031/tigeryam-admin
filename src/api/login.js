import service from '@/utils/request.js'

export function login(username, password) {
    return service({
        url: '/admin/login',
        method: 'post',
        data: {
            username,
            password
        }
    })
}

export function logout() {
    return request({
      url: '/admin/logout',
      method: 'post'
    })
  }