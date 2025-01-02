import localforage from "localforage";
import { printLog } from "../context/LogTools";
import { fetchImageBlobWithTimeout } from "./FetchWithTimeout";

//图片缓存区域
export const imageCache = localforage.createInstance({
    name: 'image-cache',
});
//Json动画缓存区域
export const jsonAnimateCache = localforage.createInstance({
    name: 'janimate-cache',
});

//下载到内存
const downloadToMem = async (url: string, timeout = 10000): Promise<Blob> => {
    const blob = await fetchImageBlobWithTimeout(url, timeout);
    return blob;
};

//缓存到图片区域
const CacheImage = async (url: string, timeout = 10000): Promise<string> => {
    const blob = await downloadToMem(url, timeout);
    await imageCache.setItem(url, blob);
    printLog("存入缓存：" + url)
    return URL.createObjectURL(blob);
}

//缓存到Json动画区域
const CacheJsonAnimate = async (url: string): Promise<string> => {
    const blob = await downloadToMem(url);
    await jsonAnimateCache.setItem(url, blob);
    return URL.createObjectURL(blob);
}

export const LoadImageWait = async (src: string, timeout = 10000): Promise<(string | undefined)> => {

    //如果是开发环境，需要将图片地址转换成跨域地址
    if (false) {
        src = src.replace("occ.test.webankcdn.net", "wbbcoafrtest.test.wbchain.com")
    }

    //从缓存区域内尝试取
    const cachedBlob = await imageCache.getItem(src);
    printLog("cache::LoadImageWait-->" + src + "-->" + (cachedBlob ? "已缓存" : "新加载"))
    if (cachedBlob) {
        return URL.createObjectURL(cachedBlob as Blob)
    } else {
        try {
            const cImage = await CacheImage(src, timeout);
            printLog("cache::LoadImageWait-->" + src + "-->缓存完毕")
            return cImage
        } catch (exp) {
            printLog(["cache::LoadImageWait-->" + src + "-->缓存失败", exp])
        }

    }
}

export const LoadImage = async (src: string, onGetCatchSuccess?: (url: string) => void): Promise<string | undefined> => {

    //如果是开发环境，需要将图片地址转换成跨域地址
    if (false) {
        src = src.replace("occ.test.webankcdn.net", "wbbcoafrtest.test.wbchain.com")
    }

    try {
        //从缓存区域内尝试取
        const cachedBlob = await imageCache.getItem(src);
        //如果取到了缓存
        if (cachedBlob) {
            const catchUrl = URL.createObjectURL(cachedBlob as Blob)
            printLog(['catched img:', src, catchUrl]);
            return catchUrl
        } else {
            //下载并缓存图片（异步，不等待缓存完毕）
            printLog(['not catched img:', src]);
            CacheImage(src).then(
                newUrl => {
                    printLog(['new catched img:', src, newUrl]);
                    onGetCatchSuccess && onGetCatchSuccess(newUrl)
                }
            ).catch(
                e => {
                    printLog(['new catched img error:', src, e]);
                }
            );
            return src
        }
    } catch (error) {
        printLog(['Error loading image:', error]);
    }
};

export const LoadAnimate = async (src: string): Promise<string | undefined> => {
    try {
        //从缓存区域内尝试取
        const cachedBlob = await jsonAnimateCache.getItem(src);
        //如果取到了缓存
        if (cachedBlob) {
            const catchUrl = URL.createObjectURL(cachedBlob as Blob)
            printLog(['catched json:', src, catchUrl]);
            return catchUrl
        } else {
            //下载并缓存动画资源（异步，不等待缓存完毕）
            CacheJsonAnimate(src).then(
                newUrl => {
                    printLog(['new catched json:', src, newUrl]);
                }
            ).catch(
                e => {
                    printLog(['new catched json error:', e]);
                }
            );
            return src
        }
    } catch (error) {
        printLog(['Error loading json:', error]);
    }
};

export const LoadAnimateWait = async (src: string): Promise<string | undefined> => {
    //从缓存区域内尝试取
    const cachedBlob = await jsonAnimateCache.getItem(src);
    printLog("cache::LoadAnimateWait-->" + src + "-->" + (cachedBlob ? "已缓存" : "新加载"))
    if (cachedBlob) {
        return URL.createObjectURL(cachedBlob as Blob)
    } else {
        const cJson = await CacheJsonAnimate(src);
        printLog("cache::LoadAnimateWait-->" + src + "-->缓存完毕")
        return cJson
    }
}



