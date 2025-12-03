<template>
    <div class="tiktok_container">
        <!-- 刚进来就要去拿到所有的数据 -->
        <a-button danger @click="listenTikTokMax" class="get_data_btn">获取最新的所有账号Tk广告数据</a-button>
        <Mark v-show="loading" />
        <!-- 这个地方把我当前的活动和余额什么的都显示出来 -->
        <a-table :columns="columns" :data-source="currentDataShow">
            <template #bodyCell="{ column, text, record }">
                <!-- 要的就是record 里面是整个对象的所有属性 -->
                <a-tag color="blue" @click="toUpdateadvertisement(record)" v-if="column.dataIndex == 'opacity'" style="cursor: pointer;">操作</a-tag>
            </template>
        </a-table>
        <!-- 弹出窗 -->
        <div class="modal" v-show="open">
            <CloseOutlined class="close" @click="toClose" />
            <div class="main_container">
                <h1 style="text-align: center; margin-bottom: 0; background-color: #fafafa;">广告ROI修改</h1>
                <a-collapse v-model:activeKey="activeKey">
                        <a-collapse-panel :header="item.advertisementName" v-if="updateList?.activityList?.activity" :key="index" v-for="(item, index) in updateList.activityList.activity">
                            <!-- 显示所有的数据 -->
                            总共盈利: <a-input v-model:value="item.all_save" disabled /> <b />
                            每单消耗: <a-input v-model:value="item.average_cost_money" disabled /> <b />
                            实际花费: <a-input v-model:value="item.correct_money" disabled /> <b />
                            总共花费: <a-input v-model:value="item.cost_money" disabled /> <b />
                            当前roi值: <a-input v-model:value="item.current_roi" disabled /> <b />
                            当前出单量: <a-input v-model:value="item.get_order" disabled /> <b />
                        </a-collapse-panel>
                </a-collapse>
            </div>
        </div>

        <!-- 这个地方提供导出功能 -->
        <a-button danger @click="getTikTokXlsx" class="get_data_btn">导出TK的订单和消耗xlsx表</a-button>
        <a-button danger @click="tiktokTime = { startTime: null, endTime: null }" class="get_data_btn">重置时间</a-button>
        <div class="tiktok_data_option">
            这里是要展示的内容
            <div class="input_item" v-for="(item, index) in currentDataShow" :key="index">
                <div class="input_row start_time"><span>开始时间: </span><a-date-picker v-model:value="tiktokTime.startTime" style="width: 50%" /></div>
                <div class="input_row end_time"><span>结束时间: </span><a-date-picker v-model:value="tiktokTime.endTime" style="width: 50%" /></div>
                <div class="title_container">
                    <div class="input_row title">{{ item.account_name }}</div>
                    <a-button permary @click="updateTikTokList(item)" type="primary" ghost>确认修改</a-button>
                    <a-button style="margin-left: 8px; border-color: #ff4d4f; color: #ff4d4f" shape="round" @click="dowloadItem(item)" type="primary" ghost>确认导出</a-button>
                    <div class="sure_time">
                        <a-tag v-if="updateTikTokData[item.account_name]" color="green">{{ updateTikTokData[item.account_name].startTime }}</a-tag>
                        <a-tag v-if="updateTikTokData[item.account_name]" color="red">{{ updateTikTokData[item.account_name].endTime }}</a-tag>
                    </div>
                </div>
            </div>
        </div>

        <!-- 这个是加载 -->
        <Loading v-show="downloadFileLoading" />
    </div>
  </template>
<script setup>
/* eslint-disable */
import Mark from './mark.vue'
import Loading from './loading.vue'
import { onMounted, ref, reactive } from 'vue'
import utils from '@/utils/utils.js'
import { CloseOutlined } from '@ant-design/icons-vue';
const loading = ref(false)
let currentDataShow = ref(null)
let open = ref(false)
let updateList = ref(null)
let tiktokTime = ref({
    startTime: null,
    endTime: null
})
let downloadFileLoading = ref(false)
// 这个是总的
let updateTikTokData = reactive({})
let activeKey = ref(['1'])
// 监听tk的广告
let listenTikTokMax = () => {
        // 我来啦
        loading.value = true
        chrome.runtime.sendMessage({
        message: 'listenTk'
        })  
}
const columns = [{
    title: '广告户名称',
    dataIndex: 'account_name',
    key: 'account_name',
    width: '350px',
    ellipsis: true
}, {
    title: '花费',
    dataIndex: 'cost',
    key: 'cost' ,
    align: 'center'
}, {
    title: '订单数',
    dataIndex: 'get_order',
    key: 'get_order',
    align: 'center' 
}, {
    title: '平均成本',
    dataIndex: 'sell_rate',
    key: 'sell_rate',
    align: 'center' 
}, {
    title: '营业额',
    dataIndex: 'all_sell',
    key: 'all_sell',
    align: 'center' 
}, {
    title: '操作广告',
    dataIndex: 'opacity',
    align: 'center' 
}]
async function initData() {
    // 加载数据
    loading.value = true
    // 加载所有账户数据
    let allAccount = await utils.persistent.getLocalStorage("tiktokbusinessaccount")
    // 加载所有活动数据 
    let allActivity = await utils.persistent.getLocalStorage("tiktokbusinessadvertisement")
    // 加载所有的roi数据
    let allRoiData = await utils.persistent.getLocalStorage("tiktokbusinessroidata")
    let formatData = []
    // 格式化开始
    if (allAccount.length) {
        allAccount.forEach(account => {
            let account_item = {}
            account_item.account_id = account.account_id
            account_item.owner_id = account.owner_id
            account_item.name = account.account_name
            let item_activity = allActivity.find(active => active.accountName === account.account_name)
            // 找到当前已经开启的广告
            if (item_activity) {
                account_item.activityList = item_activity
            }
            // 找当前的roi数据
            let keys = Object.keys(allRoiData)
            let roi = keys.find(key => account.account_name.includes(key))
            if (roi) {
                account_item.item_roi = allRoiData[roi]
            }
            formatData.push(account_item)
        })
        console.log(formatData)
        currentDataShow.value = formatData.map(data => ({
            account_id: data.account_id,
            owner_id: data.owner_id,
            account_name: data.name,
            cost: '$' + data.item_roi.cost,
            all_sell: '$' + data.item_roi.all_sell,
            sell_rate: '$' + data.item_roi.sell_rate,
            get_order: data.item_roi.get_order + '单',
            activityList: data.activityList
        }))
        loading.value = false
    }
}
// 更新广告数据
const toUpdateadvertisement = (data) => {
    // 拿到数据 进行渲染
    updateList.value = data
    open.value = true
}
// 关闭掉弹窗
const toClose = () => {
    open.value = false
}
// 导出单个广告户
const dowloadItem = (d) => {
    downloadFileLoading.value = true
    chrome.runtime.sendMessage({
        message: 'downloadTikTokXlsx',
        data: JSON.stringify({
            [d.account_name]: updateTikTokData[d.account_name]
        })
    }, (resp) => {
        console.log('有回应')
    })  
}
// 更新数据
const updateTikTokList = (data) => {
    let keys = Object.keys(updateTikTokData)
    let startDay = tiktokTime.value.startTime
    let endDay = tiktokTime.value.endTime
    if (!startDay || !endDay) {
        alert('请选择开始和结束时间')
        return
    }
    let y = startDay.$y
    let m = startDay.$M + 1 < 10 ? '0' + startDay.$M + 1 : startDay.$M + 1
    let d = startDay.$D < 10 ? '0' + startDay.$D : startDay.$D
    let dy = endDay.$y
    let dm = endDay.$M + 1 < 10 ? '0' + endDay.$M + 1 : endDay.$M + 1
    let dd = endDay.$D < 10 ? '0' + endDay.$D : endDay.$D
    if (keys.includes(data.account_name)) {
        // 那么就更新,否则加进去
        updateTikTokData[data.account_name] = {
            startTime: `${y}-${m}-${d}`,
            endTime: `${dy}-${dm}-${dd}`,
            owner_id: data.owner_id,
            account_id: data.account_id,
            name: data.account_name
        }
    } else {
        // 添加进去
        updateTikTokData[data.account_name] = {
            startTime: `${y}-${m}-${d}`,
            endTime: `${dy}-${dm}-${dd}`,
            owner_id: data.owner_id,
            account_id: data.account_id,
            name: data.account_name
        }
    }
    // 发走
    // chrome.runtime.sendMessage({
    //     message: 'downloadTikTokXlsx',
    //     data: JSON.stringify(updateTikTokData)
    // }) 
    console.log(updateTikTokData)
}
// 下载更新的数据
const getTikTokXlsx = () => {
    let keys = Object.keys(updateTikTokData)
    let keys2 = Object.keys(currentDataShow.value)
    console.log(keys, keys2)
    if (keys.length == keys2.length) {
        // 发起
        downloadFileLoading.value = true
        chrome.runtime.sendMessage({
            message: 'downloadTikTokXlsx',
            data: JSON.stringify(updateTikTokData)
        }, (resp) => {
            console.log('有回应')
        })
    } else {
        alert('请你确认所有的时间均已选择')
    }
}
// 确认要更新广告数据
const confirmUpdate = () => {}
onMounted(() => {
    initData()
    chrome.runtime.onMessage.addListener(async (resp, render, sendResponse) => {
        if (resp.message === 'tiktokDataUpdate') {
            // 可以关掉了
            await initData()
            loading.value = false

        } else if (resp.message === 'alreadyDownload') {
            downloadFileLoading.value = false
        }
    })
})
</script>
<style scoped>
.tiktok_container {
    width: 100vw;
    height: 100vh;
    padding: 15px 15px 10px;
}
.tiktok_container .get_data_btn {
    margin-bottom: 10px;
}
.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9998;
    background-color: #ffffffe8;
}
.main_container .ant-collapse, :deep(.ant-collapse .ant-collapse-item) {
    max-width: 400px;
    min-width: 400px;
    border: unset;
}
:deep(.ant-collapse .ant-collapse-content) {
    background-color: transparent;
}
.main_container {
    min-height: 404px;
    max-height: 405px;
    overflow-y: auto;
    border: 1px solid #ccc;
}
.main_container::-webkit-scrollbar {
    width: 0;
    height: 0;
}
.close {
    position: fixed;
    top: 20px;
    right: 20px;
    cursor: pointer;
    width: 80px;
    height: 80px;
}
.input_item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}
.input_row {
    display: flex;
    align-items: center;
    margin-right: 10px;
}
.input_row.title {
    min-width: 360px;
}
.input_row span {
    margin-right: 15px;
}
.input_row input {
    flex: 1;
}
.title_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.sure_time {
    margin-left: 10px;
}
.get_data_btn {
    margin-right: 10px;
}
</style>

  