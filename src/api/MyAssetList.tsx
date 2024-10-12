import axios, { AxiosResponse } from 'axios';
import { printLog } from '../context/LogTools';
import { getUrl } from '../tools/UrlTools';
import { BaseResp } from './BaseResp';
import { AssetInfo } from './AssetInfo';


export function MyAssetList(OnMyAssetList: (resp: BaseResp<AssetInfo[]> | undefined) => void, token: string) {

    const url = getUrl('asset/myAssetList?pageNumber=1&pageSize=100');

    axios.get<BaseResp<AssetInfo[]>>(url, { headers: { 'Content-Type': 'application/json', 'Authorizationtoken': token } })
        .then((response: AxiosResponse<BaseResp<AssetInfo[]>>) => {
            printLog(url + "-->success");
            OnMyAssetList(response.data);
        }).catch((error) => {
            printLog(["Error when-->" + url, error])
            OnMyAssetList(undefined);
        });
}