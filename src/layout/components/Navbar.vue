<template>
    <van-nav-bar :title="title" left-text="" left-arrow @click-left="onClickLeft">
        <template #right>
            <!-- <van-icon name="setting" @click="onClickRight"/> -->
            <!-- <van-dropdown-menu active-color="#1989fa" class="home-group">
                        <van-dropdown-item v-model="groupId" :options="groupList" @change="changeGroup" />
                    </van-dropdown-menu> -->
        </template>
    </van-nav-bar>
</template>
<script>
import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { Toast } from 'vant'
export default {
    data() {
        return {
            title: ''
        }
    },
    watch: {
        $route: {
            handler: function (val, oldVal) {
                this.title = val.meta.title
            },
            immediate: true,
        }
    },
    setup() {
        // const route = useRoute()
        // const router = useRouter()
        // const onClickLeft = () => router.go(-1);
        // const onClickRight = () => Toast('按钮');
        // onMounted(() => {
        // })
        // return {
        //     onClickLeft,
        //     onClickRight,
        // };
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },
        onClickRight() {
            this.$router.push('set')
        }
    }
}
</script>