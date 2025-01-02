import { Button } from "antd-mobile";
import { useEffect, useState } from "react";
import { L2RStyle, LRSideStyle } from "../BaseStyle";
import styled from 'styled-components';
import { useWCContext } from "../context/WCContext";
import { CONN_STSTUS } from "../context/Const";
import { useMPContext } from "../context/MPContext";
import { useTranslation } from "react-i18next";
import { getStdAddress } from "../tools/StringTools";
import CopyClipboard from "./CopyClipboard";
import { autoEnter } from "../pages/WellcomePage";

interface ConnectProps {
    //连接组件可能的参数
    style?: React.CSSProperties;
}


const ConnButton = styled(Button)`
    border-radius: 5px;
    font-size: 12px;
`;

const Connect: React.FC<ConnectProps> = ({ style }) => {
    const { t } = useTranslation();
    const { doConncet, currentStatus } = useWCContext()
    const { currentAccount, doLogoutMP } = useMPContext()
    useEffect(
        () => {
            if (currentStatus === CONN_STSTUS.noConn || currentStatus === CONN_STSTUS.connectError) {
                setIsConnected(false);
                setIsConnecting(false);
            } else if (currentStatus === CONN_STSTUS.connInit || currentStatus === CONN_STSTUS.conning) {
                setIsConnected(false);
                setIsConnecting(true);
            } else if (currentStatus === CONN_STSTUS.connected) {
                setIsConnected(true);
                setIsConnecting(false);
                setAccount(currentAccount)
            }
        },
        [currentStatus]
    )
    //是否连上了钱包
    const [isConnected, setIsConnected] = useState(false)
    //是否连接中
    const [isConnecting, setIsConnecting] = useState(false)
    const [account, setAccount] = useState<string | undefined>(undefined)

    const onDisConn = () => {
        doLogoutMP()
        autoEnter.isAuto = true
    }

    return (
        <div style={style}>
            {isConnected ?
                <div style={{ ...LRSideStyle, height: "auto", padding: '6px 8px' }}>
                    {/* 已连接状态 */}
                    {/* 左边的div */}
                    <div style={L2RStyle}>
                        <img src={process.env.PUBLIC_URL + '/icons/link.svg'} style={{ width: '25%', height: '25%' }} />
                        <p style={{ marginLeft: '7%', whiteSpace: "nowrap" }}>{t("wc_connected")} {getStdAddress(account)}</p>
                        <CopyClipboard style={{ marginLeft: '7%', width: '200%', height: 'auto' }} copyStr={account ? account : ''} />
                    </div>
                    {/* 右边的div */}
                    <div>
                        <ConnButton style={{ background: '#ffffff' }} onClick={onDisConn}>{t("wc_disconnect")}</ConnButton>
                    </div>
                </div>
                :
                <div style={{ ...LRSideStyle, height: "auto", padding: '6px 8px' }}>
                    {/* 没有连接以及连接中状态 */}
                    {/* 左边的div */}
                    <div style={L2RStyle}>
                        <img src={process.env.PUBLIC_URL + '/icons/link.svg'} style={{ width: '25%', height: '25%' }} />
                        <p style={{ marginLeft: '7%', whiteSpace: "nowrap" }}>{t("wc_connect_note")}</p>
                    </div>
                    {/* 右边的div */}
                    <div>
                        <ConnButton loading={isConnecting} loadingText={t("wc_connecting")} disabled={isConnecting} style={{ background: '#2DA1FF', color: "white" }} onClick={() => { doConncet() }}>{t("wc_connect")}</ConnButton>
                    </div>
                </div>
            }
        </div>)
}

export default Connect;