import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CachedImage from "../elements/CachedImage";
import { GridItem } from "antd-mobile/es/components/grid/grid";
import { Grid } from "antd-mobile";
import { AssetInfo } from "../api/AssetInfo";

interface MyPageProps {
    //页面选择控件可能的参数
    style?: React.CSSProperties;
}

const MyPage: React.FC<MyPageProps> = ({ style }) => {

    const [currentList, setCurrentList] = useState<AssetInfo[]>([])

    const navigate = useNavigate();

    function onItemClick(_item: AssetInfo): void {
        navigate(`${process.env.PUBLIC_URL}/detail?assetAddress=${_item.assetAddress}&assetId=${_item.assetId}`);
    }


    return (<div style={style}>
        <Grid columns={2} style={{ marginTop: '4%' }}>
            {currentList.map((item, index) => (
                <GridItem key={index} onClick={() => onItemClick(item)}>
                    <div style={ItemStyle}>
                        <CachedImage src={item.imageUrl} style={ItemImageStyle} />
                        <div style={{ width: '90%', height: 'auto' }}><h3>{item.assetName}</h3></div>
                    </div>
                </GridItem>
            )
            )}
        </Grid>
    </div>)
}

export default MyPage;

const ItemStyle: React.CSSProperties = { width: '100%', height: 'auto', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }
const ItemImageStyle: React.CSSProperties = { width: '90%', height: 'auto', borderRadius: '4%' }