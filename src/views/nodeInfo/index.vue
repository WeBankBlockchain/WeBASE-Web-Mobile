<template>
    <div>
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset="20" :immediate-check="false">
            <div class="overview-item-base">
                <div class="block-item" v-for="item in nodeData" :key='item.nodeId'>
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
        </van-list>
    </div>
</template> 
<script>
import { reactive, ref, toRefs, onMounted, provide, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNodeList, getConsensusNodeId } from '@/api/node.js'
import clip from '@/utils/clipboard.js'
import { Toast } from 'vant';

export default {
    name: 'TxInfo',
    setup() {
        const groupId = ref(+sessionStorage.getItem('groupId'))
        const state = reactive({
            loading: false,
            finished: false,
            nodeData: [],
            reqData: {
                groupId: groupId.value,
                pageNumber: 1,
                pageSize: 7
            },
            reqQuery: {}
        })
        const queryNodeList = async () => {   
            //请求接口
            const {data} = await getNodeList(state.reqData, state.reqQuery)
            return data
            
        }
        const queryList = async () => {
            const data = await queryNodeList()
            state.loading = false;
            if (data.code === 0) {
                state.nodeData = state.nodeData.concat(data.data)
                console.log(state.nodeData,data.data)
                if (state.nodeData.length >= data.totalCount) {
                    state.finished = true;
                }
            } else {
                Toast.fail(data.message)
            }
        }
        
        const onLoad = () => {
            state.reqData.pageNumber += 1
            queryList()
        };
        onMounted(() => {
            //初始化列表接口
            queryList()
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
    padding-bottom: 12px;
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
.copy-key {
    display: inline-block;
    min-width: 30px;
    font-size: 12px;
    color: #5c86da;
    font-weight: 400;
}
.circle-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: #fff;
    margin-bottom: 2px;
}
</style>