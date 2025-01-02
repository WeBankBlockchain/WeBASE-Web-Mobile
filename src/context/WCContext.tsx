import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import { printLog } from './LogTools'
import { connect } from './ClientUtils'
import { disConn, getLastSession, getSessionData, SessionData } from './SessionUtils'
import { useClientContext } from './ClientContext'
import { CONN_STSTUS, WCTimeout, tokenkey } from './Const'
import { checkIsTimeout, withTimeout } from './Timeout'
import { useTranslation } from "react-i18next";
import { ShowToast } from '../tools/CommonUtils'
import { Modal, Dialog } from 'antd-mobile'
import { QRCodeCanvas } from "qrcode.react";


interface IWCContext {
    currentSession: SessionData | undefined
    currentStatus: number //0-未连接，1-连接初始化,2-连接中，3-连接成功，4-连接失败
    setCurrentStatus: Dispatch<SetStateAction<number>>
    doLogoutSession: () => void
    doConncet: () => void
}

const WCContext = createContext<IWCContext>({} as IWCContext)

export function useWCContext() {
    const context = useContext(WCContext)
    if (context === undefined) {
        printLog('get client context error!!!')
    }
    return context
}


export function WCContextProvider({ children }: { children: ReactNode | ReactNode[] }) {

    const searchParams = new URLSearchParams(window.location.search);
    const currentAccountAddress = searchParams.get('currentAccountAddress');

    const { currentClient, currentJwt } = useClientContext()
    const [currentSession, setCurrentSession] = useState<SessionData>()
    const [currentStatus, setCurrentStatus] = useState<number>(0)

    const { t } = useTranslation();

    //无条件拿上一个session
    useEffect(() => {

        printLog(["currentClient changed", currentClient ? true : false, "currentAccountAddress-->", currentAccountAddress])

        if (!currentClient) {
            printLog(["no conn in session"])
            setCurrentStatus(CONN_STSTUS.noConn)
            return;
        }

        setCurrentStatus(CONN_STSTUS.connInit)
        let _sessionData = getLastSession(currentClient)

        if (!_sessionData) {
            //如果上一个session不可用，则直接回到未连接状态
            printLog("do init conn error::last session cannot use!")
            setCurrentStatus(CONN_STSTUS.noConn)
            return
        }

        // 12.30方案改为直接断开链接
        if (currentAccountAddress && !_sessionData.accounts?.[0]?.includes(currentAccountAddress)) {
            //连接状态不一致
            // ShowToast(t('addressDiffer'))
            console.log('Confirmed')
            printLog(['currentAccountAddress differ',currentAccountAddress, _sessionData?.accounts[0]])
            // disConn(currentClient, _sessionData)
            // setCurrentStatus(CONN_STSTUS.connectError)
            doLogoutSession()
            localStorage.removeItem(tokenkey)
            return 
        }


        //如果上一个session有用的话，检测session可用性
        printLog("do ping topic-->" + _sessionData.session.topic)
        withTimeout(currentClient.ping({ topic: _sessionData.session.topic }), WCTimeout).then(
            (isSuccess) => {
                printLog(["do init conn ping success", isSuccess])
                setCurrentSession(_sessionData)
                setCurrentStatus(CONN_STSTUS.conning)

                // if (currentAccountAddress && !_sessionData?.accounts?.[0]?.includes(currentAccountAddress)) {
                //     //连接状态不一致
                //     // ShowToast(t('addressDiffer'))
                //     Dialog.confirm({
                //         content: t('addressDiffer'),
                //         confirmText: t('confirm'),
                //         onConfirm: () => {
                //             console.log('Confirmed')
                //             printLog(['currentAccountAddress differ',currentAccountAddress, _sessionData?.accounts[0]])
                //             // disConn(currentClient, _sessionData)
                //             // setCurrentStatus(CONN_STSTUS.connectError)
                //             doLogoutSession()
                //             localStorage.removeItem(tokenkey)
                //         },
                //         cancelText: t('cancel'),
                //         onCancel: () => {
                //             console.log('Canceled')
                //         }
                //     })
                    
                // }
            }
        ).catch(
            (exp) => {
                //如果上一个session不可用，则直接回到未连接状态
                printLog(["do init conn error::last session ping timeout", exp])
                disConn(currentClient, _sessionData)
                //setCurrentStatus(CONN_STSTUS.noConn)
                setCurrentStatus(CONN_STSTUS.connectError)
            }
        );

    }, [currentClient])

    //用户点击链接
    const doConncet = async () => {

        printLog("doConncet")

        //如果当前Client不可用，什么也不做
        if (!currentClient || !currentJwt) {
            ShowToast(t("wc_init"))
            printLog(['currentClient undef'])
            return;
        }

        if (currentSession) {
            //如果连接已在线，不重新申请连接
            printLog("conn is running!!!")
            return;
        }

        //如果正在检测上一个连接是否可用（ping），或者连接中，不重复连接
        //如果已经连上，也不能重复连接
        if (currentStatus === CONN_STSTUS.connInit || currentStatus === CONN_STSTUS.conning || currentStatus === CONN_STSTUS.connected) {
            printLog("doConncet-->init or conning")
            return;
        }

        setCurrentStatus(CONN_STSTUS.connInit)
        try {
            const connectResult = await withTimeout(connect(currentClient, (uri) => {
                const schemeUrl = currentJwt.schemeUrl + 'wcUrl=' + uri
                printLog(['调用scheme::schemeUrl', schemeUrl])


                // 发布前删除
                // Modal.show({
                //     content:  <QRCodeCanvas style={{width: '300px', height: '300px'}}  value={uri} />,
                //     closeOnMaskClick: true,
                //     afterShow: () => {
                //         setTimeout(() => {
                //             Modal.clear()
                //         }, WCTimeout * 2)
                //     }
                // })

                window.location.href = schemeUrl
            }), WCTimeout * 2)//todo 需要改回来
            if (connectResult) {
                const _sessionData = getSessionData(connectResult.session)
                setCurrentStatus(CONN_STSTUS.conning)
                setCurrentSession(_sessionData)
                return
            } else {
                printLog(['get url error:', connectResult])
                ShowToast(t("wc_deny"))
                setCurrentStatus(CONN_STSTUS.noConn)
                return
            }
        } catch (error) {
            printLog(['调用scheme超时！！！', error])
            if (checkIsTimeout(error)) {
                ShowToast(t("wc_timeout"))
            } else {
                ShowToast(t("network_error"))
            }
            setCurrentStatus(CONN_STSTUS.noConn)
            return;
        }
    }

    const doLogoutSession = () => {
        setCurrentStatus(CONN_STSTUS.noConn)
        disConn(currentClient, currentSession)
        setCurrentSession(undefined)
    }

    const value = useMemo(
        () => ({ currentSession, currentStatus, setCurrentStatus, doLogoutSession, doConncet }),
        [currentSession, currentStatus, setCurrentStatus, doLogoutSession, doConncet]
    )

    return <WCContext.Provider value={{ ...value }}>{children}</WCContext.Provider>
}