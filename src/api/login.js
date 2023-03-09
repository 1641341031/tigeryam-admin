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
    return service({
      url: '/admin/logout',
      method: 'post'
    })
  }

export function getInfo() {
  return service({
    url: '/admin/info',
    method: 'get'
  })
}