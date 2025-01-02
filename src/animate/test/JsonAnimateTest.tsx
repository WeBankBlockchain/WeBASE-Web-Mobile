import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const JsonAnimateTest: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Player
                autoplay
                loop
                src={process.env.PUBLIC_URL + "/test/json_animate.json"}// 这里是 JSON 动画文件的路径
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default JsonAnimateTest;