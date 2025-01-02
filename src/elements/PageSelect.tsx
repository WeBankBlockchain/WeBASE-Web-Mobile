import { useEffect, useState } from "react";
import { CenterStyle, ColumnCenterStyle } from "../BaseStyle";

import { useTranslation } from "react-i18next";


interface PageSelectProps {
    //页面选择控件可能的参数
    style?: React.CSSProperties;
    onSelectPageChanged?: (pageIndex: number) => void
}

const ImageIconStyle: React.CSSProperties = { width: '13%', height: '13%' }
const TxtSelect: React.CSSProperties = { color: '#0F121E' }
const TxtUnSelect: React.CSSProperties = { color: '#D8D8D8' }

const PageSelect: React.FC<PageSelectProps> = ({ style, onSelectPageChanged }) => {

    const { t } = useTranslation();
    const [currentPageIndex, setCurrentPageIndex] = useState(1)

    useEffect(
        () => {
            if (onSelectPageChanged) {
                onSelectPageChanged(currentPageIndex);
            }
        }, [currentPageIndex]
    )

    return (<div style={style}>
        <div style={{ height: '1px', width: '100%', background: '#DCDFE5' }}></div>
        {currentPageIndex === 1 ?
            <div style={{ ...CenterStyle, marginTop: '4%' }}>
                <div style={{ width: '50%', height: 'auto', ...ColumnCenterStyle }}>
                    <img src={process.env.PUBLIC_URL + '/icons/home.svg'} style={ImageIconStyle} />
                    <p style={TxtSelect}>{t("home")}</p>
                </div>
                <div style={{ width: '50%', height: 'auto', ...ColumnCenterStyle }} onClick={() => { setCurrentPageIndex(2) }}>
                    <img src={process.env.PUBLIC_URL + '/icons/me_unselect.svg'} style={ImageIconStyle} />
                    <p style={TxtUnSelect}>{t("me")}</p>
                </div>
            </div>
            :
            <div style={{ ...CenterStyle, marginTop: '4%' }}>
                <div style={{ width: '50%', height: 'auto', ...ColumnCenterStyle }} onClick={() => { setCurrentPageIndex(1) }}>
                    <img src={process.env.PUBLIC_URL + '/icons/home_unselect.svg'} style={ImageIconStyle} />
                    <p style={TxtUnSelect}>{t("home")}</p>
                </div>
                <div style={{ width: '50%', height: 'auto', ...ColumnCenterStyle }}>
                    <img src={process.env.PUBLIC_URL + '/icons/me.svg'} style={ImageIconStyle} />
                    <p style={TxtSelect}>{t("me")}</p>
                </div>
            </div>
        }

    </div>)
}

export default PageSelect;