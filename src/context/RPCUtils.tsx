import { SessionTypes } from '@walletconnect/types';
import { DEFAULT_EIP155_METHODS, DEFAULT_EIP155_OPTIONAL_METHODS } from "./GetNamespaces";
import { printLog } from "./LogTools";
import { DEFAULT_CHAINIDS } from "./Const";
import { SignClientV2 } from './SignClient';
import { ShowToast } from '../tools/CommonUtils';


export const stringToHex = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
};

export interface DIDInfo {
    email: string,
    firstName: string,
    lastName: string
}

export async function tranxSign(client: SignClientV2, session: SessionTypes.Struct, fromAdd: string, toAdd: string, enData: string, sigMessage: string, t: Function) {

    printLog('tranxSign func topic-->' + session!.topic)
    // encode message (hex)
    const hexMsg = stringToHex(sigMessage);
    try {
        printLog('signedTx topic-->' + session!.topic)
        const signedTx = await client!.request<string>({
            topic: session!.topic,
            chainId: DEFAULT_CHAINIDS,
            request: {
                method: DEFAULT_EIP155_OPTIONAL_METHODS.ETH_SIGN_TRANSACTION,
                // params: [hexMsg, {
                params: [{
                    version: 0,
                    from: fromAdd,
                    to: toAdd,
                    data: enData,
                    message: hexMsg
                }],
            },
        });
        let result = signedTx.replaceAll(/"/g, '');
        printLog(['signedTx-->', "topic=" + session!.topic, result])
        return result
    }
    catch (_error) {
        printLog(['signedTx failed-->', _error])
        const errorResult = (_error as { code: number, message: string })
        ShowToast(t("sign_failed") + ": " + errorResult.message)
        return undefined;
    }

}

interface KycRequest {
    cptId: string,
    publicKey: string,
    needDataKey: string[],
}

interface UserInfoRequest {
    needDataKey: string[],
}

interface DIDResp {
    error: {
        code: number,
        message: string,
    },
    kycInfo: any,
    userInfo: {
        email: string,
        firstName: string,
        lastName: string,
    },
    signedMessage: string
}

export async function personalSign(client: SignClientV2, session: SessionTypes.Struct, address: string, sigMessage: string, _cptId: string, t: Function): Promise<DIDInfo | undefined> {


    // encode message (hex)
    const hexMsg = stringToHex(sigMessage);
    // personal_sign params

    const kycRequest: KycRequest = {
        cptId: _cptId,
        publicKey: "",
        needDataKey: ['englishName'],
    }

    const userInfoRequest: UserInfoRequest = {
        needDataKey: ["email", "firstName", "lastName"]
    }

    const params = [hexMsg, address, kycRequest, userInfoRequest];

    //请求签名
    printLog(["send req did-->", "topic=" + session!.topic, address, 'params--->', params])
    let signature: DIDResp | undefined
    try {
        signature = await client!.request<DIDResp>({
            topic: session!.topic,
            chainId: DEFAULT_CHAINIDS,
            request: {
                method: DEFAULT_EIP155_METHODS.PERSONAL_SIGN,
                params,
            },
        });
        if (!signature) {
            printLog(["授权失败：钱包返回数据为空"])
        }
    } catch (_error) {
        const errorResult = (_error as { code: number, message: string })
        printLog(["授权失败：", errorResult])
        ShowToast(t("auth_failed"), 6000)
        return;
    }

    printLog(["signature", signature])


    if (signature && signature.error && signature.error.code !== 0) {
        ShowToast(t("auth_failed"), 6000)
        printLog(["授权失败：", signature])
    }
    else {
        const didInfo: DIDInfo = {
            email: signature.userInfo.email,
            firstName: signature.userInfo.firstName,
            lastName: signature.userInfo.lastName
        }
        return didInfo;
    }

}