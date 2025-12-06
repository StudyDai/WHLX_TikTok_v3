// 要用这个的话 不可以使用ES module的模式 所以要把model改掉
importScripts(chrome.runtime.getURL('js/xlsx.js'))
const utils = require('@/utils/utils').default
const instance = require('@/utils/instance').default
let TIKTOK_BUSINESS_ACCOUNT = 'tiktokbusinessaccount'
let TIKTOK_BUSINESS_ROI_DATA = 'tiktokbusinessroidata'
let TIKTOK_BUSINESS_MS_TOKEN = 'tiktokbueinessmstoken'
let TIKTOK_BUSINESS_ADVERTISEMENT = 'tiktokbusinessadvertisement'
let tiktok_advertisement = []
let moneyNum = 0
let collectList = null
// // 德国仓 - 登录
const LingXingErp_Login_GETTOKEN = async function(data) {
    let params = Object.assign(data, {
            "businessType": "oms"
    })
    return await utils.request(Config.LingXingErp_Login, "post", {
        body: JSON.stringify(params),
        headers: {
            'content-type': 'application/json'
        }
    })
}
// 维赢仓 - outh验证
const ShipoutErp_LOGIN = async function(data) {
    console.log(data)
    let { loginAccount, password } = data
    const params = new FormData()
    params.append('grant_type', 'password')
    params.append('username', loginAccount)
    params.append('password', password)
    params.append('scope', 'oms')
    params.append('systemType', 'OMS')
    params.append('client_secret', 7700)
    params.append('client_id', "browser-oms")
    return await utils.request(Config.ShipoutErp_Login, "post", {
        body: params
    })
}

console.log('This is background page');
// // 创建一个持久化存储
// // 初始化本地的cookies
async function initCookies(url, key) {
    chrome.cookies.getAll({ url }, function(cookies) {
        let str = []
        for (let index = 0; index < cookies.length; index++) {
            const cookie = cookies[index];
            str = str.concat(`${cookie.name}=${cookie.value}`)
        }
        // 存储起来
        utils.persistent.addLocalStorage(key, JSON.stringify(str.join(';')))
    })
}
// 直接调用我的自定义tab栏
async function get_collect_list() {
    collectList = await utils.persistent.getLocalStorage('collectURL')
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let tab = tabs[0]
        if (tab) {
            // 将数据传递出去
            chrome.tabs.sendMessage(tab.id, {
                message: "getCollect",
                data: collectList
            })
        }
    })
}

async function messageToInject(message, data) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let tab = tabs[0]
        if (tab) {
            // 将数据传递出去
            chrome.tabs.sendMessage(tab.id, {
                message,
                data
            })
        }
    })
}

// 向当前的激活tab发送
async function toActivePage(message, data) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let tab = tabs[0]
        if (tab) {
            // 将数据传递出去
            chrome.tabs.sendMessage(tab.id, {
                message,
                data
            })
        } else {
            console.log('当前没有chrome在线, 转弹窗')
            let id = new Date().getTime() + ''
            chrome.notifications.create(id,{
                type: 'basic',
                title: '广告提醒',
                iconUrl: chrome.runtime.getURL("/assets/logo.png"),
                message: data.roiData + `\n${data.moneyData}`
            }, (notificationId) => {
                if (chrome.runtime.lastError) {
                    console.error('创建通知失败:', chrome.runtime.lastError.message);
                } else {
                    console.log('通知创建成功，ID:', notificationId);
                }
            })
        }
    })
}
// 请求下
async function getIm(params) {
    
}
// // 得到baseurl
chrome.runtime.onMessage.addListener(async (params, sender, sendResponse) => {
    let timer = null;
    sendResponse({ 'statu': 'pending' })
    // 这个地方 接受popup.html发送过来的内容
    if (params.message === 'addWarehouse') {
        // 当前添加的是什么仓库 有 weiying paipai weilai
        let resp;
        let type = params.data.Erp
        let info = params.data.Info 
        console.log(info, type)
        let prev;
        switch (type) {
            case 'PaiPai':
                break;
            case 'ShipOut':
                resp = await ShipoutErp_LOGIN(info)
                if (resp.access_token.length) {
                    // 先拿之前的
                    prev = await utils.persistent.existLocalStorage(instance.ShipoutToken)
                    // // 加进去
                    prev = prev.concat({
                        account: info.loginAccount,
                        pwd: info.password,
                        token: resp.access_token
                    })
                    // 有值,存起来token
                    utils.persistent.addLocalStorage(instance.ShipoutToken, JSON.stringify(prev))
                    chrome.runtime.sendMessage({
                        message: 'addSuccess'
                    })
                }
                // 请求维赢的数据
                break;
            case 'WeiLai':
                resp = await LingXingErp_Login_GETTOKEN(info)
                if (resp.code === 200) {
                    // 先拿之前的
                    prev = await utils.persistent.existLocalStorage(instance.WeiLaiToken)
                    // 加进去
                    prev = prev.concat({
                        account: info.loginAccount,
                        pwd: info.password,
                        token: resp.data.token
                    })
                    // 成功啦 存储token
                    utils.persistent.addLocalStorage(instance.WeiLaiToken, JSON.stringify(prev))
                    chrome.runtime.sendMessage({
                        message: 'addSuccess'
                    })
                }
                break;
            default:
                // 未知的账号
                throw new Error('出现了未知的错误')
        }
    }
    else if (params.message === 'cookies') {
        console.log('触发了')
        initCookies(params.data.url, params.data.name)
    }
    else if (params.message === 'good_limit') {
        // data是true就是监听 false就是不监听
        let resp, isLimit = false, isRun = params.statu, sendData = {}, listenData = [], haveLimitData = [], alreadyAdd = false;
        if (params.statu) {
            // 请求数据 如果我是有传递的,就传参数给LIMIT
            if (params.data[0].trim()) {
                sendData = {
                    productSkcIdList: params.data
                }
            }
            let param = Object.assign({
                "pageSize": 30,
                "pageNumber": 1,
                "timeDimension": 1
              }, sendData)
            while(isRun) {
                let mallid = await utils.persistent.getLocalStorage('temu_mallid')
                resp = await utils.request(instance.TEMU_Traffic_Analysis, "post", {
                    body: JSON.stringify(param),
                    headers: {
                        'content-type': 'application/json',
                        'Mallid': mallid
                    }
                })
                // 判断是否有被禁的
                if (resp.success) {
                    for(let i = 0; i < resp.result.pageItems.length; i++) {
                        if (resp.result.pageItems[i].flowLimitStatus === 2) {
                            haveLimitData = haveLimitData.concat({
                                id: resp.result.pageItems[i].productId,
                                statu: 2
                            })
                        }
                        if (!alreadyAdd) {
                            listenData = listenData.concat({
                                id: resp.result.pageItems[i].productId,
                                statu: 1
                            })
                        }
                    }
                }
                // 如果有,就要去操作了 操作完事就停止了
                if (haveLimitData.length) {
                    // 发请求
                    resp = await utils.request(instance.Local_CALL_USER, "get")
                    isRun = false
                    chrome.runtime.sendMessage({
                        message: 'listenData',
                        data: listenData,
                        errorData: haveLimitData
                    })
                } else {
                    // 没有
                    chrome.runtime.sendMessage({
                        message: 'listenData',
                        data: listenData
                    })
                }
                alreadyAdd = true
                await utils.delayFn(300)
            }
        } else {
            isRun = false
        }
    }
    else if (params.message === 'temu_rate_mallid') {
        // 存储起来
        utils.persistent.addLocalStorage('temu_mallid', params.data)
    }
    else if (params.message === 'listenTk') {
        // 先告诉当前的页面
        messageToInject("tkWarehouse_statu", "正在获取广告户信息")
        // 业务函数外接
        const resp = await get_TikTok_Data()
        if (resp == 'success') {
            // 发通知已经更新了数据
            chrome.runtime.sendMessage({
                message: 'tiktokDataUpdate'
            })
        }
    }
    else if (params.message === 'gettiktokmsToken') {
        utils.persistent.addLocalStorage(TIKTOK_BUSINESS_MS_TOKEN, JSON.stringify(params.data))
    }
    else if (params.message === 'updateCollect') {
        utils.persistent.addLocalStorage('collectURL', params.data)
    }
    else if (params.message === 'startCollect') {
        get_collect_list()
    }
    else if (params.message === 'weiyingToken') {
        if (!params.data || !params.id) {
            return
        }
        let running = true, pageNum = 1, dataList = [], resp = null
        async function getData(num) {
            // 拿到token去请求数据
            let url = `http://omsbackend.jaspers.com.cn:16017/prod-api/oms/backend/inventory/list?pageNum=${num}&pageSize=50`
            const resp = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${params.data}`,
                    'clientid': params.id
                }
            }).then(res => res.json())
            return resp
        }
        while(running) {
           resp = await getData(pageNum)
           if (resp.total > pageNum * 50) {
                pageNum++
                for (let index = 0; index < resp.rows.length; index++) {
                    const element = resp.rows[index];
                    if (element.warehouseName == "Jasper美西仓" || element.warehouseName == "JASPER美东仓") {
                        dataList = dataList.concat(element)
                    }
                }
                await utils.delayFn()
           } else {
                running = false
           }
        }
        if (dataList.length) {
             utils.persistent.addLocalStorage('weiyingown_list', JSON.stringify(dataList))
             toActivePage('temu_limit_data', {
                data: JSON.stringify(dataList)
             })
        }
    }
    else if (params.message === 'temu_data_get') {
        let m = await utils.persistent.getLocalStorage('temu_mallid')
        let url = 'https://agentseller.temu.com/bg-brando-mms/supplier/data/center/skc/sales/data'
        let param = ({
            body: JSON.stringify(params.data),
            headers: {
                'Mallid': m,
                'content-type': 'application/json'
            }
        })
        const resp = await utils.request(url, "post", param)
        console.log(resp)
        if (resp.success) {
            // 证明有数据,直接存储起来
            utils.persistent.addLocalStorage('all_temu_data_limit', JSON.stringify(resp.result))
            // 返回给前台
            messageToInject("temu_limit_data", JSON.stringify(resp.result))
        }
    }
    else if (params.message === 'aliexpress_data') {
        console.log(params.data, '看看数据')
        let data = JSON.parse(params.data)
        // 这个先下载吧
        let pdfList = data.pdfData
        if (pdfList.length) {
            let dirName = new Date().getTime() + 'Aliexpress面单'
            for (let index = 0; index < pdfList.length; index++) {
                const element = pdfList[index];
                let fileName = `${element.orderNum}-${element.yundan}.pdf`
                chrome.downloads.download({
                    url: element.pdf_url,
                    saveAs: false, // true的话会弹出让你确认保存地址的窗,设置false
                    filename: `${dirName}/${fileName}`, //这样就可以了,不要出现../ .这些也不要出现/ 直接开头就是本地浏览器保存的文件夹目录下了
                    conflictAction: 'uniquify'
                })
                await utils.delayFn()
            }
        }
        // const resp = await await utils.request(instance.Local_SAVE_XLSX, "post", {
        //     body: data.outData,
        //     headers: {
        //         'content-type': 'application/json'
        //     }
        // })
    }
    else if (params.message === 'download_TEMU_Pic') {
        const size = params.size
        switch (size) {
            case '180':
            case '800':
                const currentT = new Date().getTime()
                for (let index = 0; index < params.downloadList.length; index++) {
                    const downloadItem = params.downloadList[index]
                    console.log(downloadItem)
                    chrome.downloads.download({
                        url: downloadItem[size],
                        saveAs: false,
                        filename: `${currentT}TEMU商品图/${downloadItem.imgName}`,
                        conflictAction: 'uniquify'
                    })
                    await utils.delayFn()
                }
                break;
            default:
                console.log('暂无对应的资源下载')
        }
    }
    else if (params.message == 'download_TEMU_Video') {
        chrome.downloads.download({
            url: params.videoHref,
            saveAs: false,
            filename: `视频.mp4`,
            conflictAction: 'uniquify'
        })
    }
    else if (params.message == 'updateMoney') {
        let money_data = JSON.parse(params.data)
        moneyNum = money_data.num
        if (money_data.dw != 'CNY') {
            moneyNum = money_data.num * 7.19
        }
        utils.persistent.addLocalStorage('money_num', moneyNum)
    }
    else if (params.message == 'download_TEMU_totalData') {
        topThreeArr = []
        moneyNum = await utils.persistent.getLocalStorage('money_num')
        console.log('第九个需求,七天回款: (解决)', moneyNum)
        let mallid = await utils.persistent.getLocalStorage('temu_mallid')
        // 导出数据
        let show_url = 'https://agentseller.temu.com/mms/venom/api/supplier/sales/management/listWarehouse'
        // 这个地方要拿俩部分 一个是JIT还有一个就是库存大于1的
        // 这个是筛JIT的
        let jit_params = {
            "pageNo": 1,
            "pageSize": 10,
            "isLack": 0,
            "purchaseStockType": 1,
            "selectStatusList": [
              12
            ],
            "priceAdjustRecentDays": 7
        }
        let resp = await fetch(show_url, {
            method: 'POST',
            body: JSON.stringify(jit_params),
            headers: {
                'content-type': 'application/json',
                'mallid': mallid
            }
        }).then(res => res.json())
        console.log('结果', resp)
        if (resp.success) {
            // 成了 看看数据
            let total = resp.result.total
            let save_total = 0
            // 拿加入站点而且库存是大于等于1的
            jit_params = {
                "pageNo": 1,
                "pageSize": 10,
                "isLack": 0,
                "selectStatusList": [
                  12
                ],
                "priceAdjustRecentDays": 7,
                "maxRemanentInventoryNum": 1
            }
            resp = await fetch(show_url, {
                method: 'POST',
                body: JSON.stringify(jit_params),
                headers: {
                    'content-type': 'application/json',
                    'mallid': mallid
                }
            }).then(res => res.json())
            if (resp.success) { 
                // 可以,都拿到了 看看拿到啥
                total += resp.result.total
                console.log('第一个需求,在售数量: (解决)', total)
                // 第二个需求
                let move_rate_url = 'https://agentseller.temu.com/bg-brando-mms/supplier/data/center/skc/sales/data'
                // 先得到今天的时间
                let today = new Date()
                // 年月份
                let year = today.getFullYear()
                let month = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1
                let date = today.getDate() - 1 < 10 ?  `0${today.getDate() - 1}` : today.getDate() - 1
                // 前七天
                let prevDay = new Date(new Date().setDate(today.getDate() - 6))
                let prevyear = prevDay.getFullYear()
                let prevmonth = prevDay.getMonth() + 1 < 10 ? `0${prevDay.getMonth() + 1}` : prevDay.getMonth() + 1
                let prevdate = prevDay.getDate() < 10 ?  `0${prevDay.getDate()}` : prevDay.getDate() - 1
                resp = await fetch(move_rate_url, {
                    method: 'POST',
                    body: JSON.stringify({
                        "regionIdList": [
                            -1
                        ],
                        "select": 2,
                        "startDate": `${prevyear}-${prevmonth}-${prevdate}`,
                        "endDate": `${year}-${month}-${date}`,
                        "page": 1,
                        "pageSize": 100
                    }),
                    headers: {
                        'content-type': 'application/json',
                        'mallid': mallid
                    }
                }).then(res => res.json())
                if (resp.success) {
                    // 这个地方拿一下前三
                    for (let index = 0; index < 3; index++) {
                        const element = resp.result.salesDataVOList[index];
                        const sku = element.productSkcBasicInfoVO.skcExtCode
                        const spu = element.productSkcBasicInfoVO.productId
                        const element_num = element.confirmGoodsQuantity
                        topThreeArr = topThreeArr.concat({
                            sku,
                            element_num,
                            spu
                        })
                    }
                    // 成功了
                    save_total = resp.result.total
                    // 算那个动销率
                    let can_sale_rate = save_total / total * 100 + '%'
                    console.log('第二个需求,动销率: (解决)', can_sale_rate)
                    // 销售额
                    console.log("第十个需求, 销售额", moneyNum)
                    // 完事了 下一个功能 近七天的金额流入数量 这个先不管了
                    // 下一个功能 也是在这个地方操作
                    let totalData = resp.result.salesDataVOList
                    // 循环累加总销量
                    let totalSale = 0
                    for (let index = 0; index < totalData.length; index++) {
                        const element = totalData[index];
                        totalSale += element.confirmGoodsQuantity
                    }
                    console.log('第四个需求,近七天总销量: (解决)', totalSale)
                    // 客单价
                    let customerPrice = (moneyNum / totalSale).toFixed(2)
                    console.log('第十一个需求,客单价: (解决)', customerPrice)
                    // 下一个功能
                    // 开始时间,今天的前俩天
                    let sDay = new Date(new Date().setDate(today.getDate() - 1))
                    let sprevyear = sDay.getFullYear()
                    let sprevmonth = sDay.getMonth() + 1 < 10 ? `0${sDay.getMonth() + 1}` : sDay.getMonth() + 1
                    let sprevdate = sDay.getDate() < 10 ?  `0${sDay.getDate()}` : sDay.getDate() - 1
                    let ssDay = new Date(new Date().setDate(sDay.getDate() - 6))
                    let ssprevyear = ssDay.getFullYear()
                    let ssprevmonth = ssDay.getMonth() + 1 < 10 ? `0${ssDay.getMonth() + 1}` : ssDay.getMonth() + 1
                    let ssprevdate = ssDay.getDate() < 10 ?  `0${ssDay.getDate()}` : ssDay.getDate() - 1
                    let shop_url = 'https://agentseller.temu.com/api/seller/full/flow/analysis/mall/list'
                    let params_list = {
                        "pageSize": 30,
                        "pageNum": 1,
                        "statTimeDimension": 2,
                        "startDate": `${ssprevyear}-${ssprevmonth}-${ssprevdate}`,
                        "endDate": `${sprevyear}-${sprevmonth}-${sprevdate}`
                    }
                    resp = await fetch(shop_url, {
                        method: 'POST',
                        body: JSON.stringify(params_list),
                        headers: {
                            'content-type': 'application/json',
                            'mallid': mallid
                        }
                    }).then(res => res.json())
                    if (resp.success) {
                        // 开始
                        let shopData = resp.result.list[0]
                        // 总预览量
                        let totalView = shopData.totalPageView
                        // 总访客数
                        let totalVistor = shopData.totalVisitorsNum
                        // 总支付买家数
                        let totalSaleNum = shopData.totalPayBuyerNum
                        // 总支付转化率
                        let totalRate = (shopData.totalExposePayConversionRate * 100).toFixed(2)
                        // 总支付件数
                        let totalPay = shopData.totalPayGoodsNum
                        // 商品浏览量
                        let goodView = shopData.goodsPageView
                        // 商品访客数
                        let goodVistor = shopData.goodsVisitorsNum
                        // 详情页下单买家数
                        let detailNum = shopData.goodsDetailPayBuyerNum
                        // 详情页下单的转化率
                        let detailRateNum = (shopData.goodsDetailPayConversionRate * 100).toFixed(2)
                        // 搞定
                        console.log('第五个需求,商家的各项数据: (解决)', totalView,totalVistor,totalSaleNum,totalRate,totalPay,goodView,goodVistor,detailNum,detailRateNum)
                        // 销量前三的SKU和销量
                        let sort_url = 'https://agentseller.temu.com/bg-luna-agent-seller/review/pageQuery'
                        let endT = new Date(`${year}-${month}-${date} 23:59:59`).getTime() + ''
                        let sort_list = {
                            "page": 1,
                            "pageSize": 100,
                            "endCreateTime": endT.substring(0, 10) + '999',
                            "startCreateTime": new Date(`${prevyear}-${prevmonth}-${prevdate} 00:00:00`).getTime(),
                            "scoreList": [
                                1,
                                2,
                                3
                            ]
                        }
                        resp = await fetch(sort_url, {
                            method: 'POST',
                            body: JSON.stringify(sort_list),
                            headers: {
                                'content-type': 'application/json',
                                'mallid': mallid
                            }
                        }).then(res => res.json())
                        if (resp.success) {
                            let len = resp.result.total
                            console.log('第六个需求,商家的差评: (解决)', len)
                            resp = await fetch('https://agentseller-us.temu.com/bg-luna-agent-seller/review/pageQuery', {
                                method: 'POST',
                                body: JSON.stringify(sort_list),
                                headers: {
                                    'content-type': 'application/json',
                                    'mallid': mallid
                                }
                            }).then(res => res.json())
                            if (resp.success) {
                                // 第七个需求
                                let len2 = resp.result.total
                                console.log('第七个需求,商家的差评: (解决)', len2)
                                resp = await fetch('https://agentseller-eu.temu.com/bg-luna-agent-seller/review/pageQuery', {
                                    method: 'POST',
                                    body: JSON.stringify(sort_list),
                                    headers: {
                                        'content-type': 'application/json',
                                        'mallid': mallid
                                    }
                                }).then(res => res.json())
                                if (resp.success) {
                                    // 第八个需求
                                    let len3 = resp.result.total
                                    console.log('第八个需求,商家的差评: (解决)', len3)
                                    // 导出表
                                    let currentY = new Date()
                                    let cy = currentY.getFullYear()
                                    let cm = currentY.getMonth() + 1
                                    let cd = currentY.getDate()
                                    // 七天前
                                    let prevY = new Date(new Date().setDate(cd - 6))
                                    let py = prevY.getFullYear()
                                    let pm = prevY.getMonth() + 1
                                    let pd = prevY.getDate()
                                    // 时间
                                    // // 数据
                                    let ws = [['日期', '在售数量/单','动销率','销售额/人民币','订单量/单','客单价/元','总预览量','总访客数','总支付买家数','总支付转化率','总支付件数','商品浏览量','商品访客数','详情页下单买家数','详情页下单的转化率','全球差评数(近七天)','美区差评数(近七天)', '欧区差评数(近七天)', '第一个产品货号','第一个产品SPU', '近七天销量','第二个产品货号', '第二个产品SPU', '近七天销量', '第三个产品货号', '第三个产品SPU', '近七天销量']]
                                    ws = ws.concat([[`${cy}-${cm}-${cd} / ${py}-${pm}-${pd}`, total, can_sale_rate, moneyNum, totalSale, customerPrice, totalView,totalVistor,totalSaleNum,totalRate + '%',totalPay,goodView,goodVistor,detailNum,detailRateNum + '%', len, len2, len3, topThreeArr[0].sku, topThreeArr[0].spu, topThreeArr[0].element_num,topThreeArr[1].sku, topThreeArr[1].spu, topThreeArr[1].element_num,topThreeArr[2].sku, topThreeArr[2].spu, topThreeArr[2].element_num]])
                                    resp = await await utils.request(instance.Local_SAVE_XLSX, "post", {
                                        body: JSON.stringify({
                                            data: JSON.stringify(ws),
                                            mallid: mallid
                                        }),
                                        headers: {
                                            'content-type': 'application/json'
                                        }
                                    })
                                    console.log(resp, '是什么')
                                    if (resp.code == 200) {
                                        chrome.downloads.download({
                                            url: resp.data,
                                            filename: "TEMU数据/temu7天数据表.xlsx",
                                            conflictAction: "uniquify",
                                            saveAs: false,
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    else if (params.message == 'downloadTikTokXlsx') {
        let downloadXlsx = [['时间','广告户名称', '订单', '消耗/USD']]
        // 看看
        let downloadData = JSON.parse(params.data)
        console.log(downloadData)
        let keys = Object.keys(downloadData)
        console.log(keys)
        let roi_url = "https://ads.tiktok.com/api/oec_shopping/v1/oec/stat/post_overview_stat?locale=zh&language=zh&bc_id=7490498299846361105"
        let bec_seller_url = "https://business.tiktok.com/api/v3/bm/account/gmv_max/?org_id=7490498299846361105&attr_source=&source_biz_id=&attr_type=web&account_type=1"
        if (keys.length <= 1) {
            let tiktokData = downloadData[keys[0]]
            // 开整
            bec_seller_url += `&account_id=${tiktokData.account_id}&shop_owner_id=${tiktokData.owner_id}`
            let resp = await utils.request(bec_seller_url, "get")
            if (resp.msg === 'success') {
                // 这个是拿到当前的所有广告计划的 然后campaign_opt_status等于1是关闭,等于0是开启 暂时先不用
                // 证明拿到了id值,可以开始去拿roi数据了
                let aaid = resp.data.accounts[0].account_id
                // 这个是拿到每个广告的roi
                roi_url += `&oec_seller_id=${aaid}&aadvid=${tiktokData.account_id}`
                resp = await utils.request(roi_url, "post", {
                    body: JSON.stringify({
                        "query_list": [
                        "cost",
                        "onsite_roi2_shopping_sku",
                        "cost_per_onsite_roi2_shopping_sku",
                        "onsite_roi2_shopping_value",
                        "onsite_roi2_shopping"
                        ],
                        "start_time": tiktokData.startTime,
                        "end_time": tiktokData.endTime,
                        "campaign_shop_automation_type": 2,
                        "external_type_list": [
                        "307",
                        "304",
                        "305"
                        ]
                    }),
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                if (resp.data?.statistics) {
                    // 看看
                    console.log(resp.data,'看看')
                    // 证明就是拿到数据了
                    let data = resp.data.statistics
                    let cost = data.cost // 消费成本
                    let spend_rate = data.onsite_roi2_shopping // 投资回报率
                    let get_order = data.onsite_roi2_shopping_sku // 出的单量
                    let all_sell = data.onsite_roi2_shopping_value // 总收入
                    let sell_rate = data.cost_per_onsite_roi2_shopping_sku // 平均下单的成本 也就是roi
                    // 这个是总的, 所以要弄一个数组来存
                    let all_time = `${tiktokData.startTime}-${tiktokData.endTime}`
                    downloadXlsx = downloadXlsx.concat([[all_time, tiktokData.name, get_order, cost]])
                    // 这个地方开始循环去拿
                    let startTimeStramp = new Date(tiktokData.startTime).getTime()
                    let endTimeStramp = new Date(tiktokData.endTime).getTime()
                    while(startTimeStramp <= endTimeStramp) {
                        // 开搞
                        let searchTime = utils.formatDate(new Date(startTimeStramp),"yyyy-MM-dd")
                        resp = await utils.request(roi_url, "post", {
                            body: JSON.stringify({
                                "query_list": [
                                "cost",
                                "onsite_roi2_shopping_sku",
                                "cost_per_onsite_roi2_shopping_sku",
                                "onsite_roi2_shopping_value",
                                "onsite_roi2_shopping"
                                ],
                                "start_time": searchTime,
                                "end_time": searchTime,
                                "campaign_shop_automation_type": 2,
                                "external_type_list": [
                                "307",
                                "304",
                                "305"
                                ]
                            }),
                            headers: {
                                'content-type': 'application/json'
                            }
                        })
                        if (resp.data?.statistics) { 
                            startTimeStramp += 86400000
                            let data = resp.data.statistics
                            let cost = data.cost
                            let get_order = data.onsite_roi2_shopping_sku
                            downloadXlsx = downloadXlsx.concat([[searchTime, tiktokData.name, get_order, cost]])
                        }
                        // 延迟下
                        await utils.delayFn(1)
                    }
                    console.log('看看效果', downloadXlsx)
                    if (downloadXlsx.length) {
                        // 发给我的远程接口
                        const resp = await utils.request(instance.Local_SAVE_XLSX_TK, "post", {
                            body: JSON.stringify(downloadXlsx),
                            headers: {
                                'content-type': 'application/json'
                            }
                        })
                        console.log(resp.data)
                        if (resp.code == 200) {
                            // 下载
                            chrome.downloads.download({
                                url: resp.data,
                                filename: "tiktok实时数据/TikTok七天数据表.xlsx",
                                conflictAction: "uniquify",
                                saveAs: false,
                            })
                        }
                    }
                }
            }
            toActivePage('alreadyDownload')
        } else {
            // 多个的
            for (let index = 0; index < keys.length; index++) {
                let name = keys[index]
                const element = downloadData[name];
                roi_url = "https://ads.tiktok.com/api/oec_shopping/v1/oec/stat/post_overview_stat?locale=zh&language=zh&bc_id=7490498299846361105"
                bec_seller_url = "https://business.tiktok.com/api/v3/bm/account/gmv_max/?org_id=7490498299846361105&attr_source=&source_biz_id=&attr_type=web&account_type=1"
                bec_seller_url += `&account_id=${element.account_id}&shop_owner_id=${element.owner_id}`
                let resp = await utils.request(bec_seller_url, "get")
                if (resp.msg === 'success') {
                    // 这个是拿到当前的所有广告计划的 然后campaign_opt_status等于1是关闭,等于0是开启 暂时先不用
                    // 证明拿到了id值,可以开始去拿roi数据了
                    let aaid = resp.data.accounts[0].account_id
                    // 这个是拿到每个广告的roi
                    roi_url += `&oec_seller_id=${aaid}&aadvid=${element.account_id}`
                    resp = await utils.request(roi_url, "post", {
                        body: JSON.stringify({
                            "query_list": [
                            "cost",
                            "onsite_roi2_shopping_sku",
                            "cost_per_onsite_roi2_shopping_sku",
                            "onsite_roi2_shopping_value",
                            "onsite_roi2_shopping"
                            ],
                            "start_time": element.startTime,
                            "end_time": element.endTime,
                            "campaign_shop_automation_type": 2,
                            "external_type_list": [
                            "307",
                            "304",
                            "305"
                            ]
                        }),
                        headers: {
                            'content-type': 'application/json'
                        }
                    })
                    if (resp.data?.statistics) {
                        // 看看
                        console.log(resp.data,'看看')
                        // 证明就是拿到数据了
                        let data = resp.data.statistics
                        let cost = data.cost // 消费成本
                        let spend_rate = data.onsite_roi2_shopping // 投资回报率
                        let get_order = data.onsite_roi2_shopping_sku // 出的单量
                        let all_sell = data.onsite_roi2_shopping_value // 总收入
                        let sell_rate = data.cost_per_onsite_roi2_shopping_sku // 平均下单的成本 也就是roi
                        // 这个是总的, 所以要弄一个数组来存
                        let all_time = `${element.startTime}-${element.endTime}`
                        downloadXlsx = downloadXlsx.concat([[all_time, element.name, get_order, cost]])
                        // 这个地方开始循环去拿
                        let startTimeStramp = new Date(element.startTime).getTime()
                        let endTimeStramp = new Date(element.endTime).getTime()
                        while(startTimeStramp <= endTimeStramp) {
                            // 开搞
                            let searchTime = utils.formatDate(new Date(startTimeStramp),"yyyy-MM-dd")
                            resp = await utils.request(roi_url, "post", {
                                body: JSON.stringify({
                                    "query_list": [
                                    "cost",
                                    "onsite_roi2_shopping_sku",
                                    "cost_per_onsite_roi2_shopping_sku",
                                    "onsite_roi2_shopping_value",
                                    "onsite_roi2_shopping"
                                    ],
                                    "start_time": searchTime,
                                    "end_time": searchTime,
                                    "campaign_shop_automation_type": 2,
                                    "external_type_list": [
                                    "307",
                                    "304",
                                    "305"
                                    ]
                                }),
                                headers: {
                                    'content-type': 'application/json'
                                }
                            })
                            if (resp.data?.statistics) { 
                                startTimeStramp += 86400000
                                let data = resp.data.statistics
                                let cost = data.cost
                                let get_order = data.onsite_roi2_shopping_sku
                                downloadXlsx = downloadXlsx.concat([[searchTime, element.name, get_order, cost]])
                            }
                            // 延迟下
                            await utils.delayFn(1)
                        }
                        console.log('看看效果', downloadXlsx)
                    }
                }
                await utils.delayFn(1.5)
            }
            if (downloadXlsx.length) {
                // 发给我的远程接口
                const resp = await utils.request(instance.Local_SAVE_XLSX_TK, "post", {
                    body: JSON.stringify(downloadXlsx),
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                console.log(resp.data)
                if (resp.code == 200) {
                    toActivePage('alreadyDownload')
                    // 下载
                    chrome.downloads.download({
                        url: resp.data,
                        filename: "tiktok实时数据/TikTok七天数据表.xlsx",
                        conflictAction: "uniquify",
                        saveAs: false,
                    })
                }
            }
        }
    }
    else if (params.message == 'translate') {
        let data = params.data
        let resp = await fetch('http://192.168.188.77:8889/translate', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                msg: data
            })
        }).then(res => res.json())
        if (resp.code == 200) {
            toActivePage('translate', resp.data)
        }
    }
    else if (params.message == 'delete_item') {
        let delete_index = 0
        for (let index = 0; index < collectList.length; index++) {
            const element = collectList[index];
            if (element.label == params.data) {
                // 删掉!
                delete_index = index
                break;
            }
        }
        // 删掉,更新本地的存储
        collectList.splice(delete_index, 1)
        utils.persistent.addLocalStorage('collectURL', JSON.stringify(collectList))
    }
})

// 强制顶戴上一次函数的执行完成再执行当前的函数
function strongWait(fn) {

}


// 这个地方要去看我要拿哪个的数据
// tiktok 申请所有的数据
const get_TikTok_Data = async function() {
    let roi_data = {}, showStr = '', moneyStr = '';
    tiktok_advertisement = []
    let account_url = 'https://business.tiktok.com/api/v3/bm/account/list/?org_id=7490498299846361105&attr_source=TTAM_account_list&source_biz_id=&attr_type=web&page=1&keyword=&account_type=1&limit=10'
    // 先看看本地有没有存储,有的话就不用再请求一次了
    let local_account = await utils.persistent.getLocalStorage(TIKTOK_BUSINESS_ACCOUNT)
    // 拿到所有的账目  
    if (!local_account) {
        let resp = await utils.request(account_url, "get")
        if(resp.msg === 'success') {
            // 持久化保存下
            console.log('看看我的账户', resp.data)
            utils.persistent.addLocalStorage(TIKTOK_BUSINESS_ACCOUNT, JSON.stringify(resp.data.accounts))
            local_account = resp.data.accounts
        } else {
            console.log('报错是:', resp)
        }
    } 
    // 接下去往下走 拿到所有的账户的广告数据,保存在本地
    // 拿到今天的数据
    let today = utils.formatDate(new Date(),"yyyy-MM-dd")
    let url = 'https://ads.tiktok.com/api/v3/i18n/statistics/transaction/balance/query/'
    let msToken = await utils.persistent.getLocalStorage(TIKTOK_BUSINESS_MS_TOKEN)
    // 拿到当前选择的广告户的数据
    let moveWidth = 100 / local_account.length
    // 当前移动多少
    let currentMove = 0
    for (let index = 0; index < local_account.length;) {
        // if (index !== 4) {
        //     continue
        // }
        let bec_seller_url = "https://business.tiktok.com/api/v3/bm/account/gmv_max/?org_id=7490498299846361105&attr_source=&source_biz_id=&attr_type=web&account_type=1"
        let roi_url = "https://ads.tiktok.com/api/oec_shopping/v1/oec/stat/post_overview_stat?locale=zh&language=zh&bc_id=7490498299846361105"
        const account = local_account[index];
        // let filter_list = ['YG', 'MQ']
        // let listen_item = filter_list.find(item => account.account_name.includes(item))
        currentMove += moveWidth
        let country_en = account.account_name.substring(0,5)
        let currentCNmoney = null
        if (account.account_name.includes('MQ') && (new Date().getHours() < 15)) {
            // 要用昨天
            today = utils.formatDate(new Date(new Date().getTime() - 86400000),"yyyy-MM-dd");
        }
        // 在这里请求我的金额额度
        let money_url = url
        const response = await utils.request(money_url, "get", {
            aadvid: account.account_id,
            source: 3,
            req_src: 'bidding',
            msToken
        })
        // if (!listen_item) {
        //     continue
        // }
        // console.log(listen_item)
        // 这个是拿到oec_seller_id用的
        bec_seller_url += `&account_id=${account.account_id}&shop_owner_id=${account.owner_id}`
        let resp = await utils.request(bec_seller_url, "get")
        if (resp.msg === 'success') {
            // 这个是拿到当前的所有广告计划的 然后campaign_opt_status等于1是关闭,等于0是开启 暂时先不用
            // 证明拿到了id值,可以开始去拿roi数据了
            let aaid = resp.data.accounts[0].account_id
            // 这个是拿到每个广告的roi
            roi_url += `&oec_seller_id=${aaid}&aadvid=${account.account_id}`
            resp = await utils.request(roi_url, "post", {
                body: JSON.stringify({
                    "query_list": [
                      "cost",
                      "onsite_roi2_shopping_sku",
                      "cost_per_onsite_roi2_shopping_sku",
                      "onsite_roi2_shopping_value",
                      "onsite_roi2_shopping"
                    ],
                    "start_time": today,
                    "end_time": today,
                    "campaign_shop_automation_type": 2,
                    "external_type_list": [
                      "307",
                      "304",
                      "305"
                    ]
                }),
                headers: {
                    'content-type': 'application/json'
                }
            })
            if (resp.data?.statistics) {
                // 看看
                console.log(resp.data,'看看')
                // 证明就是拿到数据了
                let data = resp.data.statistics
                let cost = data.cost // 消费成本
                let spend_rate = data.onsite_roi2_shopping // 投资回报率
                let get_order = data.onsite_roi2_shopping_sku // 出的单量
                let all_sell = data.onsite_roi2_shopping_value // 总收入
                let sell_rate = data.cost_per_onsite_roi2_shopping_sku // 平均下单的成本 也就是roi
                showStr += `${country_en}当前每单消耗: ${sell_rate}USD, 现已消耗了${cost}USD, 出了${get_order}单\n`
                roi_data[country_en] = {
                    cost,
                    spend_rate,
                    get_order,
                    all_sell,
                    sell_rate,
                    currentMoney: currentCNmoney
                }
            }
            let plan_url = `https://ads.tiktok.com/api/oec_shopping/v1/oec/stat/post_campaign_list?locale=zh&language=zh&oec_seller_id=${aaid}&aadvid=${account.account_id}&bc_id=7490498299846361105`
            // // 请求下,我要活动数据
            // // 今天的日期
            let today_time = utils.formatDate(new Date(), 'yyyy-MM-dd')
            // // 七天前
            let prev_time = utils.formatDate(new Date().getTime() - (1000 * 60 * 60 * 24 * 7), 'yyyy-MM-dd')
            resp = await utils.request(plan_url, "post", {
                body: JSON.stringify({
                    "query_list": [
                      "campaign_opt_status",
                      "campaign_name",
                      "campaign_primary_status",
                      "campaign_status",
                      "campaign_budget",
                      "campaign_budget_mode",
                      "campaign_create_channel",
                      "template_ad_start_time",
                      "template_ad_end_time",
                      "template_ad_roas_bid",
                      "template_ad_schedule_type",
                      "auto_increase_budget_effective_budget",
                      "cost",
                      "billed_cost",
                      "onsite_roi2_shopping_sku",
                      "cost_per_onsite_roi2_shopping_sku",
                      "onsite_roi2_shopping_value",
                      "onsite_roi2_shopping",
                      "basic_cost",
                      "basic_onsite_roi2_shopping",
                      "campaign_additional_budget",
                      "creative_nobid_cost",
                      "session_info",
                      "campaign_no_bid_budget",
                      "gmv_max_bid_type",
                      "campaign_target_roi_budget_mode",
                      "campaign_target_roi_budget",
                      "promotion_days_mode",
                      "in_promotion_days",
                      "promotion_days_roas_bid_multiplier",
                      "promotion_days_budget_multiplier",
                      "promotion_days_schedules",
                      "compensation_info"
                    ],
                    "start_time": prev_time,
                    "end_time": today_time,
                    "order_field": "cost",
                    "order_type": 1,
                    "page": 1,
                    "campaign_status": [
                      "no_delete"
                    ],
                    "keyword": "",
                    "campaign_shop_automation_type": 2,
                    "external_type_list": [
                      "304",
                      "307"
                    ],
                    "keyword_type": 0
                }),
                headers: {
                    'content-type': 'application/json'
                }
            })
            if (resp.data && resp.data.table.length) {
                // 拿到了,看看
                console.log(resp)
                let activeList = []
                for (let index = 0; index < resp.data.table.length; index++) {
                    const element = resp.data.table[index];
                    if (element.campaign_primary_status == "delivery_ok") {
                        activeList = activeList.concat(element)
                    }
                }
                // 有东西 直接保存起来 
                if (activeList.length) {
                    let activeItem = {
                        accountName: account.account_name,
                        activity: []
                    }
                    for (let active_index = 0; active_index < activeList.length; active_index++) {
                        const a = activeList[active_index];
                        activeItem.activity = activeItem.activity.concat({
                            advertisementId: a.campaign_id,
                            advertisementName: a.campaign_name,
                            cost_money: a.basic_cost,
                            correct_money: a.billed_cost,
                            get_order: a.onsite_roi2_shopping_sku,
                            average_cost_money: a.cost_per_onsite_roi2_shopping_sku,
                            all_save: a.onsite_roi2_shopping_value,
                            current_roi: a.onsite_roi2_shopping
                        })
                    }
                    tiktok_advertisement = tiktok_advertisement.concat(activeItem)
                }
                // campaign_id 这个可能是后面要改动他的时候用到的一个id,先看看
                // 拿到更新的数据
                // let update_data_url = `https://ads.tiktok.com/api/oec_shopping/v1/creation/all_ad_data/detail?locale=zh&language=zh&oec_seller_id=${aaid}&aadvid=${account.account_id}&bc_id=7490498299846361105&campaign_id=${resp.data.table[2].campaign_id}`
                // 上面这个地址是拿到ad_id的
                // 先拿到本次要更新的数据
                // let updateDataResp = await utils.request(update_data_url, "get")
                // if (updateDataResp.data && updateDataResp.data.ad_info) {
                //     // 看看吧 进来就是数据是对的,但是要更新部分的内容 例如我的roi和我的预算
                //     let updateData = updateDataResp.data
                //     // 这个是电脑的数据,这个是固定的,不会变
                //     updateData.risk_info = {
                //         "cookie_enabled": true,
                //         "screen_width": 1920,
                //         "screen_height": 1080,
                //         "browser_language": "zh-CN",
                //         "browser_platform": "Win32",
                //         "browser_name": "Mozilla",
                //         "browser_version": "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
                //         "browser_online": true,
                //         "timezone_name": "Asia/Shanghai"
                //     }
                //     // 如下是改预算 值是一致的
                //     let sellMoney = '11'
                //     updateData.campaign_info.budget = sellMoney
                //     updateData.ad_info.budget = sellMoney
                //     // 如下是改roi 最低1 最高20 可以小数点
                //     let sellRoi = '20'
                //     updateData.ad_info.roas_bid = sellRoi
                //     // 这个是预算范围
                //     updateData.ad_info.adjusted_budget = sellMoney * 1.5
                //     updateData.ad_info.adjusted_roas_bid = sellRoi * 0.9
                //     console.log(updateDataResp)
                //     // 这个地方修改看看
                //     let update_url = `https://ads.tiktok.com/api/oec_shopping/v1/creation/all_ad_data/update?locale=zh&language=zh&oec_seller_id=${aaid}&aadvid=${account.account_id}&bc_id=7490498299846361105`
                //     // 更新看看
                //     resp = await utils.request(update_url, "post", {
                //         body: JSON.stringify(updateData),
                //         headers: {
                //             'content-type': 'application/json'
                //         }
                //     })
                //     // 看看是否更新成功
                //     if (resp.data.ad_id) {
                //         console.log('更新成功,当前的roi和预算分别是',sellRoi, sellMoney)
                //     }
                // }
            }
        } else {
            // 继续走一遍
            await utils.delayFn(2)
            continue
        }
        await utils.delayFn(2)
        index++
        messageToInject("tkWarehouse_statu", currentMove)
        if (response.msg === 'success') {
            currentCNmoney = `${country_en}当前通用额度: ${response.data?.credit_cash_valid}USD, 广告可用额度： ${response.data?.ad_credit_valid}USD\n`
            moneyStr += currentCNmoney
        } else {
            console.log('有大问题~')
        }
        if (local_account.length == index + 1) {
            // 保存到本地
            utils.persistent.addLocalStorage(TIKTOK_BUSINESS_ADVERTISEMENT, JSON.stringify(tiktok_advertisement))
        }
    }
    // 保存到本地
    utils.persistent.addLocalStorage(TIKTOK_BUSINESS_ROI_DATA, JSON.stringify(roi_data))
    messageToInject("tkWarehouse_statu", 100)
    messageToInject("close_message")
    await utils.delayFn(2)
    // 触发弹窗
    // 改变策略， 直接给页面，页面去传递就行了
    toActivePage('tiktokCurrentBusiness', {
        roiData: showStr,
        moneyData: moneyStr
    })
    return Promise.resolve('success')
}