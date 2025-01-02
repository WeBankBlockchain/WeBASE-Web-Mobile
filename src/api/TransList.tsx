import axios, { AxiosResponse } from 'axios';
import { printLog } from '../context/LogTools';
import { getUrl } from '../tools/UrlTools';
import { BaseResp } from './BaseResp';
import { TranxInfo } from './TranxInfo';


export function TransList(OnTransList: (resp: BaseResp<TranxInfo[]> | undefined) => void, assetAddress: string, assetId: string, token?: string) {

    let url = getUrl('asset/transList?&pageNumber=1&pageSize=100');
    url = url + '&assetAddress=' + assetAddress;
    url = url + '&assetId=' + assetId;

    let header: any = undefined
    if (token) {
        header = { 'Content-Type': 'application/json', 'Authorizationtoken': token }
    } else {
        header = { 'Content-Type': 'application/json' }
    }

    axios.get<BaseResp<TranxInfo[]>>(url, { headers: header })
        .then((response: AxiosResponse<BaseResp<TranxInfo[]>>) => {
            printLog(url + "-->success");
            OnTransList(response.data);
        }).catch((error) => {
            printLog(["Error when-->" + url, error])
            OnTransList(undefined);
        });
}