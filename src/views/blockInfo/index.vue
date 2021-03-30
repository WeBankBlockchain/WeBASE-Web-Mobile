<template>
    <div>
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset="20" :immediate-check="false">
            <div class="overview-item-base">
                <div class="block-item" v-for="item in blockData" :key='item.blockNumber' @click="toBlockDetail(item)">
                    <div class="item">
                        <div class="key">块高</div>
                        <router-link :to="{'path': 'block', 'query': {blockNumber: item.blockNumber, blockTimestamp:item.blockTimestamp}}" class="node-ip">
                            {{item.blockNumber}}
                        </router-link>
                    </div>
                    <div class="item">
                        <div class="key">出块者</div>
                        <div style="overflow: hidden;text-overflow: ellipsis;;">{{item.sealer}}</div>
                    </div>
                    <div class="item">
                        <div class="key">交易笔数</div>
                        <div style="word-break: break-all;">{{item.transCount}}</div>
                    </div>
                    <div class="item-more">
                        <div style="overflow: hidden;text-overflow: ellipsis;" class="item-time">
                            <span>{{item.blockTimestamp}}</span>
                            <!-- <span style="">详情 ></span> -->
                        </div>
                    </div>
                </div>
            </div>
        </van-list>
    </div>
</template> 
<script>
import { reactive, ref, toRefs, onMounted, provide, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getChartData, getNetworkStatistics, getNodeList, getBlockPage, getTransactionList, getConsensusNodeId, getGroupsInvalidIncluded } from '@/api/home.js'
import { Toast, Cell, CellGroup, List, Tab, Tabs, Swipe, SwipeItem, Search, Popup, Divider, DropdownMenu, DropdownItem } from 'vant';

export default {
    name: 'TxInfo',
    setup() {
        const route = useRoute()
        const router = useRouter()
        const groupId = ref(+sessionStorage.getItem('groupId'))
        const state = reactive({
            loading: false,
            finished: false,
            blockData: [],
            reqData: {
                groupId: groupId.value,
                pageNumber: 1,
                pageSize: 7
            },
            reqQuery: {}
        })
        const queryBlockList = async () => {
            const { data } = await getBlockPage(state.reqData, state.reqQuery);
            state.loading = false;
            if (data.code === 0) {
                state.blockData = state.blockData.concat(data.data)
                if (state.blockData.length >= data.totalCount) {
                    state.finished = true;
                }
            } else {
                Toast.fail(data.message)
            }
        }
        const onLoad = () => {
            state.reqData.pageNumber += 1
            queryBlockList()
        };
        onMounted(() => {
            if (route.query.blockNumber || route.query.blockNumber === 0) {
                state.reqQuery.blockNumber = route.query.blockNumber
            }
            if (route.query.blockHash) {
                state.reqQuery.pkHash = route.query.blockHash
            }
            queryBlockList()
        })
        return {
            ...toRefs(state),
            onLoad
        }

    },
    methods: {
        toBlockDetail(item) {
            this.$router.push({
                'path': 'block',
                'query': { blockNumber: item.blockNumber, blockTimestamp: item.blockTimestamp }
            })
        },
    }
}
</script>
<style scoped>
.overview-item-base {
    margin: 16px;
    margin-bottom: 0;
    font-size: 12px;
}
.block-item {
    background: #ffffff;
    padding: 16px 12px;
    margin-bottom: 16px;
    box-shadow: 0 0 10px 0 rgba(201, 223, 255, 0.5);
    border-radius: 6px;
    padding-bottom: 0;
}
.item {
    display: flex;
    align-items: center;
    font-size: 12px;
    margin: 5px 0;
    line-height: 22px;
    height: 22px;
}
.key {
    min-width: 70px;
    font-size: 12px;
    color: #888888;
    font-weight: 400;
}
.item-more {
    border-top: 1px solid #f2f2f2;
    height: 37px;
    line-height: 37px;
}
.item-time {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #888888;
}
.block-amount {
    display: -webkit-flex;
    display: -moz-flex;
    display: flex;
    flex-flow: column;
}
.block-miner {
    display: flex;
    flex-flow: row wrap;
}
.block-miner > p {
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 10px;
}
</style>