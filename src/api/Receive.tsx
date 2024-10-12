import axios, { AxiosResponse } from 'axios';
import { printLog } from '../context/LogTools';
import { getUrl } from '../tools/UrlTools';
import { BaseResp } from './BaseResp';
import { AssetInfo } from './AssetInfo';


export function Receive(OnReceive: (resp: BaseResp<AssetInfo> | undefined) => void, assetAddress: string, token: string) {

    const url = getUrl('asset/receive?assetAddress=' + assetAddress);

    axios.get<BaseResp<AssetInfo>>(url, { headers: { 'Content-Type': 'application/json', 'Authorizationtoken': token } })
        .then((response: AxiosResponse<BaseResp<AssetInfo>>) => {
            printLog(url + "-->success");
            OnReceive(response.data);
        }).catch((error) => {
            printLog(["Error when-->" + url, error])
            OnReceive(undefined);
        });
}