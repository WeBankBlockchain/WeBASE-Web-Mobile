import React, { useEffect } from 'react';
import { BaseModalStyle, CenterStyle, ColumnCenterStyle } from '../BaseStyle';
import { printLog } from '../context/LogTools';

interface NoticeModalProps {
    //控件可能的参数
    style?: React.CSSProperties;
    disc?: string;
    onClose?: () => void
}

const NoticeModal: React.FC<NoticeModalProps> = ({ style, disc, onClose }) => {



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


    return (
        // 这个图层需要阻断后面的事件监听
        <div style={{ ...style, ...BaseModalStyle, }}   >
            <div style={{ width: '100%', height: '100%', ...CenterStyle }}>
                <div style={{ width: '70%', height: 'auto', ...ColumnCenterStyle, backgroundColor: '#ffffff', borderRadius: '5px' }}>
                    <p style={{ width: "100%", margin: '10% 0 10% 0', textAlign: 'center' }}>{disc}</p>
                    <div style={{ height: '1px', width: '100%', background: '#DCDFE5' }}></div>
                    <p style={{ width: "100%", textAlign: 'center', fontWeight: 'bold', color: '#2DA1FF' }} onClick={onClose}>Got it</p>
                </div>
            </div>
        </div>
    );
};

export default NoticeModal;