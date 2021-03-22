import { get, post } from '@/utils/request'
import qs from 'qs'
// const baseURL = `${process.env.VUE_APP_BASE_API}/WeBASE-Node-Manager`
export function getPictureCheckCode() {
    return get({
        url: `account/pictureCheckCode`,
        method: 'get'
    })
}
export function login(data, code, token) {
    return post({
        url: `/account/login?checkCode=${code}`,
        method: 'post',
        data: qs.stringify(data),
        headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'token': token
        }
    })
}
export function loginOut() {
    return get({
        url: `/account/logout`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}


//获取链版本
export function fetchVersion() {
    return get({
        url: `/version`,
        method: "get",
        responseType: "text",
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**
 * 
 * @param {*} data 
 */
export function fetchFronts(data) {
    return get({
        url: `/front/find`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}