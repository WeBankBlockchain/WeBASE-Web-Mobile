<template>
    <div style="background:#fff; padding: 5px 12px;">
        <div style="margin-bottom: 20px;">
            <p style="font-weight: bold;font-size: 15px;">个人信息</p>
            <p>
                <span style="width: 100px;display: inline-block;">用户名</span>
                <span>{{ user }}</span>
            </p>
        </div>
        <div style="margin-bottom: 20px;">
            <p style="font-weight: bold;font-size: 15px;">版本信息</p>
            <p>
                <span style="width: 100px;display: inline-block;">链版本</span>
                <span>{{ clientVersion }}</span>
            </p>
            <p>
                <span style="width: 100px;display: inline-block;">兼容版本</span>
                <span>{{ supportVersion }}</span>
            </p>
            <p>
                <span style="width: 100px;display: inline-block;">WeBASE版本</span>
                <span>{{ webaseVersion }}</span>
            </p>
        </div>
        <div>
            <!-- <van-button block type="primary" @click="handleLoginOut">修改密码</van-button> -->
            <van-button block type="primary" @click="handleLoginOut">退出</van-button>
        </div>
    </div>
</template>
<script>
import { loginOut, fetchVersion, fetchFronts } from "@/api/login.js";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
export default {
    name: "Set",
    setup() {
        const router = useRouter();
        const user = sessionStorage.getItem("user");
        const webaseVersion = ref("");
        const clientVersion = ref("");
        const supportVersion = ref("");
        const queryVersion = async () => {
            const { data } = await fetchVersion();
            webaseVersion.value = data;
        };
        const queryLoginOut = async () => {
            const { data } = await loginOut();
            router.push({ path: `/login` });
        };
        const queryFronts = async () => {
            const { data } = await fetchFronts();
            if (data.code === 0) {
                if (data.data.length) {
                    clientVersion.value = data.data[0]["clientVersion"];
                    supportVersion.value = data.data[0]["supportVersion"];
                }
            }
        };
        onMounted(() => {
            queryVersion();
            queryFronts()
        });
        const handleLoginOut = () => {
            queryLoginOut();
        };

        return {
            handleLoginOut,
            webaseVersion,
            clientVersion,
            supportVersion,
            user,
        };
    },
};
</script>
