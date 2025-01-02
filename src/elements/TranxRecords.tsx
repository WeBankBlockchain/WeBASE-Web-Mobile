import { List } from "antd-mobile";
import { useEffect, useState } from "react";
import { CenterStyle, L2RStyle, LRSideStyle } from "../BaseStyle";
import { getStdAddress } from "../tools/StringTools";
import { AssetInfo } from "../api/AssetInfo";
import { TransList } from "../api/TransList";
import { TranxInfo } from "../api/TranxInfo";
import { BaseResp } from "../api/BaseResp";
import { printLog } from "../context/LogTools";
import { formatTimestamp, GetToken } from "../tools/CommonUtils";
import CopyClipboard from "./CopyClipboard";
import { useTranslation } from "react-i18next";

interface TranxRecordsProps {
    //页面选择控件可能的参数
    style?: React.CSSProperties;
    currentAssetInfo: AssetInfo;
}


interface TranxItem {
    id: string,
    title: string,
    img: string,
    date: string,
    from?: string,
    to?: string,
    hash?: string,
    sponsor?: string
}

const TranxRecords: React.FC<TranxRecordsProps> = ({ style, currentAssetInfo }) => {



    useEffect(
        () => {
            //加载新数据
            printLog("TranxRecords-->load data")
            const currentToken = GetToken();
            if (currentAssetInfo) {
                TransList(OnTransList, currentAssetInfo.assetAddress, currentAssetInfo.assetId + '', currentToken ? currentToken.token : undefined)
            }
        }, []
    )

    const [tranxList, setTranxList] = useState<TranxItem[]>([])

    const [loadingText, setLoadingText] = useState('loading...')

    const { t } = useTranslation();

    const OnTransList = (resp: BaseResp<TranxInfo[]> | undefined) => {
        if (resp) {
            const list: TranxItem[] = []
            if (resp.data.length < 1) {
                setLoadingText("no more data")
                return;
            }
            for (let i = 0; i < resp.data.length; i++) {

                const item = resp.data[i]

                //todo mock 需去掉
                //item.transType = 5

                if (item.transType === 1) {
                    list.push({
                        id: item.txHash,
                        title: t('mint'),
                        img: process.env.PUBLIC_URL + '/icons/forging.svg',
                        date: formatTimestamp(item.txTime),
                        from: item.fromAddress,
                        to: item.toAddress
                    })
                }
                if (item.transType === 2) {
                    list.push({
                        id: item.txHash,
                        title: t('listing'),
                        img: process.env.PUBLIC_URL + '/icons/listing.svg',
                        date: formatTimestamp(item.txTime),
                        from: item.fromAddress,
                    })
                }
                //领取
                if (item.transType === 3) {
                    list.push({
                        id: item.txHash,
                        title: t('claim'),
                        img: process.env.PUBLIC_URL + '/icons/deal.svg',
                        date: formatTimestamp(item.txTime),
                        from: item.fromAddress,
                        to: item.toAddress,
                        hash: item.txHash

                    })
                }
                //核销
                if (item.transType === 4) {
                    list.push({
                        id: item.txHash,
                        title: t('redemption'),
                        img: process.env.PUBLIC_URL + '/icons/writeOff.svg',
                        date: formatTimestamp(item.txTime),
                        sponsor: item.fromAddress
                    })
                }
                //分发
                if (item.transType === 5) {
                    list.push({

                        id: item.txHash,
                        title: t('distb'),
                        img: process.env.PUBLIC_URL + '/icons/deal.svg',
                        date: formatTimestamp(item.txTime),
                        from: item.fromAddress,
                        to: item.toAddress,
                        hash: item.txHash

                    
                    })
                }
            }
            setTranxList(list)
        } else {
            printLog(["加载交易细节失败", resp])
            setLoadingText("no more data")
        }

    }

    function handItemClick(item: TranxItem): void {

    }

    return (
        <div style={style}>
            <List>
                {(tranxList && tranxList.length > 0) ? (
                    tranxList.map((item, index) => (
                        <List.Item style={TranxItemStyle} key={index} >
                            <div style={{ height: 'auto', width: '100%' }}>
                                <div style={{ border: '0.5px solid #DCDFE5', borderRadius: '10px' }}>
                                    <div style={{ ...L2RStyle, background: '#F6F7F9', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                                        <img src={item.img} style={{ width: '24px', height: '24px', marginLeft: '12px' }} />
                                        <p style={{ marginLeft: '8px', color: '#0F121E', fontSize: '14px', fontWeight: "bold" }}>{item.title}</p>
                                    </div>
                                    <div style={{ ...InfoItemStyle, marginTop: '2%' }}>
                                        <p style={InfoStyle}>{t('date')}</p>
                                        <p style={InfoStyle}>{item.date}</p>
                                    </div>
                                    {item.sponsor ? <div style={InfoItemStyle}>
                                        <p style={InfoStyle}>{t('initiator')}</p>
                                        <div style={L2RStyle}><p style={InfoStyle}>{getStdAddress(item.sponsor)}</p><CopyClipboard copyStr={item.sponsor} /></div>
                                    </div> : <></>}
                                    {item.hash ? <div style={InfoItemStyle}>
                                        <p style={InfoStyle}>{t('hash_value')}</p>
                                        <div style={L2RStyle}><p style={InfoStyle}>{getStdAddress(item.hash)}</p><CopyClipboard copyStr={item.hash} /></div>
                                    </div> : <></>}
                                    {item.from ? <div style={InfoItemStyle}>
                                        <p style={InfoStyle}>From</p>
                                        <div style={L2RStyle}><p style={InfoStyle}>{getStdAddress(item.from)}</p><CopyClipboard copyStr={item.from} /></div>
                                    </div> : <></>}
                                    {item.to ? <div style={InfoItemStyle}>
                                        <p style={InfoStyle}>To</p>
                                        <div style={L2RStyle}><p style={InfoStyle}>{getStdAddress(item.to)}</p><CopyClipboard copyStr={item.to} /></div>
                                    </div> : <></>}
                                </div>

                            </div>
                        </List.Item>
                    ))
                ) : (
                    <div style={{ ...CenterStyle, height: '30vh' }}>{loadingText}</div>
                )}
            </List>
        </div>
    )
}

const InfoStyle: React.CSSProperties = { color: '#8B93A4', fontSize: '13px', margin: '8px' }
const TranxItemStyle: React.CSSProperties = { width: '100%', height: 'auto' }
const InfoItemStyle: React.CSSProperties = { ...LRSideStyle, marginLeft: '12px', marginRight: '12px' }

export default TranxRecords;
