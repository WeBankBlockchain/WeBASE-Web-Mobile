// AnimatedImage.tsx
import React, { useState } from 'react';
import './static_animate.css';
import CachedImage from '../../elements/CachedImage';

const StaticAnimateTest: React.FC = () => {
    const [animation, setAnimation] = useState('');

    return (
        <div>
            <button onClick={() => setAnimation('zoom-in')}>放大</button>
            <button onClick={() => setAnimation('zoom-out')}>缩小</button>
            <button onClick={() => setAnimation('translate')}>位移</button>
            <button onClick={() => setAnimation('flip')}>翻转</button>
            <CachedImage
                src='https://127.0.0.1/ipfs/QmNcawBHDPw7R33Z3PRBzSKaTshi4yHC3MdDoMMPfKTsMc'
                className={`animated ${animation}`}
                onAnimationEnd={() => setAnimation('')}
                style={{ width: '100%', height: 'auto', marginTop: '20%' }}
            />
        </div>
    );
};

export default StaticAnimateTest;