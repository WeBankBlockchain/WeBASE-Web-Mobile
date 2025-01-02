import axios, { AxiosResponse } from 'axios';
import { printLog } from '../context/LogTools';
import { getUrl } from '../tools/UrlTools';
import { BaseResp } from './BaseResp';
import { AssetInfo } from './AssetInfo';


export function Detail(OnDetail: (resp: BaseResp<AssetInfo> | undefined) => void, assetAddress: string, assetId: string, token?: string) {

    let url = getUrl('asset/detail?assetAddress=' + assetAddress);
    url = url + "&assetId=" + assetId

    let header: any = undefined
    if (token) {
        header = { 'Content-Type': 'application/json', 'Authorizationtoken': token }
    } else {
        header = { 'Content-Type': 'application/json' }
    }

    axios.get<BaseResp<AssetInfo>>(url, { headers: header })
        .then((response: AxiosResponse<BaseResp<AssetInfo>>) => {
            printLog(url + "-->success");
            OnDetail(response.data);
        }).catch((error) => {
            printLog(["Error when-->" + url, error])
            OnDetail(undefined);
        });
}