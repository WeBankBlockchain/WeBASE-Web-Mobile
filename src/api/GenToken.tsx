import axios, { AxiosResponse } from 'axios';
import { printLog } from '../context/LogTools';
import { getUrl } from '../tools/UrlTools';
import { BaseResp } from './BaseResp';

export interface TokenInfo {
    token: string,
    expireIn: number,
    value: string
}


export interface GenTokenReq {
    userAddress: string,
    salt: string,
    englishName: string,
}

export function GenToken(req: GenTokenReq, OnGenToken: (resp: BaseResp<TokenInfo> | undefined) => void) {

    const url = getUrl('connect/genToken');

    printLog(["try token", url, req])

    axios.post<BaseResp<TokenInfo>>(url, req, { headers: { 'Content-Type': 'application/json' } })
        .then((response: AxiosResponse<BaseResp<TokenInfo>>) => {
            printLog(url + "-->success");
            OnGenToken(response.data);
        }).catch((error) => {
            printLog(["Error when-->" + url, error])
            OnGenToken(undefined);
        });

}