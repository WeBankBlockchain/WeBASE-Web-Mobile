import axios, { AxiosResponse } from "axios";
import { getUrl } from "../tools/UrlTools";

//日志缓存
const logs: { timestamp: string; message: string; type: string; }[] = [];

function putLog(log: { timestamp: string, message: string, type: string }) {
    if (logs.length > 5000) {
        logs.shift()
    }
    logs.push(log)
}

function getFormDateStr(now: Date) {
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`
}

export function WeConsole() {

    console.log('WeConsole initialized');

    //原生控制台日志
    const originalConsole = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
        debug: console.debug,
        trace: console.trace,
    };
    console.log = function (...args) {
        const currentTime = getFormDateStr(new Date());
        putLog({
            timestamp: currentTime,
            message: JSON.stringify(args),
            type: 'log'
        });
        originalConsole.log.apply(console, args);
    };

    console.debug = function (...args) {
        const currentTime = getFormDateStr(new Date());
        putLog({
            timestamp: currentTime,
            message: JSON.stringify(args),
            type: 'debug'
        });
        originalConsole.debug.apply(console, args);
    };

    console.trace = function (...args) {
        const currentTime = getFormDateStr(new Date());
        putLog({
            timestamp: currentTime,
            message: JSON.stringify(args),
            type: 'trace'
        });
        originalConsole.trace.apply(console, args);
    };

    console.info = function (...args) {
        const currentTime = getFormDateStr(new Date());
        putLog({
            timestamp: currentTime,
            message: JSON.stringify(args),
            type: 'info'
        });
        originalConsole.info.apply(console, args);
    };
    console.warn = function (...args) {
        const currentTime = getFormDateStr(new Date());
        putLog({
            timestamp: currentTime,
            message: JSON.stringify(args),
            type: 'warn'
        });
        originalConsole.warn.apply(console, args);
    };
    console.error = function (...args) {
        const currentTime = getFormDateStr(new Date());
        putLog({
            timestamp: currentTime,
            message: JSON.stringify(args),
            type: 'error'
        });
        originalConsole.error.apply(console, args);
    };

    createButton();
}

function createButton() {
    // 创建一个容器，存放按钮
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.right = '20px';
    buttonContainer.style.zIndex = '10000';
    buttonContainer.style.cursor = 'pointer';

    // 创建一个按钮
    const button = document.createElement('button');
    button.innerText = 'download logs';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = '#FFF';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'move'; // 鼠标悬停时显示拖动手势

    let isDragging = false;
    let offsetX: number, offsetY: number;

    // 处理开始拖动事件 (PC 和移动)
    const startDrag = (e: MouseEvent | TouchEvent) => {
        isDragging = true;
        const event = 'touches' in e ? e.touches[0] : e;
        offsetX = event.clientX - buttonContainer.getBoundingClientRect().left;
        offsetY = event.clientY - buttonContainer.getBoundingClientRect().top;
        button.style.cursor = 'grabbing';
    };

    // 处理拖动事件 (PC 和移动)
    const onDrag = (e: MouseEvent | TouchEvent) => {
        if (isDragging) {
            const event = 'touches' in e ? e.touches[0] : e;
            buttonContainer.style.left = `${event.clientX - offsetX}px`;
            buttonContainer.style.top = `${event.clientY - offsetY}px`;
            buttonContainer.style.right = 'auto';
            buttonContainer.style.bottom = 'auto';
        }
    };

    // 处理停止拖动事件 (PC 和移动)
    const stopDrag = () => {
        isDragging = false;
        button.style.cursor = 'move';
    };

    // 绑定鼠标事件 (PC)
    button.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);

    // 绑定触摸事件 (移动设备)
    button.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', onDrag);
    document.addEventListener('touchend', stopDrag);
    document.addEventListener('touchcancel', stopDrag);

    // 按钮点击事件
    button.addEventListener('click', () => {
        onSaveLogs();
    });

    // 将按钮添加到容器中
    buttonContainer.appendChild(button);

    // 将容器添加到页面 body 中
    document.body.appendChild(buttonContainer);
}

function onSaveLogs() {

    const content = logs.map(log => `${log.timestamp} [${log.type.toUpperCase()}] ${log.message}`).join('\n');

    // 创建Blob对象
    const blob = new Blob([content], { type: 'text/plain' });

    // 创建下载链接
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'logs.txt';

    // 模拟点击下载链接
    link.click();

    // 释放URL对象
    URL.revokeObjectURL(link.href);

    //上传文件
    doUpload(blob);
}



function doUpload(file: Blob) {
    // 使用 FormData 包装 Blob 对象，模拟上传文件
    const formData = new FormData();
    const fileName = new Date().getTime() + '.txt';
    formData.append('file', file, fileName); // 'log.txt' 是文件名，可以随意定义
    const url = 'wsmp-front/debug/uploadLog';
    axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((resp: AxiosResponse) => {
        if (resp.status === 200) {
            alert("upload finish: " + JSON.stringify(resp.data))
        } else {
            alert("upload failed: " + resp.status)
        }
    }).catch(
        error => {
            alert('Error uploading file:' + error);
        }
    )
}
