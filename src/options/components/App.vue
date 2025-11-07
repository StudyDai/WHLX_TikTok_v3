<template>
  <div class="option_container" v-if="showWarehouseList.length">
    <div class="user_options">
      <h1 style="font-size: 36px; border-right: 5px solid orange;margin-bottom: 0; margin-right: 15px;">筛选条件</h1>
      <a-input
        size="large"
        v-model:value="searchInput.sku"
        placeholder="请输入产品SKU"
        style="width: 200px; margin-right: 10px"
      />
      <a-input-group compact style="width: 200px; margin-right: 10px;">
        <a-cascader
          size="large"
          v-model:value="searchInput.selectFirstId"
          style="width: 100%"
          :options="warehouseFirstOptions"
          placeholder="请选择海外仓"
          @change="firstSelect"
        />
        
      </a-input-group>
      <a-input-group compact style="width: 200px; margin-right: 10px;">
        <a-cascader
          size="large"
          v-model:value="searchInput.selectSecondId"
          style="width: 100%"
          :options="warehouseSecondOptions"
          placeholder="请选择区域仓"
        />
      </a-input-group>
      <a-button type="primary" @click="onSearch" size="large" style="margin-right: 10px;">搜索</a-button>
      <a-button type="primary" @click="onReset" size="large" danger>重置</a-button>
    </div>
    <a-table align="center" :dataSource="showWarehouseList" :columns="showWarehouseTitle" sorter="NumSort">
    </a-table>
  </div>
  <div class="mark" v-else>
       <a-spin size="large" tip="资源加载中, 请稍后" />
    </div>
</template>
<script setup>
/* eslint-disable */
import { ref, onMounted } from 'vue'
import utils from '@/utils/utils';
import instance from '@/utils/instance'
import api from '@/utils/api'
import { message } from 'ant-design-vue';
let weilaiWarehouseList = ref([])
let shipoutWarehouseList = ref([])
let paipaiWarehouseList = ref([])
let downloadWarehouseList = ref(['sku','erpSku', '海外仓', '区域仓', '可用库存','在途库存'])
let showWarehouseList = ref([])
let allWarehouseList = ref([])
let searchInput = ref({
   sku: '',
   selectFirstId: [],
   selectSecondId: []
})
// 这个是表格的列选项
let showWarehouseTitle = ref([{
   title: '产品SKU',
   dataIndex: 'sku',
   key: 'sku',
   sorter: (a, b) => a.sku >= b.sku
}, {
   title: 'ERP产品SKU',
   dataIndex: 'erpSku',
   key: 'erpSku',
   sorter: (a, b) => a.erpSku >= b.erpSku
}, {
   title: '所在仓库',
   dataIndex: 'warehouseName',
   key: 'warehouseName',
   sorter: (a, b) => a.warehouseName >= b.warehouseName
}, {
   title: '可用库存',
   dataIndex: 'sQuantity',
   key: 'sQuantity',
   sorter: (a, b) => a.sQuantity - b.sQuantity
}, {
   title: '在途库存',
   dataIndex: 'inboundingQuantity',
   key: 'inboundingQuantity',
   sorter: (a, b) => a.inboundingQuantity - b.inboundingQuantity
}])
// 第一大类
let warehouseFirstOptions = ref([{
    value: '派派仓',
    label: '派派仓'
  },{
    value: '维赢仓',
    label: '维赢仓'
  },{
    value: '司达仓',
    label: '司达仓'
  },{
    value: '科隆仓',
    label: '科隆仓'
}])
// 第二大类是动态渲染的
// 第二大类的映射
let warehouse_children_map = [{
    value: '派派仓',
    label: '派派仓',
    children: [
      {
        value: '派派仓-纽约',
        label: '派派仓-纽约'
      },
      {
        value: '派派仓-迈阿密',
        label: '派派仓-迈阿密'
      },
      {
        value: '派派仓-新泽西',
        label: '派派仓-新泽西'
      },
      {
        value: '派派仓-达拉斯',
        label: '派派仓-达拉斯'
      },
      {
        value: '派派仓-洛杉矶',
        label: '派派仓-洛杉矶'
      },
    ],
  },{
    value: '维赢仓',
    label: '维赢仓',
    children: [
      {
        value: 'JASPER-美西仓',
        label: 'JASPER-美西仓'
      },
      {
        value: 'JASPER-美东仓',
        label: 'JASPER-美东仓'
      }
    ],
  },{
    value: '司达仓',
    label: '司达仓',
    children: [
      {
        value: 'CA01',
        label: 'CA01-美西'
      },
      {
        value: 'NC01',
        label: 'NC01-美东'
      }
    ],
  },{
    value: '科隆仓',
    label: '科隆仓',
    children: [
      {
        value: '科隆仓',
        label: '科隆仓'
      }
    ],
}]
// 第二大类渲染
let warehouseSecondOptions = ref([{
  value: '',
  warehouse: ''
}])
// 用户选择第一大类会触发
const firstSelect = (event) => {
  console.log('我选择了内容', event)
  // 要先把选择的内容删除掉
  searchInput.value.selectSecondId = []
  // 这个地方要动态渲染
  warehouseSecondOptions.value = warehouse_children_map.find(child => child.value == event?.[0])?.children ?? []
}
setTimeout(() => {
  console.log(searchInput.value)
}, 15000);
// 当我点击搜索的时候会触发这个
const onSearch = () => {
  // 根据传递进来的内容去进行搜索了
  let sku = searchInput.value.sku
  let selectFirstId = searchInput.value.selectFirstId?.[0] ?? ''
  let selectSecondId = searchInput.value.selectSecondId?.[0] ?? ''
  let showList = []
  console.log(allWarehouseList.value)
  if (!sku.trim() && !selectFirstId.trim() && !selectSecondId.trim()) {
    showWarehouseList.value = allWarehouseList.value
    return
  }
  if (sku.trim()) {
    let str = sku + ''
    showList = allWarehouseList.value.filter(item => item.sku.toUpperCase().includes(str.toUpperCase()))
  }
  if (selectFirstId.trim()) {
    if (showList.length) {
      // 存在的话, 直接筛选这个
      showList = showList.filter(item => item.faWarehouseName == selectFirstId)
    } else {
      showList = allWarehouseList.value.filter(item => item.faWarehouseName == selectFirstId)
    }
  }
  if (selectSecondId.trim()) {
    if (showList.length) {
      // 存在的话, 直接筛选这个
      showList = showList.filter(item => item.warehouseName == selectSecondId)
    } else {
      showList = allWarehouseList.value.filter(item => item.warehouseName == selectSecondId)
    }
  }
  if (!showList.length) {
    showWarehouseList.value = allWarehouseList.value
    message.error('该仓并无此产品,请更换查询条件');
  } else {
    showWarehouseList.value = showList
  }
}
// 重置下搜索的内容
const onReset = () => {
    searchInput.value = {
      sku: '',
      selectFirstId: [],
      selectSecondId: []
    }
}
onMounted(async () => {
  // 进来就去请求未来的仓库数据
  let weilaiToken = await utils.persistent.getLocalStorage(instance.WeiLaiToken)
  let shipoutToken = await utils.persistent.getLocalStorage(instance.ShipoutToken)
  let ppToken = await utils.persistent.getLocalStorage(instance.PaiPaiToken)
  let weiyingToken = await utils.persistent.getLocalStorage(instance.WeiYingToken)
  let ownWarehouseList = await utils.persistent.getLocalStorage('weiyingown_list')
  // 这个地方就是请求数据用的
  async function getWarehouseStock() {
    if (shipoutToken?.length) {
      // 验证下 这个地方要循环
      for (let index = 0; index < shipoutToken.length; index++) {
        const element = shipoutToken[index];
        // 接下来拿所有的库存数据
        let currentIndex = 1, allData = []
        let stock_resp = await api.ShipoutErp_STOCK({}, element.token)
        if (stock_resp.result === 'OK') { 
          allData.push(...stock_resp.data.records)
          while(stock_resp.data.total > currentIndex * 60) {
              currentIndex++
              stock_resp = await api.ShipoutErp_STOCK({
                curPageNo: currentIndex
              }, element.token)
              if (stock_resp.result === 'OK') { 
                allData.push(...stock_resp.data.records)
              }
          }
          // 格式化
          allData.forEach(r => {
              let name_arr = r.skuNameEN.split(' ')
              let good_sku = name_arr[0]
              let erp_sku = r.omsSku
              let good_cn = name_arr[1]
              let erp_name = r.skuNameEN
              let good_stock = r.subItemList.map(s => {
                if (s.inboundingQuantity == 720) {
                  debugger;
                }
                return {
                    warehouseName: s.warehouseName,
                    sQuantity: s.sQuantity,
                    inboundingQuantity: s.inboundingQuantity
                }
              })
              // 第一层的转化
              if (!good_cn) {
                  // sku要重新刷
                  name_arr = r.skuNameEN.match(/[a-zA-Z0-9-]+/ig)
                  if (name_arr) {
                    good_sku = name_arr[0]
                    good_cn = r.skuNameEN.replace(good_sku, '')
                  } else {
                    good_cn = r.skuNameEN
                  }
              }
              // 处理特殊的
              if (!Number.isNaN(+good_sku) || good_sku === '-' || good_sku === 'IW' || /[\u4e00-\u9fa5]/ig.test(good_sku)) {
                  good_sku = erp_sku.replace(/WO-\d{2,3}-?/ig, '')
              }
              let faName = ''
              if (r.subItemList[0].warehouseName.includes('JASPER')) {
                faName = '维赢仓'
              } else {
                faName = '司达仓'
              }
              // 这个地方要去查 是不是有库存,有就同步进去
              let current_item = null
              if (ownWarehouseList.length) {
                 current_item = ownWarehouseList.filter(list => erp_sku.includes(list.skuId))
              }
              if (current_item) {
                // 对应下仓库然后推进去那个库存
                good_stock.forEach(stock => {
                  let item = current_item.find(item => stock.warehouseName.includes(item.warehouseName.slice(-3)))
                  if (item) {
                    stock.inboundingQuantity = stock.inboundingQuantity + item.inboudQty
                    stock.sQuantity = stock.sQuantity + item.actualStandQty
                    r.inboundingQuantity = r.inboundingQuantity + item.inboudQty
                    r.sQuantity = r.sQuantity + item.actualStandQty
                  }
                })
              }
              shipoutWarehouseList.value.push({
                  sku: good_sku.replace('@', ''),
                  erpSku: erp_sku,
                  good_cn,
                  erp_name,
                  runningStock: r.inboundingQuantity,
                  availableAmount: r.sQuantity,
                  good_img: r.picUrl,
                  warehouseName: faName,
                  good_stock
              })
          })
          console.log(shipoutWarehouseList.value)
        } else {
          // 这个地方要更新token
          console.log(element)
          const resp = await api.ShipoutErp_LOGIN({
              loginAccount: element.account,
              password: element.pwd
          })
          if (resp.access_token.length) { 
            // 更新下token
            element.token = resp.access_token
            utils.persistent.addLocalStorage(instance.ShipoutToken, JSON.stringify(shipoutToken))
          }
          // 如果是第二次循环,那么就冲直接重开
          if ((index + 1) == shipoutToken.length) {
             // 这个地方去拿完数据,回来就别往下走了
             await getWarehouseStock()
             return
          }
        }
      }
    }
    if (weilaiToken?.length) {
      for (let index = 0; index < weilaiToken.length; index++) {
        const element = weilaiToken[index];
        const resp = await api.LingXingErp_STOCK({}, element.token)
        if (resp.code === 200) {
          // 拿数据
          let WeiLaiStoke = resp.data.records
          // 格式化  availableAmount可用库存  sku产品SKU  
          WeiLaiStoke.forEach(item => {
              // 正则拿sku
              let sku = item.sku.match(instance.WeiLaiSkuReg)[1].replace('@', '')
              // 平台仓sku
              let erpSku = item.sku
              // 库存
              let availableAmount = item.availableAmount
              // 在途库存
              let runningStock = item.transportAmount
              weilaiWarehouseList.value.push({
                  sku,
                  erpSku,
                  availableAmount,
                  runningStock,
                  warehouseName: '科隆仓',
                  good_stock: [{
                    warehouseName: '科隆仓',
                    sQuantity: availableAmount,
                    inboundingQuantity: runningStock
                  }]
              })
          })
          console.log(weilaiWarehouseList.value)
        }
      }
    }
    // 派派的 这里面融合了其他两个仓的账号,这样子做直接就是不用去登录了
    if (ppToken?.length) {
       // 直接请求
       const resp = await api.PaiPaiErp_STOCK({
          "warehouseIds": [],
          "inquireType": 2,
          "searchType": "sku",
          "searchContent": "",
          "orderBy": "sku",
          "desc": 2,
          "rangeFields": "total",
          "minValue": null,
          "maxValue": null,
          "pageNo": 1,
          "pageSize": 300
        }, ppToken)
        if (resp.success) {
           resp.data.page.rows.forEach(item => {
              // 如果sku不是纯数字就要用sku
              let sku = item.sku
              console.log(item.name)
              if (!Number.isNaN(+sku)) {
                  sku = item.name.split(' ')[0]
              }
              paipaiWarehouseList.value.push({
                  sku,
                  erpSku: item.name,
                  availableAmount: item.available,
                  runningStock: item.onTheWay,
                  warehouseName: '派派仓',
                  good_stock: [{
                    warehouseName: item.warehouseName,
                    sQuantity: item.available,
                    inboundingQuantity: item.onTheWay
                  }]
              })
           })
           // 开始格式化
        }
       // 去拿维赢的数据
       if (!shipoutToken) {
          // 去请求
          let resp, prev
          let user = {
            user1: {
              loginAccount: '13923112538@139.com',
              password: 'zhang13923112538'
            },
            user2: {
              loginAccount: 'whlx20200202@126.com',
              password: 'WHLXwhlx2020'
            }
          }
          let values = Object.values(user)
          console.log(values)
          for (let index = 0; index < values.length; index++) {
            resp = await api.ShipoutErp_LOGIN(values[index])
            if (resp.access_token.length) {
                // 先拿之前的
                prev = await utils.persistent.existLocalStorage(instance.ShipoutToken)
                // // 加进去
                prev = prev.concat({
                    account: values[index].loginAccount,
                    pwd: values[index].password,
                    token: resp.access_token
                })
                // 有值,存起来token
                utils.persistent.addLocalStorage(instance.ShipoutToken, JSON.stringify(prev))
            }
          }
       }
       if (!weilaiToken) {
          // 去请求
          let resp, prev
          let user = {
            user1: {
              loginAccount: 'Anhil',
              password: 'lxwms123456'
            }
          }
          let values = Object.values(user)
          for (let index = 0; index < values.length; index++) {
            resp = await api.LingXingErp_Login_GETTOKEN(values[index])
            if (resp.code === 200) {
                // 先拿之前的
                prev = await utils.persistent.existLocalStorage(instance.WeiLaiToken)
                // 加进去
                prev = prev.concat({
                    account: values[index].loginAccount,
                    pwd: values[index].password,
                    token: resp.data.token
                })
                // 成功啦 存储token
                utils.persistent.addLocalStorage(instance.WeiLaiToken, JSON.stringify(prev))
                chrome.runtime.sendMessage({
                    message: 'addSuccess'
                })
            }
          }
       }
    }
    if (weiyingToken?.length) {
       // http://omsbackend.jaspers.com.cn:16017/prod-api/oms/backend/inventory/list?pageNum=1&pageSize=10
    }
    // 开始合并
    compareStockByWarehouse(weilaiWarehouseList.value, shipoutWarehouseList.value, paipaiWarehouseList.value, )
  }
  /**
   * 这是合并所有的海外仓库存函数
   * @param data 海外仓仓库库存数组
   */
  function compareStockByWarehouse(...data) {
      let allList = []
      data.map(w => {
          allList.push(...w)
      })
      allList.forEach(r => {
        r.good_stock.forEach(s => {
          allWarehouseList.value.push({
              faWarehouseName: r.warehouseName,
              sku: r.sku,
              erpSku: r.erpSku,
              warehouseName: s.warehouseName,
              sQuantity: s.sQuantity,
              inboundingQuantity: s.inboundingQuantity
          })
          downloadWarehouseList.value.push([r.sku, r.erpSku, r.warehouseName, s.warehouseName, s.sQuantity, s.inboundingQuantity])
        })
      })
      // 看看效果
      console.log(showWarehouseList.value)
      showWarehouseList.value = allWarehouseList.value
  }
  setTimeout(() => {
    getWarehouseStock()
  }, 5000);
  // 输入的时候就会触发
  const handleSearch = function(...data) {
      console.log(data)
  }
})
</script>
<style scoped>
.option_container {
  padding: 15px;
}
.user_options {
  width: 70%;
  margin: 0px 0 15px;
  display: flex;
  align-items: center;
}
.mark {
  display: flex;
  justify-content: center;
  align-items: center;
  display: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: #00000025;
}
</style>
