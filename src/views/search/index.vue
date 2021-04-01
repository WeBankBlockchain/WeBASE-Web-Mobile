<template>
    <div class="">
        <div class="search-wrapper">
            <van-search v-model="searchText" placeholder="请输入块高 / 交易哈希" ref="searchInput" @search="onSearch">
                <!-- <template #action>
                    <div @click="onSearch">搜索</div>
                </template> -->
            </van-search>
        </div>
        <div style="padding: 0 16px;" v-if="searchHistory.length">
            <div class="history-search" style="display: flex;justify-content: space-between;align-items: center;">
                <span>历史搜索</span>
                <span @click="deleteHistory">
                    <van-icon name="delete-o" />
                </span>
            </div>
            <div class="history-search" style="margin-top:5px;">
                <div class="history-search-value" v-for="(item, index) in dataHistory" @click="selectTag(item)" :key="index">
                    <span class="history-search-item" >
                        {{ item }}
                    </span>
                </div>
            </div>
            <div class="history-search">
                <span style="color:#337bf6;" @click='openHistory'>{{title}}</span>
            </div>
        </div>

        <div v-if="searchType=='BLOCK'">
            <div class="overview-item-base" @click="toBlockDetail(blockInfo)">
                <div class="block-item">
                    <div class="item">
                        <div class="key">块高</div>
                        <div class="value">{{blockInfo.number}}</div>
                    </div>
                    <div class="item">
                        <div class="key">出块者</div>
                        <div style="overflow: hidden;text-overflow: ellipsis;;">{{seekSealer(blockInfo.sealerList, blockInfo.sealer)}}</div>
                    </div>
                    <div class="item">
                        <div class="key">区块哈希</div>
                        <div class="value">{{blockInfo.transactions.length}}</div>
                    </div>
                    <div class="item-more">
                        <div style="overflow: hidden;text-overflow: ellipsis;" class="item-time">
                            <span>{{timeAge(blockInfo.timestamp) }}</span>
                            <!-- <span style="">更多 ></span> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="searchType=='TX'">
            <div class="overview-item-base" @click="toTxDetail(txInfo)">
                <div class="block-item" >
                    <div class="item">
                        <div class="key">交易哈希</div>
                        <div class="value">{{txInfo.hash}}</div>
                    </div>
                    <div class="item">
                        <div class="key">发送方</div>
                        <div class="value">{{txInfo.from}}</div>
                    </div>
                    <div class="item">
                        <div class="key">接收方</div>
                        <div class="value">{{txInfo.to}}</div>
                    </div>
                    <div class="item">
                        <div class="key">块高</div>
                        <div class="value">{{txInfo.blockNumber}}</div>
                    </div>
                    <div class="item-more">
                        <div style="overflow: hidden;text-overflow: ellipsis;;" class="item-time">
                            <span></span>
                            <!-- <span style="">更多 ></span> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Search, Icon, Dialog } from 'vant';
import { mapState, mapMutations } from "vuex";
import { fetchSearchKw } from '@/api/search.js'
import { getStore, dedupe, dateFormat } from "../../utils/util";
import { Toast } from 'vant'
export default {
    name: "Search",

    data() {
        return {
            searchText: '',
            groupId: sessionStorage.getItem('groupId'),
            blockInfo: {},
            txInfo: {},
            searchType: '',
            showData: false,
            title: '更多>>>'
        }
    },
    created() {
        let searchHistory = getStore("searchHistory");
        if (!searchHistory) {
            searchHistory = [];
        }
        this.$store.commit("search/setHistory", searchHistory);
    },
    mounted() {
        this.$refs.searchInput.focus();
    },
    computed: {
        ...mapState({
            searchHistory: state => state.search.searchHistory
        }),
        dataHistory() {
            if (this.searchHistory.length > 5 && !this.showData) {
                const array = this.searchHistory.filter((value,index) => {
                    return index < 5
                })
                return array
            } else {
                return this.searchHistory
            }
        }
    },
    methods: {
        openHistory() {
            this.showData = !this.showData
            if (this.showData) {
                this.title = '收起'
            } else {
                this.title = '更多>>>'
            }
        },
        onSearch() {
            let keyword = this.searchText.replace(/^\s+|\s+$/g, "");
            if (!keyword) {
                alert("请输入搜索内容");
                return;
            }
            this.querySearch(keyword)
            this.selectTag(keyword)
        },
        selectTag(keyword) {
            this.$store.commit("search/addHistory", keyword);
            this.$store.commit("search/setHistory", dedupe(this.searchHistory));
            this.querySearch(keyword)
        },
        querySearch(keyword) {
            fetchSearchKw(this.groupId, keyword)
                .then(res => {
                    if (res.data.code === 0) {
                        if (keyword.length == 66) {
                            this.searchType = 'TX'

                            this.txInfo = res.data.data
                        } else {
                            this.searchType = 'BLOCK'
                            this.blockInfo = res.data.data
                        }
                    } else {
                        this.txInfo = {}
                        this.blockInfo = {}
                        Toast.fail(res.data.message)
                    }
                })


        },
        deleteHistory() {
            Dialog.confirm({
                message: '删除全部搜索历史',
                confirmButtonColor: '#1989fa'
            })
                .then(() => {
                    this.confirmDelete()
                })
                .catch(() => {
                    // on cancel
                });

        },
        confirmDelete() {
            this.$store.commit("search/setHistory", []);
        },
        toBlockDetail(item) {
            this.$router.push({
                'path': 'block',
                'query': { blockNumber: item.number, blockTimestamp: this.timeAge(item.timestamp) }
            })
        },
        toTxDetail(item) {
            console.log(item);
            this.$router.push({
                'path': 'transaction',
                'query': { transHash: item.hash, blockTimestamp: this.timeAge(item.timestamp) }
            })
        },
        seekSealer(val, index) {
            var dec = parseInt(index, 16)
            return val[dec]
        },
        timeAge(val){
            if(!val) return
            return dateFormat(val)
        }
    }
}
</script>

<style scoped>
.history-search-item {
    word-break: break-all;
    background: #f2f2f2;
    border-radius: 2px;
    padding: 5px 10px;
    margin-bottom: 5px;
    display: inline-block;
}
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
.value {
    /* word-break: break-all; */
    overflow: hidden;
    text-overflow: ellipsis;
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
.search-wrapper >>> .van-search {
    padding: 16px;
}
.history-search-value {
    /* float: left; */
    width: 100%;
}
</style>