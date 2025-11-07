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
const OriginalXMLHttpRequest = window.XMLHttpRequest;
let currentXhr = [], pdfList = [], timer = null;
window.XMLHttpRequest = function () {
    const xhr = new OriginalXMLHttpRequest();
    // 重写 send 方法，获取请求体
    const originalSend = xhr.send;
    const originalOpen = xhr.open;
    xhr.open = function(...data) {
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
                        }
                    }
                })
            }, 1500);
        } 
        originalSend.call(this, ...data);
    };
    return xhr;
}