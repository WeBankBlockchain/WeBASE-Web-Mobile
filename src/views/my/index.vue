<template>
    <div class="mine-layout">
        <div>
            <img src="@/assets/image/my/store-new.png" class="header-img" />
            <ul class="user-info">
                <li class="user-name">钻石王老五</li>
            </ul>
        </div>
        <div ref="signOut" style="height:200px;flex-direction: column-reverse;display: flex;">
            <van-button block type="primary" native-type="submit" to="/">退出</van-button>
        </div>
    </div>
</template>
<script>
import { Search, Sticky  } from 'vant';
export default {
    name: "My",
    data() {
        return {

        }
    },
    methods: {

    }
}
</script>
<style scoped>
.mine-layout {
    padding: 10px 16px;
}
</style>