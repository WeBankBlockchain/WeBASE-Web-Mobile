import { useEffect, useState, forwardRef, CSSProperties } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { LoadAnimate } from './LocalCacher';
import { printLog } from '../context/LogTools';

interface CachedPlayerProps {
  autoplay: boolean;
  loop: boolean;
  src: string;
  style?: CSSProperties;
}

const CachedPlayer = forwardRef<Player, CachedPlayerProps>(
  ({ autoplay, loop, src, style }, ref) => {
    const [cachedSrc, setCachedSrc] = useState<string>('');
    useEffect(() => {
      printLog(['init cache player:', src]);
      LoadAnimate(src.toString())
        .then((url) => {
          if (url) {
            setCachedSrc(url);
          } else {
            setCachedSrc(src);
          }
        })
        .catch((e) => {
          printLog(['Error loading image when setCachedSrc:', e]);
          setCachedSrc(src);
        });
    }, [src]);

    return <Player ref={ref} autoplay={autoplay} loop={loop} src={cachedSrc} style={style} />;
  }
);

export default CachedPlayer;