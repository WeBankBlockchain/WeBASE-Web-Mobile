<template>
    <div>
        <van-tabbar v-model="active" @change="onChange" route>
            <van-tabbar-item replace to="/home" >首页</van-tabbar-item>
            <van-tabbar-item replace to="/blockInfo">
                <span>区块</span>
            </van-tabbar-item>
            <van-tabbar-item replace to="/txInfo">交易</van-tabbar-item>
            <van-tabbar-item replace to="/nodeInfo">节点</van-tabbar-item>
            <van-tabbar-item replace to="/contract">合约</van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script>
import { reactive, ref, toRefs, onMounted, provide, computed } from 'vue'
import blockPng from '@/assets/image/block.png'
export default {
    setup() {
        onMounted(() => {
            console.log(blockPng)
        })
        const icon1 = blockPng
        return {
            icon1
        }
    },
    methods: {
        onChange(index) {
            console.log(index);
        }
    }
}
</script>