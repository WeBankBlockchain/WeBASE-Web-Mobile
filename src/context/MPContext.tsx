import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { printLog } from './LogTools'
import { CONN_STSTUS, isDID, tokenkey, WCTimeout, } from './Const'
import { useWCContext } from './WCContext'
import { GenToken, TokenInfo } from '../api/GenToken'
import { useTranslation } from "react-i18next";
import { BaseResp } from '../api/BaseResp'
import { useClientContext } from './ClientContext'
import { withTimeout } from './Timeout'
import { DIDInfo, personalSign } from './RPCUtils'
import { ShowToast } from '../tools/CommonUtils'


interface IMPContext {
    currentAccount: string | undefined
    doLogoutMP: () => void
    currentDID: DIDInfo | undefined
}

const MPContext = createContext<IMPContext>({} as IMPContext)

export function useMPContext() {
    const context = useContext(MPContext)
    if (context === undefined) {
        printLog('get client context error!!!')
    }
    return context
}

export function MPContextProvider({ children }: { children: ReactNode | ReactNode[] }) {

    const { currentSession, currentStatus, setCurrentStatus, doLogoutSession } = useWCContext()
    const [currentAccount, setCurrentAccount] = useState<string | undefined>(undefined)
    const [currentDID, setCurrentDID] = useState<DIDInfo | undefined>(undefined)
    const { currentClient, currentJwt } = useClientContext()

    const { t } = useTranslation();

    useEffect(
        () => {
            printLog(['currentSession changed', currentSession ? true : false])
            if (!currentSession) {
                return;
            }
            const lastToken = localStorage.getItem(tokenkey)
            const currentAdds = currentSession.accounts[0]?.split(':')[2]
            setCurrentAccount(currentAdds)
            if (lastToken) {
                printLog("token::setCurrentToken")
                setCurrentStatus(CONN_STSTUS.connected)
            }
            else {
                if (isDID) {
                    //请求DID唯一理由就是获取Token
                    doSignDid()
                } else {
                    //香港ECC门票项目没有DID环节
                    GenToken({ userAddress: currentAdds, salt: ('' + Date.now()), englishName: "" }, OnPostToken);
                }
            }

        },
        [currentSession]
    )

    const doSignDid = async () => {

        if (!currentSession || !currentJwt) {
            printLog(['currentSession or currentJwt undef'])
            return;
        }

        try {
            printLog('Start doSignDid::topic-->' + currentSession.session.topic);
            const didInfo: DIDInfo | undefined = await withTimeout(personalSign(currentClient!, currentSession.session!, currentSession.accounts[0]?.split(':')[2], t("did_note"), currentJwt?.cptId, t), WCTimeout)
            printLog(["try did", didInfo])
            if (didInfo) {
                setCurrentDID(didInfo)
                return;
            } else {
                printLog('doSignDid error');
                ShowToast(t("kyc_failed"))
                setCurrentStatus(CONN_STSTUS.connectError)
                return;
            }

        } catch (error) {
            printLog('doSignDid timed out');
            ShowToast(t("kyc_timeout"))
            setCurrentStatus(CONN_STSTUS.connectError)
        };
    }

    useEffect(() => {
        if (currentSession && currentDID) {
            const currentAdds = currentSession.accounts[0]?.split(':')[2]
            GenToken({ userAddress: currentAdds, salt: ('' + Date.now()), englishName: (currentDID.firstName + " " + currentDID.lastName) }, OnPostToken);
        }
    }, [currentDID])


    // 错误情况清除WC状态
    useEffect(() => {
        if (currentStatus === CONN_STSTUS.connectError) {
            doLogoutMP()
        }
    }, [currentStatus])

    const OnPostToken = (resp: BaseResp<TokenInfo> | undefined) => {

        if (!resp || !resp.success || !currentSession) {
            ShowToast(t("network_error"))
            setCurrentStatus(CONN_STSTUS.connectError)
            return
        }

        localStorage.setItem(tokenkey, resp.data.token)
        printLog("token::OnPostToken")
        setCurrentStatus(CONN_STSTUS.connected)
    }

    const doLogoutMP = () => {
        printLog("token::doLogoutMP")
        setCurrentAccount(undefined)
        setCurrentStatus(CONN_STSTUS.noConn)
        localStorage.removeItem(tokenkey)
        doLogoutSession()
    }

    const value = useMemo(
        () => ({ currentAccount, doLogoutMP, currentDID }),
        [currentAccount, doLogoutMP, currentDID]
    )

    return <MPContext.Provider value={{ ...value }}>{children}</MPContext.Provider>
}