/* eslint-disable */
console.log('我是api')
import utils from '@/utils/utils'
import Config from '@/utils/instance'
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
// 德国仓 - 库存
const LingXingErp_STOCK = async function(data, token) {
    let params = Object.assign(data, {
        "current": 1,
        "size": 200,
        "stockType": "",
        "whCodeList": "",
        "stockCountKind": "totalAmount",
        "startValue": "",
        "endValue": "",
        "categoryIdList": [],
        "isHideInventory": 0,
        "barcodeType": "sku",
        "barcode": "",
        "sku": ""
    })
    return await utils.request(Config.LingXingErp_Stock, "post", {
        body: JSON.stringify(params),
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
}

// 维赢仓 - 登录 (拿仓库id和名称)
const ShipoutErp_LOGIN_FINAL = async function(token) {
    return await utils.request(Config.ShipOutErp_LOGIN_FINAL, "get", {
        "orgType": 1
    }, {
        method: 'get',
        headers: {
            'authorization': `Bearer ${token}`
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
// 维赢的库存
const ShipoutErp_STOCK = async function(data, token) {
    let params = Object.assign({
        "showSkuType": 0,
        "curPageNo": 1,
        "pageSize": 60
    }, data)
    try {
        return await utils.request(Config.ShipoutErp_Stock, "get", params, {
            headers: {
                'authorization': 'Bearer ' + token,
                'content-type': 'application/json'
            }
        })
    } catch(err) {
        return Promise.reject({
            message: 'token过期',
            statu: 201
        })
    }
}

// 维赢仓 - 登录 
const PaiPaiErp_LOGIN = async function(data) {
    let {
        loginAccount,
        code
    } = data
    return await utils.request(Config.PaiPaiErp_Login, "post", {
        body: JSON.stringify({
            "email": loginAccount,
            "verifyCode": code,
            "password": Config.PaiPai_Account[loginAccount]
        }),
        headers: {
            'content-type': 'application/json'
        }
    })
}

// 派派仓-验证码登录 这个法子行不通
const PaiPaiErp_CODEVERTIFY = async function() {
    return await utils.request(Config.PaiPaiErp_CODE, "get")
}
// 派派仓- 仓库库存
const PaiPaiErp_STOCK = async function(data, cookie) {
    return await utils.request(Config.PaiPaiErp_Stock, "post", {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
            'cookie': cookie
        }
    })
}

export default {
    LingXingErp_Login_GETTOKEN,
    LingXingErp_STOCK,
    ShipoutErp_LOGIN_FINAL,
    ShipoutErp_LOGIN,
    ShipoutErp_STOCK,
    PaiPaiErp_LOGIN,
    PaiPaiErp_CODEVERTIFY,
    PaiPaiErp_STOCK
}


