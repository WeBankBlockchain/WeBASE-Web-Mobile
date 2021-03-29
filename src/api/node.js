import { get, post } from '@/utils/request'
import { reviseParam } from '@/utils/util'

export function getNodeList(data, list) {
  const params = reviseParam(data, list);
  return get({
      url: `node/nodeList/${params.str}`,
      method: 'get',
      params: params.querys,
      headers: {
          AuthorizationToken: "Token " + localStorage.getItem("token") || ""
      }
  })
}

export function getConsensusNodeId(data) {
  return get({
      url: `precompiled/consensus/list`,
      method: 'get',
      params: data,
      headers: {
          AuthorizationToken: "Token " + localStorage.getItem("token") || ""
      }
  })
}