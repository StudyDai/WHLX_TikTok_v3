<template>
  <div class="pop_container">
    <!-- 弹窗 -->
    <a-alert message="Success Text" type="success" v-show="canSee" class="alert" />

     <!-- 选择仓库 -->
     <div class="select_warehouse">
      <span class="choose_text">选择系统</span>
      <a-input-group size="middle">
        <a-input-group compact>
          <a-select v-model:value="warehouseId">
            <a-select-option v-for="(list_cal, list_key, index) in warehouseList" :value="list_key" :key="index">{{ list_cal }}</a-select-option>
          </a-select>
        </a-input-group>
      </a-input-group>
      <a-button danger ghost @click="warehouseLogin">确认</a-button>
     </div>
     <!-- 填写账号信息 -->
     <div class="input_info">
        <div class="info_row">
          <span class="info_text">账号</span>
          <a-input v-model:value="ErpInfo.loginAccount" placeholder="请输入邮箱/手机/账号" />
        </div>
        <div class="info_row">
          <span class="info_text">密码</span>
          <a-input v-model:value="ErpInfo.password" placeholder="请输入密码" />
        </div>
     </div>
     <!-- 查看的位置 -->
      <div class="see_button">
        <a-button type="danger" :size="size">当前页面查看</a-button>
        <a-button @click="toStockPage" type="primary" :size="size">后台页面查看</a-button>
      </div>

      <!-- 这个是TEMU模块 -->
      <div class="temu_container">
          <div class="temu_title">
              <h3>
                   <TagTwoTone />
                   <div class="temu_text">TEMU功能模块</div>
                   <MinusSquareTwoTone @click="openMenu" />
              </h3>
          </div>
          <div class="fun_container" ref="funContainer">
             <a-button type="primary" @click="toggleListen" :loading="isloading" :disabled="isloading">{{ isListening ? '停止监听' : '开始监听' }}</a-button>
             <a-input v-model:value="listenInfo.skuList" placeholder="需要指定请输入SKU" />
             <a-alert message="默认是监听全店铺在售商品情况" type="warning" showIcon>
                <template #icon><smile-outlined /></template>
             </a-alert>
             <!-- 这个地方展示 -->
             <div class="listening_list">
                  <div v-if="showListenData" class="list_item">
                      <a-divider>
                        <a-tag color="processing">
                          <template #icon>
                            <sync-outlined :spin="true" />
                          </template>
                          监听中
                        </a-tag>
                      </a-divider>
                      <div class="listening_item">
                          <div class="listen_item" v-for="(item, index) in showListenData" :key="index">
                             <a-tag :color="item.statu == 1 ? '#2db7f5' : '#f50'">{{ item.id }}</a-tag>
                          </div>
                      </div>
                  </div>
                  <div v-else class="no_result">
                    <a-result title="暂无监听数据" />
                  </div>
             </div>
          </div>
      </div>

      <!-- 这个是TK模块 -->
       <div class="tk" @click="listenTikTokMax">
          开始监听广告
       </div>
       <a-button @click="toEditTkAccount">跳转广告调整页面</a-button>
  </div>
</template>
<script setup>
/* eslint-disable */
import { TagTwoTone,  MinusSquareTwoTone } from '@ant-design/icons-vue'
import { ref, onMounted } from 'vue'
import utils from '@/utils/utils.js'
import instance from '@/utils/instance.js'
let warehouseId = ref("PaiPai")
let warehouseList = instance.WarehouseMap
let ErpInfo = ref({
    loginAccount: '',
    password: ''
})
let listenInfo = ref({
    temuMallId: '',
    skuList: ''
})
let isloading = ref(false)
let isListening = ref(false)
let canSee = ref(false)
let showListenData = ref(null)
let funContainer = ref(null)
onMounted(async () => {
  isListening.value = await utils.persistent.getLocalStorage(instance.TEMUListenStatu)
})
// 跳转去查看库存
const toStockPage =() => {
  const optionsUrl = chrome.runtime.getURL('options.html');
  // 跳转过去
  chrome.tabs.create({ url: optionsUrl })
}
// 海外仓登录
const warehouseLogin = () => {
  // 判断下是否都填写了
  if (!ErpInfo.value.loginAccount.trim() || !ErpInfo.value.password.trim()) {
      console.error('有信息并未填写')
      return
  }
  chrome.runtime.sendMessage({
      message: 'addWarehouse',
      data: {
        Erp: warehouseId.value,
        Info: ErpInfo.value
      }
  })
}
// 跳转去tk广告修改页面
const toEditTkAccount = () => {
  const tiktokUrl = chrome.runtime.getURL('tiktok.html');
  // 跳转过去
  chrome.tabs.create({ url: tiktokUrl })
}
chrome.runtime.onMessage.addListener((resp, sender, sendResponse) => {
  if(resp.message == 'addSuccess') {
    // 可以显示了
    canSee.value = true
    setTimeout(() => {
        canSee.value = false
    }, 1000);
  } 
  else if (resp.message == 'listenData') {
    // 传递过来的值去渲染
    if (resp.data && resp.errorData) {
      // 渲染
      showListenData.value = [...resp.data,...resp.errorData]
    } else if (resp.data) {
      showListenData.value = resp.data
    } else {
      showListenData.value = null
    }
  }
})

// 监听tk的广告
const listenTikTokMax = () => {
    chrome.runtime.sendMessage({
      message: 'listenTk'
    })
}
// 是否开启监听我的限流链接
const toggleListen = () => {
  isloading.value = true
  isListening.value = !isListening.value
  setTimeout(() => {
      console.log('看看')
      // 这个地方要更新
      utils.persistent.addLocalStorage(instance.TEMUListenStatu, isListening.value)
      // 停止加载中
      isloading.value = false
    }, 1500);
  // 这个地方要通知background去请求接口了
  chrome.runtime.sendMessage({
    message: 'good_limit',
    statu: isListening.value,
    data: listenInfo.value.skuList.split(',')
  })
}
// 点击展开TEMU菜单
const openMenu = () => {
    funContainer.value?.classList.toggle('active')
}
</script>
<style scoped>
.pop_container {
  padding: 15px;
  width: 300px;
  height: 500px;
}
.select_warehouse {
  display: flex;
  align-items: center;
}
.select_warehouse .choose_text {
   width: 110px;
   margin-right: 10px;
}
.select_warehouse :deep(.ant-input-group .ant-input-group-compact) {
  text-align: center;
}
.input_info .info_row {
   padding: 8px 0;
   display: flex;
   align-items: center;
}
.input_info .info_row .info_text {
    position: relative;
    min-width: 40px;
    font-size: 16px;
}
.input_info .info_row .info_text::after {
    content: "*";
    color: red;
    position: absolute;
    top: -6px;
    left: 30px;
}
.see_button {
  display: flex;
  justify-content: space-between;
}
.alert {
  position: fixed!important;
  top: 5px!important;
  left: 40px!important;
  right: 40px!important;
  z-index: 9999!important;
}
.temu_container {
  margin-top: 10px;
  min-height: 46px;
  overflow-y: hidden;
}
.temu_container .temu_title {
  position: relative;
  z-index: 9999;
}
.temu_container .temu_title h3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background-color: #d3d7e0;
}
.temu_container .temu_title h3 .temu_text {
    color: #5f7eda;
}
.temu_container .fun_container {
  width: 90%;
  position: relative;
  top: -10px;
  display: flex;
  flex-wrap: wrap;
  padding: 12px 8px 10px;
  margin: 0 auto;
  background-color: #d3d7e065;
  transform: translateY(-120%);
  transition: all linear .5s;
}
.temu_container .fun_container.active {
  transform: translateY(0);
}
.temu_container .fun_container .ant-btn{
  margin-right: 15px;
}
.temu_container .fun_container .ant-input {
  flex: 1;
  margin-bottom: 5px;
}
.temu_container .fun_container .ant-alert {
  padding: 0;
  width: 100%;
}
.temu_container .fun_container :deep(.ant-alert .ant-alert-content .ant-alert-message) {
  color: #c5ab55;
}
.listening_list {
  width: 100%;
  padding: 5px 0px;
}
.listening_list .no_result .ant-result {
    padding: 10px 0 0;
}
.listening_list .listening_item {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  max-height: 80px;
  overflow-y: auto;
}
.listening_list .listening_item .listen_item {
  text-align: center;
}
.listening_list .listening_item .listen_item .ant-tag {
  min-width: 80.69px;
}
.listening_list .list_item .ant-divider {
  margin: 5px 0;
}
</style>
