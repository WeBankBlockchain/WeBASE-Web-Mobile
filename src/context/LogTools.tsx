export function printLog(params: any) {
    let content: string = ''
    if (typeof params === 'string') {
        content = params;
    } else {
        content = JSON.stringify(params);
    }
    const now = new Date();
    const currentTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    console.log(currentTime + " ticket-------------------::" + content);
}