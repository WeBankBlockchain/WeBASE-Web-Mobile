import { printLog } from "../context/LogTools";

export function fetchImageBlobWithTimeout(url: string, timeout = 10000) {
    const controller = new AbortController(); // 创建 AbortController 实例
    const signal = controller.signal; // 获取信号

    // 设置超时
    const timeoutId = setTimeout(() => {
        controller.abort(); // 超时后中止请求
    }, timeout);

    return fetch(url, { signal })
        .then(response => {
            clearTimeout(timeoutId); // 清除超时
            if (!response.ok) {
                printLog(["Network response was not ok", url, response])
                throw new Error('Network response was not ok'); // 网络错误处理
            }
            return response.blob(); // 返回图片的 Blob 数据
        })
        .catch(error => {
            if (error.name === 'AbortError') {
                printLog(["Image request timed out with " + timeout, url, error])
                throw new Error('Image request timed out'); // 处理超时错误
            }
            printLog(["Image request error", url, error])
            throw error; // 处理其他错误
        });
}