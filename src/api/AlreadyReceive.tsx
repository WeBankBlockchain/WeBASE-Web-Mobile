import axios, { AxiosResponse } from 'axios';
import { printLog } from '../context/LogTools';
import { getUrl } from '../tools/UrlTools';
import { BaseResp } from './BaseResp';


export function AlreadyReceive(OnAlreadyReceive: (resp: BaseResp<boolean> | undefined) => void, assetAddress: string, token: string) {

    const url = getUrl('asset/alreadyReceive?assetAddress=' + assetAddress);

    axios.get<BaseResp<boolean>>(url, { headers: { 'Content-Type': 'application/json', 'Authorizationtoken': token } })
        .then((response: AxiosResponse<BaseResp<boolean>>) => {
            printLog(url + "-->success");
            //response.data.code = 103732602
            OnAlreadyReceive(response.data);
        }).catch((error) => {
            printLog(["Error when-->" + url, error])
            OnAlreadyReceive(undefined);
        });
}