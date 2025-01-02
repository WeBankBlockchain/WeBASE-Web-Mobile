import { Grid, InfiniteScroll } from "antd-mobile";
import { GridItem } from "antd-mobile/es/components/grid/grid";
import { useEffect, useState } from "react";
import { AssetList, ListBaseResp } from "../api/AssetList";
import { AssetInfo, getStdAssetName } from "../api/AssetInfo";
import { printLog } from "../context/LogTools";
import CachedImage from "../elements/CachedImage";
import { ListTitletyle } from "../BaseStyle";
import { useClientContext } from "../context/ClientContext";

interface ListPageProps {
    //页面选择控件可能的参数
    style?: React.CSSProperties;
    currentAsssetId?: string //是否需要加载本身的ticket
    onAItemClick?: (assetInfo: AssetInfo) => void
}

const pagesize = 4;

const ListPage: React.FC<ListPageProps> = ({ style, currentAsssetId, onAItemClick }) => {

    const [currentList, setCurrentList] = useState<AssetInfo[]>([])
    const [currentPageIndex, setCurrentPageIndex] = useState(-1)
    const { currentJwt } = useClientContext()

    useEffect(
        () => {
            printLog(["ListPage flash-->", currentAsssetId])
            if (currentJwt) {
                AssetList(OnAssetList, 1, pagesize, currentJwt.openTicketAddress, currentAsssetId)
            }
        }, [currentJwt, currentAsssetId]
    )

    const OnAssetList = (resp: ListBaseResp<AssetInfo[]> | undefined) => {
        if (resp) {
            let list: AssetInfo[] = [...currentList]
            for (let i = 0; i < resp.data.length; i++) {
                if (!list.find(asset => asset.assetId === resp.data[i].assetId)) {
                    list.push(resp.data[i])
                }
            }
            setCurrentList(list)
            setCurrentPageIndex(resp.currentPageIndex)
            printLog(["total", list.length, resp.data.length, resp.currentPageIndex])
            setLoading(false)
            if (list.length < resp.totalCount && resp.data.length > 0) {
                setHasMore(true)
            } else {
                setHasMore(false)
            }
        } else {
            setHasMore(false)
        }
    }
    function onItemClick(_item: AssetInfo): void {
        printLog(["onItemClick", _item])
        setCurrentList([])
        setCurrentPageIndex(-1)
        setLoading(false)
        setHasMore(true)
        onAItemClick && onAItemClick(_item)

    }

    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const handScroll = async () => {
        printLog(["load more down", "loading=" + loading, "hasMore=" + hasMore])

        if (!loading && hasMore && currentPageIndex > 0) {
            printLog("load more")
            setLoading(true)
            AssetList(OnAssetList, 1 + currentPageIndex, pagesize, currentJwt ? currentJwt.openTicketAddress : '', currentAsssetId)
        }
    }

    return (<div style={style} >
        <Grid columns={2} style={{ marginLeft: '1%', marginRight: '1%' }}>
            {currentList.map((item, index) => (
                <GridItem key={index} onClick={() => onItemClick(item)}>
                    <div style={ItemStyle}>
                        <CachedImage src={item?.imageUrl} style={ItemImageStyle} />
                        <div style={{ width: '90%', height: 'auto' }}><p style={{ margin: '10px 0 15px 0', ...ListTitletyle }}>{getStdAssetName(item)}</p></div>
                    </div>
                </GridItem>
            ))}
        </Grid>
        <InfiniteScroll loadMore={handScroll} hasMore={hasMore} threshold={100} >
            {hasMore ? "loading more..." : "no more data"}
        </InfiniteScroll>
    </div>)
}

export default ListPage;

const ItemStyle: React.CSSProperties = { width: '100%', height: 'auto', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }
const ItemImageStyle: React.CSSProperties = { width: '90%', height: 'auto', borderRadius: '4%', minHeight: '150px' }