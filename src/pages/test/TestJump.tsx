import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { printLog } from '../../context/LogTools';

export const TestJump: React.FC = () => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        // 使用时间戳作为参数强制更新
        const currentTime = Date.now();
        navigate(`${process.env.PUBLIC_URL}/test?time=${currentTime}`);
        setCurrentTime(currentTime + "")
    };

    const [currentTime, setCurrentTime] = useState<string | null>("")

    const searchParams = new URLSearchParams(window.location.search);


    useEffect(
        () => {
            printLog("test")
            const time = searchParams.get('time');
            setCurrentTime(time)
        }, []
    )

    useEffect(() => {
        const handlePopState = () => {
            window.location.reload(); // 强制刷新页面
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return (
        <div>
            <h1>我的组件--{currentTime}</h1>
            <button onClick={handleNavigation}>导航到相同路由</button>
        </div>
    );
};