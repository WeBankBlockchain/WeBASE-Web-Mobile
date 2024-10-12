import React, { useEffect, useRef, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { BaseModalStyle, CenterStyle } from '../BaseStyle';
import "./AssetsShowAmimate.css"
import { useTranslation } from "react-i18next";
import { printLog } from '../context/LogTools';
import CachedImage from '../elements/CachedImage';
import CachedPlayer from '../elements/CachedPlayer';
import FoldWindowListener from '../elements/FoldWindowListener';

const baseModalLayerStyle: React.CSSProperties = { position: 'absolute', width: '100%', height: '100%' }
const layer1Style: React.CSSProperties = { ...baseModalLayerStyle, ...CenterStyle, zIndex: 101 }
const layer2Style: React.CSSProperties = { ...baseModalLayerStyle, ...CenterStyle, zIndex: 102 }
const layer3Style: React.CSSProperties = { ...baseModalLayerStyle, ...CenterStyle, zIndex: 103 }
const layer4Style: React.CSSProperties = { ...baseModalLayerStyle, zIndex: 104 }
const layer5Style: React.CSSProperties = { ...baseModalLayerStyle, ...CenterStyle, zIndex: 105 }

interface GetAssetsModalProps {
  //控件可能的参数
  style?: React.CSSProperties;
  onAccpet?: () => void;
  imageUrl?: string;
}

const GetAssetsModal: React.FC<GetAssetsModalProps> = ({ style, onAccpet, imageUrl }) => {

  useEffect(
    () => {
      if (imageUrl) {
        printLog("play for-->" + imageUrl)
        playAnimate()
      }

    }, [imageUrl]
  )

  useEffect(() => {
    const handleTouchMove = (e: any) => {
      e.preventDefault(); // 阻止默认的触摸滚动行为
    };

    printLog("touchmove::addEventListener@GetAssetsModal")
    document.addEventListener('touchmove', handleTouchMove, { passive: false });


    // Cleanup on component unmount
    return () => {
      printLog("touchmove::removeEventListener@GetAssetsModal")
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const [imageAnimation, setImageAnimation] = useState('');
  const [lightAnimation, setLightAnimation] = useState('');

  const playerRef = useRef<Player>(null);
  const playAnimation = () => {
    if (playerRef.current) {
      playerRef.current.setLoop(true);
      playerRef.current.play();
    }
  };

  const playAnimate = () => {
    setImageAnimation('zoom-image')//图片先出来，耗时1秒
    if (playerRef.current) {
      playerRef.current.play();//同时，背景动画出来，循环播放
    }
  }
  //图片动画结束之后，闪光开始
  const afterPlayAnimate = () => {
    setImageAnimation('')
    setLightAnimation('move-animation-2')
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.setLoop(true);
      playerRef.current.play();
    }
  }
  //闪光结束之后
  const afterLight = () => {
    setLightAnimation('')
  }

  const { t } = useTranslation();

  const [playerStyle, setPlayerStyle] = useState<React.CSSProperties>({ width: '240%', height: 'auto', marginLeft: '-70%' })
  const [imgStyle, setImgStyle] = useState<React.CSSProperties>({ marginBottom: '14%', width: '62%', height: 'auto' })
  const [lightBoxStyle, setLightBoxStyle] = useState<React.CSSProperties>({ position: 'fixed', marginBottom: '14%', width: '62%', height: '30%' })
  const [btnStyle, setBtnStyle] = useState<React.CSSProperties>({ position: 'absolute', marginTop: '100%', width: '40%', height: 'auto', zIndex: 105 })

  const onGetFoldWindow = (isFlod: boolean) => {
    if (isFlod) {
      setPlayerStyle({ width: '120%', height: 'auto', marginLeft: '-10%' })
      setImgStyle({ marginBottom: '14%', width: '31%', height: 'auto' })
      setLightBoxStyle({ position: 'fixed', marginBottom: '14%', width: '31%', height: '35%' })
      setBtnStyle({ position: 'absolute', marginTop: '50%', width: '20%', height: 'auto', zIndex: 105 })
    }
  }

  return (
    <div style={{ ...style, ...BaseModalStyle }}>
      <FoldWindowListener onGetFoldWindow={onGetFoldWindow} />
      <div style={layer1Style}>
        <CachedPlayer
          ref={playerRef}
          autoplay={false}
          loop={false}
          src={process.env.PUBLIC_URL + "/animate/get_asset.json"}// 这里是 JSON 动画文件的路径
          style={playerStyle}

        />
      </div>
      <div style={layer2Style}>
        {imageUrl && <CachedImage src={imageUrl} style={{ ...imgStyle, borderRadius: '5px' }} className={imageAnimation}
          onAnimationEnd={() => afterPlayAnimate()} />}
      </div>
      <div style={layer3Style}>
        <div style={lightBoxStyle}>
          <CachedImage src={process.env.PUBLIC_URL + "/icons/light.png"} style={{ width: '45%', height: 'auto', opacity: '0' }} className={lightAnimation}
            onAnimationEnd={() => afterLight()} />
        </div>

      </div>
      <div style={{ ...layer4Style, display: 'none' }}>
        <button onClick={playAnimation}>Play1</button>
        <button onClick={() => setImageAnimation('zoom-image')}>Play2</button>
        <button onClick={() => setLightAnimation('move-animation')}>Play3</button>
        <button onClick={() => playAnimate()}>Play4</button>
      </div>
      <div style={layer5Style}>
        <h2 style={{ textAlign: 'center', position: 'absolute', marginTop: '-100%', color: 'white', marginLeft: '10%', marginRight: '10%' }}>{t("gen_ticket")}</h2>
        <CachedImage onClick={onAccpet} src={process.env.PUBLIC_URL + '/icons/accept.png'} style={btnStyle} />
      </div>
    </div>
  );
};

export default GetAssetsModal;