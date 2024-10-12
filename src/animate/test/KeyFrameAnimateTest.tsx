// AnimatedImage.tsx
import React, { useState } from 'react';
import './key_frame_animate.css';

const KeyFrameAnimateTest: React.FC = () => {
    const [animation, setAnimation] = useState('');

    const handleAnimation = (type: string) => {
        setAnimation(type);
        setTimeout(() => setAnimation(''), 500); // 动画结束后重置
    };

    return (
        <div>
            <button onClick={() => handleAnimation('zoomIn')}>放大</button>
            <button onClick={() => handleAnimation('zoomOut')}>缩小</button>
            <img
                src='https://127.0.0.1/ipfs/QmNcawBHDPw7R33Z3PRBzSKaTshi4yHC3MdDoMMPfKTsMc'
                alt="example"
                className={`animated ${animation}`}
                style={{ width: '100%', height: 'auto', marginTop: '20%' }}
            />
        </div>
    );
};

export default KeyFrameAnimateTest;