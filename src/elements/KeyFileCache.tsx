import { LoadAnimate, LoadImage } from "./LocalCacher"

//关键数据缓存，立即加载
export const KeyFileList = [
    process.env.PUBLIC_URL + '/icons/gening.png', //生成中动画
    process.env.PUBLIC_URL + "/icons/light.png", //扫光
    process.env.PUBLIC_URL + '/icons/accept.png',//领取按钮
    process.env.PUBLIC_URL + "/animate/get_asset.json", //领取Json动画
]

export function loadKeyFile() {
    LoadImage(KeyFileList[0])
    LoadImage(KeyFileList[1])
    LoadImage(KeyFileList[2])
    LoadAnimate(KeyFileList[3])
}