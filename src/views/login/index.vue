<template>
    <div class="login">
        <div style="display: flex;justify-content: center;">
            <svg style="width: 142px;height: 142px;fill: currentColor;overflow: hidden;" aria-hidden="true">
                <use xlink:href="#wbs-icon-WeBASE"></use>
            </svg>
        </div>
        <van-form @submit="onSubmit">
            <van-field v-model="userForm.username" name="用户名" label="用户名" placeholder="用户名" :rules="[{ required: true, message: '请填写用户名' }]" />
            <van-field v-model="userForm.password" type="password" name="密码" label="密码" placeholder="密码" :rules="[{ required: true, message: '请填写密码' }]" />
            <van-field center clearable label="验证码" placeholder="输入验证码" v-model="userForm.vercode" :rules="[{ required: true, message: '请填写验证码' }]">
                <template #button>
                    <img style="width: 64px;" :src="verifyRef" @click="getVerifyCode" />
                </template>
            </van-field>
            <div style="margin: 16px;">
                <van-button block  type="primary" :loading="loading" native-type="submit">提交</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPictureCheckCode, login, fetchFronts } from '@/api/login.js'
import { Toast } from 'vant'
const sha256 = require("js-sha256").sha256;
export default {
    name: 'Login',
    setup() {
        const route = useRoute()
        const router = useRouter()
        const verifyRef = ref(null)
        const authToken = ref(null)
        const loading = ref(false)
        console.log('loading',loading);
        const userForm = reactive({
            username: '',
            password: '',
            vercode: ''
        });
        const queryFronts = async () => {
            const { data } = await fetchFronts();
            if (data.code === 0) {
                if (data.data.length) {
                    localStorage.setItem('clientVersion', data.data[0]["clientVersion"])
                }
            }
        };
        onMounted(() => {
            pictureCheckCode();
            queryFronts()
        });
        const pictureCheckCode = async () => {
            const { data } = await getPictureCheckCode()
            verifyRef.value = `data:image/png;base64,${data.data.base64Image}`;
            authToken.value = data.data.token;
        }
        const getVerifyCode = () => {
            pictureCheckCode()
        }
        const queryLogin = async () => {
            loading.value = true
            const reqData = {
                account: userForm.username,
                accountPwd: sha256(userForm.password),
            };
            const checkCode = userForm.vercode;
            const { data } = await login(reqData, checkCode, authToken.value)
            if (data.code === 0) {
                sessionStorage.setItem("user", data.data.account);
                sessionStorage.setItem("root", data.data.roleName);
                localStorage.setItem("token", data.data.token);
                sessionStorage.setItem("accountStatus", data.data.accountStatus);
                router.push({ path: `/home` })
                loading.value = false
            } else {
                Toast.fail(data.message)
                pictureCheckCode()
            }
        }
        const onSubmit = (values) => {
            queryLogin()
        };

        return {
            userForm,
            onSubmit,
            getVerifyCode,
            verifyRef,
            loading
        };
    },
    components: {
    }
}
</script>

<style spoed>
</style>
