import axios, { AxiosResponse } from 'axios';
import { printLog } from '../context/LogTools';
import { getUrl } from '../tools/UrlTools';
import { BaseResp } from './BaseResp';

export interface JWTInfo {
    jwt: string
    relayUrl: string
    cptId: string
    schemeUrl: string
    // tpProxyAddress: string;
    openTicketAddress: string
}

export function GetJwt(OnGetJwt: (resp: BaseResp<JWTInfo> | undefined) => void) {

    const url = getUrl('connect/getJwt');

    axios.get<BaseResp<JWTInfo>>(url)
        .then((response: AxiosResponse<BaseResp<JWTInfo>>) => {
            printLog(url + "-->success");
            OnGetJwt(response.data);
        }).catch((error) => {
            printLog(["Error when-->" + url, error])
            OnGetJwt(undefined);
        });
}