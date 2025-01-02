import { Button, Dialog, Input } from 'antd-mobile';
import GetAssetsModal from '../animate/GetAssetsModal';
import { BaseTitleStyle, ColumnStyle, MainPageFullScreenStyle } from '../BaseStyle';
import ListPage from './ListPage';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { useWCContext } from '../context/WCContext';
import { CONN_STSTUS } from '../context/Const';
import { printLog } from '../context/LogTools';
import { useMPContext } from '../context/MPContext';
import GenAssetsModal from '../animate/GenAssetsModal';
import { useNavigate } from 'react-router-dom';
import { useClientContext } from '../context/ClientContext';
import { AlreadyReceive } from '../api/AlreadyReceive';
import { BaseResp } from '../api/BaseResp';
import { Receive } from '../api/Receive';
import { AssetInfo } from '../api/AssetInfo';
import { GetToken, ShowToast } from '../tools/CommonUtils';
import { KeyFileList } from '../elements/KeyFileCache';
import { LoadImageWait, LoadAnimateWait } from '../elements/LocalCacher';
import NoticeModal from '../elements/NoticeModal';
import { MyAssetList } from '../api/MyAssetList';
import InviteCodeDialog from '../elements/InviteCodeDialog';
import RulesDialog from '../elements/RulesDialog'
import { isBeanbag } from '../tools/index' 


import { WellcomePageBox } from './WellcomePageStyle'


export const autoEnter = { isAuto: true }

function WellcomePage() {
    /**
     * -1：初始状态
     * 0：请求中
     * 1：未领取
     * 2：领取中
     * 3：领取成功
     * 4：领取失败
     * 5：已领取（已收下）
     * 6：活动结束
     * 7：门票已领完
     * 8：活动未开始
     * 9：非白名单用户
     * 10：用户其他地址已领取
     * 11：其他类型错误
     */

    const RECIVE_STATUS = {
        Init: -1,
        Loading: 0,
        NotRecived: 1,
        Reciving: 2,
        ReciveSuccess: 3,
        ReciveFailed: 4,
        Recived: 5,
        ActivityEnd: 6,
        OutOfRecive: 7,
        ActivityNotStart: 8,
        NotWhiteUser: 9,
        UerRecived: 10,
        OtherReciveError: 11,
    } as const;

    const [currentGetAssetStatus, setCurrentGetAssetStatus] = useState<number>(RECIVE_STATUS.Init)

    const { doConncet, currentStatus } = useWCContext()
    const { currentJwt } = useClientContext()
    const { doLogoutMP } = useMPContext()

    const [showInviteCodeDialog, setShowInviteCodeDialog] = useState(false)
    const [inviteCodeDialogBtnLoading, setInviteCodeDialogBtnLoading] = useState<boolean>(false)
    const inviteCode = useRef<string>('')

    const [showRulesDialog, setShowRulesDialog] = useState<boolean>(false)


    const onOkCodeDialog = (resp: any) => {

        onCloseCodeDialog()
        OnReceive(resp)

        GetAssset()
    }

    const onCancelCodeDialog = () => {
        setCurrentGetAssetStatus(RECIVE_STATUS.NotRecived)
        onCloseCodeDialog()
    }
    const onCloseCodeDialog = () => {
        setShowInviteCodeDialog(false)
        setInviteCodeDialogBtnLoading(false)
        inviteCode.current = ''
    }




    function GetAssset() {
        if(!isBeanbag()){
            // 非目标环境
            ShowToast(t("not_target_env"), 5 * 1000)
            return 
        }

        const currentToken = GetToken();

        //如果没连接钱包，需要先连接钱包
        //连接钱包后会自动触发检测领取状态
        //    如果没有领取会自动触发领取
        //        如果领取失败，会弹出toast，此时需要重新点击领取按钮
        //        如果领取成功，自动进入详情页
        //    如果已领取会自动进入详情页
        if (currentStatus !== CONN_STSTUS.connected) {
            doConncet();
            return;
        }
        console.log('status', currentGetAssetStatus);

        // 未领取1
        if (currentGetAssetStatus === RECIVE_STATUS.NotRecived && currentJwt && currentToken) {
            setCurrentGetAssetStatus(RECIVE_STATUS.Reciving);
            setShowInviteCodeDialog(true)
            return
        }

        // 领取失败4
        if (currentGetAssetStatus === RECIVE_STATUS.ReciveFailed && currentJwt && currentToken) {
            setCurrentGetAssetStatus(RECIVE_STATUS.Reciving);
            setShowInviteCodeDialog(true)
            return
            // setCurrentGetAssetStatus(RECIVE_STATUS.Reciving);
            // Receive(OnReceive, currentJwt?.openTicketAddress, currentToken.token,)

        }


        // 已领取5
        if ((currentGetAssetStatus === RECIVE_STATUS.Recived) && currentJwt && currentToken) {
            if (reciveAssetInfo) {
                goToDetail(reciveAssetInfo.assetAddress, reciveAssetInfo.assetId)
            } else {
                // navigate(`${process.env.PUBLIC_URL}/detail`)
                MyAssetList((resp: BaseResp<AssetInfo[]> | undefined) => {
                    if (resp && resp.data.length > 0) {
                        goToDetail(resp.data[0]?.assetAddress, resp.data[0].assetId)
                    }
                }, currentJwt ? currentJwt.openTicketAddress : '', currentToken.token);
            }
        }

        // 门票已领完了7
        if (currentGetAssetStatus === RECIVE_STATUS.OutOfRecive) {
            //检查一下是否名下有门票
            if (currentToken && currentToken.token) {
                getMyAssets()
            }
        }
    }


    useEffect(
        () => {
            const currentToken = GetToken();
            if (currentStatus === CONN_STSTUS.connected && currentJwt && currentToken) {
                printLog("try check AlreadyReceive")
                //如果已连接，则检查领取状态
                setCurrentGetAssetStatus(RECIVE_STATUS.Loading);
                AlreadyReceive(OnAlreadyReceive, currentJwt?.openTicketAddress, currentToken.token)
            }
        }, [currentStatus]
    )

    const OnAlreadyReceive = (resp: BaseResp<boolean> | undefined) => {
        if (resp?.code === 0) {
            //正常返回
            // 临时修改
            if (resp.data === true) {
                printLog("已领取")
                setCurrentGetAssetStatus(RECIVE_STATUS.Recived);
            } else {
                printLog("未领取")
                setCurrentGetAssetStatus(RECIVE_STATUS.NotRecived);
            }
        } else {
            if (resp?.code === 103732601 || resp?.code === 103722601) {
                printLog("活动结束")
                setCurrentGetAssetStatus(RECIVE_STATUS.ActivityEnd);
            } else if (resp?.code === 103732602 || resp?.code === 103722602) {
                setCurrentNotice(resp?.message)
                // setCurrentNotice('本次ECC参观门票已领完')
                printLog("售完")
                setCurrentGetAssetStatus(RECIVE_STATUS.OutOfRecive);
            } else if (resp?.code === 103732600 || resp?.code === 103722600) {
                printLog("活动未开始")
                setCurrentGetAssetStatus(RECIVE_STATUS.ActivityNotStart);
            } else if (resp?.code === 103722651) {
                printLog("非白名单用户")
                setCurrentNotice(resp?.message)
                // setCurrentNotice('本次门票仅限特邀嘉宾领取哦')
                setCurrentGetAssetStatus(RECIVE_STATUS.NotWhiteUser);
            } else if (resp?.code === 103722609) {
                printLog("其他地址领取")
                setCurrentNotice(resp?.message)
                // setCurrentNotice('本次ECC门票限每人领取1张哦')
                setCurrentGetAssetStatus(RECIVE_STATUS.UerRecived);
            }
            else {
                printLog("其他错误")
                setCurrentGetAssetStatus(RECIVE_STATUS.OtherReciveError);
            }
        }
    }

    useEffect(
        () => {
            console.log('status change', currentGetAssetStatus);
            const isActiveAuto = sessionStorage.getItem('isActiveAuto');
            console.log('isActiveAuto',isActiveAuto);
            

            const currentToken = GetToken();

            // 未领取1
            if (currentGetAssetStatus === RECIVE_STATUS.NotRecived && currentJwt && currentToken) {
                if(isActiveAuto !== 'done'){
                    setCurrentGetAssetStatus(RECIVE_STATUS.Reciving)
                    setShowInviteCodeDialog(true)
                    // autoEnter.isAuto = false
                    setActiveAuto()
                }
                //如果未领取状态点击，则领取
                // setCurrentGetAssetStatus(RECIVE_STATUS.Reciving);
                // Receive(OnReceive, currentJwt?.openTicketAddress, currentToken.token, inviteCode.current)
            }

            //如果门票已领完7
            if (currentGetAssetStatus === RECIVE_STATUS.OutOfRecive) {



                if (isActiveAuto !== 'done') {
                    //检查一下是否名下有门票
                    if (currentToken && currentToken.token) {
                        getMyAssets()
                    }
                    // autoEnter.isAuto = false
                    setActiveAuto()
                }

            }

            // 如果已经领取5
            if (currentGetAssetStatus === RECIVE_STATUS.Recived) {
                // 增加邀请码一环，这里暂不用isAuto来限制，
                // 避免未领取 isAuto 弹窗解压码，领取后 无法跳转
                if (isActiveAuto !== 'done') {
                    //跳转详情页
                    if (reciveAssetInfo) {
                        goToDetail(reciveAssetInfo.assetAddress, reciveAssetInfo.assetId)
                    }
                    //直接进入详情页
                    else {
                        getMyAssets()
                    }
                    // autoEnter.isAuto = false
                    setActiveAuto()
                }

            }
            // 领取失败4
            if (currentGetAssetStatus === RECIVE_STATUS.ReciveFailed) {
                ShowToast(t("recive_failed"))
            }
            if (currentGetAssetStatus === RECIVE_STATUS.OtherReciveError) {
                doLogoutMP()
                setCurrentGetAssetStatus(RECIVE_STATUS.Init)
            }


        }, [currentGetAssetStatus]
    )

    const [reciveAssetInfo, setReciveAssetInfo] = useState<AssetInfo | undefined>(undefined)
    const OnReceive = async (resp: BaseResp<AssetInfo> | undefined) => {
        if (resp?.code === 0) {
            //缓冲资源
            printLog("cache::key----start")
            await LoadImageWait(KeyFileList[0])
            await LoadImageWait(KeyFileList[1])
            await LoadImageWait(KeyFileList[2])
            await LoadAnimateWait(KeyFileList[3])
            printLog("cache::key----end")
            //缓冲图片
            printLog("cache::ass----start")
            await LoadImageWait(resp.data?.imageUrl, 5000)
            printLog("cache::ass----end")
            printLog("cache::finish")
            //缓冲完毕
            setCurrentGetAssetStatus(RECIVE_STATUS.ReciveSuccess);
            setReciveAssetInfo(resp.data)
        } else {
            setCurrentGetAssetStatus(RECIVE_STATUS.ReciveFailed);
        }
    }

    const navigate = useNavigate();
    function onAccpet(): void {
        if (reciveAssetInfo) {
            //已收下
            setCurrentGetAssetStatus(RECIVE_STATUS.Recived);
            getMyAssets()
        }
    }

    const [currentNotice, setCurrentNotice] = useState<string | undefined>(undefined)


    const getMyAssets = () => {
        const currentToken = GetToken();
        MyAssetList((resp: BaseResp<AssetInfo[]> | undefined) => {
            if (resp && resp.data?.length > 0) {
                goToDetail(resp.data[0]?.assetAddress, resp.data[0].assetId)
            }
        }, currentJwt ? currentJwt.openTicketAddress : '', currentToken.token);
    }

    const setActiveAuto = () => {
        // 首次访问自动激活领取和跳转 ，记录激活状态，避免返回时自动循环到详情页
        sessionStorage.setItem('isActiveAuto', 'done');
    }

    const goToDetail = (address: string, id: number) => {
        setActiveAuto()
        navigate(`${process.env.PUBLIC_URL}/detail?assetAddress=${address}&assetId=${id}`)
    }


    const { t } = useTranslation();

    return (
        <>

            <WellcomePageBox >
                <Button className='rules-btn' onClick={() => setShowRulesDialog(true)}>{t('event_rules')}</Button>

                {currentNotice && <NoticeModal disc={currentNotice} onClose={() => { setCurrentNotice(undefined) }} />}
                {currentGetAssetStatus === RECIVE_STATUS.Reciving && <GenAssetsModal />}
                {reciveAssetInfo && <GetAssetsModal style={{ display: currentGetAssetStatus === RECIVE_STATUS.ReciveSuccess ? 'block' : 'none' }} onAccpet={onAccpet} imageUrl={reciveAssetInfo?.imageUrl} />}



                <Button
                    block
                    loading={
                        currentGetAssetStatus === RECIVE_STATUS.Loading
                        || currentStatus === CONN_STSTUS.connInit
                        || currentStatus === CONN_STSTUS.conning
                    }
                    loadingText={t("loading")}
                    className='claim-btn'
                    onClick={GetAssset} >
                    {currentGetAssetStatus === RECIVE_STATUS.ActivityEnd
                        ? t('ecc_end')
                        : (
                            currentGetAssetStatus === RECIVE_STATUS.OutOfRecive
                                ? t("ecc_finished")
                                : (
                                    currentGetAssetStatus === RECIVE_STATUS.ActivityNotStart
                                        ? t("ecc_notstart")
                                        : t("start")
                                )
                        )
                    }
                </Button>

                {/* <Button loading={currentGetAssetStatus === RECIVE_STATUS.Loading || currentStatus === CONN_STSTUS.connInit || currentStatus === CONN_STSTUS.conning} loadingText={t("loading")}
                style={{
                    position: 'absolute', marginTop: '106%', width: '50%', height: '10%',
                    backgroundImage: (currentGetAssetStatus === RECIVE_STATUS.ActivityEnd || currentGetAssetStatus === RECIVE_STATUS.OutOfRecive || currentGetAssetStatus === RECIVE_STATUS.ActivityNotStart || currentGetAssetStatus === RECIVE_STATUS.NotWhiteUser || currentGetAssetStatus === RECIVE_STATUS.UerRecived || currentGetAssetStatus === RECIVE_STATUS.OtherReciveError) ? `url(${process.env.PUBLIC_URL}/icons/enter-error.png)` : `url(${process.env.PUBLIC_URL}/icons/enter.png)`,
                    backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundColor: '#ffffff00', backgroundPosition: 'center',
                    border: 'none', fontWeight: 'bold', fontSize: '130%',
                    color: (currentGetAssetStatus === RECIVE_STATUS.ActivityEnd || currentGetAssetStatus === RECIVE_STATUS.OutOfRecive || currentGetAssetStatus === RECIVE_STATUS.ActivityNotStart || currentGetAssetStatus === RECIVE_STATUS.NotWhiteUser || currentGetAssetStatus === RECIVE_STATUS.UerRecived || currentGetAssetStatus === RECIVE_STATUS.OtherReciveError) ? '#ADB4C1' : '#3E0000',
                }}
                onClick={GetAssset} >
                {currentGetAssetStatus === RECIVE_STATUS.ActivityEnd ? t('ecc_end') : (currentGetAssetStatus === RECIVE_STATUS.OutOfRecive ? t("ecc_finished") : (currentGetAssetStatus === RECIVE_STATUS.ActivityNotStart ? t("ecc_notstart") : t("start")))}
            </Button> */}


            </WellcomePageBox>

            <InviteCodeDialog
                show={showInviteCodeDialog}
                loading={inviteCodeDialogBtnLoading}
                onOk={onOkCodeDialog}
                onCancel={onCancelCodeDialog}
            />

            <RulesDialog show={showRulesDialog} onClose={() => setShowRulesDialog(false)} />
        </>
    );
}

export default WellcomePage;
