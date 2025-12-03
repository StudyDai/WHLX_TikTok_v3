window.prompt = () => {
    console.log('23333')
}
// 解决掉到处跳的问题
let startOpen = localStorage.getItem('start')
if (startOpen && JSON.parse(startOpen)) {
    window.open = () => {
        console.log('我被调用了')
    }
}
localStorage.removeItem('temporaryData')

let xhrStatu = null, state = 0
const OriginalXMLHttpRequest = window.XMLHttpRequest;
let currentXhr = [], pdfList = [], timer = null, aliexpressXhr = null, aliexpressTimer = null;
window.XMLHttpRequest = function () {
    const xhr = new OriginalXMLHttpRequest();
    // 重写 send 方法，获取请求体
    const originalSend = xhr.send;
    const originalOpen = xhr.open;
    xhr.open = function(...data) {
        let url2 = /seller\-acs\.aliexpress\.com\/h5\/mtop\.global\.merchant\.sales\.trend\/1\.0/
        let xiangmaiUrl = /\/fn\/search\-pc\/index/
        let current_order_obj = {}
        console.log(data, '请求体')
        let url = /\/\/seller\-acs\.aliexpress\.com\/h5\/mtop\.ae\.seller\.fulfillment\.shipping\.way\.bill\.get\/1\.0/
        if (url.test(data[1])) {
            console.log('看看哦', )
            let value = data[1].match(/data=(.*)/ig)[0].replace('data=', '')
            // 转化下
            let val = decodeURIComponent(value).replace('data=', '')
            // 拿到关键数据
            let details = val.replace('\\', '').match(/\["(.+)"\]/)
            if (details.length > 1) {
                let order_item = details[1].replace('\\', '')
                // 直接分组
                let arr = order_item.split('#')
                // 订单号
                let order_num = arr[0]
                // 订单标号
                let order_bian = arr[1]
                // 运单号
                let yundan_num = arr[3]
                current_order_obj.orderNum = order_num
                current_order_obj.orderBian = order_bian
                current_order_obj.yundan = yundan_num
            }
            console.log(val)
            currentXhr.push({
                xhr,
                current_order_obj
            })
        }
        else if (url2.test(data[1])) {
            // 好咯 记录
            let modifiedResponseText = null
            // 保存原生 responseText 的 getter（用于后续获取原始值）
            const originalResponseTextGetter = Object.getOwnPropertyDescriptor(OriginalXMLHttpRequest.prototype, 'responseText').get;
            // 阿里用的response 不是用text的
            Object.defineProperty(xhr, 'responseText', {
                get: function() {
                        // 伪造的时候用
                        let temporaryData = localStorage.getItem('temporaryData')
                        console.log(temporaryData)
                        if (temporaryData) {
                            return temporaryData
                        }
                        return originalResponseTextGetter.call(this)
                },
                set: function(value) {
                    // 忽略外部赋值（因为只读），或存储到 modifiedResponseText
                    modifiedResponseText = value;
                },
                configurable: true // 允许后续修改（可选）
            });
            xhr.addEventListener('readystatechange', function() {
                if (xhr.readyState === 4 && xhr.status === 200) { 
                    let temporaryData = localStorage.getItem('temporaryData')
                    if (temporaryData) {
                        return
                    }
                    // 把数据给他改了
                    xhr.readyState = 3
                    xhr.status = 201
                    console.log('看下返回了啥', xhr.responseText)
                    let data = JSON.parse(xhr.responseText)
                    state = 1
                    console.log('结果是', data)
                    let map_data = data.data.itemSalesByDay
                    let dd = 18
                    let num = [50, 38, 41, 80, 180, 75, 25]
                    map_data = map_data.map((m, i) => {
                        dd++
                        m.daysId = +('202511' + dd)
                        m.nums = num[i]
                        return m
                    })
                    localStorage.setItem('temporaryData', JSON.stringify(data))
                 }
            })
        }
        else if (xiangmaiUrl.test(data[1])) {
            aliexpressXhr = xhr
        }
        originalOpen.call(this, ...data)
    }
    xhr.send = function (...data) {
        // 证明他发出去了,开始监听
        if (currentXhr?.length && !timer) {
            console.log(currentXhr)
            timer = setInterval(() => {
                if (!currentXhr.length) {
                    clearInterval(timer)
                    localStorage.setItem('currentOrder', JSON.stringify(pdfList))
                }
                currentXhr.forEach((item, index) => {
                    if (item.xhr.readyState === 4 && item.xhr.status === 200) {
                        let data = JSON.parse(item.xhr.responseText)
                        if (data && data.data && data.data.data.fileUrl) {
                            let pdf_url = data.data.data.fileUrl
                            item.current_order_obj.pdf_url = pdf_url
                            pdfList.push(item.current_order_obj)
                            currentXhr.splice(index, 1)
                        } else {
                            console.log('结果', data)
                        }
                    }
                })
            }, 1500);
        }
        if (aliexpressXhr) {
            // 开始监听
            if (aliexpressTimer) {
                clearInterval(aliexpressTimer)
            }
            aliexpressTimer = setInterval(() => {
                if (aliexpressXhr.readyState === 4 && aliexpressXhr.status === 200) { 
                    clearInterval(aliexpressTimer)
                    let currentData = [], prevData = [];
                    // 查看数据 https://www.aliexpress.com/item/1005010010142977.html 跳转地址
                    console.log(JSON.parse(aliexpressXhr.responseText),'看看')
                    // 存储跳转的编码和出单情况
                    // 编码路径 data.result.mods.itemList.content[0].trace.utLogMap.pic_group_id
                    let data = JSON.parse(aliexpressXhr.responseText)
                    if (data) {
                        let list = localStorage.getItem('aliexpress_list')
                        if (list) {
                            prevData = JSON.parse(list)
                        }
                        // 开始拿
                        data.data.result.mods.itemList.content.forEach(d => {
                            let code = d.trace.utLogMap.pic_group_id
                            // 销量
                            let num = d.trade?.realTradeCount || '0'
                            // 名
                            let name = d.title.seoTitle
                            let sku = d.trace.utLogMap.sku_id
                            // 判断
                            if (prevData.length) {
                                // 有东西要判断下 
                                let item = prevData.find(item => item.sku == sku)
                                console.log(code, '看看这个代码是不是出现过多次')
                                if (item) {
                                    // 如果找到了,就加进去
                                    item.numArr.push(num)
                                } else {
                                    prevData.push({
                                        name,
                                        sku,
                                        numArr: [num],
                                        url: `https://www.aliexpress.com/item/${code}.html`
                                    })
                                }
                            } else {
                                currentData.push({
                                    name,
                                    sku,
                                    numArr: [num],
                                    url: `https://www.aliexpress.com/item/${code}.html`
                                })
                            }
                        })
                        // 查看 存储一下
                        console.log(currentData,'看看咋个事')
                        if (!currentData.length) {
                            localStorage.setItem('aliexpress_list', JSON.stringify(prevData))
                        } else {
                            localStorage.setItem('aliexpress_list', JSON.stringify(currentData))
                        }
                    }
                }
            }, 1000);
        }
        originalSend.call(this, ...data);
    };
    return xhr;
}
// 保存原生 fetch
const originalFetch = window.fetch;

// 2. 重写 fetch：加 async，支持 await
window.fetch = async function(...data) { // 修正参数名：obj → url（和原生一致，也可以保留 obj，但后面要统一）
    try {
        // 3. 等待原生 fetch 完成，拿到实际响应对象（关键：必须加 await）
        const response = await originalFetch(...data);
        // 4. 匹配目标接口（这里用 url 变量，和参数名一致）
        if (/https:\/\/seller\.kuajingmaihuo\.com\/api\/merchant\/fund\/detail\/pageSearch/.test(data[0].url)) {
            // 克隆响应（此时 response 是实际响应对象，有 clone 方法）
            const clonedResponse = response.clone();
            const data = await clonedResponse.json();
            console.log('拦截到目标接口响应数据：', data);
            if (data.success) {
                // 直接修改response
                localStorage.setItem('accountNum', JSON.stringify({"dw":data.result.incomeAmountFormat.currencyCode,"num": data.result.incomeAmount}))
            }
        }

        // 5. 返回原始响应（不影响其他接口的正常请求）
        return response;
    } catch (err) {
        // 6. 捕获错误，避免阻断所有请求
        console.error('fetch 重写报错：', err);
        throw err; // 抛出错误，让原请求能捕获到（不吞错）
    }
}
if (location.href.includes('#zx')) {
    // 清理数据,准备刷新
    console.log('是从temu后台过来的')
    let arr = location.href.split('&')
    // 把cookies去掉
    let cookies = document.cookie.split(';')
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var cookie_name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        // 直接让cookie过期
        document.cookie = cookie_name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    if (arr.length == 2) {
        location.replace(`https://www.temu.com/us-es/g-${arr[1]}.html`)
    } else {
        location.replace(`https://www.temu.com/${arr[1]}/g-${arr[2]}.html`)
    }
}