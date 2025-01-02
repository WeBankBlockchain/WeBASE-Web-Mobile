import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { printLog } from '../../../context/LogTools';


export const TestJumpPage: React.FC = () => {

    const { id } = useParams();

    useEffect(
        () => {
            printLog("run useEffect-->id")
            setPageData(id)
        }, [id]
    )

    const [pageData, setPageData] = useState<string | undefined>()
    const navigate = useNavigate();
    return (
        <div>
            <p>这是我的页ID:{pageData}</p>
            <button onClick={() => { navigate(`${process.env.PUBLIC_URL}/testpage/${id}1`) }}>下一页</button>
        </div>
    );
};