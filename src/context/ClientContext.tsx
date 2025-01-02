import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { printLog } from './LogTools'
import { RELAYER_EVENTSV2, SignClientV2 } from './SignClient'
import { createClient } from './ClientUtils'
import { GetJwt, JWTInfo } from '../api/GetJwt'
import { useTranslation } from "react-i18next";
import { BaseResp } from '../api/BaseResp'
import { ShowToast } from '../tools/CommonUtils'

interface IClientContext {
    currentClient: SignClientV2 | undefined
    currentJwt: JWTInfo | undefined
}

const ClientContext = createContext<IClientContext>({} as IClientContext)

export function useClientContext() {
    const context = useContext(ClientContext)
    if (context === undefined) {
        printLog('get client context error!!!')
    }
    return context
}

export function ClientContextProvider({ children }: { children: ReactNode | ReactNode[] }) {

    const { t } = useTranslation();

    const [currentClient, setCurrentClient] = useState<SignClientV2 | undefined>(undefined)
    const [currentJwt, setCurrentJwt] = useState<JWTInfo | undefined>(undefined)

    //无条件获取jwt
    useEffect(
        () => {
            printLog("do init conn")
            GetJwt(onGetJwt)
        }, []
    )

    //无条件解析JWT
    const onGetJwt = (resp: BaseResp<JWTInfo> | undefined) => {
        if (!resp?.success) {
            ShowToast(t("network_error"))
            //如果网络jwt解析失败，结束
            printLog("do init conn error::jwt failed!")
            return
        } else {
            printLog('start load jwt-->' + resp.data.jwt)
        }
        setCurrentJwt(resp.data)
    }

    //无条件init客户端
    useEffect(
        () => {
            if (currentJwt) {
                printLog('initClient')
                initClient(currentJwt)
            }
        },
        [currentJwt]
    )


    const initClient = useCallback(async (_jwt: JWTInfo) => {
        printLog('init client...')
        const _client = await createClient(_jwt)
        if (_client) {
            printLog('init client success!')
            //客户端初始化成功
            //注册client状态监听
            _client.core.relayer.on(RELAYER_EVENTSV2.connect, () => {
                printLog('Network connection is restored!')
            })
            _client.core.relayer.on(RELAYER_EVENTSV2.disconnect, () => {
                printLog('Network connection lost.')
            })
            //触发client后续行为
            setCurrentClient(_client)
        } else {
            printLog('init client failed!')
            //客户端初始化失败，连接错误
            ShowToast(t("wc_init_failed"))
            return
        }
    }, [])

    const value = useMemo(
        () => ({ currentClient, currentJwt }),
        [currentClient, currentJwt]
    )

    return <ClientContext.Provider value={{ ...value }}>{children}</ClientContext.Provider>
}


