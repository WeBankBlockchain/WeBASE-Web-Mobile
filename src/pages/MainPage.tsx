import { useState } from 'react';
import Connect from '../elements/Connect';
import PageSelect from '../elements/PageSelect';
import ListPage from './ListPage';
import MyPage from './MyPage';
import { ContentPageStyle, MainPageFullScreenStyle, UpDownStyle } from '../BaseStyle';


//Dapp整体布局
function MainPage() {

    const [currentPageIndex, setCurrentPageIndex] = useState(1)

    const onSelectPageChanged = (pageIndex: number) => {
        setCurrentPageIndex(pageIndex)
    }

    return (
        <div style={MainPageFullScreenStyle}>
            <Connect style={UpDownStyle} />
            {currentPageIndex === 1 ?
                <ListPage style={ContentPageStyle} />
                :
                <MyPage style={ContentPageStyle} />
            }
            <PageSelect style={UpDownStyle} onSelectPageChanged={onSelectPageChanged} />
        </div>
    );
}

export default MainPage;
