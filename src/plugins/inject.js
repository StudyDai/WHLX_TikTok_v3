(async function() {
console.log("This is injected into")
let tiktokUrl = /https:\/\/seller\.tiktokshopglobalselling\.com/
let weiyingUrl = /http:\/\/omsbackend\.jaspers\.com\.cn\:16017/
let temu_Data_Url = /https:\/\/agentseller\.temu\.com\/newon\/goods\-data/
let current_url = location.href
let url_list = null, timer = null, current_Data = null, outData = [['编号', '仓库', '订单号', '邮编', '运单号', '产品SKU', '手机号', '收货人地址']];
// 重写alert
function injectFn() {
    let link;
    let p = chrome.runtime.getURL('js/zx.js')
    link = document.createElement('script')
    link.setAttribute('type', `text/javascript`)
    link.setAttribute('src', p)
    document.querySelector('head').insertBefore(link, document.querySelector('head').firstChild)
    console.log("植入成功")
}
injectFn()
if (tiktokUrl.test(current_url)) {
    timer = setInterval(function() {
        // 直接拿,拿到就关掉
        let tiktokPopUp = document.querySelector('.mmo-message-entry-arco-notification-wrapper.mmo-message-entry-arco-notification-wrapper-topRight')
        if (tiktokPopUp) {
            // 关掉
            tiktokPopUp.style.display = 'none'
            clearInterval(timer)
        }
    }, 500)
}
else if (weiyingUrl.test(current_url)) {
    // 存储下 token
    const token = localStorage.getItem('Admin-Token')
    function base64ToUtf8(base64Str) {
        return decodeURIComponent(
          atob(base64Str).split("").map(char => 
            "%" + char.charCodeAt(0).toString(16).padStart(2, "0")
          ).join("")
        );
    }
    // 拿到的是字符串还要转化一次
    let userInfo = base64ToUtf8(token.split('.')[1])
    chrome.runtime.sendMessage({
        message: 'weiyingToken',
        data: token,
        id: JSON.parse(userInfo).clientid
    })
}
else if (temu_Data_Url.test(current_url)) {
    // 插入一个可以请求数据的
    let getBtn = document.createElement('div')
    getBtn.classList.add('btn-container')
    getBtn.innerHTML = `
        <button type="submit" class="request-btn">
            <!-- 加载图标（默认隐藏） -->
            <span class="loading-icon"></span>
            <!-- 按钮文字 -->
            <span class="btn-text">刷新数据</span>
        </button>
    `
    getBtn.onclick = () => {
        let searchIpt = document.querySelector('input[data-testid="beast-core-rangePicker-htmlInput"]')
        let numberIpt = document.querySelector('.PGT_sizeChanger_5-120-1 input[data-testid="beast-core-select-htmlInput"]')
        console.log(searchIpt.value, )
        chrome.runtime.sendMessage({
            message: 'temu_data_get',
            data: {
                "regionIdList": [
                  -1
                ],
                "select": 3,
                "startDate": searchIpt.value.split(' ~ ')[0],
                "endDate": searchIpt.value.split(' ~ ')[1],
                "page": 1,
                "pageSize": numberIpt.value
            }
        })
    }
    // 循环去查
    let searchOptions = null
    let timer = setInterval(() => {
        searchOptions = document.querySelector('.index-module__col-query-btn-wrapper___U5ioq')
        if (searchOptions) {
            searchOptions.appendChild(getBtn)
            clearInterval(timer)
        }
    }, 2000);
    // 告诉后面的人 要发请求了
    // 能拿到么 看看
    
}
function formatDate(data) {
    if (!data) {
        return '-------------------'
    }
    let now = new Date(data)
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    // 格式化 年-月-日
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需+1
    let day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
const instance = await import(chrome.runtime.getURL('js/instance_chrome.js'))
chrome.runtime.onMessage.addListener((resp, sender, sendResponse) => {
    if (resp.message === 'tiktokCurrentBusiness') {
        alert(resp.data.roiData + `\n${resp.data.moneyData}`)
    }
    else if (resp.message === 'getCollect') {
        url_list = resp.data
        initData()
    }
    else if (resp.message === 'tkWarehouse_statu') {
        console.log('233', resp.data)
        // 渲染
        if (!show_el) {
            show_el = document.querySelector('.show_tk_container')
        }
        if (!show_el.className.includes('active')) {
            show_el.classList.add('active')     
            show_el.innerHTML = `<div class="show_main" style="background-color: blue; width: 0%; transition: width linear .6s"></div>`
        } else {
            let showMain = document.querySelector('.show_main')
            if (resp.data == 100) {
                showMain.style.backgroundColor = 'green'
            }
            showMain.style.width = resp.data + '%'
            currentNum = resp.data
        }
    }
    else if (resp.message === 'close_message') {
        if (!show_el) {
            show_el = document.querySelector('.show_tk_container')
        }
        show_el.classList.remove('active')
    }
    else if (resp.message === 'temu_limit_data') {
        // 拿数据看看
        console.log('我拿到数据了', resp.data)
        current_Data = JSON.parse(resp.data)
        let tbody = null, timer = null;
        let svgEl = document.createElement('div')
        svgEl.innerHTML = `<div class="ball_container">
            <svg t="1761813163580" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1610" width="200" height="200"><path d="M888.544169 945.712325h-33.046521c-5.81805-120.270721-32.953433-210.846117-72.376537-278.800937l-0.558533-1.396332c-41.424513-71.026749-96.160724-117.431513-153.829231-145.683961 57.668508-28.764437 112.404718-74.657212 153.829231-145.683962l0.558533-1.396332c40.726347-70.747483 68.746074-166.349674 72.981614-294.439854h32.3949a39.050749 39.050749 0 0 0 39.516193-39.143837 39.050749 39.050749 0 0 0-39.516193-39.143838H164.313357a39.190382 39.190382 0 1 0 0 78.33422h32.3949c4.700984 128.043635 32.162178 223.692371 72.981614 294.439854l0.791254 1.396331c41.424513 71.026749 95.881457 116.826436 153.782687 145.683962-57.90123 28.252449-112.358174 74.610668-153.782687 145.683962l-0.74471 1.349787c-39.097293 67.954819-66.325765 158.530215-72.143815 278.800937H164.313357a39.004204 39.004204 0 0 0-39.423105 38.53876c-0.046544 22.34131 17.593782 39.748915 39.423105 39.748915h724.230812a39.190382 39.190382 0 0 0 39.469649-39.748915 38.911116 38.911116 0 0 0-39.516193-38.53876m-577.941774-255.063294l0.605077-1.675599c47.475285-81.685416 99.418831-125.204427 168.257994-146.52176l2.699575-1.675599h0.605077c1.396332-0.558533 2.792664-1.117066 3.956274-2.234131l0.465444-0.511988 1.722143-1.16361 0.232722-0.558533 1.768687-1.675598 0.279266-0.558533c1.117066-1.16361 1.675598-2.559942 2.792664-3.956274v-0.465444a10.100134 10.100134 0 0 0 1.722143-5.678416l0.279266-0.558533v-1.722142l0.232722-1.396332v-1.070521l-0.232722-1.396332v-1.117066l-0.279266-1.117065a9.774323 9.774323 0 0 0-1.722143-5.585328v-0.558533c-1.117066-1.629054-1.675598-2.792664-2.792664-3.909729l-0.279266-0.837799-1.768687-1.396332h-0.232722l-1.675598-1.675598-0.465444-0.558533a71.399105 71.399105 0 0 0-4.002819-2.559942l-0.605077-0.279266-2.699575-1.117066c-68.839163-20.665712-120.736165-64.836345-168.257994-147.080293l-0.605077-0.558533c-37.002795-64.650167-62.090225-152.665621-66.558487-271.2142h564.862798c-3.956274 118.548578-29.136792 206.657121-66.558487 271.2142l-0.558533 0.605077c-47.335651 82.15086-99.418831 126.368037-167.699461 147.080294l-3.351197 1.070521-0.558532 0.279266-4.002819 2.559942-0.511988 0.558533-1.722143 1.675598-1.90832 1.396332-0.279266 0.837799a12.101543 12.101543 0 0 0-2.234131 3.909729l-0.605078 0.558533-1.722142 5.585328v8.377991l1.722142 5.631872 0.605078 0.511988c0.605077 1.396332 1.396332 2.792664 2.234131 3.956274l0.279266 0.558533 1.90832 1.675598v0.558533l1.722143 1.16361 0.511988 0.511988a11.403377 11.403377 0 0 0 4.002819 2.234131h0.558532l3.351197 1.675599c68.28063 21.317334 120.36381 64.836345 167.699461 146.52176l0.558533 1.675599c19.827913 33.605054 35.699552 74.42449 47.475285 121.946319 2.559942 13.544419 10.937933 43.332833 13.265153 81.918138-37.561328-33.279244-142.891298-57.715052-268.700803-59.576827V464.536351a33.651599 33.651599 0 0 0 3.770097-1.396331l0.279266-0.605078 6.748937-2.513397 0.605078-0.279266h0.558532a273.448331 273.448331 0 0 0 112.63744-66.558488c32.581078-31.882912 57.109975-71.538738 73.819414-115.243926a22.992932 22.992932 0 0 0-13.358242-30.160769 23.50492 23.50492 0 0 0-30.812391 13.451331c-14.708029 37.188973-35.187564 71.259471-62.928024 98.394854a226.112679 226.112679 0 0 1-93.088794 54.782755l-1.070521 0.558533-2.792664 0.605077-2.280675 1.117066-2.234131-1.117066-1.675598-0.605077-2.187587-0.558533a227.695189 227.695189 0 0 1-92.856071-54.782755c-27.926638-27.135383-48.313084-61.205882-63.160747-98.394854a22.853299 22.853299 0 0 0-30.160769-13.497875 23.132565 23.132565 0 0 0-13.497875 30.253857c16.802527 43.6121 40.86598 83.31447 73.819413 115.197382 29.648781 29.695325 67.11702 52.315902 112.404718 66.558488h0.279267l0.837799 0.279266 6.14386 2.513397 1.722143 0.605078 2.792664 1.303243v370.400309c-117.896957 0-219.87573 19.734824-268.654258 48.452717 1.675598-18.943569 5.585328-40.447081 13.032431-70.654394 11.682644-48.080362 27.926638-88.341265 47.475285-121.94632" fill="#7380e1" p-id="1611"></path></svg>
        </div>`
        svgEl.classList.add('loudou')
        document.body.appendChild(svgEl)
        timer = setInterval(() => {
            tbody = document.querySelector('tbody[data-testid="beast-core-table-middle-tbody"]')
            const trs = tbody?.querySelectorAll('tr')
            if (trs.length) {
                clearInterval(timer)
                // 循环
                Array.from(trs).forEach(tr => {
                    // 拿到每一个tr的第四个td
                    let tdEl = tr.querySelectorAll('td')[3]
                    // 加入一个按钮
                    let divEl = document.createElement('div')
                    divEl.innerText = '查看详情'
                    divEl.classList.add('look_detail')
                    let tagEl = document.createElement('div')
                    tagEl.classList.add('tag-vibrant')
                    let timeEl = document.createElement('div')
                    timeEl.classList.add('time-tag')
                    // 拿到他的skc 去拿数据, 插入
                    let twoTd = tr.querySelectorAll('td')[1]
                    let tdItem = twoTd.querySelector('.product-info-render_infoContent__mQixw')
                    let skc_div = tdItem.querySelectorAll('div')[4]
                    let skc_value = skc_div.innerText.split('\n')[1]
                    let skc_item = current_Data.salesDataVOList.find(i => i.productSkcId == skc_value)
                    // 格式化 时:分:秒（补零确保两位数）
                    if (skc_item.marketProductSearchLimitTag) {
                        
                    }
                    switch (skc_item.marketProductSearchLimitTag) {
                        case null:
                            tagEl.innerText = '暂无限制'
                            tagEl.classList.add('blue')
                            break;
                        case 1:
                            tagEl.innerText = '限制一级'
                            timeEl.innerHTML = `
                            <div class="time-tag primary">
                                <span class="time-number" id="primaryTime">开始 ${formatDate(skc_item.marketProductSearchLimitBeginTime)}</span>
                            </div>
                            <div class="time-tag warning">
                                <span class="time-number" id="warningTime">截止 ${formatDate(skc_item.marketProductSearchLimitEndTime)}</span>
                            </div>`
                            tagEl.classList.add('yellow')
                            break;
                        case 2:
                            tagEl.innerText = '限制二级'
                            timeEl.innerHTML = `
                            <div class="time-tag primary">
                                <span class="time-number" id="primaryTime">开始 ${formatDate(skc_item.marketProductSearchLimitBeginTime)}</span>
                            </div>
                            <div class="time-tag warning">
                                <span class="time-number" id="warningTime">截止 ${formatDate(skc_item.marketProductSearchLimitEndTime)}</span>
                            </div>`
                            tagEl.classList.add('red')
                            break;
                    }
                    tdEl.appendChild(tagEl)
                    if (skc_item.marketProductSearchLimitTag) {
                        tdEl.appendChild(timeEl)
                    }
                    divEl.onclick = (event) => {
                        let target = event.currentTarget
                        let pp = target.parentElement
                        let grandfather = pp.parentElement
                        let Spu_item = grandfather.querySelectorAll('td')[1]
                        if (Spu_item) {
                            // 拿数据
                            let item = Spu_item.querySelector('.product-info-render_infoContent__mQixw')
                            let ThreeDiv = item.querySelectorAll('div')[4]
                            let spanValue = ThreeDiv.innerText.split('\n')[1]
                            let dotData = [], finalData = [];
                            console.log(spanValue, ThreeDiv, item, current_Data)
                            for (let index = 0; index < current_Data.salesDataVOList.length; index++) {
                                const element = current_Data.salesDataVOList[index];
                                console.log(element, spanValue)
                                if (element.productSkcId == spanValue) {
                                    let start_time = element.marketProductSearchLimitBeginTime
                                    let end_time = element.marketProductSearchLimitEndTime
                                    let limit_label = element.marketProductSearchLimitTag
                                    let startTime, startYear, startMonth, startDate, endTime,endYear,endMonth,endDate,start_current_time,end_current_time;
                                    let xData = element.confirmTrendList.map(list => {
                                            let arr = list.day.split('-')
                                            return `${arr[1]}.${arr[2]}`
                                    })
                                    if (start_time) {
                                        // 证明有东西 转化一下
                                        startTime = new Date(start_time)
                                        startYear = startTime.getFullYear()
                                        startMonth = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1
                                        startDate = startTime.getDate() < 10 ? '0' + startTime.getDate() : startTime.getDate()
                                        start_current_time = startYear + '-' + startMonth + '-' + startDate;
                                        endTime = new Date(end_time)
                                        if (endTime) {
                                            endYear = endTime.getFullYear()
                                            endMonth = endTime.getMonth() + 1 < 10 ? '0' + (endTime.getMonth() + 1) : endTime.getMonth() + 1
                                            endDate = endTime.getDate() < 10 ? '0' + endTime.getDate() : endTime.getDate()
                                            end_current_time = endYear + '-' + endMonth + '-' + endDate
                                        }
                                        // 有俩情况 一种就是 限制已经结束了 开启了新的限制 有的是在限制中 有俩种 tag是1 这个时候是已经开始新的了
                                        // 有限制结束时间 并且大于限制开始时间的 就是tag2  如果只有显示开始时间 或者比结束限制时间大的 就是tag 1
                                        console.log(start_current_time, end_current_time,'233')
                                        let stramp = new Date(start_current_time).getTime()
                                        let etramp = new Date(end_current_time).getTime()
                                        let len = xData.length
                                        let index = 0, eindex = 0, d = null, e = null;
                                        // 没有结束限制的 就是一直限
                                        if (!end_current_time) {
                                            d = element.confirmTrendList.find((d, i) => {
                                                let s = new Date(d.day).getTime()
                                                if (stramp == s) {
                                                    index = i
                                                    return true
                                                }
                                            })
                                            if (d) {
                                                // 找到了,他之后都要标记
                                                dotData = [
                                                      {
                                                        name: '搜索异常区域',
                                                        xAxis: xData[index]
                                                      },
                                                      {
                                                        xAxis: xData[len-index]
                                                      }
                                                ]
                                            }
                                        } else if (endTime < startTime){
                                            // 证明 上一次限流已经 结束了 等接下来的时间开始
                                            d = element.confirmTrendList.find((d, i) => {
                                                let s = new Date(d.day).getTime()
                                                if (stramp == s) {
                                                    index = i
                                                    return true
                                                }
                                            })
                                            console.log('2333', d)
                                            if (d) {
                                                // 找到了,他之后都要标记
                                                dotData = [
                                                      {
                                                        name: '搜索异常区域',
                                                        xAxis: xData[index]
                                                      },
                                                      {
                                                        xAxis: xData[len-index]
                                                      }
                                                ]
                                            }
                                        } else {
                                            console.log('来了哈')
                                            // 证明 上一次限流正在开始 并且有结束时间
                                            d = element.confirmTrendList.find((d, i) => {
                                                let s = new Date(d.day).getTime()
                                                if (stramp == s) {
                                                    index = i
                                                    return true
                                                }
                                            })
                                            // 没找到证明 是之前就开始的
                                            e = element.confirmTrendList.find((d, i) => {
                                                let s = new Date(d.day).getTime()
                                                if (etramp == s) {
                                                    eindex = i
                                                    return true
                                                }
                                            })
                                            // 如果没找到 要么是从之前就开始限制了
                                            if (!d && e) {
                                                // 找到了,他之后都要标记
                                                dotData = [
                                                      {
                                                        name: '搜索异常区域',
                                                        xAxis: xData[0]
                                                      },
                                                      {
                                                        xAxis: xData[eindex]
                                                      }
                                                ]
                                            } else if (d && !e) {
                                                // 找到了, 那就是从现在开始限制
                                                dotData = [
                                                    {
                                                      name: '搜索异常区域',
                                                      xAxis: xData[index]
                                                    },
                                                    {
                                                      xAxis: xData[xData.length - 1]
                                                    }
                                                ] 
                                            } else if (d && e){
                                                dotData = [
                                                    {
                                                      name: '搜索异常区域',
                                                      xAxis: xData[index]
                                                    },
                                                    {
                                                      xAxis: xData[eindex]
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                    // 拿 所有的数据 要渲染
                                    let myChart = document.createElement('div')
                                    myChart.classList.add('myChart_container')
                                    myChart.innerHTML = '<div class="myChart"></div><div id="close">×</div>'
                                    document.body.appendChild(myChart)
                                    let show_chart = document.querySelector('.myChart')
                                    let echart_close = document.getElementById('close')
                                    echart_close.onclick = () => {
                                        myChart.remove()
                                    }
                                    console.log(element.confirmTrendList.map(list => list.day), element.confirmTrendList.map(list => list.quantity))
                                    // 初始化图表实例
                                    const chart_Obj = window.echarts.init(show_chart);
                                    if (dotData.length) {
                                        finalData.push(dotData)
                                    }
                                    // 配置
                                    option = {
                                        title: {
                                          text: element.productSkcBasicInfoVO.category,
                                          subtext: '走向趋势图',
                                          textStyle: {
                                            color: '#fff'
                                          },
                                          subtextStyle: {
                                            color: '#fff'
                                          }
                                        },
                                        grid: {
                                            top: '30%'
                                        },
                                        tooltip: {
                                          trigger: 'axis',
                                          axisPointer: {
                                            type: 'cross'
                                          }
                                        },
                                        toolbox: {
                                          show: true,
                                          feature: {
                                            saveAsImage: {}
                                          }
                                        },
                                        xAxis: {
                                          type: 'category',
                                          boundaryGap: false,
                                          axisLabel: {
                                            color: "#fff",
                                            interval: 0,
                                            fontSize: 12,
                                            rotate: 45
                                          },
                                          axisPointer: {
                                            snap: true,
                                            lineStyle: {
                                                color: '#fff'
                                            }
                                          },
                                          // prettier-ignore
                                          data: xData
                                        },
                                        yAxis: {
                                          type: 'value',
                                          axisLabel: {
                                            formatter: '{value} 件',
                                            color: '#fff'
                                          },
                                          axisPointer: {
                                            snap: true,
                                            lineStyle: {
                                                color: '#fff'
                                            }
                                          },
                                          splitLine: {
                                            show: false // false=隐藏横线，true=显示（默认）
                                          },
                                          axisTick: {
                                            show: false
                                          },
                                          axisLine: {
                                            show: true, // 开启Y轴轴线（竖线）
                                            lineStyle: {
                                              color: '#333' // 可选：设置竖线颜色（如深灰色，默认是浅灰色）
                                            }
                                          }
                                        },
                                        visualMap: {
                                          show: false,
                                          dimension: 0
                                        },
                                        series: [
                                          {
                                            name: 'order_num',
                                            type: 'line',
                                            smooth: true,
                                            // prettier-ignore
                                            data: element.confirmTrendList.map(list => list.quantity),
                                            lineStyle: {
                                                color: '#ff0000'
                                            },
                                            markArea: {
                                              itemStyle: {
                                                color: 'rgba(255, 173, 177, 0.4)'
                                              },
                                              data: finalData
                                            }
                                          }
                                        ]
                                    };
                                    chart_Obj.setOption(option)
                                    return
                                }
                            }
                        }
                    }
                    tdEl.appendChild(divEl)
                    svgEl.style.display = 'none'                                              
                })
            }
        }, 1500);
    }
});
function putTAbNav() {
    let tables = document.createElement('div')
    tables.classList.add('tables')
    let str = ''
    if (url_list) {
        url_list.forEach(url => {
            str += `<span class="tab_item" data-index="${url.label}"><a target="__blank" href="${url.value}">${url.label}</a></span>`
        })
        // 生成链接
    }
    tables.innerHTML = `
        <div class="prev"></div>
        <div class="next"></div>
        <div class="add_container">
            <input placeholder="输入网址" type="text" id="ur" value="" />
            <input placeholder="请输入标签" type="text" id="ta" value="" />
            <span style="margin-right: 5px">标签颜色</span>
            <input placeholder="请选择颜色" type="color" id="co" value="" />
            <span class="add">添加</span>
        </div>
        <div class="show_container">
            ${str}
        </div>
    `
    let link = document.createElement('link')
    let filePath = chrome.runtime.getURL('/css/inject.css')
    link.setAttribute('href', filePath)
    link.setAttribute('rel','stylesheet')
    const Element = document.querySelector('head')
    Element.insertBefore(link, Element.firstChild)
    document.body.appendChild(tables)
    let prev = document.querySelector('.tables .prev')
    let next = document.querySelector('.tables .next')
    let submitBtn = document.querySelector('.add')
    let urlEl = document.getElementById('ur')
    let label = document.getElementById('ta')
    let show_container = document.querySelector('.show_container')
    let isanimal = false
    // 删除类名
    tables.ontransitionend = function() {
        // 动画执行结束啦
        console.log('结束!')
        isanimal = false
        // 顺便切回来
        tables.classList.remove('animate')
    }
    prev.onclick = function() {
        if (isanimal) {
            return
        }
        isanimal = true
        // 添加一个类名
        tables.classList.add('animate')
        tables.style.transform = 'translateX(0)'
    }
    next.onclick = function() {
        if (isanimal) {
            tables.style.transform = 'translateX(430px)'
            return
        }
        isanimal = true
        // 添加一个类名
        tables.classList.add('animate')
        tables.style.transform = 'translateX(430px)'
        // 删除类名
        tables.ontransitionend = function() {
            // 动画执行结束啦
            console.log('结束!')
            isanimal = false
            // 顺便切回来
            tables.classList.remove('animate')
        }
    }
    submitBtn.onclick = function() {
        let saveList = []
        // 添加
        let url = urlEl.value.trim()
        let val = label.value.trim()
        if (!url || !val) {
            alert("请确保网址和标签是否正确填写")
            return
        }
        // 有内容,就开始存储
        if (url_list) {
            saveList = url_list
        }
        // 加进去
        saveList.push({
            label: val,
            value: url
        })
        // 保存 并且更新
        chrome.runtime.sendMessage({
            message: 'updateCollect',
            data: JSON.stringify(saveList)
        })
        let Element = document.createElement('span')
        Element.classList.add('tab_item')
        Element.innerHTML = `<a href="${url}">${val}</a>`
        show_container.appendChild(Element)
    }
}
async function delayFn(timeout = 500) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, timeout);
    })
}
async function initData() {
    // 这个是不管什么网页进来就要渲染的
    putTAbNav()
    // 判断
    let Reg = new RegExp(instance.PaiPaiURL, 'ig')
    if (Reg.test(current_url)) {
        chrome.runtime.sendMessage({
            message: 'cookies',
            data: {
                url: instance.PaiPaiURL,
                name: instance.PaiPaiToken
            }
        })
    }
    else if (current_url === 'https://agentseller-us.temu.com/main/flux-analysis' || current_url === 'https://agentseller.temu.com/newon/goods-data') {
        console.log('来了没')
        chrome.runtime.sendMessage({
            message: 'temu_rate_mallid',
            data: localStorage.getItem('agentseller-mall-info-id')
        })
    }
    // https://ads.tiktok.com/i18n/dashboard?aadvid=7527560000823394311
    else if (/https:\/\/ads\.tiktok\.com\/i18n\/dashboard/.test(current_url)) {
        console.log('触发了吗')
        chrome.runtime.sendMessage({
            message: 'gettiktokmsToken',
            data: localStorage.getItem('msToken')
        })
    }
    else if (/https:\/\/csp\.aliexpress\.com\/m_apps\/logistics\/logistic_local_supply/.test(current_url)) {
        // 直接插入一个按钮
        let divEl = document.createElement('div')
        let divEl2 = document.createElement('div')
        divEl.classList.add('out_order')
        divEl2.classList.add('download_order')
        divEl.innerText = '导出订单信息与面单匹配'
        divEl2.innerText = '下载面单pdf'
        document.body.appendChild(divEl)
        document.body.appendChild(divEl2)
        divEl2.onclick = () => {
            chrome.runtime.sendMessage({
                message: 'aliexpress_data',
                data: JSON.stringify({
                    outData,
                    pdfData: JSON.parse(localStorage.getItem('currentOrder'))
                })
            })
        }
        divEl.onclick = async () => {
            let flag = localStorage.getItem('start')
            if (!flag || (flag && !JSON.parse(flag))) {
                localStorage.setItem('start', true)
                alert('当前已开启监听')
                return
            }
            outData = [['编号', '仓库', '订单号', '邮编', '运单号', '产品SKU', '手机号', '收货人地址']]
            clickItem = document.querySelectorAll('.PackageTable--btn--u1dnVw4')
            let last_btn = document.querySelectorAll('.next-btn.next-medium.next-btn-primary.next-btn-text.next-menu-btn')
            console.log(clickItem)
            // 挨个点击一下
            for (let index = 0; index < clickItem.length; index++) {
                const element = clickItem[index];
                element.click()
                await delayFn()
                // 拿到对应的数据
                let order_container = document.querySelectorAll('.next-table-row')
                let copy_item = order_container[index].querySelector('.copy-item')
                let order = copy_item.innerText
                let img_container = document.querySelectorAll('.PackageTable--media--svqGcJV')
                let sku_container = img_container[index].querySelector('div')
                let sku = sku_container.querySelectorAll('.PackageTable--sub-text-color--JKn1h61')[1].innerText
                let all_container = document.querySelectorAll('.next-overlay-wrapper.v2.opened')
                console.log(all_container, index)
                let show_content = all_container[index].querySelector('.PackageTable--buyer-address--LXgrxcn')
                let content_items = show_content.querySelectorAll('.PackageTable--buyer-address-item--aSSBEFN')
                let code_item = content_items[2]
                let person_item = content_items[1]
                let person_phone = content_items[3]
                let code_value = code_item.querySelector('div').innerText
                let person_value = person_item.querySelector('div').innerText
                let phone_value = person_phone.querySelector('div').innerText
                let trel = order_container[index].querySelector('td[data-next-table-col="3"]')
                let all_item = trel.querySelectorAll('.PackageTable--country--VbkXJaf')[4].innerText
                console.log(code_value,'邮编')
                console.log(person_value, '地址')
                console.log(order, '订单号')
                console.log(sku, '产品是')
                console.log(all_item,'运单号')
                console.log(phone_value, '手机号')
                // 获取第一位
                let first_num = code_value[0]
                // ['编号', '仓库', '订单号', '邮编', '运单号', '产品SKU', '手机号', '收货人地址']
                let name = '01_' + (index + 1)
                if (first_num <= 5) {
                    console.log('来啦~~~')
                    // 美东
                    outData.push([name, '美东', order, code_value, all_item,  sku, phone_value, person_value])
                } else {
                    outData.push([name, '美西', order, code_value, all_item, sku, phone_value, person_value])
                }
                // 下载面单
                last_btn[index].click()
                // 找菜单
                let menu = document.querySelector('.next-menu.next-ver')
                // 菜单的数据
                let menu_option = menu.querySelectorAll('.next-menu-item')
                // 点击第一个
                menu_option[0].click()
                await delayFn(1500)
            }
            localStorage.setItem('start', false)
        }
    }
}
// 发一个请求给background
chrome.runtime.sendMessage({
    message: 'startCollect'
})
// 刚进来就直接把元素插入先 这个是弹窗的元素
// 创
show_el = document.createElement('div')
show_el.classList.add('show_tk_container')
document.body.appendChild(show_el)
})();
