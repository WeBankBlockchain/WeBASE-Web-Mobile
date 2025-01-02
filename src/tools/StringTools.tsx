import { WriteOffInfo } from "../api/GetWriteOffInfo"
import { printLog } from "../context/LogTools"

export const getStdAddress = (account: string | undefined): string => {
    if (account && account.length > 8) {
        return account.slice(0, 6) + "..." + account.slice(account.length - 4, account.length)
    } else {
        return account ? account : ''
    }
}

export const getMastName = (name: string | null): string => {
    printLog("getMastName-->" + name)
    if (!name) {
        return ""
    }
    name = name.trim()
    if (name.includes(' ')) {
        const names = name.split(' ')
        name = '****' + names[names.length - 1]
    }
    return name;
}

export const StringEqual = (str1: string, str2: string): boolean => {
    return str1.trim().toLocaleLowerCase() === str2.trim().toLocaleLowerCase()
}

export function getStdID(assetId: number): string {
    if (assetId < 10) {
        return '#000' + assetId
    } else if (assetId < 100) {
        return '#00' + assetId
    } else if (assetId < 1000) {
        return '#0' + assetId
    } else {
        return '#' + assetId
    }
}

export function getQRCode(tokenInfo: WriteOffInfo): string {
    return `weco:writeoff?tokenAddress=${tokenInfo.tokenAddress}&tokenId=${tokenInfo.tokenId}&amount=${tokenInfo.amount}&userAddress=${tokenInfo.userAddress}&userName=${tokenInfo.userName}&contractIndex=${tokenInfo.contractIndex}&secret=${tokenInfo.secret}`
}