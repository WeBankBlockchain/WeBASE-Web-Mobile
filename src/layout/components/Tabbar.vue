<template>
    <div>
        <van-tabbar v-model="active" @change="onChange" route>
            <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item replace to="/my" icon="friends-o">我</van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script>
export default {
    data() {
        return {
            active: 0
        }
    },
    // watch
    mounted(){
        console.log(window.location.hash);
    },
    methods: {
        onChange(index) {
            console.log(index);
        }
    }
}
</script>