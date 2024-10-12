import axios, { AxiosResponse } from 'axios';
import { printLog } from '../context/LogTools';
import { getUrl } from '../tools/UrlTools';
import { BaseResp } from './BaseResp';
import { AssetInfo } from './AssetInfo';


export function Detail(OnDetail: (resp: BaseResp<AssetInfo> | undefined) => void, assetAddress: string, assetId: string) {

    let url = getUrl('asset/detail?assetAddress=' + assetAddress);
    url = url + "&assetId=" + assetId

    axios.get<BaseResp<AssetInfo>>(url, { headers: { 'Content-Type': 'application/json' } })
        .then((response: AxiosResponse<BaseResp<AssetInfo>>) => {
            printLog(url + "-->success");
            OnDetail(response.data);
        }).catch((error) => {
            printLog(["Error when-->" + url, error])
            OnDetail(undefined);
        });
}