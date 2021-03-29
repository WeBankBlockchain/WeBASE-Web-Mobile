<template>
    <div style="background: rgba(92,134,218,0.05);">
        <div class="home-wrapper">
            <van-popup v-model:show="show" position="left" overlay-class="menu-wrapper" :teleport="myContainer">
                <div class="popup-wrapper">
                    <div class="user-wrapper">
                        <i class="wbs-icon-user-icon user-icon" style="color: #5C86DA;font-size: 36px;"></i>
                        <span class="user-name">{{user}}</span>
                        <van-icon name="wap-nav" color="#888888" size="22px" @click="showPopup" class="user-right-icon" />
                    </div>
                    <div class="help-out-wrapper">
                        <div class="help-wrapper">
                            <a style="color: #222222;" v-if="clientVersion>=2.5" target="_blank" href="https://fisco-bcos-documentation.readthedocs.io/zh_CN/latest/docs/design/security_control/chain_governance.html">
                                <van-icon name="info-o" />
                                帮助文档
                            </a>
                            <a style="color: #222222;" v-else target="_blank" href="https://webasedoc.readthedocs.io/zh_CN/latest/">
                                <van-icon name="info-o" />
                                帮助文档
                            </a>
                        </div>
                        <div class="logout-wrapper" @click="handleLoginOut">
                            <van-icon class-prefix="wbs-icon" name="logout" />
                            退出
                        </div>
                    </div>
                </div>
            </van-popup>
        </div>

        <div>
            <div class="van-nav-bar van-hairline--bottom">
                <div class="van-nav-bar__content">
                    <div class="van-nav-bar__left">
                        <van-icon name="wap-nav" color="#888888" size="22px" @click="showPopup" />
                    </div>
                    <div class="van-nav-bar__title" style="height:100%;">
                        <svg style="width: 90px;height: 100%;fill: currentColor;overflow: hidden;" aria-hidden="true">
                            <use xlink:href="#wbs-icon-WeBASE"></use>
                        </svg>
                    </div>
                    <div class="van-nav-bar__right">
                        <van-dropdown-menu active-color="#1989fa" class="home-group">
                            <van-dropdown-item v-model="groupId" :options="groupList" @change="changeGroup" />
                        </van-dropdown-menu>
                    </div>
                </div>
            </div>
        </div>

        <div class="search-wrapper">
            <van-search background='rgba(92,134,218,0.05)' v-model="searchValue" placeholder="请输入块高/交易Hash" @focus="focus" />
        </div>
        <div style="font-size:12px;padding: 0 16px;">
            <van-row gutter="16">
                <van-col span="12">
                    <div class="overview-base" style="background: #73baf6;">
                        <div style="font-size:16px;display: flex;justify-content: space-between;align-items: center;">
                            <span style="font-size: 24px;color: #FFFFFF;">{{overviewInfo.nodeCount}}</span>
                            <span>
                                <!-- <svg class="overview-item-svg" aria-hidden="true">
                                    <use xlink:href="#wbs-icon-node1"></use>
                                </svg> -->
                            </span>
                        </div>
                        <div style="margin-top: 10px;color: #FFFFFF;">节点个数</div>
                    </div>
                </van-col>
                <van-col span="12">
                    <div class="overview-base" style="background: #6CC8E6;">
                        <div style="font-size:16px;display: flex;justify-content: space-between;align-items: center;">
                            <span style="font-size: 24px;color: #FFFFFF;">
                                {{overviewInfo.contractCount}}
                            </span>

                        </div>
                        <div style="margin-top: 10px;color: #FFFFFF;">
                            已部署的智能合约
                        </div>
                    </div>

                </van-col>
            </van-row>
            <van-row gutter="16" style="margin-top: 16px;">
                <van-col span="12">
                    <div class="overview-base" style="background: #ECAC7B;">
                        <div style="font-size:16px;display: flex;justify-content: space-between;align-items: center;">
                            <span style="font-size: 24px;color: #FFFFFF;">
                                {{overviewInfo.latestBlock}}
                            </span>
                        </div>
                        <div style="margin-top: 10px;color: #FFFFFF;">区块数量</div>
                    </div>
                </van-col>
                <van-col span="12">
                    <div class="overview-base" style="background: #8AAEFD;">
                        <div style="font-size:16px;display: flex;justify-content: space-between;align-items: center;">
                            <span style="font-size: 24px;color: #FFFFFF;">
                                {{overviewInfo.transactionCount}}
                            </span>
                            <span>

                            </span>
                        </div>
                        <div style="margin-top: 10px;color: #FFFFFF;">
                            交易数量
                        </div>
                    </div>

                </van-col>
            </van-row>
        </div>
        <!-- <div style="display: flex;flex-wrap: wrap-reverse;">
            <div class="overview-item" style="font-size:0" v-for="item in detailsList" :key='item.label' :class="item.bg">
                <div>
                    <div class="overview-item-img">
                    <svg class="overview-item-svg" aria-hidden="true" v-if='item.icon == "#wbs-icon-node1"'>
                        <use xlink:href="#wbs-icon-node1"></use>
                    </svg>
                    <svg class="overview-item-svg" aria-hidden="true" v-else-if='item.icon == "#wbs-icon-contract"'>
                        <use xlink:href="#wbs-icon-contract"></use>
                    </svg>
                    <svg class="overview-item-svg" aria-hidden="true" v-else-if='item.icon == "#wbs-icon-block"'>
                        <use xlink:href="#wbs-icon-transation"></use>
                    </svg>
                    <svg class="overview-item-svg" aria-hidden="true" v-else-if='item.icon == "#wbs-icon-transation"'>
                        <use xlink:href="#wbs-icon-block"></use>
                    </svg>
                </div>
                <div class="overview-item-content">
                    <div class="overview-item-number">{{item.value}}</div>
                    <div class="overview-item-title">{{item.label}}</div>
                </div>
                </div>
            </div>
           
        </div> -->
        <div class="chart-wrapper" ref="chart">
            <line-charts :reloadNum="reloadNum" :date="chartStatistics.date" :dataArr="chartStatistics.dataArr" :chartsData="chartStatistics"></line-charts>
        </div>
        <div class="overview-item-base" style="margin-top: 8px;">
            <span style="color: #888888;font-weight: 400;">节点列表</span>
        </div>
        <div class="overview-item-base">

            <div class="block-item" v-for="item in nodeData" :key='item.blockNumber'>
                <div class="item">
                    <div class="key">节点ID</div>
                    <div style="overflow: hidden;text-overflow: ellipsis;padding-right:5px;">{{item.nodeId}}</div>
                    <span class="copy-key" @click="handleCopy(item.nodeId, $event)">复制</span>
                </div>
                <div class="item">
                    <div class="key">块高</div>
                    <div style="overflow: hidden;text-overflow: ellipsis;">{{item.blockNumber}}</div>
                </div>
                <div class="item">
                    <div class="key">pbftView</div>
                    <div style="overflow: hidden;text-overflow: ellipsis;;">{{item.pbftView}}</div>
                </div>
                <div class="item">
                    <div class="key">运行状态</div>
                    <div style="overflow: hidden;text-overflow: ellipsis;;">
                        <span class="circle-dot" :style="{'background': textColor(item.nodeActive)}">
                        </span>
                        <span style="margin-left:4px;">
                            {{nodesStatus(item.nodeActive)}}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <van-tabs v-model:active="active" sticky color="#5C86DA" background="#f8f8fa" @click="changeTab">
                <van-tab title="区块">
                    <div class="overview-item-base" style="">
                        <div class="block-item" style=" padding-bottom: 0;" v-for="item in blockData" :key='item.blockNumber'>
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
                                <div style="overflow: hidden;text-overflow: ellipsis;;">{{item.transCount}}</div>
                            </div>
                            <div class="item-more" @click="toBlockDetail(item)">
                                <div style="overflow: hidden;text-overflow: ellipsis;" class="item-time">
                                    <span>{{item.blockTimestamp}}</span>
                                    <span style="">更多 ></span>
                                </div>
                            </div>
                        </div>
                        <div style="text-align: center;padding-bottom: 18px;" @click="toBlockInfo">
                            <span style="color:#337bf6;">查看更多>>></span>
                        </div>
                    </div>

                </van-tab>
                <van-tab title="交易">
                    <div class="overview-item-base">
                        <div class="block-item" style=" padding-bottom: 0;" v-for="item in transactionList" :key='item.transHash'>

                            <div class="item">
                                <div class="key">交易哈希</div>
                                <router-link :to="{'path': 'transaction', 'query': {transHash: item.transHash, blockTimestamp:item.blockTimestamp}}" style="overflow: hidden;text-overflow: ellipsis;;">
                                    {{item.transHash}}
                                </router-link>
                            </div>
                            <div class="item">
                                <div class="key">发送方</div>
                                <div style="overflow: hidden;text-overflow: ellipsis;;">{{item.transFrom}}</div>
                            </div>
                            <div class="item">
                                <div class="key">接收方</div>
                                <div style="overflow: hidden;text-overflow: ellipsis;;">{{item.transTo}}</div>
                            </div>
                            <div class="item">
                                <div class="key">块高</div>
                                <div style="overflow: hidden;text-overflow: ellipsis;;">{{item.blockNumber}}</div>
                            </div>
                            <div class="item-more" @click="toTxDetail(item)">
                                <div style="overflow: hidden;text-overflow: ellipsis;;" class="item-time">
                                    <span>{{item.blockTimestamp}}</span>
                                    <span style="">更多 ></span>
                                </div>
                            </div>
                        </div>
                        <div style="text-align: center;padding-bottom: 18px;" @click="toTxInfo">
                            <span style="color:#337bf6;">查看更多>>></span>
                        </div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>

    </div>
</template>
<script>

import { reactive, ref, toRefs, onMounted, provide, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getChartData, getNetworkStatistics, getNodeList, getBlockPage, getTransactionList, getConsensusNodeId, getGroupsInvalidIncluded } from '@/api/home.js'
import { loginOut } from "@/api/login.js";
import { Toast, Cell, CellGroup, List, Tab, Tabs, Swipe, SwipeItem, Search, Popup, Divider, DropdownMenu, DropdownItem } from 'vant';
import { changWeek, numberFormat, unique } from "@/utils/util.js";
import clip from '@/utils/clipboard.js'
import lineCharts from "@/components/Charts/LineCharts";
import * as echarts from 'echarts'
export default {
    name: 'Home',
    components: {
        lineCharts
    },
    setup() {
        provide('ec', echarts)
        const clientVersion = localStorage.getItem('clientVersion')
        const myContainer = document.querySelector('.home-wrapper');
        const show = ref(false);
        const reloadNum = ref(1)
        const searchValue = ref('');
        const active = ref(0);
        const groupId = ref(+sessionStorage.getItem('groupId'))
        const router = useRouter()
        const state = reactive({
            loading: false,
            finished: false,
            nodeData: [],
            blockData: [],
            transactionList: [],
            reqData: {
                groupId: groupId.value,
                pageNumber: 1,
                pageSize: 2
            },
            reqNode: {
                groupId: groupId.value,
                pageNumber: 1,
                pageSize: 100
            },
            reqQuery: {},
            chartStatistics: {
                show: false,
                date: [],
                dataArr: [],
                chartSize: {
                    width: 0,
                    height: 0
                }
            },
            detailsList: [
                {
                    label: "节点数量",
                    name: "nodeCount",
                    value: 0,
                    icon: "#wbs-icon-node1",
                    bg: 'node-bg'
                },
                {
                    label: '已部署的智能合约',
                    name: "contractCount",
                    value: 0,
                    icon: "#wbs-icon-contract",
                    bg: 'contract-bg'
                },
                {
                    label: '区块数量',
                    name: "latestBlock",
                    value: 0,
                    icon: "#wbs-icon-block",
                    bg: "block-bg"
                },
                {
                    label: '交易数量',
                    name: "transactionCount",
                    value: 0,
                    icon: "#wbs-icon-transation",
                    bg: 'transation-bg'
                }
            ],
            overviewInfo: {},
            groupList: [],

        })
        const onLoad = () => {
            queryBlockList()
            queryTransactionList()
        };
        const changeTab = (name) => {
            sessionStorage.setItem('homeTab', name)
            state.reqData = {
                groupId: groupId.value,
                pageNumber: 1,
                pageSize: 2
            }
            state.reqNode = {
                groupId: groupId.value,
                pageNumber: 1,
                pageSize: 100
            }
            switch (name) {
                case 0:
                    queryBlockList()
                    break;
                case 1:
                    queryTransactionList()
                    break;
            }
        }
        const showPopup = () => {
            show.value = !show.value;
        };
        const handleLoginOut = () => {
            queryLoginOut();
        };

        onMounted(() => {
            queryGroupInfo()
        })
        const queryAll = () => {
            queryNetworkDetails()
            queryCharts()
            queryBlockList()
            queryTransactionList()
            queryNodeList()
        }
        const queryGroupInfo = async () => {
            const { data } = await getGroupsInvalidIncluded(groupId.value)
            if (data.code === 0) {
                const groupList = data.data
                if (groupList && groupList.length) {
                    const groupIdList = groupList.map(item => {
                        return item.groupId
                    })
                    const list = groupList.map(item => {
                        return {
                            text: item.groupName,
                            value: item.groupId,
                            groupStatus: item.groupStatus
                        }
                    })
                    state.groupList = list;
                    if (!groupIdList.includes(groupId.value) || !sessionStorage.getItem('groupId')) {
                        groupId.value = list[0]['value']
                        state.reqData.groupId = list[0]['value']
                        state.reqNode.groupId = list[0]['value']
                        sessionStorage.setItem("groupId", list[0].value)
                    }
                    queryAll()
                }

            } else {
                groupList.value = [];
                Toast.fail(data.message)
                sessionStorage.setItem("groupId", "")
            }
        }
        const queryNetworkDetails = async () => {
            const { data } = await getNetworkStatistics(groupId.value)
            if (data.code === 0) {
                state.overviewInfo = data.data
                state.detailsList.forEach((value) => {
                    for (let i in data.data) {
                        if (value.name === i) {
                            value.value = data.data[i];
                        }
                    }
                });
            } else {
                Toast.fail(data.message)
            }
        }
        const queryCharts = async () => {
            state.chartStatistics.date = [];
            state.chartStatistics.dataArr = [];
            const { data } = await getChartData(groupId.value)
            reloadNum.value += 1
            if (data.code === 0) {
                const resData = changWeek(data.data);
                for (let i = 0; i < resData.length; i++) {
                    state.chartStatistics.date.push(resData[i].day);
                    state.chartStatistics.dataArr.push(
                        resData[i].transCount
                    );
                }
            } else {
                Toast.fail(data.message)
            }
        }
        const queryBlockList = async () => {
            const { data } = await getBlockPage(state.reqData, state.reqQuery);
            state.loading = false;
            if (data.code === 0) {
                state.blockData = data.data
                // state.blockData = state.blockData.concat(data.data)
                // if (state.blockData.length >= data.totalCount) {
                //     state.finished = true;
                // }
            } else {
                Toast.fail(data.message)
            }
        }
        const queryTransactionList = async () => {
            const { data } = await getTransactionList(state.reqData, state.reqQuery);
            state.loading = false;
            if (data.code === 0) {
                state.transactionList = data.data
                // state.transactionList = state.transactionList.concat(data.data)
                // if (state.transactionList.length >= data.totalCount) {
                //     state.finished = true;
                // }
            } else {
                Toast.fail(data.message)
            }
        }
        const queryNodeList = async () => {
            console.log('queryNodeList', state.reqNode);
            const { data } = await getNodeList(state.reqNode, state.reqQuery);
            state.loading = false;
            if (data.code === 0) {
                state.nodeData = data.data
            } else {
                Toast.fail(data.message)
            }
        }
        const queryLoginOut = async () => {
            const { data } = await loginOut();
            router.push({ path: `/login` });
        };
        const changeGroup = (value) => {
            groupId.value = value
            state.reqData = {
                groupId: value,
                pageNumber: 1,
                pageSize: 2
            }
            state.reqNode = {
                groupId: groupId.value,
                pageNumber: 1,
                pageSize: 100
            }
            state.transactionList = []
            state.blockData = []
            state.loading = false
            state.finished = false
            sessionStorage.setItem("groupId", value);
            queryAll()
        }
        const onClickRight = () => {
            router.push("set")
        }
        const focus = (event) => {
            router.push("/search")
        }
        return {
            ...toRefs(state),
            onLoad,
            active,
            changeTab,
            searchValue,
            focus,
            changeGroup,
            onClickRight,
            groupId,
            reloadNum,
            show,
            showPopup,
            myContainer,
            handleLoginOut,
            clientVersion
        }
    },
    data() {
        return {
            user: sessionStorage.getItem('user')
        }
    },
    mounted() {

    },
    methods: {
        toBlockInfo() {
            this.$router.push("blockInfo")
        },
        toTxInfo() {
            this.$router.push("txInfo")
        },
        toBlockDetail(item) {
            this.$router.push({
                'path': 'block',
                'query': { blockNumber: item.blockNumber, blockTimestamp: item.blockTimestamp }
            })
        },
        toTxDetail(item) {
            this.$router.push({
                'path': 'transaction',
                'query': { transHash: item.transHash, blockTimestamp: item.blockTimestamp }
            })
        },
        handleCopy(text, event) {
            clip(text, event)
        },
        nodesStatus(val) {
            let transString = "";
            switch (val) {
                case 1:
                    transString = '运行';
                    break;
                case 2:
                    transString = '异常';
                    break;
                case 3:
                    transString = '启动中';
                    break;
                case 4:
                    transString = '停止';
                    break;
            }
            return transString;
        },
        textColor(val) {
            let colorString = "";
            switch (val) {
                case 1:
                    colorString = "#67C23A";
                    break;
                case 2:
                    colorString = "#F56C6C";
                    break;
                case 2:
                    colorString = "#E6A23C";
                    break;
                case 2:
                    colorString = "#909399";
                    break;
            }
            return colorString;
        },
    }
}
</script>
<style scoped>
.home-group >>> .van-dropdown-menu__bar {
    box-shadow: none;
}
.node-bg {
    background: linear-gradient(102.87deg, #4ccbf3 0%, #94eefb 100%);
}
.contract-bg {
    background: linear-gradient(102.87deg, #4886ff 0%, #62b0f8 100%);
}
.block-bg {
    background: linear-gradient(102.87deg, #7280ff 0%, #98afff 100%);
}
.transation-bg {
    background: linear-gradient(102.87deg, #ff9472 0%, #ffc1ad 100%);
}

.overview-item {
    height: 85px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    box-sizing: border-box;
}
.overview-item-img {
}
.overview-item-svg {
    width: 20px;
    height: 20px;
}

.overview-item-content {
    font-size: 12px;
    display: inline-block;
    padding-left: 2px;
}

.overview-item-number {
    font-size: 12px;
    color: #fff;
}
.overview-item-title {
    width: 100%;
    color: #fff;
    min-width: 113px;
}
.block-title {
    text-align: left;
    padding-left: 5px;
}
.block-item {
    background: #ffffff;
    padding: 16px 12px;

    margin-bottom: 16px;
    box-shadow: 0 0 10px 0 rgba(201, 223, 255, 0.5);
    border-radius: 6px;
}
.overview-wrapper > p {
    padding: 26px 18px 0px 22px;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    justify-content: space-between;
}
.overview-title {
    font-size: 15px;
    color: #2e384d;
    padding-bottom: 22px;
    border-bottom: 2px solid #2e384d;
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
.circle-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: #fff;
    margin-bottom: 2px;
}
.copy-key {
    display: inline-block;
    min-width: 30px;
    font-size: 12px;
    color: #5c86da;
    font-weight: 400;
}
.block-amount {
    display: -webkit-flex;
    display: -moz-flex;
    display: flex;
    flex-flow: column;
}
.overview-item-base {
    margin: 16px;
    margin-bottom: 0;
    font-size: 12px;
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
.trans-hash {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.block-trans {
    display: inline-block;
    padding: 0 2px;
    background-color: #f6f7f8;
    color: #337bf6;
    cursor: pointer;
}
.home-bar {
}
.search-wrapper >>> .van-search {
    padding: 16px;
}
.search-wrapper >>> .van-search__content {
    background: #fff;
}
.chart-wrapper {
    padding: 16px;
}
.menu-wrapper {
    background-color: #4886ff;
}
.popup-wrapper {
    width: 240px;
    height: 100%;
    background: #fff;
}
.user-wrapper {
    height: 78px;
    background: #f6f6f6;
    display: flex;
    justify-content: left;
    align-items: center;
}
.user-icon {
    margin-left: 16px;
}
.user-right-icon {
    margin-left: 70px;
}
.user-name {
    font-size: 16px;
    color: #222222;
    font-weight: 500;
    margin-left: 10px;
}
.home-wrapper >>> .van-popup {
    height: 100%;
}
.help-out-wrapper {
    margin-top: 20px;
}
.help-wrapper {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    color: #222222;
    font-weight: 400;
    padding-left: 16.5px;
}
.logout-wrapper {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    color: #222222;
    font-weight: 400;
    padding-left: 16.5px;
}
.overview-base {
    box-shadow: 0 0 10px 0 rgba(201, 223, 255, 0.5);
    border-radius: 6px;
    height: 44px;
    padding: 16px;
}
</style>