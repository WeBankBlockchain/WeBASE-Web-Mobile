import { get, post } from '@/utils/request'
import { reviseParam } from '@/utils/util'

/** search */
export function fetchSearchKw(groupId, keyword) {
    return get({
        url: `/block/search/${groupId}/${keyword}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}