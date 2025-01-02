import React, { useEffect, useRef, useState } from 'react';
import { BaseModalStyle, ColumnCenterStyle, L2RStyle, LRSideStyle } from '../BaseStyle';
import AssetQRCode from './AssetQRCode';
import { AssetInfo, getStdAssetName } from '../api/AssetInfo';
import html2canvas from 'html2canvas';
import CachedImage from './CachedImage';
import { printLog } from '../context/LogTools';
import FoldWindowListener from './FoldWindowListener';
import { GetToken, ShowToast } from '../tools/CommonUtils';
import { GetWriteOffInfo, WriteOffInfo } from '../api/GetWriteOffInfo';
import { BaseResp } from '../api/BaseResp';
import { Loading, Button, Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next';
import { getQRCode, getStdID, getStdAddress } from '../tools/StringTools';
import { QRCodeCanvas } from "qrcode.react";
import useLongPress from './useLongPress'
import { padZero } from '../tools/index'

interface GetAssetsModalProps {
    //控件可能的参数
    style?: React.CSSProperties;
    assetInfo?: AssetInfo;
    onClose?: () => void
}

const CheckAssetModal: React.FC<GetAssetsModalProps> = ({ style, assetInfo, onClose }) => {
    const { t } = useTranslation();
    const [isShowQRCode, setIsShowQRCode] = useState(false)


    const divRef = useRef<HTMLDivElement>(null);

    const saveLock = useRef(false)
    const savePic = () => {
        console.log('click save pic');
        if (divRef.current) {
            if(saveLock.current)return
            saveLock.current = true 

            // 使用 html2canvas 将 div 渲染为 canvas
            // html2canvas(divRef.current, { backgroundColor: "#00000000" }).then((canvas) => {
            //     console.log('canvas',canvas);
            //     const image = canvas.toDataURL('image/png');
            //     // 创建一个临时链接用于下载图片
            //     const link = document.createElement('a');
            //     link.href = image;
            //     link.download = 'webank-ecc-ticket.png';
            //     link.click();
            //     console.log('download success');

            // });


            try{
                html2canvas(divRef.current, { backgroundColor: "#00000000" }).then((canvas) => {
                    console.log('canvas1', canvas);
                    // 获取data URL形式的Base64编码图像数据
                    const dataURL = canvas.toDataURL('image/png');
    
    
                    if (window.ReactNativeWebView) {
                        // 将图片 URL 传递给 React Native
                        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'saveImage', url: dataURL }));
                        // Toast.show(t('image_saved'))
                        saveLock.current = false
                    } else {
    
                        const link = document.createElement('a');
                        link.href = dataURL;
                        link.download = 'webank-ecc-ticket.png';
                        link.click();
                        console.log('download success');
                        Toast.show(t('image_saved'))
                        saveLock.current = false
                    }
                });

            }catch(e){
                console.log('save image fail', e);
                
                // Toast.show('Save image fail')
                saveLock.current = false
            }

        }
    }

    const longPressEventHandlers = useLongPress(savePic)





    useEffect(() => {

        printLog("init CheckAssetModal-->" + (assetInfo ? assetInfo.writeOffStatus : 'undefined'))

        const currentToken = GetToken();
        if (!assetInfo || !currentToken) {
            printLog(["open show failed", assetInfo, currentToken])
            onClose && onClose();
            return
        }

        // //如果没有核销，请求随机数
        // if (!assetInfo.writeOffStatus) {
        //     setLoading(true)
        //     GetWriteOffInfo((WriteOffInfoResp: BaseResp<WriteOffInfo> | undefined) => {
        //         setLoading(false)
        //         if (!WriteOffInfoResp) {
        //             ShowToast(t("network_error"))
        //             onClose && onClose();
        //             return
        //         }

        //         //todo mock 需要移除
        //         //WriteOffInfoResp.code = 103722607

        //         if (WriteOffInfoResp.code === 0 && WriteOffInfoResp.data.contractIndex) {
        //             setCurrentWriteOffInfo(WriteOffInfoResp.data)
        //             return
        //         }

        //         if (WriteOffInfoResp.code === 103722605) {
        //             //如果已核销
        //             setCurrentWriteOffStr(getStdID(assetInfo.assetId))
        //             return
        //         } else if (WriteOffInfoResp.code === 103722203) {
        //             ShowToast("上架中的票券不可核销哦")
        //         } else if (WriteOffInfoResp.code === 103722607) {
        //             ShowToast("核销失败：该票券不属于您哦")
        //         } else {
        //             ShowToast("核销失败：票券状态异常")
        //         }
        //         onClose && onClose();

        //     }, assetInfo.assetAddress, assetInfo.assetId + '', currentToken.token)
        // } else {
        //     //如果已核销
        //     printLog("init turnto done")
        //     setCurrentWriteOffStr(getStdID(assetInfo.assetId))
        // }

        printLog("init turnto done")
        setCurrentWriteOffStr(getStdID(assetInfo.assetId))

        const handleTouchMove = (e: any) => {
            e.preventDefault(); // 阻止默认的触摸滚动行为
        };

        printLog("touchmove::addEventListener")
        document.addEventListener('touchmove', handleTouchMove, { passive: false });


        // Cleanup on component unmount
        return () => {
            printLog("touchmove::removeEventListener")
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    const [currentWriteOffInfo, setCurrentWriteOffInfo] = useState<WriteOffInfo | undefined>(undefined)
    useEffect(() => {
        if (currentWriteOffInfo && assetInfo) {
            setCurrentWriteOffStr(currentWriteOffInfo.contractIndex + getStdID(assetInfo.assetId) + "-" + currentWriteOffInfo.secret);
        }

    }, [currentWriteOffInfo]);




    const [imageDiscDivStyle, setImageDiscDivStyle] = useState<React.CSSProperties>({ width: '90%', height: 'auto', position: 'relative', ...ColumnCenterStyle })
    const [cancelImgStyle, setCancelImgStyle] = useState<React.CSSProperties>({ width: '36px', height: '36px', position: 'absolute',top: '-52px', right: '0'})
    const onGetFoldWindow = (isFlod: boolean) => {
        if (isFlod) {
            setImageDiscDivStyle({ width: '50%', height: 'auto',position: 'relative', ...ColumnCenterStyle })
            // setCancelImgStyle({ width: '5%', marginTop: '5%' })
        }
    }

    const [loading, setLoading] = useState(false)
    const [currentWriteOffStr, setCurrentWriteOffStr] = useState<string | undefined>(undefined)

    const onSwitchClick = () => {
        if (currentWriteOffInfo) {
            setIsShowQRCode(!isShowQRCode)
        } else {
            ShowToast("本门票已核销")
        }

    }

    return (
        // 这个图层需要阻断后面的事件监听
        <div style={{ ...style, ...BaseModalStyle, }}   >
            <FoldWindowListener onGetFoldWindow={onGetFoldWindow} />
            {loading ? <div style={{ width: '100%', height: '100%', ...ColumnCenterStyle }}><Loading /></div> :
                <div style={{ width: '100%', height: '100%', ...ColumnCenterStyle }}  className='unselectable'>
                    {/* 叉叉按钮 */}
                    {/* <img src={process.env.PUBLIC_URL + '/icons/close.svg'} style={cancelImgStyle} onClick={onClose} /> */}
                    {/* 图片+下面的描述 */}
                    <div ref={divRef} style={imageDiscDivStyle}>
                          {/* 叉叉按钮 */}
                        <img src={process.env.PUBLIC_URL + '/icons/close.svg'} style={cancelImgStyle} onClick={onClose} />
                        {isShowQRCode ?
                            (currentWriteOffInfo && <AssetQRCode style={{ width: '100%', height: 'auto' }} code={getQRCode(currentWriteOffInfo)} />)
                            :
                            (assetInfo && <CachedImage src={assetInfo?.imageUrl} style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />)
                        }
                        <div style={{ width: '100%', padding: '12px', height: 'auto', backgroundColor: 'white', borderRadius: '10px', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{flex: 1}}>

                                {
                                    assetInfo && 
                                    <div style={{ fontSize: '13px', fontWeight: '500', lineHeight: '24px', color: '#0F121E' }}>
                                        {/* {`${assetInfo?.assetName}`} */}
                                        {getStdAssetName(assetInfo)}
                                    </div> 
                                }
                                <div style={{ fontSize: '12px', lineHeight: '20px', color: '#8B93A4', marginTop: '8px' }}>
                                    {t('Contract Address')}: {getStdAddress(assetInfo?.assetAddress)}
                                </div>
                                <div style={{ fontSize: '12px', lineHeight: '20px', color: '#8B93A4', marginTop: '2px' }}>
                                    {t('asset_id')}: {padZero((assetInfo?.assetId as number))}
                                    
                                </div>
                            </div>
                            <div style={{ width: '70px', height: '70px', border: '1px solid #DCDFE5', boxSizing: 'border-box', padding: '4px' }}>
                                {/* <img src={process.env.PUBLIC_URL + (isShowQRCode ? '/icons/pic.svg' : '/icons/qrcode.svg')} style={{ width: '100%' }} onClick={() => onSwitchClick()}></img> */}
                                <QRCodeCanvas style={{ width: '100%', height: '100%' }} value={window.location.href} />
                            </div>



                            {/* <div style={{ ...LRSideStyle }}>
                                <div style={L2RStyle}>
                                    <p style={{ margin: 0, fontSize: '85%', color: '#2DA1FF', whiteSpace: "nowrap" }}>Powered By Weco</p>
                                    <img src={process.env.PUBLIC_URL + '/icons/officer.svg'} style={{ marginLeft: '5%', width: '12%' }} />
                                </div>
                                <img src={process.env.PUBLIC_URL + (isShowQRCode ? '/icons/pic.svg' : '/icons/qrcode.svg')} style={{ width: '5%' }} onClick={() => onSwitchClick()}></img>
                            </div>
                            <div style={L2RStyle}>
                                <h4 style={{ margin: "2.5% 0 0 0" }}>{currentWriteOffStr}</h4>
                                {(assetInfo && assetInfo.writeOffStatus) && <img style={{ position: 'fixed', paddingTop: '3%', right: '15%', width: '18%', height: 'auto', pointerEvents: 'none' }} src={process.env.PUBLIC_URL + '/icons/redeemed.png'} />}
                            </div>
                          
                            <p style={{ fontSize: '85%', margin: "1.5% 0 0 0", color: '#8B93A4' }}>{assetInfo?.assetName}</p> */}
                        </div>
                    </div>

                    {/* <div style={{ fontSize: '16px', fontWeight: '500', lineHeight: '22px', color: '#FFFFFF', marginTop: '24px' }}>Press and hold to save image</div> */}
                    <div style={{
                        width: '180px',
                        height: '50px',
                        backgroundImage: `url(${process.env.PUBLIC_URL}/icons/save-btn-bg2.png)`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',

                        display: 'flex',
                        justifyContent: 'center',

                        boxSizing: 'border-box',
                        padding: '0',
                        marginTop: '24px'
                    }}>

                        <div style={{ display: 'flex', alignItems: 'center', padding: '0 0 2px' }} onClick={savePic}>
                            <img style={{ width: '20px', height: '20px', marginRight: '4px' }} src={process.env.PUBLIC_URL + '/icons/save-down-icon.svg'} alt="" />
                            <div
                                style={{
                                    fontSize: '14px',
                                    lineHeight: '22px',
                                    color: '#FFFFFF'
                                }}>{t('save_image')}</div>

                        </div>

                    </div>
                </div>
            }
        </div>

    );
};

export default CheckAssetModal;