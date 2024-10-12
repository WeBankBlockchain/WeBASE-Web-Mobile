import React, { useEffect } from 'react';
import { BaseModalStyle, ColumnCenterStyle } from '../BaseStyle';

import { useTranslation } from "react-i18next";
import { printLog } from '../context/LogTools';



interface GetAssetsModalProps {
  //控件可能的参数
  style?: React.CSSProperties;
}

const GenAssetsModal: React.FC<GetAssetsModalProps> = ({ style }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleTouchMove = (e: any) => {
      e.preventDefault(); // 阻止默认的触摸滚动行为
    };

    printLog("touchmove::addEventListener@GenAssetsModal")
    document.addEventListener('touchmove', handleTouchMove, { passive: false });


    // Cleanup on component unmount
    return () => {
      printLog("touchmove::removeEventListener@GenAssetsModal")
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div style={{ ...style, ...BaseModalStyle }}>
      <div style={{ width: '100%', height: '100%', ...ColumnCenterStyle }}>
        <img style={{ width: "30%", height: 'auto' }} src={process.env.PUBLIC_URL + '/icons/gening.png'} />
        <p style={{ color: 'white', margin: 0, fontWeight: 'bold', fontSize: '14px' }}>{t("gen")}</p>
      </div>
    </div>
  );
};

export default GenAssetsModal;