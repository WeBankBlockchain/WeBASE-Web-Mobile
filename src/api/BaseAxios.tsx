import axios, { AxiosResponse } from "axios";
import { BaseResp } from "./BaseResp";

const BaseAxios = axios.create({
    //全局配置
    timeout: 10000,
})

//对特定类型错误的全局拦截（暂未启用）
BaseAxios.interceptors.response.use(
    (resp: AxiosResponse) => {
        const baseResp: BaseResp<any> = resp.data as BaseResp<any>
        if (baseResp.code != 0) {
            //如果code不等于0，判断是否是Token失效
        }
        return resp;
    }
)