import React, { useState } from 'react';
import './join_animate.css';
import CachedImage from '../../elements/CachedImage';

const JoinAnimateTest: React.FC = () => {
    const [animations, setAnimations] = useState<string[]>([]);

    const handleAnimation = (type: string) => {
        setAnimations([type]);
        setTimeout(() => setAnimations([]), 500); // 动画结束后重置
    };

    return (
        <div>
            <button onClick={() => handleAnimation('zoom-in')}>放大</button>
            <button onClick={() => handleAnimation('zoom-out')}>缩小</button>
            <button onClick={() => handleAnimation('translate')}>位移</button>
            <button onClick={() => handleAnimation('translate flip')}>翻转</button>
            <CachedImage
                src='https://127.0.0.1/ipfs/QmNcawBHDPw7R33Z3PRBzSKaTshi4yHC3MdDoMMPfKTsMc'
                className={`animated ${animations.join(' ')}`}
                style={{ width: '100%', height: 'auto', marginTop: '20%' }}
            />
        </div>
    );
};

export default JoinAnimateTest;