console.log('我是常量，我正式开启了哦')
// ------------ 登录接口 ----------------

// 德国仓
const LingXingErp_Login = 'https://oms.xlwms.com/gateway/woms/auth/login'
// 维赢仓 - 验证接口
const ShipoutErp_Login = 'https://oms.shipout.com/api/auth-server/oauth/token'
// 维赢仓- 登录接口
const ShipOutErp_LOGIN_FINAL = 'https://oms.shipout.com/api/wms-user/user/afterLogin'

// 派派仓- 验证码接口
const PaiPaiErp_CODE = 'https://pcpc.jfwms.net/oms/vcode'
// 派派仓- 登录接口
const PaiPaiErp_Login = 'https://pcpc.jfwms.net/oms/login'

// ------------ 登录接口 ----------------


// ------------ 库存接口 ----------------

// 德国仓-库存接口
const LingXingErp_Stock = 'https://oms.xlwms.com/gateway/woms/stock/list'

// 维赢仓-库存接口
const ShipoutErp_Stock = 'https://oms.shipout.com/api/wms-business/oms/stock/list'

// 派派仓-库存接口
const PaiPaiErp_Stock = 'https://pcpc.jfwms.net/oms/inventory/list'


// ------------ 库存接口 ----------------



// --------------- TEMU接口 ---------------

// TEMU 流量分析接口 - 功能: 监听是否有产品处于流量限制中
const TEMU_Traffic_Analysis = 'https://agentseller-us.temu.com/api/flow/analysis/list'



// --------------- TEMU接口 ---------------



// ------------ 仓库映射 ----------------

const WarehouseMap = {
    'PaiPai': '海外仓-派派仓',
    'ShipOut': '海外仓-维赢仓',
    'WeiLai': '海外仓-科隆仓'
}

// ------------ 仓库映射 ----------------



// ------------ 普通常量 ----------------

const WeiLaiToken = "weilaitoken"
const ShipoutToken = 'shipouttoken'
const PaiPaiToken = 'paipaitoken'
const WeiYingToken = 'weiyingToken'
const PaiPai_Account = {
    "szt20171218@126.com": "7bd87f29d961ae8e129162014562de37"
}

const TEMUListenStatu = 'temulistenstatu'

// ------------ 普通常量 ----------------

// 获取网站cookie 地址
const PaiPaiURL = 'https://pcpc.jfwms.net/'


// ------------ 本地服务器接口 ----------------

const Local_URL = 'http://192.168.188.77'
const Local_PORT = '8889'
const Local_REFU_PaiPaiCODE = Local_URL + ":" + Local_PORT + '/getCode'
const Local_CALL_USER = Local_URL + ":" + Local_PORT + '/callUser'
const Local_SAVE_XLSX = Local_URL + ":" + Local_PORT + '/saveXlsx'
const Local_SAVE_XLSX_TK = Local_URL + ":" + Local_PORT + '/saveXlsx_tk'

// ------------ 本地服务器接口 ----------------


// ------------ 特殊SKU映射 ------------------

// const SpecialSkuMap = {
//     ''
// }

// ------------ 特殊SKU映射 ------------------




// ------------ 正则表达式 ----------------

const WeiLaiSkuReg = /WO-\d{2,3}-(.*)/

// ---------------------------------------

export default {
    PaiPaiErp_Login,
    LingXingErp_Login,
    ShipoutErp_Login,
    WarehouseMap,
    WeiLaiToken,
    ShipoutToken,
    PaiPaiToken,
    WeiYingToken,
    LingXingErp_Stock,
    ShipoutErp_Stock,
    PaiPaiErp_Stock,
    ShipOutErp_LOGIN_FINAL,
    WeiLaiSkuReg,
    PaiPai_Account,
    PaiPaiErp_CODE,
    Local_REFU_PaiPaiCODE,
    Local_SAVE_XLSX,
    Local_CALL_USER,
    Local_SAVE_XLSX_TK,
    PaiPaiURL,
    TEMUListenStatu,
    TEMU_Traffic_Analysis
}