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
import { AssetInfo, getStdAssetInfo } from "../api/AssetInfo";
import { BaseResp } from "../api/BaseResp";
import { useMPContext } from "../context/MPContext";
import { printLog } from "../context/LogTools";
import GoBackListener from "../elements/GoBackListener";
import CachedImage from "../elements/CachedImage";
import { GetToken } from "../tools/CommonUtils";
import { MyAssetList } from "../api/MyAssetList";
import { Detail } from "../api/Detail";
import { useWCContext } from "../context/WCContext";
import { CONN_STSTUS } from "../context/Const";

const NoPadButton = styled(Button)`
    padding: 0px;
    border-width: 0px;
`;
//todo 宽屏
//todo 已核销样式  详情页返回  copy失败
function DetialPage() {


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

    //从当前assetAddress和assetId获取刷新依据
    const searchParams = new URLSearchParams(window.location.search);

    const [currentAssetInfo, setCurrentAssetInfo] = useState<AssetInfo | undefined>(undefined)

    //根据请求参数，重新刷新界面（回退时候用到。前进时候只需要setCurrentAssetInfo，所以无需刷新）
    useEffect(
        () => {
            if (!currentAssetInfo) {

                const assetAddress = searchParams.get('assetAddress');
                const assetId = searchParams.get('assetId');
                printLog(["back load", assetAddress, assetId])

                if (assetAddress && assetId) {
                    Detail((resp: BaseResp<AssetInfo> | undefined) => {
                        if (resp?.code !== 0) {
                            //加载详情失败（todo）
                        } else {
                            setCurrentAssetInfo(resp.data)
                        }
                    }, assetAddress, assetId)
                } else {
                    const currentToken = GetToken();
                    if (currentToken && currentToken.token) {
                        MyAssetList(OnMyAssetList, currentToken.token);
                    } else {
                        navigate(process.env.PUBLIC_URL + '/', { replace: true });
                    }

                }
            }
        }, []
    )

    const { currentAccount } = useMPContext()
    const { currentStatus } = useWCContext()

    const OnMyAssetList = (resp: BaseResp<AssetInfo[]> | undefined) => {
        printLog(["加载详情成功:", resp?.data])
        resp && setCurrentAssetInfo(getStdAssetInfo(resp.data[0]));
    }

    const [currentSelectIndex, setCurrentSelectIndex] = useState(1)

    const [isShowCheckPic, setIsShowCheckPic] = useState(false)

    const { t } = useTranslation();


    useEffect(
        () => {
            window.scrollTo(0, 0)
            setCurrentSelectIndex(1)
        }, [currentAssetInfo]
    )
    const navigate = useNavigate();


    return (

        <div style={{ ...MainPageFullScreenStyle }} >
            <GoBackListener />
            {isShowCheckPic && <CheckAssetModal assetInfo={currentAssetInfo} onClose={() => setIsShowCheckPic(false)} />}
            {/* 最顶部的连接 */}
            <Connect style={UpDownStyle} />
            {/* 最底部的按钮 */}
            {(currentAssetInfo && currentAssetInfo.assetOwner === currentAccount && currentStatus === CONN_STSTUS.connected) &&
                <div style={{ position: "fixed", bottom: '0%', width: '100%', height: 'auto', ...CenterStyle, zIndex: 10 }}>
                    <img style={{ width: '50%', height: 'auto' }} src={process.env.PUBLIC_URL + '/icons/ticket.png'} onClick={() => { setIsShowCheckPic(true); MyAssetList(OnMyAssetList, GetToken().token); }} />
                </div>}
            {/* 中间的详情 */}
            <div style={{ ...UpDownStyle, marginTop: '2%' }}>
                <div style={{ width: '100%', height: 'auto', ...ColumnCenterStyle }}>
                    <div style={{ width: '100%', ...ColumnStyle }}>
                        <img style={{ width: '100%', height: 'auto' }} src={process.env.PUBLIC_URL + '/icons/detial_up.svg'}></img>
                        {currentAssetInfo && <CachedImage src={currentAssetInfo.imageUrl} style={{ position: 'absolute', marginTop: '10%', width: '70%', height: 'auto', borderRadius: '5px' }} className="detial-aminate" />}
                        <img style={{ position: 'absolute', marginTop: '48%', width: '100%', height: 'auto' }} src={process.env.PUBLIC_URL + '/icons/detial_down.svg'}></img>
                        <div style={{ ...ColumnStyle, marginTop: '-15%' }}>
                            <div style={L2RStyle}>
                                <p style={{ margin: 0, fontSize: '12px', color: '#2DA1FF', whiteSpace: "nowrap" }}>Powered By FISCO BCOS</p>
                                <img src={process.env.PUBLIC_URL + '/icons/officer.svg'} style={{ marginLeft: '5%', width: '12%' }} />
                            </div>
                            {currentAssetInfo && <p style={{ fontWeight: 550, fontSize: '20px', margin: '4% 0 2% 0' }}>{currentAssetInfo.assetName}</p>}
                            <p style={{ margin: '1% 0 1.5% 0', fontSize: '12px', color: '#414C63' }}>An exclusive, one-time access pass to ECC, available only</p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#414C63' }}>to invited guests. Walk-ins are not permitted.</p>
                        </div>

                    </div>

                    <div style={{ ...L2RStyle, width: '100%', height: 'auto', marginTop: '5%' }}>
                        <div style={{ ...ColumnCenterStyle, marginLeft: '5%' }}>
                            <NoPadButton style={{ fontSize: '15px', fontWeight: currentSelectIndex === 1 ? 550 : undefined, color: currentSelectIndex === 1 ? '#414C63' : '#0F121E' }} onClick={() => { setCurrentSelectIndex(1) }}>Asset Details</NoPadButton>
                            <div style={{ marginTop: '5px', background: currentSelectIndex === 1 ? '#0F121E' : '#FFFFFF', height: '5px', width: '20px' }} />
                        </div>
                        <div style={{ ...ColumnCenterStyle, marginLeft: '5%' }}>
                            <NoPadButton style={{ fontSize: '15px', fontWeight: currentSelectIndex === 2 ? 550 : undefined, color: currentSelectIndex === 2 ? '#414C63' : '#0F121E' }} onClick={() => { setCurrentSelectIndex(2) }}>Transaction Activity</NoPadButton>
                            <div style={{ marginTop: '5px', background: currentSelectIndex === 2 ? '#0F121E' : '#FFFFFF', height: '5px', width: '20px' }} />
                        </div>
                    </div>
                </div>
                <div style={{ height: '1px', width: '100%', backgroundImage: `url(${process.env.PUBLIC_URL}/icons/line.svg)` }} />
            </div>
            {currentSelectIndex === 1 ?
                currentAssetInfo && <AssetDetial style={{ width: '92%', padding: '3% 4% 3% 4%' }} assetInfo={currentAssetInfo} />
                :
                (currentAssetInfo && <TranxRecords style={{ width: '92%', padding: '0 4% 3% 4%' }} currentAssetInfo={currentAssetInfo} />)
            }

            <p style={{ ...BaseTitleStyle, color: '#0F121E', marginLeft: '5%' }}>{t("others")}</p>

            <ListPage isAllData={false} onAItemClick={(assert) => {
                //记录历史栈，回退使用
                navigate(`${process.env.PUBLIC_URL}/detail?assetAddress=${assert.assetAddress}&assetId=${assert.assetId}`);
                setCurrentAssetInfo(assert)
            }} />
        </div>
    )
}

export default DetialPage;