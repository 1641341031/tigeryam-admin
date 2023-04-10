import request from '@/utils/request.js'

export function verifyCode() {
    return request({
        url: '/verify-code',
        method: 'get',
        responseType: 'blob'
    })
}