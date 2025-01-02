import { Toast } from "antd-mobile";
import { tokenkey } from "../context/Const";
import { TokenInfo } from "../api/GenToken";

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
};

export const ShowToast = (str: string, time?: number, icon?: string) => {
    Toast.show({
        content: <p style={{ margin: '0', wordBreak: "keep-all", textAlign: "center" }}>
            {str}
        </p>,
        duration: time ? time : 3000,
        maskClickable: true,
        icon: icon
    })
}

export const GetToken = () => {
    const lastToken = localStorage.getItem(tokenkey)
    return { token: lastToken, expireIn: -1, value: '' } as TokenInfo
}