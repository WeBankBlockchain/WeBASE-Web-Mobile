import { printLog } from "../context/LogTools";

export function getUrl(path: string): string {
    // 直连wstp-admin
    // path = 'wstp-admin/' + path
    // path = 'wstp-front/admin/' + path
    

    path = 'wsmp-front/wsmp-exchange/' + path
    printLog("try url:" + path)
    return `${process.env.PUBLIC_URL}/${path}`;
}