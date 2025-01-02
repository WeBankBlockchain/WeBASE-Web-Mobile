import { getStdID } from "../tools/StringTools";

export interface AssetInfo {
    assetSetName: string,
    assetSetNameEn: string,
    assetName: string,
    assetOwner: string,
    assetCreator: string,
    assetAddress: string,
    assetDesc: string,
    assetId: number,
    assetUri: string,
    imageUrl: string,
    imageInfo: string,
    writeOffStatus: boolean,
    assetOwnerUsername: string
    network: string
}

export function getStdAssetName(info: AssetInfo): string {
    if (info.assetName.includes("#")) {
        return info.assetName
    }
    const name = `${info.assetName} ${getStdID(info.assetId)}`
    return name;
}