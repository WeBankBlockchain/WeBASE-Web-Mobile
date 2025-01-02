import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const PicJsonAnimateTest: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const animation = lottie.loadAnimation({
                container: containerRef.current, // the DOM element to render the animation
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: process.env.PUBLIC_URL + '/test/pic_json_animate.json' // path to the JSON animation
            });

            return () => {
                animation.destroy(); // Cleanup on unmount
            };
        }
    }, []);

    return <div ref={containerRef} style={{ width: '500px', height: '500px' }} />;
};

export default PicJsonAnimateTest;