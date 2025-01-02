import React, { useState, useEffect, useRef } from 'react';
import localforage from 'localforage';
// import ReactPlayer, { ReactPlayerProps} from 'react-player/lazy';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import styled from 'styled-components';
import './videoPlayer.css'
import { isWeixin, isIOS } from '../tools'

export const PicBox = styled.img`
    position: absolute;
    margin-top: 5vh;
    width: 72vw;
    /* max-width: calc(468px * 0.64); */
    max-width: calc(468px - 160px);
    height: auto;
    border-radius: 8px;
    z-index: 4;

`

// export const VideoPlayerBox = styled.video`
export const VideoPlayerBox = styled.div`
    position: absolute;
    margin-top: 5vh;
    width: 72vw;
    /* max-width: calc(468px * 0.64); */
    max-width: calc(468px - 160px);
    aspect-ratio: 1 / 1;
    /* height: auto; */
    border-radius: 8px;
`

interface VideoPlayerProps {
    placeholderImage?: string;
    videoKey: string;
    style?: React.CSSProperties;
}



const VideoPlayer: React.FC<VideoPlayerProps> = ({ placeholderImage = process.env.PUBLIC_URL + '/icons/videoPic.png', videoKey, style }) => {


    const [showStaticPic, setShowStaticPic] = useState<boolean>(true)
    const playerRef = useRef<ReactPlayer | any>(null)
    const isPlaying = useRef(isWeixin() ? false : true)

    // 在微信状态下，不支持自动播放，需要用户手动点击播放，这里记录用户是否操作播放，为后续视频被暂停的问题方便处理
    const isWxPlay = useRef<boolean>(false)

    const [reFresh, setReFresh] = useState<number>(0)

    useEffect(() => {

        console.log('播放调试>>>>',isWxPlay.current,isPlaying.current);
        console.log('isweixin ?', isWeixin());
        let result = isWeixin() && !isWxPlay.current && !isPlaying.current
        console.log('是否显示自定义控件', result);
        
        
        

    },[isWxPlay.current, isPlaying.current ])


    const setIsPlaying = (isPlay: boolean) => {
        // 进行不相等判断，因不可重复设置
        if(isPlaying.current !== isPlay){
            isPlaying.current = isPlay
            console.log('set isPlaying', isPlaying.current);
        }
        // isPlaying.current = isPlay
        // console.log('set isPlaying', isPlaying.current);
        
        setReFresh(v => ++v)

    }

    // 12.27
    // 视频初始状态自动播放，在遇到播放暂停时，不做自动尝试播放，显示播放控件，交由用户进行点击播放
    // 微信内初始状态为不自动播放，其他逻辑相同
    // ----经过验证ios切出或者视频不在可视访问内时，会异常暂停，并有概率影响到 重新播放失败，以及播放的状态值
    // 最终决定ios设备在切出回来时，将页面刷新
    
    const [showVideoControls, setShowVideoControls] = useState<boolean>(false)
    useEffect(() => {
        if(isPlaying.current){
            setShowVideoControls(false)
        } else {
            setShowVideoControls(true)
        }
    },[isPlaying.current])


    const getUrl = (url: string) => {
        if (process.env.NODE_ENV === 'development') {
            // console.log('dev env');
            // return url
            return url.replace("occ.test.webankcdn.net", "wbbcoafrtest.test.wbchain.com")
        } else {
            return url
        }

    }

    function getScrollPosition() {
        
        return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    }


    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    useEffect(() => {

        window.addEventListener('scroll', function() {
            if(getScrollPosition() < 200){

                if(!isPlaying.current){
                    console.log(' sroll < 200 start play',);
                    handleVideoPlay()
                }
            }
        })
    
        // 页面可见性变化处理函数
        function handleVisibilityChange() {
            console.log('change showPage  ===  hidden', document.hidden);

            if(!document.hidden){ 
                if(isIOS()){
                   window.location.replace(window.location.href)
                }
                // handleVideoPlay()
            }
        }

        // 添加事件监听器
        document.addEventListener('visibilitychange', handleVisibilityChange);
    
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      }, []);


    useEffect(() => {
        let mounted = true;
        console.log('videoKey:', videoKey);
        if (videoKey) {
            let videoOriginUrl = getUrl(videoKey)
            console.log('videoOriginUrl:', videoOriginUrl);

            // 优先缓存获取视频，无则网络加载视频
            const loadVideo = async () => {

                try {
                    const cachedVideo = await localforage.getItem<Blob>(videoOriginUrl);
                    if (cachedVideo && mounted) {
                        console.log('get cache video');
                        setVideoUrl(URL.createObjectURL(cachedVideo));
                        setShowStaticPic(false);
                        return;
                    }

                    const response = await fetch(videoOriginUrl);
                    // const response =await fetch(process.env.PUBLIC_URL + '/videotest.mp4')
                    const blob = await response.blob();
                    if (mounted) {
                        console.log('set video url');

                        setVideoUrl(URL.createObjectURL(blob));
                        await localforage.setItem(videoOriginUrl, blob);
                    }

                } catch (err) {
                    console.log('video play err', err);
                }
            };
            loadVideo();
        }
        return () => {
            mounted = false;
        };
    }, [videoKey]);


    // let videoElement:any = null
    // useEffect(() => {
    //     console.log(playerRef.current);
    //     if(playerRef.current && !videoElement){
    //         videoElement = playerRef.current?.getInternalPlayer();
                // videoElement.play().catch(console.error)
    //     }
        

    // },[ playerRef.current])

    const handleVideoPlay = () => {
        if(isWeixin() && !isWxPlay.current) return 

        // if(playerRef.current){

        //     const videoElement = playerRef.current?.getInternalPlayer();
        //     if (videoElement) {
        //         // 尝试重新播放视频
        //         videoElement.currentTime = 0; // 可选：从头开始播放
        //         videoElement.play().catch(console.error); // 捕获可能的播放错误
        //     }
        // }
        setIsPlaying(true)
       
    }



    // 点击播放
    const handlePlay = () => {
        console.log('click handle play');
        

        if(isWeixin()){
            isWxPlay.current = true
        }
        handleVideoPlay()
    } 

    const onPlay = () => {
        console.log('video play',isPlaying.current)
        setIsPlaying(true)
        // if(!isPlaying.current){
        //     setIsPlaying(true)
        // }
    }

    // 播放已缓存完毕
    const onReady = () => {
        setShowStaticPic(false)
        console.log('video ready');
        // handleVideoPlay()
    }

    // 播放完毕或暂停
    const onPause = () => {
        console.log('Video stop or finished');
        // isPlaying.current = false
        setIsPlaying(false)
    };

    // 播放错误
    const onerror = (err: any) => {
        console.log('onerror',err);
        // isPlaying.current = false
        setIsPlaying(false)
        
    }

    return (
        <>
            {/*图片覆盖在视频上层， 视频元素保持存在，已便控制canplay事件生效,可播放时再隐藏图片 */}
            {
                // showStaticPic && <img style={{ ...style, zIndex: '99' }} src={getUrl(placeholderImage)} alt="Placeholder" />
                showStaticPic && <PicBox src={getUrl(placeholderImage)} alt="Placeholder" />
                // (showStaticPic || !isPlaying) && <PicBox src={getUrl(placeholderImage)} alt="Placeholder" />
            }

            {/* onCanPlay: 浏览器认为有足够的数据来开始播放视频。 */}
            {/* onCanPlayThrough: 浏览器估计可以在不停顿的情况下播放整个视频到结尾。 */}

            {
                videoUrl &&
                // <video
                //     id="video-element" 
                //     onCanPlayThrough={handleCanPlay} 
                //     loop 
                //     muted 
        
                //     playsInline
                //     webkit-playsinline="true" 
                //     x5-playsinline="true" 
                //     x-webkit-airplay="allow"
                //     x5-video-player-type='h5' 
                //     x5-video-player-fullscreen='true' 
                //     poster={getUrl(placeholderImage)}>

                //     {videoUrl && <source src={videoUrl || undefined} type="video/mp4" />}
                //     Your browser does not support the video tag.
                // </video>

                <VideoPlayerBox>

                    <ReactPlayer
                        ref={playerRef}
                        id="video-element"
                        width="100%"
                        height='100%'
                        url={videoUrl}
                        muted={true}
                        loop={true}
                        onReady={onReady}
                        playing={isPlaying.current}
                        onPlay={onPlay}
                        onPause={onPause}
                        onerror={onerror}
                        controls={false}
                        // light={true}
                        playsInline
                        webkit-playsinline="true"
                        x5-playsinline="true"
                        playsinline
                        style={{borderRadius: '8px'}}
                        config={{
                            file: {
                                attributes: {
                                    muted: true,
                                    'webkit-playsinline': true,
                                    playsInline: true, // 确保iOS上可以自动播放
                                },
                            },
                        }}
                    />
                    {/* 在微信内视频加载完时，controls设置false,视频区域会整个空白，非常突兀，这里用暂时覆盖 */}
                    <img style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: '2',
                        borderRadius: '8px',
                        display: (isWeixin() && !isWxPlay.current && !isPlaying.current) ? 'block' : 'none'
                    }} src={getUrl(placeholderImage)} alt="Placeholder" >
                    </img>
                        <img style={{
                            width: '40px',
                            height: '40px',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: '3',
                            display: (isWeixin() && !isWxPlay.current && !isPlaying.current) ? 'block' : 'none'
                            
                        }} 
                        src={getUrl(process.env.PUBLIC_URL + '/icons/play-icon.svg')} 
                        alt="Placeholder"  
                        onClick={handlePlay}/>
                </VideoPlayerBox>
            }



        </>
    );
};

export default VideoPlayer;
// https://www.npmjs.com/package/react-player
// 1.自动播放只能在静音模式下才有效
