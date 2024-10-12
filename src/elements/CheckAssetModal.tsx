import React, { useEffect, useRef, useState } from 'react';
import { BaseModalStyle, ColumnCenterStyle, L2RStyle, LRSideStyle } from '../BaseStyle';
import AssetQRCode from './AssetQRCode';
import { AssetInfo } from '../api/AssetInfo';
import html2canvas from 'html2canvas';
import CachedImage from './CachedImage';
import { printLog } from '../context/LogTools';
import FoldWindowListener from './FoldWindowListener';

interface GetAssetsModalProps {
    //控件可能的参数
    style?: React.CSSProperties;
    assetInfo?: AssetInfo;
    onClose?: () => void
}

const CheckAssetModal: React.FC<GetAssetsModalProps> = ({ style, assetInfo, onClose }) => {

    const [isShowQRCode, setIsShowQRCode] = useState(false)

    const divRef = useRef<HTMLDivElement>(null);
    const savePic = () => {
        if (divRef.current) {
            // 使用 html2canvas 将 div 渲染为 canvas
            html2canvas(divRef.current, { backgroundColor: "#00000000" }).then((canvas) => {
                const image = canvas.toDataURL('image/png');
                // 创建一个临时链接用于下载图片
                const link = document.createElement('a');
                link.href = image;
                link.download = 'webank-ecc-ticket.png';
                link.click();
            });
        }
    }

    useEffect(() => {

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

    const [imageDiscDivStyle, setImageDiscDivStyle] = useState<React.CSSProperties>({ width: '80%', height: 'auto', ...ColumnCenterStyle })
    const [cancelImgStyle, setCancelImgStyle] = useState<React.CSSProperties>({ width: '10%', marginTop: '10%' })
    const onGetFoldWindow = (isFlod: boolean) => {
        if (isFlod) {
            setImageDiscDivStyle({ width: '50%', height: 'auto', ...ColumnCenterStyle })
            setCancelImgStyle({ width: '5%', marginTop: '5%' })
        }
    }

    return (
        // 这个图层需要阻断后面的事件监听
        <div style={{ ...style, ...BaseModalStyle, }}   >
            <FoldWindowListener onGetFoldWindow={onGetFoldWindow} />
            <div style={{ width: '100%', height: '100%', ...ColumnCenterStyle }}>
                {/* 图片+下面的描述 */}
                <div ref={divRef} style={imageDiscDivStyle}>
                    {isShowQRCode ?
                        <AssetQRCode style={{ width: '100%', height: 'auto' }} code={assetInfo ? (assetInfo.assetAddress + '@' + assetInfo.assetId) : ''} />
                        :
                        (assetInfo && <CachedImage src={assetInfo?.imageUrl} style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />)
                    }
                    <div style={{ width: '92%', padding: '4% 4% 4% 4%', height: 'auto', backgroundColor: 'white', borderRadius: '10px' }}>
                        <div style={{ ...LRSideStyle }}>
                            <div style={L2RStyle}>
                                <p style={{ margin: 0, fontSize: '85%', color: '#2DA1FF', whiteSpace: "nowrap" }}>Powered By FISCO BCOS</p>
                                <img src={process.env.PUBLIC_URL + '/icons/officer.svg'} style={{ marginLeft: '5%', width: '12%' }} />
                            </div>
                            <img src={process.env.PUBLIC_URL + (isShowQRCode ? '/icons/pic.svg' : '/icons/qrcode.svg')} style={{ width: '5%' }} onClick={() => setIsShowQRCode(!isShowQRCode)}></img>
                        </div>
                        <div style={L2RStyle}>
                            <h4 style={{ margin: "2.5% 0 0 0" }}>{assetInfo?.assetName}</h4>
                            {(assetInfo && assetInfo.writeOffStatus) && <img style={{ position: 'fixed', right: '15%', width: '25%', height: 'auto', }} src={process.env.PUBLIC_URL + '/icons/redeemed.png'} />}
                        </div>
                        <p style={{ fontSize: '85%', margin: "1.5% 0 0 0", color: '#8B93A4' }}>Owner &bull; {assetInfo?.assetOwnerUsername}</p>
                    </div>
                </div>
                {/* 叉叉按钮 */}
                <img src={process.env.PUBLIC_URL + '/icons/close.svg'} style={cancelImgStyle} onClick={onClose} />
            </div>
        </div>
    );
};

export default CheckAssetModal;