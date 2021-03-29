<template>
    <div class="tx-wrapper">
        <van-tabs v-model:active="active" color="#5C86DA" @click="changeTab">
            <van-tab title="交易信息">
                <template v-for="(item , index) in transInfoKey" :key="index">
                    <div v-if="item.key != 'input'" style="display: flex; font-size: 12px; background:#fff; padding:12px 16px;" class="van-hairline--bottom">
                        <template v-if="item.key === 'blockHash'">
                            <div v-if="item.key != 'input'" style="min-width: 75px;">
                                <span style="color: #888888;">
                                    {{item.name}}
                                </span>
                            </div>
                            <template v-if="item.key != 'input'">
                                <div style="width:100%">
                                    <span style="word-break: break-all;">
                                        <router-link :to="{'path': 'block', 'query': {blockHash: transInfoData[item.key],'blockTimestamp': blockTimestamp}}" class="node-ip">
                                            {{transInfoData[item.key]}}
                                        </router-link>
                                    </span>
                                </div>
                            </template>
                        </template>
                        <template v-else-if="item.key === 'blockNumber'">
                            <div v-if="item.key != 'input'" style="min-width: 75px;">
                                <span style="color: #888888;">
                                    {{item.name}}
                                </span>
                            </div>
                            <template v-if="item.key != 'input'">
                                <div style="width:100%">
                                    <span style="word-break: break-all;">
                                        <router-link :to="{'path': 'block', 'query': {blockNumber: transInfoData[item.key], blockTimestamp: blockTimestamp}}" class="node-ip">
                                            {{transInfoData[item.key]}}
                                        </router-link>
                                    </span>
                                </div>
                            </template>
                        </template>
                        <template v-else>
                            <div v-if="item.key != 'input'" style="min-width: 75px;">
                                <span style="color: #888888;">
                                    {{item.name}}
                                </span>
                            </div>
                            <template v-if="item.key != 'input'">
                                <div style="width:100%">
                                    <span style="word-break: break-all;">{{transInfoData[item.key]}}</span>
                                </div>
                            </template>
                        </template>
                        <!-- <div v-if="item.key != 'input'" style="min-width: 75px;">
                            <span style="color: #888888;">
                                {{item.name}}
                            </span>
                        </div>
                        <template v-if="item.key != 'input'">
                            <div style="width:100%">
                                <span style="word-break: break-all;">{{transInfoData[item.key]}}</span>
                            </div>
                        </template> -->
                    </div>
                </template>
                <template v-for="(item , index) in transInfoKey" :key="index" style=" ">
                    <div v-if="item.key == 'input'" style="min-width: 105px;background:#fff; padding:16px 16px;">
                        <span style="color: #888888;">
                            {{item.name}}
                        </span>
                    </div>
                    <template v-if="item.key == 'input'">
                        <div style="padding:0 16px 16px 16px;">
                            <div style="background:#F8F8F8;border-radius: 4px;padding:12px;">
                                <span v-if="showDecode" style="word-break: break-all;">{{transInfoData[item.key]}}</span><br v-if="showDecode">
                                <div v-if="!showDecode">
                                    <div class="iput-key">
                                        <span style="word-break: break-all;">
                                            <span class="input-key-item">方法 </span>
                                            <span>{{funcData +" (" + abiType + outputType + ")"}}</span>
                                        </span>
                                    </div>
                                    <div class="iput-key">
                                        <span style="word-break: break-all;">
                                            <span class="input-key-item">方法ID </span>
                                            <span>{{methodId}}</span>
                                        </span>
                                    </div>
                                    <div style="display: flex;">
                                        <span class="input-key-item"></span>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th style="border:1px solid #EBEEF5;padding: 2px 6px;" v-for="item in inputHead">{{item.name}}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="content in inputData">
                                                    <td style="border:1px solid #EBEEF5;padding: 2px 6px;" v-for="head in inputHead">
                                                        {{content[head.enName]}}
                                                    </td>
                                                </tr>
                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                                <div style="display: flex;margin-top: 5px;">
                                    <span class="input-key-item"></span>
                                    <van-button v-if="inputButtonShow" type="primary" size="mini" @click="decode">{{buttonTitle}}</van-button>
                                </div>
                            </div>
                        </div>

                    </template>
                </template>
            </van-tab>
            <van-tab title="交易回执">
                <div v-for="item in txReceiptInfoList" :key="item">
                    <div v-if="item.key!='logs'" style="display: flex;font-size: 12px; background:#fff; padding:16px 16px;" class="van-hairline--bottom">
                        <div style="min-width: 75px;">
                            <span style="color: #888888;">
                                {{item.name}}
                            </span>
                        </div>
                        <div>
                            <template v-if="item.key == 'output'">
                                <div style="width:100%">
                                    <span style="word-break: break-all;">{{txInfoReceiptMap[item.key]}}</span>
                                </div>
                            </template>
                            <template v-else-if="item.key == 'blockHash'">
                                <div style="width:100%">
                                    <router-link :to="{'path': 'block', 'query': {blockHash: txInfoReceiptMap[item.key],'blockTimestamp': blockTimestamp}}" class="node-ip">
                                        {{txInfoReceiptMap[item.key]}}
                                    </router-link>
                                </div>
                            </template>
                            <template v-else-if="item.key == 'blockNumber'">
                                <div style="width:100%">
                                    <router-link :to="{'path': 'block', 'query': {blockNumber: txInfoReceiptMap[item.key],'blockTimestamp': blockTimestamp}}" class="node-ip">
                                        {{txInfoReceiptMap[item.key]}}
                                    </router-link>
                                </div>
                            </template>
                            <template v-else-if="item.key == 'status'">
                                <div style="width:100%">
                                    <span style="word-break: break-all;" :style="{'color': txStatusColor(txInfoReceiptMap[item.key])}">{{txInfoReceiptMap[item.key]}}</span>
                                </div>
                            </template>
                            <template v-else-if="item.key == 'logsBloom'">
                                <div>
                                    <div style="width:100%" :class="[textVisible=='展开'? 'van-multi-ellipsis--l3': '']">
                                        <span style="word-break: break-all;">{{txInfoReceiptMap[item.key]}}</span>

                                    </div>
                                    <p style="float: right; color:#1989fa" @click="toggleText">{{textVisible}}</p>
                                </div>
                            </template>
                            <template v-else>
                                <div style="width:100%">
                                    <span style="word-break: break-all;">{{txInfoReceiptMap[item.key]}}</span>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div v-else style="font-size: 12px; background:#fff; padding:16px 16px;">
                        <div>
                            <div style="color:#888888;">
                                {{item.key}}
                            </div>
                            <div>
                                <span v-if="txInfoReceiptMap[item.key]&& !txInfoReceiptMap[item.key].length">{{txInfoReceiptMap[item.key]}}</span>
                                <div v-for="(item,index) in eventLog" class="event-log">
                                    <div style="display: flex;">
                                        <span class="event-log-key">Address </span>
                                        <span class="event-log-value" style="word-break: break-all;">{{item.address}}</span>
                                    </div>
                                    <div style="display: flex;">
                                        <span class="event-log-key">Name </span>
                                        <span class="event-log-value" style="word-break: break-all;">{{item.eventName}}</span>
                                    </div>
                                    <div style="display: flex;">
                                        <span class="event-log-key">Topics </span>
                                        <div>
                                            <span class="event-log-value topics"  v-for="(val,index) in item.topics ">[{{index}}] {{val}}</span>
                                        </div>
                                        

                                    </div>
                                    <div style="display: flex;">
                                        <span class="event-log-key">data </span>
                                        <span v-if="!item.eventDataShow" class="input-data">{{item.data}}</span>
                                        <span v-if="item.eventDataShow">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th style="border:1px solid #EBEEF5;padding: 2px 6px;" v-for="item in logsHead">{{item.name}}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="content in item.eventLgData">
                                                        <td style="border:1px solid #EBEEF5;padding: 2px 6px;" v-for="head in logsHead">
                                                            <span v-if="content[head.enName]">
                                                                {{content[head.enName]}}
                                                            </span>
                                                            <span v-else>
                                                                /
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>

                                            </table>
                                        </span>
                                    </div>
                                    <div style="display: flex;margin-top: 5px;">
                                        <span class="event-log-key"> </span>
                                        <van-button type="primary" size="mini" @click="decodeLogBtn(item,index)">{{item.eventTitle}}</van-button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import { reactive, ref, toRefs, onMounted, } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast, Collapse, CollapseItem, Divider, Button } from 'vant';
import { hashTransactionInfo, getTransactionReceipt, getFunctionAbi } from '@/api/transaction.js'

export default {
    name: 'Transaction',
    setup() {
        const textVisible = ref('展开')

        const route = useRoute()
        const router = useRouter()
        const transHash = route.query.transHash
        const blockTimestamp = route.query.blockTimestamp
        const groupId = sessionStorage.getItem('groupId')
        const activeNames = ref(['1']);
        const active = ref(0)
        const methodId = ref('')
        const funcData = ref('')
        const funcOutData = ref('')
        const inputButtonShow = ref(true)
        const showDecode = ref(false)
        const outputShow = ref(false)
        const unEvent = ref(false)
        const eventSHow = ref(false)
        const buttonTitle = ref('还原')
        const transInfoKey = ref([
            {
                key: "hash",
                name: '交易哈希'
            }, {
                key: "from",
                name: '发送方'
            }, {
                key: "to",
                name: '接收方'
            }, {
                key: "timestamp",
                name: '交易时间'
            }, {
                key: "blockHash",
                name: '区块哈希'
            }, {
                key: "blockNumber",
                name: '块高'
            }, {
                key: "gas",
                name: 'Gas上限'
            },
            // {
            //     key: "nonceRaw",
            //     name: 'Nonce Raw'
            // },
            {
                key: "input",
                name: '输入'
            }
        ])
        const txReceiptInfoList = ref([
            // {
            //     key: "output",
            //     name: '输出'
            // },
            {
                key: "transactionHash",
                name: '交易哈希'
            },
            {
                key: "blockHash",
                name: '区块哈希'
            },
            {
                key: "gasUsed",
                name: '使用Gas'
            },
            {
                key: "blockNumber",
                name: '块高'
            },
            {
                key: "contractAddress",
                name: '合约地址'
            },
            {
                key: "from",
                name: '发送方'
            },
            {
                key: "to",
                name: '接收方'
            },
            {
                key: "logsBloom",
                name: 'LogsBloom'
            },
            {
                key: "status",
                name: '状态'
            },
            {
                key: "logs",
                name: 'Logs'
            },
            // "output",
            // "blockHash",
            // "gasUsed",
            // "blockNumber",
            // "contractAddress",
            // "from",
            // "transactionIndex",
            // "to",
            // "logsBloom",
            // "transactionHash",
            // "status",
            // "logs"
        ])
        const state = reactive({
            transInfoData: {},
            txInfoReceiptMap: {},
            eventLog: [],
            methodData: {},
            abiType: [],
            outputType: null,
            decodeData: {},
            inputData: [],
            inputHead: [
                {
                    enName: 'name',
                    name: 'Name'
                },
                {
                    enName: 'type',
                    name: 'Type'
                },
                {
                    enName: 'data',
                    name: 'Data'
                },
            ],
            logsHead: [
                {
                    enName: 'name',
                    name: 'Name'
                },
                {
                    enName: 'data',
                    name: 'Data'
                },
            ]
        })

        onMounted(() => {
            queryTransaction()
        })
        const queryTransaction = async () => {
            //tx info 
            const txInfoParam = {
                groupId: groupId,
                transHash: transHash
            };
            const txInfoData = await hashTransactionInfo(txInfoParam, {})
            if (txInfoData.data.code === 0) {
                txInfoData.data.data.timestamp = blockTimestamp
                state.transInfoData = txInfoData.data.data
            } else {
                Toast.fail(txInfoData.data.message)
            }
            //tx receipt
            const txReceiptParam = {
                groupId: groupId,
                transHash: transHash
            }
            const txReceiptData = await getTransactionReceipt(txReceiptParam, {})
            if (txReceiptData.data.code === 0) {
                state.txInfoReceiptMap = txReceiptData.data.data
                txReceiptData.data.data.logs.forEach((log, index) => {
                    log.eventDataShow = true,
                        log.eventTitle = '还原',
                        log.index = index
                })
                state.eventLog = txReceiptData.data.data.logs
            } else {
                Toast.fail(txReceiptData.data.message)
            }
            const to = state.transInfoData.to
            const input = state.transInfoData.input
            const output = state.txInfoReceiptMap.output
            if (to && to != "0x0000000000000000000000000000000000000000") {
                const functionAbiParam = {
                    groupId: groupId,
                    data: input.substring(0, 10)
                }
                const functionAbiData = await getFunctionAbi(functionAbiParam, {})
                if (functionAbiData.data.code === 0) {
                    state.methodData = functionAbiData.data.data
                    decodefun(input, functionAbiData.data.data)
                    if (output) {
                        // decodeOutPutfun(output,functionAbiData.data.data);
                        outputShow.value = true
                    } else {
                        outputShow.value = false
                    }
                } else {
                    Toast.fail(functionAbiData.data.message)
                }

            } else {
                // getDeloyAbi(input, output);
            }
            decodeEventClick()
        }

        //解析input
        const decodefun = (input, abiData) => {
            const Web3EthAbi = require('web3-eth-abi');
            methodId.value = input.substring(0, 10);
            const inputDatas = "0x" + input.substring(10);
            if (abiData) {
                abiData.abiInfo = JSON.parse(abiData.abiInfo)
                abiData.abiInfo.inputs.forEach((val, index) => {
                    if (val && val.type && val.name) {
                        state.abiType[index] = val.type + " " + val.name;
                    } else if (val && val.name) {
                        state.abiType[index] = val.name;
                    } else if (val && val.type) {
                        state.abiType[index] = val.type;
                    } else if (val) {
                        state.abiType[index] = val;
                    }
                });
                if (abiData.abiInfo.outputs && abiData.abiInfo.outputs.length) {
                    const outputType = []
                    abiData.abiInfo.outputs.forEach((val, index) => {
                        if (val && val.type && val.name) {
                            outputType[index] = val.type + " " + val.name;
                        } else if (val && val.name) {
                            outputType[index] = val.name;
                        } else if (val && val.type) {
                            outputType[index] = val.type;
                        } else if (val) {
                            outputType[index] = val;
                        }
                    });
                    state.outputType = " returns "
                    for (let i = 0; i < outputType.length; i++) {
                        state.outputType = state.outputType + outputType[i]
                    }
                } else {
                    state.outputType = ""
                }

                funcData.value = abiData.abiInfo.name;
                if (abiData.abiInfo.inputs.length) {
                    state.decodeData = Web3EthAbi.decodeParameters(abiData.abiInfo.inputs, inputDatas);
                    if (JSON.stringify(state.decodeData) != "{}") {
                        for (const key in state.decodeData) {
                            abiData.abiInfo.inputs.forEach((val, index) => {
                                if (val && val.name && val.type) {
                                    if (key === val.name) {
                                        state.inputData[index] = {};
                                        state.inputData[index].name = val.name;
                                        state.inputData[index].type = val.type;
                                        state.inputData[index].data = state.decodeData[key];
                                    }
                                } else if (val) {
                                    if (index == key) {
                                        state.inputData[index] = {};
                                        state.inputData[index].type = val;
                                        state.inputData[index].data = state.decodeData[key];
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
        //解析output
        const decodeOutPutfun = (output, abiData) => {
            console.log(output, abiData, 'xxxx');
            const web3 = new Web3(Web3.givenProvider);
            console.log(web3);
        }
        //解析logs
        const decodeEventClick = async () => {
            for (let i = 0; i < state.eventLog.length; i++) {
                if (state.eventLog[i]['data'] === '0x') {
                    unEvent.value = true
                    return;
                }
                let logsParam = {
                    groupId: groupId,
                    data: state.eventLog[i].topics[0]
                }
                const logsData = await getFunctionAbi(logsParam, {})
                if (logsData.data.code == 0) {
                    if (logsData.data.data) state.eventLog[i] = decodeEvent(logsData.data.data, state.eventLog[i]);
                    setTimeout(() => {
                        eventSHow.value = true;
                    }, 200)
                } else {
                    Toast.fail(logsData.data.message)

                }
            }
        }
        const decodeEvent = (eventData, data) => {
            let Web3EthAbi = require('web3-eth-abi');
            let abi = "";
            eventData.abiInfo = JSON.parse(eventData.abiInfo)
            let list = data;
            list.eventTitle = '还原'
            list.eventDataShow = true;
            list.eventButtonShow = true;
            list.eventName = eventData.abiInfo.name + "(";
            for (let i = 0; i < eventData.abiInfo.inputs.length; i++) {
                if (i == eventData.abiInfo.inputs.length - 1) {
                    if (eventData.abiInfo.inputs[i]['indexed']) {
                        list.eventName = list.eventName + eventData.abiInfo.inputs[i].type + " " + "indexed" + " " + eventData.abiInfo.inputs[i].name;
                    } else {
                        list.eventName = list.eventName + eventData.abiInfo.inputs[i].type + " " + eventData.abiInfo.inputs[i].name;
                    }

                } else {
                    if (eventData.abiInfo.inputs[i]['indexed']) {
                        list.eventName = list.eventName + eventData.abiInfo.inputs[i].type + " " + "indexed" + " " + eventData.abiInfo.inputs[i].name + ",";
                    } else {
                        list.eventName = list.eventName + eventData.abiInfo.inputs[i].type + " " + eventData.abiInfo.inputs[i].name + ",";
                    }

                }
            }
            list.eventName = list.eventName + ")";
            let eventResult = Web3EthAbi.decodeLog(eventData.abiInfo.inputs, list.data, list.topics.slice(1));
            list.outData = {};
            list.eventLgData = [];
            for (const key in eventResult) {
                if (+key || +key == 0) {
                    list.outData[key] = eventResult[key];
                }
            }
            if (eventData.abiInfo.inputs.length && JSON.stringify(list.outData) != "{}") {
                for (const key in list.outData) {
                    eventData.abiInfo.inputs.forEach((items, index) => {
                        if (index == key) {
                            list.eventLgData[index] = {};
                            list.eventLgData[index].name = items.name;
                            list.eventLgData[index].data = list.outData[key];
                        }
                    });
                }
            }
            return list
        }
        const changePanel = (activeNames) => {

        }
        const changeTab = (name) => {

        }
        const decode = () => {
            if (showDecode.value) {
                buttonTitle.value = '还原';
                showDecode.value = false;
            } else {
                buttonTitle.value = '解码';
                showDecode.value = true;
            }

        }
        const decodeLogBtn = (item, index) => {
            console.log(item, index);
            if (item.index == index) {

                item.eventDataShow = !item.eventDataShow
                if (item.eventDataShow) {
                    item.eventTitle = '还原'
                } else {
                    item.eventTitle = '解码'
                }
            }
        }
        const txStatusColor = (val) => {
            if (val == '0x0') {
                return '#67C23A'
            } else {
                return '#F56C6C'
            }
        }
        const toggleText = () => {
            if (textVisible.value == '展开') {
                textVisible.value = '收起'
            } else {
                textVisible.value = '展开'
            }
        }
        return {
            ...toRefs(state),
            activeNames,
            transInfoKey,
            changePanel,
            blockTimestamp,
            methodId,
            funcData,
            funcOutData,
            buttonTitle,
            inputButtonShow,
            showDecode,
            decode,
            txReceiptInfoList,
            txStatusColor,
            decodeLogBtn,
            active,
            changeTab,
            textVisible,
            toggleText
        }
    },
    methods: {

    }
}
</script>

<style scoped>
.input-data {
    word-break: break-all;
}
.tx-wrapper {
    margin-top: 13px;
}
.tx-wrapper >>> .van-tabs__content {
    margin-top: 12px;
}
.input-key-item {
    min-width: 70px;
    display: inline-block;
    padding: 5px 0;
    font-size: 12px;
    color: #888888;
}
table {
    border-spacing: 0px;
}
.event-log {
    background: #f8f8f8;
    border-radius: 4px;
    padding: 12px;
    margin-top: 12px;
}
.event-log-key {
    color:#888888;
    min-width: 65px;
    display: inline-block;
    padding: 5px 0;
}
.event-log-value {
    padding: 5px 0;

}
.topics {
    display: inline-block;
    word-break: break-all;
}
</style>