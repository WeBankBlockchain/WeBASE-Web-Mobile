import axios, { AxiosResponse } from 'axios';
import { printLog } from '../context/LogTools';
import { getUrl } from '../tools/UrlTools';
import { BaseResp } from './BaseResp';
import { AssetInfo } from './AssetInfo';

export interface ListBaseResp<T> extends BaseResp<T> {
    totalCount: number,
    currentPageIndex: number,
}

export function AssetList(OnAssetList: (resp: ListBaseResp<AssetInfo[]> | undefined) => void, pageNumber: number, pageSize: number, assetAddress: string, assetId?: string) {

    let url = getUrl('asset/assetList?&status=1');
    url = url + '&assetAddress=' + assetAddress;
    assetId && (url = url + '&assetId=' + assetId);
    url = url + '&pageNumber=' + pageNumber;
    url = url + '&pageSize=' + pageSize;


    axios.get<ListBaseResp<AssetInfo[]>>(url, { headers: { 'Content-Type': 'application/json' } })
        .then((response: AxiosResponse<ListBaseResp<AssetInfo[]>>) => {
            printLog(url + "-->success");
            response.data.currentPageIndex = pageNumber;
            OnAssetList(response.data);
        }).catch((error) => {
            printLog(["Error when-->" + url, error])
            OnAssetList(undefined);
        });
}