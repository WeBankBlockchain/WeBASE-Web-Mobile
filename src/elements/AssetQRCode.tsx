import { QRCodeCanvas } from "qrcode.react";
import { ColumnCenterStyle } from "../BaseStyle";
import FoldWindowListener from "./FoldWindowListener";
import { useState } from "react";

interface AssetQRCodeProps {
    //复制控件可能的参数
    style?: React.CSSProperties;
    code: string;
}

const AssetQRCode: React.FC<AssetQRCodeProps> = ({ style, code }) => {

    const [QRCodeCanvasStyle, setQRCodeCanvasStyle] = useState<React.CSSProperties>({ marginTop: '15%', position: 'absolute', width: '50%', height: 'auto', border: '10px solid #ffffff' })

    const onGetFoldWindow = (isFlod: boolean) => {
        if (isFlod) {
            setQRCodeCanvasStyle({ marginTop: '10%', position: 'absolute', width: '35%', height: 'auto' })
        }
    }

    return <div style={style} >
        <FoldWindowListener onGetFoldWindow={onGetFoldWindow} />
        <div style={{ width: '100%', height: 'auto', borderRadius: '10px', overflow: "hidden", ...ColumnCenterStyle }}>
            <img style={{ width: '100%', height: 'auto' }} src={process.env.PUBLIC_URL + '/icons/bak_qr.png'}></img>
            <QRCodeCanvas style={QRCodeCanvasStyle} value={code} />
        </div>
    </div>
}

export default AssetQRCode;