import { AssetInfo } from "../api/AssetInfo";
import { L2RStyle, LRSideStyle } from "../BaseStyle";
import { getStdAddress } from "../tools/StringTools";
import CopyClipboard from "./CopyClipboard";

interface AssetDetialProps {
    //控件可能的参数
    style?: React.CSSProperties;
    assetInfo: AssetInfo;
}

const titleStype: React.CSSProperties = { color: '#414C63', fontSize: '13px' }
const valueStype: React.CSSProperties = { color: '#0F121E', fontSize: '13px' }
const InfoItemStyle: React.CSSProperties = { ...LRSideStyle, marginLeft: '3%', marginRight: '3%' }


const AssetDetial: React.FC<AssetDetialProps> = ({ style, assetInfo }) => {

    return (<div style={style}>
        <div style={{ width: '100%', height: 'auto', background: '#F6F7F9', borderRadius: '5px' }}>
            <div style={InfoItemStyle}>
                <p style={titleStype}>Owner</p>
                <div style={L2RStyle}>
                    <p style={valueStype}> {assetInfo.assetOwnerUsername} </p><CopyClipboard copyStr={assetInfo.assetOwnerUsername} />
                </div>
            </div>
            <div style={InfoItemStyle}>
                <p style={titleStype}>Creator</p>
                <div style={L2RStyle}><p style={valueStype}>{getStdAddress(assetInfo.assetCreator)}</p><CopyClipboard copyStr={assetInfo.assetCreator} /></div>
            </div>
            <div style={InfoItemStyle}>
                <p style={titleStype}>Contract Address</p>
                <div style={L2RStyle}><p style={valueStype}>{getStdAddress(assetInfo.assetAddress)}</p><CopyClipboard copyStr={assetInfo.assetAddress} /></div>
            </div>
            <div style={InfoItemStyle}>
                <p style={titleStype}>Network</p>
                <p style={valueStype}>{'FISCO BCOS'}</p>
            </div>
            <div style={InfoItemStyle}>
                <p style={titleStype}>Asset ID</p>
                <div style={L2RStyle}><p style={valueStype}>{assetInfo.assetId}</p><CopyClipboard copyStr={assetInfo.assetId + ''} /></div>
            </div>
            <div style={InfoItemStyle}>
                <p style={titleStype}>Asset Standard</p>
                <div style={L2RStyle}><p style={valueStype}>{721}</p></div>
            </div>
        </div>
    </div>)
}

export default AssetDetial;
