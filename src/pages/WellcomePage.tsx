import { Button } from 'antd-mobile';
import GetAssetsModal from '../animate/GetAssetsModal';
import { BaseTitleStyle, ColumnStyle, MainPageFullScreenStyle } from '../BaseStyle';
import ListPage from './ListPage';
import { useEffect, useState } from 'react';
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
import { AssetInfo, getStdAssetInfo } from '../api/AssetInfo';
import GoBackListener from '../elements/GoBackListener';
import { GetToken, ShowToast, sleep } from '../tools/CommonUtils';
import { KeyFileList } from '../elements/KeyFileCache';
import { LoadImageWait, LoadAnimateWait } from '../elements/LocalCacher';
import NoticeModal from '../elements/NoticeModal';
import { MyAssetList } from '../api/MyAssetList';

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
     * 9：其他类型错误
     */
    const [currentGetAssetStatus, setCurrentGetAssetStatus] = useState(-1)

    const { doConncet, currentStatus } = useWCContext()
    const { currentJwt } = useClientContext()
    const { doLogoutMP } = useMPContext()

    // const [hasGetClick, setHasGetClick] = useState(false)
    function GetAssset() {

        const currentToken = GetToken();

        //如果没连接钱包，需要先连接钱包
        //连接钱包后会自动触发检测领取状态
        //    如果没有领取会自动触发领取
        //        如果领取失败，会弹出toast，此时需要重新点击领取按钮
        //        如果领取成功，自动进入详情页
        //    如果已领取会自动进入详情页
        // setHasGetClick(true)
        if (currentStatus !== CONN_STSTUS.connected) {
            doConncet();
            return;
        }
        if (currentGetAssetStatus === 4 && currentJwt && currentToken) {

            setCurrentGetAssetStatus(2);
            Receive(OnReceive, currentJwt?.tpProxyAddress, currentToken.token)

        }
        if ((currentGetAssetStatus === 5) && currentJwt && currentToken) {
            printLog("GoBack::To::detail")
            if (reviveAssetInfo) {
                navigate(`${process.env.PUBLIC_URL}/detail?assetAddress=${reviveAssetInfo.assetAddress}&assetId=${reviveAssetInfo.assetId}`);
            } else {
                navigate(`${process.env.PUBLIC_URL}/detail`)
            }
        }
        if (currentGetAssetStatus === 7) {
            //检查一下是否名下有门票
            if (currentToken && currentToken.token) {
                MyAssetList((resp: BaseResp<AssetInfo[]> | undefined) => {
                    if (resp && resp.data.length > 0) {
                        navigate(`${process.env.PUBLIC_URL}/detail`)
                    }
                }, currentToken.token);
            }
        }
    }


    useEffect(
        () => {

            const currentToken = GetToken();

            if (currentStatus === CONN_STSTUS.connected && currentJwt && currentToken) {
                printLog("try check AlreadyReceive")
                //如果已连接，则检查领取状态
                setCurrentGetAssetStatus(0);
                AlreadyReceive(OnAlreadyReceive, currentJwt?.tpProxyAddress, currentToken.token)
            }
        }, [currentStatus]
    )

    const OnAlreadyReceive = (resp: BaseResp<boolean> | undefined) => {
        if (resp?.code === 0) {
            //正常返回
            if (resp.data === true) {
                printLog("已领取")
                setCurrentGetAssetStatus(5);
            } else {
                printLog("未领取")
                setCurrentGetAssetStatus(1);
            }
        } else {
            if (resp?.code === 103732601) {
                printLog("活动结束")
                setCurrentGetAssetStatus(6);
            } else if (resp?.code === 103732602) {
                setCurrentNotice('Admission Tickets have all been claimed')
                printLog("售完")
                setCurrentGetAssetStatus(7);
            } else if (resp?.code === 103732600) {
                printLog("活动未开始")
                setCurrentGetAssetStatus(8);
            } else {
                printLog("其他错误")
                setCurrentGetAssetStatus(9);
            }
        }
    }

    const [isDisConnBackFromDetail, setDisConnBackFromDetail] = useState(false)
    function onGoBack(currentPath: string, lastPath: string): void {
        if ((currentPath === process.env.PUBLIC_URL || currentPath === (process.env.PUBLIC_URL + "/")) && (lastPath === process.env.PUBLIC_URL + "/detail/" || lastPath === process.env.PUBLIC_URL + "/detail")) {
            setDisConnBackFromDetail(true);
            printLog("welcome goback-->true")
        } else {
            setDisConnBackFromDetail(false);
            printLog("welcome goback-->false")
        }

    }

    useEffect(
        () => {

            const currentToken = GetToken();

            if (currentGetAssetStatus === 1 && currentJwt && currentToken) {
                //如果未领取状态点击，则领取
                setCurrentGetAssetStatus(2);
                Receive(OnReceive, currentJwt?.tpProxyAddress, currentToken.token)
            }

            //如果门票已领完
            if (currentGetAssetStatus === 7) {
                printLog(["goto detail-->", "7-isBackFromDetail=" + isDisConnBackFromDetail])
                //如果是从详情页退回
                if (isDisConnBackFromDetail) {
                    return;
                }


                //检查一下是否名下有门票
                if (currentToken && currentToken.token) {
                    MyAssetList((resp: BaseResp<AssetInfo[]> | undefined) => {
                        if (resp && resp.data.length > 0) {
                            navigate(`${process.env.PUBLIC_URL}/detail`)
                        }
                    }, currentToken.token);
                }
            }

            //如果已经领取
            if (currentGetAssetStatus === 5) {
                //跳转详情页
                printLog(["goto detail-->", "5-isBackFromDetail=" + isDisConnBackFromDetail])
                //如果是从详情页退回
                if (isDisConnBackFromDetail) {
                    return;
                }

                //如果用户还没有主动点击界面
                // if (!hasGetClick) {
                //     printLog(["goto detail-->", "hasGetClick-->" + hasGetClick])
                //     return;
                // }

                //如果不是从详情页退回，并且领取成功（即初次领取）
                if (reviveAssetInfo) {
                    navigate(`${process.env.PUBLIC_URL}/detail?assetAddress=${reviveAssetInfo.assetAddress}&assetId=${reviveAssetInfo.assetId}`);
                }
                //直接进入详情页
                else {
                    navigate(`${process.env.PUBLIC_URL}/detail`)
                }
            }
            if (currentGetAssetStatus === 4) {
                ShowToast(t("recive_failed"))
            }
            if (currentGetAssetStatus === 9) {
                doLogoutMP()
                setCurrentGetAssetStatus(-1)
            }


        }, [currentGetAssetStatus]
    )

    const [reviveAssetInfo, setReciveAssetInfo] = useState<AssetInfo | undefined>(undefined)
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
            await LoadImageWait(resp.data.imageUrl, 5000)
            printLog("cache::ass----end")
            printLog("cache::finish")
            //缓冲完毕
            setCurrentGetAssetStatus(3);
            setReciveAssetInfo(getStdAssetInfo(resp.data))
        } else {
            setCurrentGetAssetStatus(4);
        }
    }

    const navigate = useNavigate();
    function onAccpet(): void {
        if (reviveAssetInfo) {
            //已收下
            setCurrentGetAssetStatus(5);
        }
    }

    const [currentNotice, setCurrentNotice] = useState<string | undefined>(undefined)


    const { t } = useTranslation();

    return (
        <div style={MainPageFullScreenStyle}>
            <GoBackListener onGoBack={onGoBack} />
            {currentNotice && <NoticeModal disc={currentNotice} onClose={() => { setCurrentNotice(undefined) }} />}
            {currentGetAssetStatus === 2 && <GenAssetsModal />}
            {reviveAssetInfo && <GetAssetsModal style={{ display: currentGetAssetStatus === 3 ? 'block' : 'none' }} onAccpet={onAccpet} imageUrl={reviveAssetInfo.imageUrl} />}
            <div style={{ ...ColumnStyle, margin: '4%', width: '92%', height: 'auto' }} >
                <img src={process.env.PUBLIC_URL + '/icons/main.png'} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                <Button loading={currentGetAssetStatus === 0 || currentStatus === CONN_STSTUS.connInit || currentStatus === CONN_STSTUS.conning} loadingText={t("loading")}
                    style={{
                        position: 'absolute', marginTop: '106%', width: '50%', height: '10%',
                        backgroundImage: (currentGetAssetStatus === 6 || currentGetAssetStatus === 7 || currentGetAssetStatus === 8 || currentGetAssetStatus === 9) ? `url(${process.env.PUBLIC_URL}/icons/enter-error.png)` : `url(${process.env.PUBLIC_URL}/icons/enter.png)`,
                        backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundColor: '#ffffff00', backgroundPosition: 'center',
                        border: 'none', fontWeight: 'bold', fontSize: '130%',
                        color: (currentGetAssetStatus === 6 || currentGetAssetStatus === 7 || currentGetAssetStatus === 8 || currentGetAssetStatus === 9) ? '#ADB4C1' : '#3E0000',
                    }}
                    onClick={GetAssset} >
                    {currentGetAssetStatus === 6 ? t('ecc_end') : (currentGetAssetStatus === 7 ? t("ecc_finished") : (currentGetAssetStatus === 8 ? t("ecc_notstart") : t("start")))}
                </Button>
            </div>
            <p style={{ marginLeft: '4%', marginTop: '3%', ...BaseTitleStyle }}>{t("others")}</p>
            <ListPage style={{ width: '100%' }} isAllData={true} onAItemClick={(assert) => {
                navigate(`${process.env.PUBLIC_URL}/detail?assetAddress=${assert.assetAddress}&assetId=${assert.assetId}`);
            }} />
        </div>
    );
}

export default WellcomePage;
