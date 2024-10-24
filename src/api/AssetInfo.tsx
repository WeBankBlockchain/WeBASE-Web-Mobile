export interface AssetInfo {
    assetSetName: string,
    assetSetNameEn: string,
    assetName: string,
    assetOwner: string,
    assetCreator: string,
    assetAddress: string,
    assetId: number,
    assetUri: string,
    imageUrl: string,
    writeOffStatus: boolean,
    assetOwnerUsername: string
}

export function getStdAssetInfo(assetInfo: AssetInfo): AssetInfo {

    if (assetInfo.assetName.includes("#")) {
        return assetInfo
    }

    if (assetInfo.assetId < 10) {
        assetInfo.assetName = assetInfo.assetName + ' #000' + assetInfo.assetId
    } else if (assetInfo.assetId < 100) {
        assetInfo.assetName = assetInfo.assetName + ' #00' + assetInfo.assetId
    } else if (assetInfo.assetId < 1000) {
        assetInfo.assetName = assetInfo.assetName + ' #0' + assetInfo.assetId
    } else {
        assetInfo.assetName = assetInfo.assetName + ' #' + assetInfo.assetId
    }
    return assetInfo;
}