import { useNavigate } from "react-router-dom";
import ListPage from "./ListPage";
import { BaseTitleStyle, CenterStyle, ColumnCenterStyle, ColumnStyle, L2RStyle, MainPageFullScreenStyle, UpDownStyle } from "../BaseStyle";
import { Button } from "antd-mobile";
import styled from 'styled-components';
import { useEffect, useState } from "react";
import AssetDetial from "../elements/AssetDetial";
import TranxRecords from "../elements/TranxRecords";
import Connect from "../elements/Connect";
import '../animate/AssetsDetial.css'
import { useTranslation } from "react-i18next";
import CheckAssetModal from "../elements/CheckAssetModal";
import { AssetInfo, getStdAssetName } from "../api/AssetInfo";
import { BaseResp } from "../api/BaseResp";
import { useMPContext } from "../context/MPContext";
import { printLog } from "../context/LogTools";
import CachedImage from "../elements/CachedImage";
import { GetToken, ShowToast } from "../tools/CommonUtils";
import { Detail } from "../api/Detail";
import { useWCContext } from "../context/WCContext";
import { CONN_STSTUS, lastAddress } from "../context/Const";
import { StringEqual } from "../tools/StringTools";
import { MyAssetList } from "../api/MyAssetList";
import { useClientContext } from "../context/ClientContext";
import VideoPlayer from '../elements/VideoPlayer'
import RulesCollapse from '../elements/RulesCollapse'
import { isBeanbag } from "../tools"



const NoPadButton = styled(Button)`
    padding: 0px;
    border-width: 0px;
`;

function DetialPage() {

    const { currentJwt } = useClientContext()

    //从当前assetAddress和assetId获取刷新依据
    const searchParams = new URLSearchParams(window.location.search);
    const assetAddress = searchParams.get('assetAddress');
    const assetId = searchParams.get('assetId');
    useEffect(
        () => {
            printLog(["run detail useEffect-->", assetAddress, assetId])
            loadDetail()
        }, [assetAddress, assetId]
    )


    const loadDetail = () => {
        const currentToken = GetToken();


        if (assetAddress && assetId) {
            printLog("get detial-->" + assetAddress + "-->" + assetId)
            Detail(OnDetail, assetAddress, assetId, currentToken?.token || '')
        } else {
            //不带参，领取成功直接直接进入

            const lastAddressVal = currentJwt ? currentJwt.openTicketAddress : localStorage.getItem(lastAddress)
            printLog(["get detial with token", currentToken, currentJwt, lastAddressVal])
            if (currentToken && currentToken.token && lastAddressVal) {
                MyAssetList(OnMyAssetList, lastAddressVal, currentToken.token);
            } else {
                doLogoutMP()
                ShowToast(t('network_error'))
            }
        }
    }

    const OnMyAssetList = (resp: BaseResp<AssetInfo[]> | undefined) => {
        printLog(["加载详情成功:", resp?.data])
        if (resp && resp.data.length > 0) {
            //更新水印
            setCurrentAssetInfo(resp.data[0]);
            localStorage.setItem(lastAddress, resp.data[0].assetAddress)
        } else {
            if(resp?.code === 103732003){
                doLogoutMP()
            }
            // ShowToast("页面加载失败，请刷新页面")
            ShowToast(resp?.message || t('network_error'))
        }
    }

    const { currentAccount, doLogoutMP } = useMPContext()
    const OnDetail = (resp: BaseResp<AssetInfo> | undefined) => {
        if (resp?.code !== 0) {
            if(resp?.code === 103732003){
                doLogoutMP()
            }
            // ShowToast("页面加载失败，请刷新页面")
            ShowToast(resp?.message || t('network_error'))


        } else {
            //todo mock 需移除
            //resp.data.writeOffStatus = true
            setCurrentAssetInfo(resp.data)
        }
    }

    
    //绑定回退重新刷新界面事件
    useEffect(() => {
        printLog(["current account=" + currentAccount])
        const handlePopState = () => {
            window.location.reload(); // 强制刷新页面
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);


    const [currentAssetInfo, setCurrentAssetInfo] = useState<AssetInfo | undefined>(undefined)
    const [currentSelectIndex, setCurrentSelectIndex] = useState(1)
    useEffect(
        () => {
            window.scrollTo(0, 0)
            setCurrentSelectIndex(1)
            printLog(['currentAssetInfo', currentAssetInfo],)
        }, [currentAssetInfo]
    )


    const [isShowCheckPic, setIsShowCheckModal] = useState(false)
    const onShowTicketClick = () => {
        const currentToken = GetToken();

        currentAssetInfo && Detail(OnDetail, currentAssetInfo.assetAddress, currentAssetInfo.assetId + '', currentToken?.token)
        setIsShowCheckModal(true);
    }
    const { currentStatus } = useWCContext()

    useEffect(() => {
        // 有连接成功的翻转时，当前detail如果无数据，重新触发detail请求
        if(currentStatus && currentStatus === CONN_STSTUS.connected){
            if(!currentAssetInfo){
                loadDetail()
            }
        }

    },[currentStatus])

    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div style={{ ...MainPageFullScreenStyle }} >
            {isShowCheckPic && <CheckAssetModal assetInfo={currentAssetInfo} onClose={() => setIsShowCheckModal(false)} />}
            {/* 最顶部的连接 */}
            {
                isBeanbag() && <Connect style={UpDownStyle} />
            }
            
            {/* 最底部的按钮 */}
            {/* {(currentAssetInfo && currentAccount && StringEqual(currentAssetInfo.assetOwner, currentAccount) && currentStatus === CONN_STSTUS.connected) &&
                <div style={{ position: "fixed", bottom: '0%', width: '100%', height: 'auto', ...CenterStyle, zIndex: 10 }}>
                    <img style={{ width: '50%', height: 'auto' }} src={process.env.PUBLIC_URL + '/icons/ticket.png'} onClick={() => onShowTicketClick()} />
                </div>} */}
            {
                (currentAssetInfo && currentAccount && StringEqual(currentAssetInfo.assetOwner, currentAccount) && currentStatus === CONN_STSTUS.connected) &&
                <div
                    style={{
                        height: '44px',
                        background: 'linear-gradient(155deg, #39A6FF 0%, #066EE4 100%)',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        borderRadius: '22px',
                        position: 'fixed',
                        bottom: '45px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        boxSizing: 'border-box',
                        padding: '10px 30px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0 2px 0px #066EE4, 2px 2px 0px #066EE4'
                    }}
                    onClick={() => onShowTicketClick()}>
                    <div style={{ marginRight: '12px', fontSize: '14px', lineHeight: '22px', color: '#FFFFFF', fontFamily: 'PingFangSC-Regular, PingFang SC' }}>{t('share')}</div>
                    <img style={{ width: '20px', height: '20px' }} src={process.env.PUBLIC_URL + '/icons/arrow-right.svg'} alt="" />
                </div>
            }

            {/* 中间的详情 */}
            <div style={{ ...UpDownStyle }}>
                <div style={{ width: '100%', height: 'auto', ...ColumnCenterStyle }}>
                    <div style={{ width: '100%', background: 'linear-gradient(196deg, #E0EFFF 0%, #FFFFFF 100%)', ...ColumnStyle, }}>
                        {/* <div style={{width: '100%',height: 'auto', maxHeight: 'calc(468px * 1.1)', backgroundImage: 'linear-gradient(196deg, #E0EFFF 0%, #FFFFFF 100%);'}}>
                            <img style={{ width: '100%', height: 'calc(468px * 1.1)', objectFit: 'fill' }} src={process.env.PUBLIC_URL + '/icons/detial_up.svg'}></img>

                        </div> */}

                        {currentAssetInfo && <VideoPlayer placeholderImage={currentAssetInfo?.imageUrl} videoKey={currentAssetInfo?.imageInfo} style={{ position: 'absolute', marginTop: '5vh', width: '70%', height: 'auto', borderRadius: '5px' }} />}
                        {/* {currentAssetInfo && <CachedImage src={currentAssetInfo?.imageUrl} style={{ position: 'absolute', marginTop: '5vh', width: '64vw',maxWidth: 'calc(468px * 0.64)', height: 'auto', borderRadius: '5px' }} className="detial-aminate" />} */}
                        <img style={{ marginTop: '23vh', width: '100%', maxWidth: '468px', height: 'auto' }} src={process.env.PUBLIC_URL + '/icons/detail_down.png'}></img>
                    </div>
                    <div style={{ ...ColumnStyle, marginTop: '0%' }}>
                        {
                            currentAssetInfo && (
                                <div style={{ maxWidth: '92%', fontWeight: 600, fontSize: '20px', lineHeight: '28px', textAlign: "center", marginTop: '9px', marginBottom: '4px' }}>
                                    {getStdAssetName(currentAssetInfo)}
                                </div>
                            )
                        }
                        <div style={{ maxWidth: '92%', fontSize: '12px', lineHeight: '20px', color: '#414C63', textAlign: "center" }}>
                            {currentAssetInfo?.assetDesc}
                        </div>
                    </div>


                    <div style={{ ...L2RStyle, width: '100%', height: 'auto', marginTop: '24px' }}>
                        <div style={{ ...ColumnCenterStyle, marginLeft: '16px' }}>
                            <NoPadButton style={{ fontSize: '15px', fontWeight: currentSelectIndex === 1 ? 550 : undefined, color: currentSelectIndex === 1 ? '#414C63' : '#0F121E' }} onClick={() => { setCurrentSelectIndex(1) }}>{t("asset_details")}</NoPadButton>
                            <div style={{ marginTop: '5px', background: currentSelectIndex === 1 ? '#0F121E' : '#FFFFFF', height: '5px', width: '20px' }} />
                        </div>
                        <div style={{ ...ColumnCenterStyle, marginLeft: '32px' }}>
                            <NoPadButton style={{ fontSize: '15px', fontWeight: currentSelectIndex === 2 ? 550 : undefined, color: currentSelectIndex === 2 ? '#414C63' : '#0F121E' }} onClick={() => { setCurrentSelectIndex(2) }}>{t("transactions")}</NoPadButton>
                            <div style={{ marginTop: '5px', background: currentSelectIndex === 2 ? '#0F121E' : '#FFFFFF', height: '5px', width: '20px' }} />
                        </div>
                    </div>
                </div>
                <div style={{ height: '1px', width: '100%', backgroundImage: `url(${process.env.PUBLIC_URL}/icons/line.svg)` }} />
            </div>
            {currentSelectIndex === 1 ?
                currentAssetInfo && <AssetDetial style={{ width: '100',boxSizing: 'border-box', padding: '24px 16px 16px' }} assetInfo={currentAssetInfo} />
                :
                (currentAssetInfo && <TranxRecords style={{ width: '100',boxSizing: 'border-box', padding: '24px 16px 16px' }} currentAssetInfo={currentAssetInfo} />)
            }


            <RulesCollapse />

            {/* <p style={{ ...BaseTitleStyle, color: '#0F121E', marginLeft: '5%' }}>{t("others")}</p>
            {currentAssetInfo && <ListPage currentAsssetId={currentAssetInfo.assetId + ''} onAItemClick={(assert) => {
                navigate(`${process.env.PUBLIC_URL}/detail?assetAddress=${assert.assetAddress}&assetId=${assert.assetId}`);
            }} />} */}
        </div>

    )
}

export default DetialPage;