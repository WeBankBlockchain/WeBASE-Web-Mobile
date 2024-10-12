import { AnimationEventHandler, MouseEventHandler, useEffect, useState } from 'react';
import { printLog } from '../context/LogTools';
import { LoadImage } from './LocalCacher';

const CachedImage = ({ src, style, className, onClick, onAnimationEnd }:
  { src: string, style?: React.CSSProperties, className?: string, onClick?: MouseEventHandler, onAnimationEnd?: AnimationEventHandler }) => {

  //如果是开发环境，需要将图片地址转换成跨域地址
  if (process.env.PUBLIC_URL.endsWith("ticket-dev") || 1 === 1) {
    src = src.replace("occ.test.webankcdn.net", "wbbcoafrtest.test.wbchain.com")
  }

  const onGetCatchSuccess = (url: string) => {
    if (url && url.length > 0) {
      setCachedSrc(url)
    }
  }

  const [cachedSrc, setCachedSrc] = useState<string>('');
  useEffect(() => {
    printLog(['init cache image:', src]);
    LoadImage(src, onGetCatchSuccess).then(
      url => {
        if (url) {
          printLog(['init cache image:', "命中", src, url]);
          setCachedSrc(url)
        } else {
          printLog(['init cache image:', "未命中", src]);
          setCachedSrc(src)
        }
      }
    ).catch(
      e => {
        printLog(['Error loading image when setCachedSrc:', src, e]);
        setCachedSrc(src)
      }
    )
  }, [src]);

  return <img src={cachedSrc} style={style} onClick={onClick} className={className} onAnimationEnd={onAnimationEnd} />;
};

export default CachedImage;