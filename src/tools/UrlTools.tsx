import { isHKEnv } from "../context/Const";
import { printLog } from "../context/LogTools";

export function getUrl(path: string): string {
    if (isHKEnv) {
        printLog("hk try url:" + path)
        return `https://ecc.potos.hk/wsmp-front/wsmp-exchange/${path}`;
    }
    path = 'wsmp-front/wsmp-exchange/' + path
    printLog("try url:" + path)
    return `${process.env.PUBLIC_URL}/${path}`;
}