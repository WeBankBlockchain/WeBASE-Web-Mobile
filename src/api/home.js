import { get, post } from '@/utils/request'
import { reviseParam } from '@/utils/util'
/**daily transaction data */
export function getChartData(data) {
    return get({
        url: `/group/transDaily/${data}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**Chain overview */
export function getNetworkStatistics(data) {
    return get({
        url: `/group/general/${data}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}
/**Block list */
export function getBlockPage(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `/block/blockList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**Node list */
export function getNodeList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `/node/nodeList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/** Transaction list*/
export function getTransactionList(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `/transaction/transList/${params.str}`,
        method: 'get',
        params: params.querys,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

// consensus node id list 
export function getConsensusNodeId(data) {
    return get({
        url: `/precompiled/consensus/list`,
        method: 'get',
        params: data,
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}


//all group
export function getGroupsInvalidIncluded(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `/group/all/invalidIncluded/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}

/**block detail */
export function fetchBlockDetail(data, list) {
    const params = reviseParam(data, list);
    return get({
        url: `/block/blockByNumber/${params.str}`,
        method: 'get',
        headers: {
            AuthorizationToken: "Token " + localStorage.getItem("token") || ""
        }
    })
}