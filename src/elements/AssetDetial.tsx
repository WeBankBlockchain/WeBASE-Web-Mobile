import { useTranslation } from "react-i18next";
import { AssetInfo } from "../api/AssetInfo";
import { L2RStyle, LRSideStyle } from "../BaseStyle";
import { getMastName, getStdAddress } from "../tools/StringTools";
import CopyClipboard from "./CopyClipboard";
import { padZero } from '../tools/index'

interface AssetDetialProps {
    //控件可能的参数
    style?: React.CSSProperties;
    assetInfo: AssetInfo;
}

const titleStype: React.CSSProperties = { color: '#414C63', fontSize: '13px' }
const valueStype: React.CSSProperties = { color: '#0F121E', fontSize: '13px' }
const InfoItemStyle: React.CSSProperties = { ...LRSideStyle, marginLeft: '3%', marginRight: '3%' }

const AssetDetial: React.FC<AssetDetialProps> = ({ style, assetInfo }) => {
    const { t } = useTranslation();
    return (<div style={style}>
        <div style={{ width: '100%', height: 'auto', background: '#F6F7F9', borderRadius: '5px' }}>
            <div style={InfoItemStyle}>
                <p style={titleStype}>{t('owner')}</p>
                <p style={valueStype}> {getMastName(assetInfo.assetOwnerUsername)} </p>
            </div>
            <div style={InfoItemStyle}>
                <p style={titleStype}>{t('creator')}</p>
                <div style={L2RStyle}><p style={valueStype}>{getStdAddress(assetInfo.assetCreator)}</p><CopyClipboard copyStr={assetInfo.assetCreator} /></div>
            </div>
            <div style={InfoItemStyle}>
                <p style={titleStype}>{t('contract_address')}</p>
                <div style={L2RStyle}><p style={valueStype}>{getStdAddress(assetInfo.assetAddress)}</p><CopyClipboard copyStr={assetInfo.assetAddress} /></div>
            </div>
            <div style={InfoItemStyle}>
                <p style={titleStype}>{t('network')}</p>
                <p style={valueStype}>{assetInfo?.network}</p>
            </div>
            <div style={InfoItemStyle}>
                <p style={titleStype}>{t('asset_id')}</p>
                <div style={L2RStyle}><p style={valueStype}>{padZero(assetInfo.assetId)}</p><CopyClipboard copyStr={assetInfo.assetId + ''} /></div>
            </div>
            <div style={InfoItemStyle}>
                <p style={titleStype}>{t('asset_standard')}</p>
                <div style={L2RStyle}><p style={valueStype}>{721}</p></div>
            </div>
        </div>
    </div>)
}

export default AssetDetial;
