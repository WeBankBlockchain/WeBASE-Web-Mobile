/**Get request parameter processing
 * @param necessary Required
 * @param query Optional
 * @return {Object}
 */
export function reviseParam(necessary, query) {
    let params = arguments[0],
        querys = arguments[1],
        arr = [],
        str = '';
    for (var i in params) {
        arr.push(params[i])
    }
    str = arr.join('/');
    return { str, querys }
}
let changeDate = function (date) {
    let newData = new Date(date);
    let Y = newData.getFullYear();
    let M = newData.getMonth() + 1 > 9 ? newData.getMonth() + 1 : "0" + (newData.getMonth() + 1);
    let D = newData.getDate() > 9 ? newData.getDate() : "0" + newData.getDate();
    return M + "-" + D
    // return Y + "-" + M + "-" + D
};
export function changWeek(data) {

    let lastDate = (new Date()).getTime();
    let firstDate = lastDate - 6 * 24 * 3600 * 1000;
    let dateList = [];
    dateList[0] = {};
    dateList[0].transCount = 0;
    dateList[0].day = firstDate;
    for (let i = 1; i < 7; i++) {
        dateList[i] = {};
        dateList[i].day = dateList[i - 1].day + 24 * 3600 * 1000;
        dateList[i].transCount = 0;
    };
    for (let i = 0; i < 7; i++) {
        dateList[i].day = changeDate(dateList[i].day)
    }
    dateList.forEach(function (value) {
        if (data && data.length) {
            for (let j = 0; j < data.length; j++) {
                if (value.day === data[j].day.substr(5)) {
                    value.transCount = data[j].transCount
                }
            }
        }
    });
    return dateList;
}

// 存储localStorage
export const setStore = (name, content) => {
    if (!name) return
    localStorage.setItem(name, JSON.stringify(content))
}

// 获取localStorage
export const getStore = name => {
    if (!name) return
    return JSON.parse(localStorage.getItem(name))
}

export function dedupe(array) {
    return Array.from(new Set(array))
}

export function dateFormat(val) {
    var str = +val
    let date = new Date(str)
    let Y = date.getFullYear();
    let M = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    let D = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
}