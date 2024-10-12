import { useEffect } from 'react';
import { printLog } from '../context/LogTools';


interface GetFoldWindowListener {
    onGetFoldWindow: (isFlod: boolean) => void
}

const checkIsFold = () => {
    const height = window.innerHeight
    const width = window.innerWidth
    let rate = 0;
    if (width > height) {
        rate = height / width
    } else {
        rate = width / height
    }
    return rate > 0.7
}

const FoldWindowListener: React.FC<GetFoldWindowListener> = ({ onGetFoldWindow }) => {
    useEffect(() => {
        onGetFoldWindow(checkIsFold())
        const handResize = () => {
            onGetFoldWindow(checkIsFold())
        }
        window.addEventListener("resize", handResize)
        return () => {
            printLog("touchmove::removeEventListener")
            window.removeEventListener("resize", handResize)
        };

    }, []);
    return null;
};



export default FoldWindowListener;