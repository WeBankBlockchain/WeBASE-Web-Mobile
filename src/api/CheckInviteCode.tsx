import axios, { AxiosResponse } from 'axios'
import { printLog } from '../context/LogTools';
import { getUrl } from '../tools/UrlTools';
import { BaseResp } from './BaseResp';

export function CheckInviteCode(params: any,token: string, OnCheckInviteCode: (resp: BaseResp<any> | undefined) => void){
    let url = getUrl('asset/checkInviteCode?inviteCode=')
    url += params.inviteCode
    let header: any = undefined
    if (token) {
        header = { 'Content-Type': 'application/json', 'Authorizationtoken': token }
    } else {
        header = { 'Content-Type': 'application/json' }
    }

    axios.get<BaseResp<boolean>>(url, { headers: header })
    .then((response: AxiosResponse<BaseResp<boolean>>) => {
        printLog(url + "-->success");
        OnCheckInviteCode(response.data);
    }).catch((error) => {
        printLog(["Error when-->" + url, error])
        OnCheckInviteCode(undefined);
    });


}
