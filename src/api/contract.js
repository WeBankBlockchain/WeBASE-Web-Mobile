import { get, post } from '@/utils/request'
import { reviseParam } from '@/utils/util'
/**
 * 链上所有合约地址
 * @params {*} {groupId} 、{pageNumber}、 {pageSize} ？ account
 */
export function getAllContractList(data,list) {
  const params = reviseParam(data, list);
  return post({
      url: `external/contract/list/all/${params.str}`,
      method: 'get',
      params: params.querys,
      headers: {
          AuthorizationToken: "Token " + localStorage.getItem("token") || "",
      }
  })
}