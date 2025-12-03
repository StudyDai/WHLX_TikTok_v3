(async function() {
console.log("This is injected into")
let tiktokUrl = /https:\/\/seller\.tiktokshopglobalselling\.com/
let weiyingUrl = /http:\/\/omsbackend\.jaspers\.com\.cn\:16017/
let temu_Data_Url = /https:\/\/agentseller\.temu\.com\/newon\/goods\-data/
let current_url = location.href
let url_list = null, timer = null, current_Data = null, outData = [['编号', '仓库', '订单号', '邮编', '运单号', '产品SKU', '手机号', '收货人地址']];
let USA_map = {
    "ALABAMA": "AL",
    "ALASKA": "AK",
    "ARIZONA": "AZ",
    "ARKANSAS": "AR",
    "CALIFORNIA": "CA",
    "COLORADO": "CO",
    "CONNECTICUT": "CT",
    "DELAWARE": "DE",
    "FLORIDA": "FL",
    "GEORGIA": "GA",
    "HAWAII": "HI",
    "IDAHO": "ID",
    "ILLINOIS": "IL",
    "INDIANA": "IN",
    "IOWA": "IA",
    "KANSAS": "KS",
    "KENTUCKY": "KY",
    "LOUISIANA": "LA",
    "MAINE": "ME",
    "MARYLAND": "MD",
    "MASSACHUSETTS": "MA",
    "MICHIGAN": "MI",
    "MINNESOTA": "MN",
    "MISSISSIPPI": "MS",
    "MISSOURI": "MO",
    "MONTANA": "MT",
    "NEBRASKA": "NE",
    "NEVADA": "NV",
    "NEW HAMPSHIRE": "NH",
    "NEW JERSEY": "NJ",
    "NEW MEXICO": "NM",
    "NEW YORK": "NY",
    "NORTH CAROLINA": "NC",
    "NORTH DAKOTA": "ND",
    "OHIO": "OH",
    "OKLAHOMA": "OK",
    "OREGON": "OR",
    "PENNSYLVANIA": "PA",
    "RHODE ISLAND": "RI",
    "SOUTH CAROLINA": "SC",
    "SOUTH DAKOTA": "SD",
    "TENNESSEE": "TN",
    "TEXAS": "TX",
    "UTAH": "UT",
    "VERMONT": "VT",
    "VIRGINIA": "VA",
    "WASHINGTON": "WA",
    "WEST VIRGINIA": "WV",
    "WISCONSIN": "WI",
    "WYOMING": "WY"
}
let country_map = [
    {
        "region_id": 3,
        "region_name": "Albania",
        "region_short_name": "al",
        "region_cn": "阿尔巴尼亚"
    },
    {
        "region_id": 4,
        "region_name": "Algeria",
        "region_short_name": "dz",
        "region_cn": "阿尔及利亚"
    },
    {
        "region_id": 5,
        "region_name": "Andorra",
        "region_short_name": "ad",
        "region_cn": "安道尔"
    },
    {
        "region_id": 9,
        "region_name": "Argentina",
        "region_short_name": "ar",
        "region_cn": "阿根廷"
    },
    {
        "region_id": 10,
        "region_name": "Armenia",
        "region_short_name": "am",
        "region_cn": "亚美尼亚"
    },
    {
        "region_id": 12,
        "region_name": "Australia",
        "region_short_name": "au",
        "region_cn": "澳大利亚"
    },
    {
        "region_id": 13,
        "region_name": "Austria",
        "region_short_name": "at",
        "region_cn": "奥地利"
    },
    {
        "region_id": 14,
        "region_name": "Azerbaijan",
        "region_short_name": "az",
        "region_cn": "阿塞拜疆"
    },
    {
        "region_id": 16,
        "region_name": "Bahrain",
        "region_short_name": "bh",
        "region_cn": "巴林"
    },
    {
        "region_id": 20,
        "region_name": "Belgium",
        "region_short_name": "be",
        "region_cn": "比利时"
    },
    {
        "region_id": 26,
        "region_name": "Bosnia and Herzegovina",
        "region_short_name": "ba",
        "region_cn": "波斯尼亚和黑塞哥维那"
    },
    {
        "region_id": 29,
        "region_name": "Brazil",
        "region_short_name": "br",
        "region_cn": "巴西"
    },
    {
        "region_id": 31,
        "region_name": "Brunei Darussalam",
        "region_short_name": "bn",
        "region_cn": "文莱达鲁萨兰国"
    },
    {
        "region_id": 32,
        "region_name": "Bulgaria",
        "region_short_name": "bg",
        "region_cn": "保加利亚"
    },
    {
        "region_id": 37,
        "region_name": "Canada",
        "region_short_name": "ca",
        "region_cn": "加拿大"
    },
    {
        "region_id": 42,
        "region_name": "Chile",
        "region_short_name": "cl",
        "region_cn": "智利"
    },
    {
        "region_id": 45,
        "region_name": "Colombia",
        "region_short_name": "co",
        "region_cn": "哥伦比亚"
    },
    {
        "region_id": 49,
        "region_name": "Costa Rica",
        "region_short_name": "cr",
        "region_cn": "哥斯达黎加"
    },
    {
        "region_id": 50,
        "region_name": "Croatia",
        "region_short_name": "hr",
        "region_cn": "克罗地亚"
    },
    {
        "region_id": 52,
        "region_name": "Cyprus",
        "region_short_name": "cy",
        "region_cn": "塞浦路斯"
    },
    {
        "region_id": 53,
        "region_name": "Czech Republic",
        "region_short_name": "cz",
        "region_cn": "捷克共和国"
    },
    {
        "region_id": 54,
        "region_name": "Denmark",
        "region_short_name": "dk",
        "region_cn": "丹麦"
    },
    {
        "region_id": 57,
        "region_name": "Dominican Republic",
        "region_short_name": "do",
        "region_cn": "多米尼加共和国"
    },
    {
        "region_id": 59,
        "region_name": "Ecuador",
        "region_short_name": "ec",
        "region_cn": "厄瓜多尔"
    },
    {
        "region_id": 60,
        "region_name": "Egypt",
        "region_short_name": "eg",
        "region_cn": "埃及"
    },
    {
        "region_id": 61,
        "region_name": "El Salvador",
        "region_short_name": "sv",
        "region_cn": "萨尔瓦多"
    },
    {
        "region_id": 64,
        "region_name": "Estonia",
        "region_short_name": "ee",
        "region_cn": "爱沙尼亚"
    },
    {
        "region_id": 68,
        "region_name": "Finland",
        "region_short_name": "fi",
        "region_cn": "芬兰"
    },
    {
        "region_id": 69,
        "region_name": "France",
        "region_short_name": "fr",
        "region_cn": "法国"
    },
    {
        "region_id": 75,
        "region_name": "Georgia",
        "region_short_name": "ge",
        "region_cn": "格鲁吉亚"
    },
    {
        "region_id": 76,
        "region_name": "Germany",
        "region_short_name": "de",
        "region_cn": "德国"
    },
    {
        "region_id": 77,
        "region_name": "Ghana",
        "region_short_name": "gh",
        "region_cn": "加纳"
    },
    {
        "region_id": 79,
        "region_name": "Greece",
        "region_short_name": "gr",
        "region_cn": "希腊"
    },
    {
        "region_id": 83,
        "region_name": "Guam",
        "region_short_name": "gu",
        "region_cn": "关岛"
    },
    {
        "region_id": 84,
        "region_name": "Guatemala",
        "region_short_name": "gt",
        "region_cn": "危地马拉"
    },
    {
        "region_id": 89,
        "region_name": "Honduras",
        "region_short_name": "hn",
        "region_cn": "洪都拉斯"
    },
    {
        "region_id": 90,
        "region_name": "Hungary",
        "region_short_name": "hu",
        "region_cn": "匈牙利"
    },
    {
        "region_id": 91,
        "region_name": "Iceland",
        "region_short_name": "is",
        "region_cn": "冰岛"
    },
    {
        "region_id": 96,
        "region_name": "Ireland",
        "region_short_name": "ie",
        "region_cn": "爱尔兰"
    },
    {
        "region_id": 97,
        "region_name": "Israel",
        "region_short_name": "il",
        "region_cn": "以色列"
    },
    {
        "region_id": 98,
        "region_name": "Italy",
        "region_short_name": "it",
        "region_cn": "意大利"
    },
    {
        "region_id": 99,
        "region_name": "Jamaica",
        "region_short_name": "jm",
        "region_cn": "牙买加"
    },
    {
        "region_id": 100,
        "region_name": "Japan",
        "region_short_name": "jp",
        "region_cn": "日本"
    },
    {
        "region_id": 101,
        "region_name": "Jordan",
        "region_short_name": "jo",
        "region_cn": "约旦"
    },
    {
        "region_id": 102,
        "region_name": "Kazakhstan",
        "region_short_name": "kz",
        "region_cn": "哈萨克斯坦"
    },
    {
        "region_id": 105,
        "region_name": "Kuwait",
        "region_short_name": "kw",
        "region_cn": "科威特"
    },
    {
        "region_id": 106,
        "region_name": "Kyrgyzstan",
        "region_short_name": "kg",
        "region_cn": "吉尔吉斯斯坦"
    },
    {
        "region_id": 108,
        "region_name": "Latvia",
        "region_short_name": "lv",
        "region_cn": "拉脱维亚"
    },
    {
        "region_id": 112,
        "region_name": "Liechtenstein",
        "region_short_name": "li",
        "region_cn": "列支敦士登"
    },
    {
        "region_id": 113,
        "region_name": "Lithuania",
        "region_short_name": "lt",
        "region_cn": "立陶宛"
    },
    {
        "region_id": 114,
        "region_name": "Luxembourg",
        "region_short_name": "lu",
        "region_cn": "卢森堡"
    },
    {
        "region_id": 119,
        "region_name": "Malaysia",
        "region_short_name": "my",
        "region_cn": "马来西亚"
    },
    {
        "region_id": 120,
        "region_name": "Maldives",
        "region_short_name": "mv",
        "region_cn": "马尔代夫"
    },
    {
        "region_id": 122,
        "region_name": "Malta",
        "region_short_name": "mt",
        "region_cn": "马耳他"
    },
    {
        "region_id": 126,
        "region_name": "Mauritius",
        "region_short_name": "mu",
        "region_cn": "毛里求斯"
    },
    {
        "region_id": 128,
        "region_name": "Mexico",
        "region_short_name": "mx",
        "region_cn": "墨西哥"
    },
    {
        "region_id": 130,
        "region_name": "Moldova",
        "region_short_name": "md",
        "region_cn": "摩尔多瓦"
    },
    {
        "region_id": 132,
        "region_name": "Mongolia",
        "region_short_name": "mn",
        "region_cn": "蒙古"
    },
    {
        "region_id": 134,
        "region_name": "Montenegro",
        "region_short_name": "me",
        "region_cn": "黑山"
    },
    {
        "region_id": 135,
        "region_name": "Morocco",
        "region_short_name": "ma",
        "region_cn": "摩洛哥"
    },
    {
        "region_id": 141,
        "region_name": "Netherlands",
        "region_short_name": "nl",
        "region_cn": "荷兰"
    },
    {
        "region_id": 144,
        "region_name": "New Zealand",
        "region_short_name": "nz",
        "region_cn": "新西兰"
    },
    {
        "region_id": 147,
        "region_name": "Nigeria",
        "region_short_name": "ng",
        "region_cn": "尼日利亚"
    },
    {
        "region_id": 236,
        "region_name": "Northern Mariana Islands",
        "region_short_name": "mp",
        "region_cn": "北马里亚纳群岛"
    },
    {
        "region_id": 116,
        "region_name": "North Macedonia",
        "region_short_name": "mk",
        "region_cn": "北马其顿"
    },
    {
        "region_id": 151,
        "region_name": "Norway",
        "region_short_name": "no",
        "region_cn": "挪威"
    },
    {
        "region_id": 152,
        "region_name": "Oman",
        "region_short_name": "om",
        "region_cn": "阿曼"
    },
    {
        "region_id": 153,
        "region_name": "Pakistan",
        "region_short_name": "pk",
        "region_cn": "巴基斯坦"
    },
    {
        "region_id": 156,
        "region_name": "Panama",
        "region_short_name": "pa",
        "region_cn": "巴拿马"
    },
    {
        "region_id": 158,
        "region_name": "Paraguay",
        "region_short_name": "py",
        "region_cn": "巴拉圭"
    },
    {
        "region_id": 159,
        "region_name": "Peru",
        "region_short_name": "pe",
        "region_cn": "秘鲁"
    },
    {
        "region_id": 160,
        "region_name": "Philippines",
        "region_short_name": "ph",
        "region_cn": "菲律宾"
    },
    {
        "region_id": 162,
        "region_name": "Poland",
        "region_short_name": "pl",
        "region_cn": "波兰"
    },
    {
        "region_id": 163,
        "region_name": "Portugal",
        "region_short_name": "pt",
        "region_cn": "葡萄牙"
    },
    {
        "region_id": 164,
        "region_name": "Puerto Rico",
        "region_short_name": "pr",
        "region_cn": "波多黎各"
    },
    {
        "region_id": 165,
        "region_name": "Qatar",
        "region_short_name": "qa",
        "region_cn": "卡塔尔"
    },
    {
        "region_id": 185,
        "region_name": "Republic of Korea",
        "region_short_name": "kr",
        "region_cn": "大韩民国（韩国）"
    },
    {
        "region_id": 167,
        "region_name": "Romania",
        "region_short_name": "ro",
        "region_cn": "罗马尼亚"
    },
    {
        "region_id": 174,
        "region_name": "Saudi Arabia",
        "region_short_name": "sa",
        "region_cn": "沙特阿拉伯"
    },
    {
        "region_id": 175,
        "region_name": "Serbia",
        "region_short_name": "rs",
        "region_cn": "塞尔维亚"
    },
    {
        "region_id": 180,
        "region_name": "Slovakia",
        "region_short_name": "sk",
        "region_cn": "斯洛伐克"
    },
    {
        "region_id": 181,
        "region_name": "Slovenia",
        "region_short_name": "si",
        "region_cn": "斯洛文尼亚"
    },
    {
        "region_id": 184,
        "region_name": "South Africa",
        "region_short_name": "za",
        "region_cn": "南非"
    },
    {
        "region_id": 186,
        "region_name": "Spain",
        "region_short_name": "es",
        "region_cn": "西班牙"
    },
    {
        "region_id": 187,
        "region_name": "Sri Lanka",
        "region_short_name": "lk",
        "region_cn": "斯里兰卡"
    },
    {
        "region_id": 191,
        "region_name": "Sweden",
        "region_short_name": "se",
        "region_cn": "瑞典"
    },
    {
        "region_id": 192,
        "region_name": "Switzerland",
        "region_short_name": "ch",
        "region_cn": "瑞士"
    },
    {
        "region_id": 197,
        "region_name": "Thailand",
        "region_short_name": "th",
        "region_cn": "泰国"
    },
    {
        "region_id": 201,
        "region_name": "Trinidad and Tobago",
        "region_short_name": "tt",
        "region_cn": "特立尼达和多巴哥"
    },
    {
        "region_id": 203,
        "region_name": "Türkiye",
        "region_short_name": "tr",
        "region_cn": "土耳其"
    },
    {
        "region_id": 208,
        "region_name": "Ukraine",
        "region_short_name": "ua",
        "region_cn": "乌克兰"
    },
    {
        "region_id": 209,
        "region_name": "United Arab Emirates",
        "region_short_name": "ae",
        "region_cn": "阿拉伯联合酋长国（阿联酋）"
    },
    {
        "region_id": 210,
        "region_name": "United Kingdom",
        "region_short_name": "uk",
        "region_cn": "英国"
    },
    {
        "region_id": 211,
        "region_name": "United States",
        "region_short_name": "us",
        "region_cn": "美国"
    },
    {
        "region_id": 212,
        "region_name": "Uruguay",
        "region_short_name": "uy",
        "region_cn": "乌拉圭"
    },
    {
        "region_id": 213,
        "region_name": "Uzbekistan",
        "region_short_name": "uz",
        "region_cn": "乌兹别克斯坦"
    },
    {
        "region_id": 217,
        "region_name": "Vietnam",
        "region_short_name": "vn",
        "region_cn": "越南"
    },
    {
        "region_id": 219,
        "region_name": "Virgin Islands (U.S.)",
        "region_short_name": "vi",
        "region_cn": "美属维尔京群岛"
    }
]
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
// 节流
function throttle(fn) {
    let timer;
    return function() {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            // 两秒没问题再调用
            fn.call(this)
        }, 2000);
    }
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
// 防抖
function _debounce(fn, time = 500) {
    let timer;
    return function(...arg) {
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
            fn.call(this, ...arg)
        }, time)
    }
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
    else if (/http:\/\/omsbackend\.jaspers\.com\.cn:16017\/outbound/.test(current_url)) {
        // 这个地方要插入一个按钮在屏幕
        let show_btn = document.createElement('textarea')
        show_btn.setAttribute('placeholder', "请输入地址")
        show_btn.classList.add('write_btn')
        // 因为不是https 所以得用这个
        show_btn.onchange = function() {
            if (this.value.trim()) {
                let arr = this.value.split('\n')
                console.log(arr,'233')
                let name = arr[0]
                let addressList = arr[1].split(',')
                let country = addressList[0]
                let province = addressList[1]
                province = USA_map[province.toUpperCase()]
                let city = addressList[2]
                let address = addressList[3]
                let code = arr[2]
                let phone = arr[3]
                // el-id-6-252
                let name_el = document.querySelector('input[placeholder="收货人"]')
                name_el.value = name
                // 触发dom的改变事件, dispatch就是派发事件用的,这个是强制触发修改,让浏览器知道这个是人为的,不是机器
                name_el.dispatchEvent(new Event('input', { bubbles: true }))
                name_el.dispatchEvent(new Event('change', { bubbles: true }))
                let code_el = document.querySelector('input[placeholder="邮编"]')
                code_el.value = code
                code_el.dispatchEvent(new Event('input', { bubbles: true }))
                code_el.dispatchEvent(new Event('change', { bubbles: true }))
                let phone_el = document.querySelector('input[placeholder="手机号"]')
                phone_el.value = phone
                phone_el.dispatchEvent(new Event('input', { bubbles: true }))
                phone_el.dispatchEvent(new Event('change', { bubbles: true }))
                let city_el = document.querySelector('input[placeholder="城市"]')
                city_el.value = city
                city_el.dispatchEvent(new Event('input', { bubbles: true }))
                city_el.dispatchEvent(new Event('change', { bubbles: true }))
                let province_el = document.querySelector('input[placeholder="州或省"]')
                province_el.value = province
                province_el.dispatchEvent(new Event('input', { bubbles: true }))
                province_el.dispatchEvent(new Event('change', { bubbles: true }))
                let country_el = document.querySelector('input[placeholder="国家"]')
                country_el.value = country
                country_el.dispatchEvent(new Event('input', { bubbles: true }))
                country_el.dispatchEvent(new Event('change', { bubbles: true }))
                let address_el = document.querySelector('input[placeholder="详细地址行1"]')
                address_el.value = address
                address_el.dispatchEvent(new Event('input', { bubbles: true}))
                address_el.dispatchEvent(new Event('change', { bubbles: true}))
            }
        }
        document.body.appendChild(show_btn)
    }
    else if (/https:\/\/agentseller\.temu\.com\/goods\/list/.test(current_url)) {
        let timer = null;
        let countryUrl = 'https://www.temu.com/api/bg/huygens/region/list'
        let UrlParams = {
            scene: 5
        }
        let rows = document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]')
        let updateBtn = document.createElement('button')
        updateBtn.innerText = '激活在售按钮跳转'
        updateBtn.classList.add('active_show_btn')
        updateBtn.onclick = () => {
            rows = document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]')
            console.log(rows,'2333')
            initBtnActive()
        }
        // 默认先调用一次
        initBtnActive()
        function initBtnActive() {
            timer = setInterval(() => {
                if (!rows.length) {
                    rows = document.querySelectorAll('tr[data-testid="beast-core-table-body-tr"]')
                    return
                }
                if (rows.length) {
                    console.log('我有数据了', rows)
                    let btnContainer = document.querySelector('.index-module__col-query-btn-wrapper___U5ioq')
                    let updateBtn_active = document.querySelector('.active_show_btn')
                    if (!updateBtn_active) {
                        btnContainer.appendChild(updateBtn)
                    }
                    clearInterval(timer)
                    rows.forEach(row => {
                        let tds = row.querySelectorAll('td')
                        let score_td = tds[1]
                        if (!score_td) {
                            return
                        }
                        // 看里面有没有我要的 skc
                        let Spu_item = score_td.querySelector('.product-info_idContent__iDukx')
                        if (Spu_item) {
                            let show_el = score_td.querySelectorAll('div[data-testid="beast-core-box"]')
                            // 在售 看有咩有
                            if (show_el.length) {
                                async function get_spu_id(country, spu) {
                                    let id = localStorage.getItem('agentseller-mall-info-id')
                                    // 去拿数据
                                    let resp = await fetch('https://agentseller.temu.com/visage-agent-seller/product/skc/pageQuery', {
                                        method: 'post',
                                        headers: {
                                            'content-type': 'application/json',
                                            'mallid': id
                                        },
                                        body: JSON.stringify({
                                            "productIds": [
                                                spu.innerText.split('\n')[1]
                                            ],
                                            "page": 1,
                                            "pageSize": 20
                                            })
                                    }).then(res => res.json())
                                    console.log(resp,'结果')
                                    if (resp.success) {
                                        // 有数据
                                        let result = resp.result
                                        let result_item = result.pageItems[0]
                                        // 跳转
                                        let goods_id = result_item.goodsId
                                        if (country == 'us') {
                                            window.open(`http://temu.com/#zx&` + goods_id)
                                        } else {
                                            window.open(`http://temu.com/#zx&${country}&` + goods_id)
                                        }
                                    }
                                }
                                show_el.forEach(show => {
                                    let v = show.innerText
                                    if (v == '在售') {
                                        let ul_container = show.parentElement.querySelector('.country_list')
                                        if (ul_container) {
                                            // 已经加过了,就不用了
                                            return
                                        }
                                        let ulEl = document.createElement('ul')
                                        ulEl.classList = 'country_list'
                                        // 好玩 监听滚动 然后把默认的滚动给关掉 然后设置他滚动的方向 可以实现直接横向滚动
                                        ulEl.addEventListener('wheel', (e) => {
                                            e.preventDefault(); // 阻止默认纵向滚动
                                            ulEl.scrollBy({
                                              left: e.deltaY, // 把滚轮纵向位移转为横向滚动
                                              behavior: 'smooth'
                                            });
                                        })
                                        let str = ''
                                        country_map.forEach(country => {
                                            str += `<li class="list_items">${country.region_cn}</li>`
                                        })
                                        ulEl.innerHTML = str
                                        show.style.backgroundColor = 'red'
                                        show.style.cursor = 'pointer'
                                        show.style.position = 'relative'
                                        show.parentElement.appendChild(ulEl)
                                        let search_el = document.createElement('input')
                                        search_el.classList.add('search_el_ipt')
                                        search_el.setAttribute('placeholder', '搜索关键词')
                                        let lis_list = ulEl.querySelectorAll('.list_items')
                                        // 绑定点击事件
                                        lis_list.forEach(li => {
                                            li.onclick = function() {
                                                let item = country_map.find(c => c.region_cn == this.innerText)
                                                if (item) {
                                                    get_spu_id(item.region_short_name, Spu_item)
                                                }
                                            }
                                        })
                                        search_el.addEventListener('input', throttle(function() {
                                            str = ''
                                            // 在这里去操作
                                            console.log('用户输入的是', this.value)
                                            if (this.value) {
                                                country_map.forEach(country => {
                                                    if (country.region_cn.includes(this.value)) {
                                                        str += `<li class="list_items">${country.region_cn}</li>`
                                                    }
                                                })
                                            } else {
                                                country_map.forEach(country => {
                                                    str += `<li class="list_items">${country.region_cn}</li>`
                                                })
                                            }
                                            let current_ul = this.previousElementSibling
                                            current_ul.innerHTML = str
                                            let lis_list = document.querySelectorAll('.list_items')
                                            // 绑定点击事件
                                            lis_list.forEach(li => {
                                                li.onclick = function() {
                                                    let item = country_map.find(c => c.region_cn == this.innerText)
                                                    if (item) {
                                                        get_spu_id(item.region_short_name, Spu_item)
                                                    }
                                                }
                                            })
                                        }))
                                        show.parentElement.appendChild(search_el)
                                        console.log('找到了,跳转百度')
                                        show.onclick = async function() {
                                            get_spu_id('us', Spu_item)
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }, 1500);
        }
    }
    // kuajingmaihuo
    if (/temu\.com/.test(current_url) || /kuajingmaihuo\.com/.test(current_url)) {
        console.log('看看', current_url)
        if (/https:\/\/seller\.kuajingmaihuo\.com\/labor\/bill/.test(current_url)) {
            // 点击导出
            let timer = setInterval(() => {
                let down_data = document.createElement('div')
                down_data.classList.add('out_data')
                down_data.innerText = '导出'
                down_data.onclick = () => {
                    console.log('点击了')
                    chrome.runtime.sendMessage({
                        message: 'updateMoney',
                        data: localStorage.getItem('accountNum')
                    })
                    alert('金额保存成功')
                }
                let restBtn = document.querySelector('button[data-tracking-id="uKf6cB2qGfy0WELt"]')
                if (restBtn) {
                    clearInterval(timer)
                    restBtn.parentElement.appendChild(down_data)
                }
            }, 1500);
        }
        else if (/https:\/\/agentseller\.temu\.com/.test(current_url)) {
            // 点击导出
            let timer = setInterval(() => {
                let down_data = document.createElement('div')
                down_data.classList.add('out_shop_data')
                down_data.innerText = '导出店铺总体数据'
                down_data.onclick = () => {
                    alert('点击确认后开始读取并且下载数据')
                    localStorage.setItem('updateCookie', false)
                    chrome.runtime.sendMessage({
                        message: 'download_TEMU_totalData',
                        data: localStorage.getItem('accountNum')
                    })
                }
                let restBtn = document.querySelector('.banner-block_container__UP4qL')
                if (restBtn) {
                    clearInterval(timer)
                    restBtn.parentElement.insertBefore(down_data, restBtn)
                }
            }, 1500);
        }
        console.log('开始了没')
        // 加一个可以去掉弹窗的
        let hideBtn = document.createElement('button')
        hideBtn.classList.add('floating-close-btn')
        hideBtn.innerText = '关'
        document.body.appendChild(hideBtn)
        console.log('来没来')
        hideBtn.onclick = () => {
            let model = document.querySelectorAll('div[data-testid="beast-core-modal"]')
            let mark = document.querySelectorAll('div[data-testid="beast-core-modal-mask"]')
            model.forEach(m => m.style.display = 'none')
            mark.forEach(k => k.style.display = 'none')
        }
    }
    if (/https:\/\/www\.temu\.com/.test(location.href)) {
        let downloadList = []
        const TEMU_EL = document.createElement('div')
        TEMU_EL.style.position = "fixed"
        TEMU_EL.style.left = '15px'
        TEMU_EL.style.top = '50%'
        TEMU_EL.innerHTML = `
            <svg class="temu_svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="54px" height="54px" class="_3My78Pdp" alt="temu" aria-label="temu" fill="#fb7701" stroke="none" stroke-width="18.962962962962962"><title>temu</title><path d="M796.4 0c125.7 0 227.6 101.9 227.6 227.6l0 568.8c0 125.7-101.9 227.6-227.6 227.6l-568.8 0c-125.7 0-227.6-101.9-227.6-227.6l0-568.8c0-125.7 101.9-227.6 227.6-227.6l568.8 0z m-256 531.9l-13.6 0c-12.1 0-22 9.8-21.9 21.9l0 150.5c0 12.1 9.8 22 21.9 22 12.1 0 22-9.8 22-22l0-98.8 37 52.2c7.7 10.8 23.7 10.8 31.5 0l37-52.2 0 98.8c0 12.1 9.8 22 22 22 12.1 0 22-9.8 21.9-22l0-150.5c0-12.1-9.8-22-21.9-21.9l-13.6 0c-5.2 0-10.2 2.5-13.2 6.8l-47.9 72-48-72c-3-4.3-7.9-6.8-13.2-6.8z m340.2 0c-12.1 0-22 9.8-22 21.9l0 91.9c0 28.9-16.3 43.7-43.1 43.6-26.8 0-43.1-15.3-43-44.9l0-90.6c0-12.1-9.8-22-22-21.9-12.1 0-22 9.8-21.9 21.9l0 91.6c0 53.6 32.8 80.9 86.4 80.9 53.6 0 87.6-27 87.5-82.2l0-90.3c0-12.1-9.8-22-21.9-21.9z m-616.9 0l-128.3 0c-12.1 0-22 9.8-22 21.9 0 12.1 9.8 22 22 22l42.2 0 0 128.3c0 12.1 9.8 22 21.9 22 12.1 0 22-9.8 22-22l0-128.3 42.2 0c12.1 0 22-9.8 22-22 0-12.1-9.8-22-22-21.9z m189.9 0l-118.9 0c-12.1 0-22 9.8-22 21.9l0 150.3c0 12.1 9.8 22 22 22l118.9 0c12.1 0 22-9.8 21.9-22 0-12.1-9.8-22-21.9-22l-97 0 0-31.2 84.4 0c12.1 0 22-9.8 22-21.9 0-12.1-9.8-22-22-22l-84.4 0 0-31.2 97 0c12.1 0 22-9.8 21.9-22 0-12.1-9.8-22-21.9-21.9z m-214.5-229.4l-4.1 0.1c-17.1 1.1-28.8 8.5-35.4 18.5-7.7-11.5-22.1-19.6-43.8-18.4l-0.5 0.7c-2.5 4-11.9 21.9 3.3 41.4 3.1 3.3 10.7 12.6 7.6 24.5l-44.1 71.3c-3.6 5.8-2 13.3 3.5 17.2 11.4 8 34.3 19 74 19 39.6 0 62.5-11 73.9-19l1.5-1.3c4.3-4.1 5.2-10.7 2-15.9l-44-71.3 0.3 1.3-0.5-2c-2.4-10.7 3.6-19.2 6.9-23l0.8-0.8c15.3-19.5 5.8-37.3 3.3-41.4l-0.4-0.7-4.3-0.2z m142.8 33.4c-15.1-30-34.7-35.1-44.5-27.3-7.5 6-24.8 29.7-26 31.3-19.1 27.1-18 33.7 6.5 49.1 13.8 8.7 24.9-2.5 29.7-5.8-2.3 14.3-9.3 36.8-19.8 52.6-5.7-4.3-9.9-7.6-12.5-10-3.3-3-8.3-2.8-11.5 0.3-1.5 1.5-2.3 3.5-2.2 5.7 0.1 2.1 1 4.1 2.5 5.5 25.5 23.3 59 36.5 94.7 36.6 35.8 0 69.5-13.2 95-36.6 3.3-3 3.4-8 0.4-11.2-3.2-3.2-8.2-3.3-11.5-0.3-2 1.8-4 3.5-6.1 5.2l-11.2-25c-1.8-4.3-3.8-9.7-6-16.2 1.1-2.7 3.4-5.3 6.7-8.7 2.4-2.4 4.4-4.8 5.9-7.1 7.4-11.7 3.2-18.6 0.9-23.2-5.3-10.8-13.6-7.3-19.6-0.9-7.4 7.8-14.6 11.2-26.2 13.8-9.7 2.2-17.2 1.1-23.4-2.8-8.6-5.3-21.8-25-21.8-25z m277.3-30.5c-32 30.4-1.3 96.5-59.5 124.6-6.4 3.1-11.7-7.1-20.3-7.1-24.3 0.2-70.7 21.6-72.5 32.4-1.5 8.9 18.3 16 76.7 16.1 50.8 0 67.2-77.3 85-77.4 17.8 0 9.5 70.1 7.6 77.4l18.6 0c-1.6-7.3-2.8-29.3-2.7-60.4 0-31.1 5.6-38 10.1-61.5 3.9-20.4-26.3-38.1-43-44.1z m182.4 2.5l-52.1 0c-33.7 0-61.7 26.1-64 59.7l-3.8 53.9c-1.8 25.6 18.5 47.3 44.1 47.4l99.4 0c25.7 0 45.9-21.7 44.2-47.4l-3.8-53.9c-2.4-33.6-30.3-59.7-64-59.7z m-442.6 124c15.7 0 27.7 7.7 32.1 22-10.7 2.8-21.4 4.2-32.3 4.1-16.4 0-22.2-1.5-32.7-4.3 4.2-12.6 18.1-21.8 32.9-21.8z m392.9-79.3l0 1.5c0 13 10.6 23.7 23.6 23.7 13 0 23.7-10.6 23.7-23.7l0-1.5c0-5.8 21-5.8 21 0l0 1.5c0 24.6-20 44.6-44.7 44.6-24.6 0-44.6-20-44.6-44.6l0-1.5c0-5.8 20.9-5.8 21 0z"></path></svg>
            <ul class="temu_menu_ul">
                <li class="menu_ul_li">
                    <div class="down_180">下载180尺寸的商品图</div>
                    <div class="down_800">下载800尺寸的商品图</div>
                    <div class="down_video">下载视频</div>
                    <div class="down_allPopup">关闭所有弹窗</div>
                </li>
            </ul>
        `
        TEMU_EL.className = 'temu_fix_logo'
        document.body.appendChild(TEMU_EL)
        const allOption = document.querySelectorAll('.menu_ul_li div')
        for (let index = 0; index < allOption.length; index++) {
            const each_menu_item = allOption[index]
            each_menu_item.onclick = _debounce(function() {
                const item_className = this.className
                switch(item_className) {
                    case 'down_180':
                        chrome.runtime.sendMessage({
                            message: 'download_TEMU_Pic',
                            size: '180',
                            downloadList: downloadList
                        })
                        break
                    case 'down_800':
                        chrome.runtime.sendMessage({
                            message: 'download_TEMU_Pic',
                            size: '800',
                            downloadList: downloadList
                        })
                        break
                    case 'down_video':
                        const videoEl = document.querySelector('.R9rmoSPn')
                        if (!videoEl) {
                            alert("该链接没有上传视频")
                        } else {
                            chrome.runtime.sendMessage({
                                message: 'download_TEMU_Video',
                                videoHref: videoEl.src
                            })
                        }
                    case 'down_allPopup':
                        const allUn = document.querySelectorAll('.undefined')
                        const markEl = document.querySelector('div[data-testid="beast-core-modal-mask"]')
                        const popupEl = document.querySelector('div[data-testid="beast-core-modal"]')
                        if (allUn) {
                            for (let index = 0; index < allUn.length; index++) {
                                allUn[index].remove() 
                            }
                        }
                        if (markEl) markEl.remove()
                        if (popupEl) popupEl.remove()
                        break;
                    case 'down_detail_pic':
                        break;
                    default:
                        console.log('以外操作')
                }
            }, 500)
        }
        // 给这个icon添加一个右击的监听
        document.querySelector('.temu_svg').oncontextmenu = function(e) {
            e.preventDefault()
            // 我被触发了
            const menuList = document.querySelector('.temu_menu_ul')
            menuList.style.display = 'block'
            // 给整个网页添加点击监听
            document.onclick = function(e) {
                        menuList.style.display = 'none'
                        // 把监听给关了
                        document.onclick = null
            }
        }
        const imgList = document.querySelectorAll('._2AOclWz7 img')
        for (let index = 0; index < imgList.length; index++) {
            console.log(imgList[index])
            const href = imgList[index].dataset.src ? imgList[index].dataset.src : imgList[index].src
            downloadList[index] = {
                imgName: '产品图' + (index+1) + '.jpg',
                '180': href,
                '800': href.replace(/\?imageView.*/, '')
            }
        }
    }
}
// 发一个请求给background
chrome.runtime.sendMessage({
    message: 'startCollect'
})
// 拿数据
// async function getWeiYing() {
//     let url = 'http://omsbackend.jaspers.com.cn:16017/prod-api/oms/backend/outbound/list?pageNum=2&pageSize=50'
//     const resp = await fetch(url, {
//         headers: {
//             clientid: 'e5cd7e4891bf95d1d19206ce24a7b32e',
//             authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJzeXNfdXNlcjoxOTU2MjA0NTcyMDY3NDkxODQxIiwicm5TdHIiOiJZRGlxbkpMSzBuQWZOTUhUQmlEYmRxZVN1MmJQTEp3UCIsImNsaWVudGlkIjoiZTVjZDdlNDg5MWJmOTVkMWQxOTIwNmNlMjRhN2IzMmUiLCJ0ZW5hbnRJZCI6IjA4NzMwNyIsInVzZXJJZCI6MTk1NjIwNDU3MjA2NzQ5MTg0MSwidXNlck5hbWUiOiJ3aGx4MjAyMDAyMDJAMTI2LmNvbSIsImRlcHROYW1lIjoiIiwiZGVwdENhdGVnb3J5IjoiIn0.BRX1Ks1B__3wyQi3k0Tfr8QulLJ6kjfrHHO-OijxdGk'
//         }
//     }).then(res => res.json())
//     console.log(resp)
// }
// getWeiYing()
// 刚进来就直接把元素插入先 这个是弹窗的元素
// 创
show_el = document.createElement('div')
show_el.classList.add('show_tk_container')
document.body.appendChild(show_el)
})();
