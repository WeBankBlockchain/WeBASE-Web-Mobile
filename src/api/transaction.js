import { get, post } from '@/utils/request'
import { reviseParam } from '@/utils/util'

export function hashTransactionInfo(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `/transaction/transInfo/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/** Transaction receipt based on transaction hash*/
export function getTransactionReceipt(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `/transaction/transactionReceipt/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

export function getFunctionAbi(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `/method/findById/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}