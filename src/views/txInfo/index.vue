<template>
    <div>
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset="20" :immediate-check="false">
            <div class="overview-item-base">
                <div class="block-item" v-for="item in transactionList" :key='item.transHash'>
                    <!-- <div class="">
                        <p style="word-wrap: break-word;text-align: left;">
                            <router-link :to="{'path': 'transaction', 'query': {transHash: item.transHash, blockTimestamp:item.blockTimestamp}}" class="node-ip">
                                {{item.transHash}}
                            </router-link>
                        </p>
                    </div>
                    <p style="text-align: left;color:#999999;">{{item.blockTimestamp}}</p> -->
                    <div class="item">
                        <div class="key">交易哈希</div>
                        <router-link :to="{'path': 'transaction', 'query': {transHash: item.transHash, blockTimestamp:item.blockTimestamp}}" style="word-break: break-all;">
                            {{item.transHash}}
                        </router-link>
                    </div>
                    <div class="item">
                        <div class="key">发送方</div>
                        <div style="word-break: break-all;">{{item.transFrom}}</div>
                    </div>
                    <div class="item">
                        <div class="key">接收方</div>
                        <div style="word-break: break-all;">{{item.transTo}}</div>
                    </div>
                    <div class="item">
                        <div class="key">块高</div>
                        <div style="word-break: break-all;">{{item.blockNumber}}</div>
                    </div>
                    <div class="item-more" @click="toTxDetail(item)">
                        <div style="overflow: hidden;text-overflow: ellipsis;;" class="item-time">
                            <span>{{item.blockTimestamp}}</span>
                            <span style="">更多 ></span>
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
        const groupId = ref(+sessionStorage.getItem('groupId'))
        const state = reactive({
            loading: false,
            finished: false,
            transactionList: [],
            reqData: {
                groupId: groupId.value,
                pageNumber: 1,
                pageSize: 7
            },
            reqQuery: {}
        })
        const queryTransactionList = async () => {
            const { data } = await getTransactionList(state.reqData, state.reqQuery);
            state.loading = false;
            if (data.code === 0) {
                state.transactionList = state.transactionList.concat(data.data)
                if (state.transactionList.length >= data.totalCount) {
                    state.finished = true;
                }
            } else {
                Toast.fail(data.message)
            }
        }
        const onLoad = () => {
            state.reqData.pageNumber += 1
            queryTransactionList()
        };
        onMounted(() => {
            queryTransactionList()
        })
        return {
            ...toRefs(state),
            onLoad
        }
    },
    methods: {
        toTxDetail(item) {
            this.$router.push({
                'path': 'transaction',
                'query': { transHash: item.transHash, blockTimestamp: item.blockTimestamp }
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
    /* align-items: center; */
    font-size: 12px;
    margin: 5px 0;
    /* line-height: 22px;
    height: 22px; */
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
</style>