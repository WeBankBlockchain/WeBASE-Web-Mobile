import { useEffect } from 'react';
import { Location, useLocation } from 'react-router-dom';
import { printLog } from '../context/LogTools';


const lastPaths: Location<any>[] = []

interface GetGoBackListener {
    onGoBack?: (currentPath: string, lastPath: string) => void
}

const GoBackListener: React.FC<GetGoBackListener> = ({ onGoBack }) => {

    const location = useLocation();
    useEffect(() => {
        const lastPath = lastPaths.pop();
        lastPaths.push(location)
        printLog(['GoBack-->', location, "from", lastPath]);
        onGoBack && onGoBack(location.pathname, lastPath ? lastPath.pathname : '')
    }, []);
    return null;
};

export function clearAll() {
    while (lastPaths && lastPaths.length > 0) {
        lastPaths.pop();
    }
    printLog("clearAll-->" + lastPaths.length)
}

export default GoBackListener;