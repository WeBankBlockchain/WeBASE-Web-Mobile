<template>
    <div class="overview-item-base">
        <div v-for="item in blockDetailKey">
            <template v-if="item.enName == 'transactions'">
                <div style="background:#fff;padding:12px 0px;">
                    <span style="color: #888888;">交易列表</span>
                </div>
                <div style="">
                    <div style="background:#F8F8F8;border-radius: 4px;padding:12px;" v-for="it in blockInfoData[item.enName]">
                        <div class="item">
                            <div class="key">交易哈希</div>
                            <div style="word-break: break-all;">
                                <router-link :to="{'path': 'transaction', 'query': {transHash: it.hash, blockTimestamp: blockTimestamp}}" class="node-ip">
                                    {{it.hash}}
                                </router-link>
                            </div>
                        </div>
                        <div class="item">
                            <div class="key">发送方</div>
                            <div style="word-break: break-all;">{{it.from}}</div>
                        </div>
                        <div class="item">
                            <div class="key">接收方</div>
                            <div style="word-break: break-all;">{{it.to}}</div>
                        </div>
                        <div class="item">
                            <div class="key">Gas</div>
                            <div style="word-break: break-all;">{{it.gas}}</div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div style="font-size: 12px; background:#fff; padding:12px 0px;" class="van-hairline--bottom">
                    <div v-if="item.enName == 'sealer'" class="item">
                        <div class="key">
                            {{item.name}}
                        </div>
                        <div style="word-break: break-all;" v-if="blockInfoData['sealerList']">
                            {{seekSealer(blockInfoData['sealerList'], blockInfoData['sealer'])}}
                        </div>
                    </div>
                    <div v-if="item.enName == 'timestamp'" class="item">
                        <div class="key">
                            {{item.name}}
                        </div>
                        <div style="word-break: break-all;">
                            {{blockTimestamp}}
                        </div>
                    </div>
                    <div v-else class="item">
                        <template v-if="item.enName!='sealer'">
                            <div class="key">
                                {{item.name}}
                            </div>
                            <div style="word-break: break-all;">
                                {{blockInfoData[item.enName]}}
                            </div>
                        </template>
                    </div>
                </div>

            </template>

        </div>
    </div>
</template>
<script>
import { reactive, ref, toRefs, onMounted, provide, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast, Collapse, CollapseItem, Divider, Button } from 'vant';
import { fetchBlockDetail } from '@/api/home.js'
import { } from "@/utils/util.js";
export default {
    name: 'Detail',
    setup() {
        const route = useRoute()
        const blockNumber = route.query.blockNumber;
        const groupId = sessionStorage.getItem('groupId')
        const blockTimestamp = route.query.blockTimestamp
        const state = reactive({
            blockInfoData: {},
            blockTxData: [],
            blockDetailKey: [
                {
                    enName: 'hash',
                    name: '交易哈希'
                },
                {
                    enName: 'number',
                    name: '块高'
                },
                {
                    enName: 'sealer',
                    name: '出块者'
                },
                {
                    enName: 'parentHash',
                    name: '父哈希'
                },
                {
                    enName: 'timestamp',
                    name: '交易时间'
                },
                {
                    enName: 'gasUsed',
                    name: '使用Gas'
                },
                {
                    enName: 'transactions',
                    name: '交易列表'
                }
            ],

        })
        const queryBlockDetail = async () => {
            const blockInfoParam = {
                groupId: groupId,
                blockNumber: blockNumber
            };
            const { data } = await fetchBlockDetail(blockInfoParam)
            if (data.code === 0) {
                state.blockInfoData = data.data;
                state.blockTxData = data.data.transactions
            } else {
                Toast.fail(txInfoData.data.message)
            }

        }
        onMounted(() => {
            queryBlockDetail()
        })
        return {
            ...toRefs(state),
            blockTimestamp
        }
    },
    methods: {
        seekSealer(val, index) {

            var dec = parseInt(index, 16)
            return val[dec]
        }
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
    /* margin: 5px 0; */
    /* line-height: 22px;
    height: 22px; */
}
.key {
    min-width: 70px;
    font-size: 12px;
    color: #888888;
    font-weight: 400;
}
</style>