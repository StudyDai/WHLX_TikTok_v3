console.log("我是工具函数, 我正式开启哦~")
/* eslint-disable */
/**
 * 网络请求函数
 * @param {String} url 网络请求地址
 * @param {String} method 网络请求方法
 * @param {Object} data 网络请求的参数
 * @param {Object} options 当是get请求的时候,通过这个传递header请求头
 * @param {String} type json | blob 两种返回格式
 * @returns Promise类型 网络请求结果
 */
async function request(url, method, data, options, type = 'json') {
    console.log(data)
    let param = null, keys, values
    // data循环
    if (data) {
        keys = Object.keys(data)
        values = Object.values(data)
    }
    let sendUrl = url 

    if (method.toUpperCase() == 'GET') {
        if (data) {
            sendUrl = url + "?" + buildQueryString(keys, values)
        }
        param = options
    } else {
        param = Object.assign({
            method: 'post'
        }, data)
        console.log(param)
    }
    switch (type) {
        case 'json':
            return await fetch(sendUrl, param).then(res => res.json())
        case 'blob':
            return await fetch(sendUrl, param).then(res => res.blob())
        default: 
            return Promise.reject('您传递的类型参数有误, 请重新输入')
    }
}
// 创建get请求携带的参数
function buildQueryString(key, value) {
    let str = []
    for (let index = 0; index < key.length; index++) {
        const k = key[index];
        str = str.concat(`${k}=${value[index]}`)
    }
    return str.join('&')
}
// 这个是contentjs使用的 浏览器使用
class cacheWindowLocalStorage {
    constructor(prev = 'local') {
        switch(prev) {
            case 'local':
                this.type = window.localStorage
                break;
            case 'session':
                this.type = window.sessionStorage
                break;
            default:
                console.error('未知的存储')
        }
    }
    addLocalStorage(key, value) {
        this.type.setItem(key, value)
    }
    removeLocalStorage(key) {
        this.type.removeItem(key)
    }
    updateLocalStorage(key, value) {
        this.type.setItem(key, value)
    }
}
// 这个是node端使用的,v3之后要用storage
class cacheServiceLocalStorage {
    addLocalStorage(key, value) {
        console.log(key, value)
        chrome.storage.local.set({
            [key]: value
        }, () => {
            console.log(key, '持久化成功')
        })
    }
    async getLocalStorage(key) {
        return new Promise((resolve) => {
            chrome.storage.local.get([key],(result) => {
                if (result[key]) {
                    resolve(JSON.parse(result[key]))
                } else {
                    resolve(null)
                }
                console.log(key, '获取值成功')
            })
        })
    }
    removeLocalStorage(key) {
        chrome.storage.local.remove(key, () => {
            console.log(key, '删除成功')
        })
    }
    updateLocalStorage(key, value) {
        chrome.storage.local.set({
            [key]: value
        }, () => {
            console.log(key, '更新数据成功')
        })
    }
    async existLocalStorage(key) {
        // 先拿之前的
        let value = await persistent.getLocalStorage(key)
        console.log(value)
        if (!value) {
            value = []
        }
        return value
    }
}

/**
 * 生成随机数 从最小值到最大值
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
function getRandomNum(min, max) {
    return Math.ceil(Math.ceil(Math.random() * (max - min)) + min)
}

/**
 * 强制等待时间
 * @param {Number} time 等待多少秒
 * @returns 
 */
async function delayFn(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time * 1000);
    })
}

const persistent = new cacheServiceLocalStorage()

function formatDate(date = new Date(), format = 'yyyy-MM-dd HH:mm:ss') {
    // 处理传入的日期参数（支持时间戳、日期字符串、Date对象）
    if (typeof date === 'number') {
        date = new Date(date); // 时间戳转换为Date对象
    } else if (typeof date === 'string') {
        date = new Date(date.replace(/-/g, '/')); // 兼容"yyyy-MM-dd"格式字符串
    }
    
    // 验证日期有效性
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error('无效的日期参数');
    }

    // 提取日期各部分
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，需+1
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];

    // 格式化映射表
    const formatMap = {
        'yyyy': year,                     // 四位年份（如：2023）
        'MM': String(month).padStart(2, '0'), // 两位月份（01-12）
        'M': month,                       // 一位月份（1-12）
        'dd': String(day).padStart(2, '0'),   // 两位日期（01-31）
        'd': day,                         // 一位日期（1-31）
        'HH': String(hour).padStart(2, '0'),  // 24小时制两位小时（00-23）
        'H': hour,                        // 24小时制一位小时（0-23）
        'hh': String((hour % 12 || 12)).padStart(2, '0'), // 12小时制两位小时（01-12）
        'h': hour % 12 || 12,             // 12小时制一位小时（1-12）
        'mm': String(minute).padStart(2, '0'), // 两位分钟（00-59）
        'm': minute,                      // 一位分钟（0-59）
        'ss': String(second).padStart(2, '0'), // 两位秒数（00-59）
        's': second,                      // 一位秒数（0-59）
        'w': week                         // 星期（日-六）
    };

    // 替换格式字符串中的占位符
    return format.replace(/yyyy|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|w/g, match => formatMap[match]);
}

export default {
    request,
    cacheWindowLocalStorage,
    getRandomNum,
    delayFn,
    persistent,
    formatDate
}