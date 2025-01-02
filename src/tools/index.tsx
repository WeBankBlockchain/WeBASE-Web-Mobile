
export function isWeixinOrWxWork(){
    const ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('micromessenger') !== -1) {
        return true
    } else {
        return false
    }
}
export function isWeixin() {
    // return true
    const ua = navigator.userAgent.toLowerCase()
    console.log('ua',ua);
    
    return /micromessenger/.test(ua) && !/wxwork/.test(ua);
}

export function isWxWorkEnv() {
    return /WXWork/gi.test(navigator.userAgent);
}


export function isAndroid() {
    const u = navigator.userAgent
    console.log('ua',u);
    

    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        return true
    } else {
        return false
    }
}

export function isIOS() {
    const u = navigator.userAgent
    if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        return true
    } else {
        return false
    }
}

export function isBeanbag () {
    // return true
    // 本地开发模式，则返回true
    // return process.env.NODE_ENV === 'development' || navigator.userAgent.toLowerCase().indexOf('beanbag') !== -1

    // 将ua小写判断是否包含beanbag
    return navigator.userAgent.toLowerCase().indexOf('beanbag') !== -1
}

export function isRongyao () {
    const ua = navigator.userAgent.toLowerCase()
    let isRy = /bdhonorbrowser/.test(ua)
    console.log('是否为荣耀环境',isRy);
    
    return isRy
}

export function isIndexedDBSupported() {
    try {
        return 'indexedDB' in window;
    } catch (e) {
        return false;
    }
}

   

export function padZero(num: number | string | undefined = '') {
    // 将数字转换为字符串
    let str = num.toString();
    // 计算需要补充的零的数量
    const padding = 4 - str.length;
    // 如果长度小于4，则补充零
    if (padding > 0) {
        str = '0'.repeat(padding) + str;
    }
    return str;
}
