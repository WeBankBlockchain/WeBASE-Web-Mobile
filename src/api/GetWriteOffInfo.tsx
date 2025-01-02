import axios, { AxiosResponse } from 'axios';
import { printLog } from '../context/LogTools';
import { getUrl } from '../tools/UrlTools';
import { BaseResp } from './BaseResp';


export interface WriteOffInfo {
    "tokenAddress": string | null,
    "tokenId": string | null,
    "amount": string | null,
    "userAddress": string | null,
    "userName": string | null,
    "contractIndex": string | null,
    "secret": string | null
}


export function GetWriteOffInfo(OnWriteOffInfo: (resp: BaseResp<WriteOffInfo> | undefined) => void, assetAddress: string, assetId: string, token: string) {

    const url = getUrl('asset/writeOffInfo?assetAddress=' + assetAddress + "&assetId=" + assetId);

    axios.get<BaseResp<WriteOffInfo>>(url, { headers: { 'Content-Type': 'application/json', 'Authorizationtoken': token } })
        .then((response: AxiosResponse<BaseResp<WriteOffInfo>>) => {
            printLog(url + "-->success");
            //response.data.code = 103722607
            OnWriteOffInfo(response.data);
        }).catch((error) => {
            printLog(["Error when-->" + url, error])
            OnWriteOffInfo(undefined);
        });
}