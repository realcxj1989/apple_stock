const axios = require('axios');
const sound = require('sound-play');
const path = require('path');
const inquirer = require('inquirer');
const platform = {
    'MQ203CH/A': 'iphone14pro gold 512gb',
    'MQ263CH/A': 'iphone14pro deeppurple 512gb',
    'MQ2Y3CH/A': 'iphone14pro deeppurple 1tb',
    'MQ143CH/A': 'iphone14pro gold 256gb',
    'MQ2K3CH/A': 'iphone14pro silver 1tb',
    'MQ0M3CH/A': 'iphone14pro spaceblack 256gb',
    'MPXR3CH/A': 'iphone14pro spaceblack 128gb',
    'MQ0D3CH/A': 'iphone14pro deeppurple 128gb',
    'MQ0W3CH/A': 'iphone14pro silver 256gb',
    'MQ2D3CH/A': 'iphone14pro spaceblack 1tb',
    'MQ1J3CH/A': 'iphone14pro spaceblack 512gb',
    'MQ1R3CH/A': 'iphone14pro silver 512gb',
    'MPXY3CH/A': 'iphone14pro silver 128gb',
    'MQ053CH/A': 'iphone14pro gold 128gb',
    'MQ2R3CH/A': 'iphone14pro gold 1tb',
    'MQ1C3CH/A': 'iphone14pro deeppurple 256gb',
    'MQ893CH/A': 'iphone14promax gold 256gb',
    'MQ883CH/A': 'iphone14promax silver 256gb',
    'MQ8F3CH/A': 'iphone14promax gold 512gb',
    'MQ863CH/A': 'iphone14promax deeppurple 128gb',
    'MQ873CH/A': 'iphone14promax spaceblack 256gb',
    'MQ8L3CH/A': 'iphone14promax gold 1tb',
    'MQ8D3CH/A': 'iphone14promax spaceblack 512gb',
    'MQ8H3CH/A': 'iphone14promax spaceblack 1tb',
    'MQ8M3CH/A': 'iphone14promax deeppurple 1tb',
    'MQ853CH/A': 'iphone14promax gold 128gb',
    'MQ843CH/A': 'iphone14promax silver 128gb',
    'MQ8J3CH/A': 'iphone14promax silver 1tb',
    'MQ8G3CH/A': 'iphone14promax deeppurple 512gb',
    'MQ8E3CH/A': 'iphone14promax silver 512gb',
    'MQ8A3CH/A': 'iphone14promax deeppurple 256gb',
    'MQ833CH/A': 'iphone14promax spaceblack 128gb'
}

/**
 * 型号 : 地址
 * @type {{'MQ873CH/A': string, 'MQ8A3CH/A': string}}
 */
const models = {
    'MQ873CH/A': '上海 黄浦区',  // 256G 黑色
    'MQ8A3CH/A': '上海 黄浦区',  // 256G 紫色
    'MQ883CH/A': '上海 黄浦区',  // 256G 银色
}

const monitorIphoneStorage = async (productName, locationName) => {
    const url = encodeURI(`https://www.apple.com.cn/shop/fulfillment-messages?pl=true&mts.0=regular&parts.0=${productName}&location=${locationName}`);
    const res = await axios.get(url);
    const {stores} = res.data.body.content.pickupMessage;
    const {subHeader} = res.data.body.content.deliveryMessage[productName].regular;
    if (Array.isArray(stores) && stores.length > 0) {
        for (const store of stores) {
            try {
                const {pickupDisplay} = store.partsAvailability[productName];
                console.log(store.storeName, pickupDisplay);
                const filePath = path.join(__dirname, "hyl.mp3");
                if (pickupDisplay === 'available') {
                    await sound.play(filePath);
                    process.exit(1);
                }
            } catch (e) {
                console.error('解析店铺信息出错');
            }
        }
    } else {
        console.log(subHeader, {
            productName,
            locationName,
            storage: '无货可用商店',
        });
    }
}
const choices = [];
for (const key in platform) {
    choices.push({
        name: platform[key],
        value: key,
    })
}
inquirer.prompt([
    {
        type: "checkbox",
        name: "types",
        message: "请选择您要查询的iPhone型号?",
        choices: choices,
    },
    {
        type: "input",
        name: "address",
        message: "请输入您的省市区（例：浙江 杭州 上城区 / 上海 黄浦区） :",
        validate: function (value) {
            if (/.+/.test(value)) {
                return true;
            }
            return "address is required";
        },
        default: '上海 黄浦区'
    },
    {
        type: "input",
        name: "interval",
        message: "请输入查询间隔(最小间隔2秒默认5秒) :",
        default: 5,
        validate: function (value) {
            if (/^\d+$/.test(value) && value > 1) {
                return true;
            }
            return "interval is required";
        }
    }
])
    .then(answers => {
        const {address, types, interval} = answers;
        console.log(`地址：${address}，型号：${types.map(type => platform[type]).join(',')}，查询间隔：${interval}秒`);
        setInterval(async () => {
            try {
                for (const type of types) {
                    monitorIphoneStorage(type, address);
                }
            } catch (e) {
                console.error(e);
            }
        }, 1000 * interval); // 5s
    });

