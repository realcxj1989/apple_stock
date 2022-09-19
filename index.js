const axios = require('axios');
const sound = require('sound-play');
const path = require('path');
const inquirer = require('inquirer');
const platform = {
    'MPU93CH/A': 'iphone14 midnight 128gb',
    'MPX63CH/A': 'iphone14 purple 512gb',
    'MPX03CH/A': 'iphone14 starlight 512gb',
    'MPW73CH/A': 'iphone14 purple 256gb',
    'MPVU3CH/A': 'iphone14 midnight 256gb',
    'MPV63CH/A': 'iphone14 product_red 128gb',
    'MPW13CH/A': 'iphone14 starlight 256gb',
    'MPUW3CH/A': 'iphone14 purple 128gb',
    'MPWT3CH/A': 'iphone14 midnight 512gb',
    'MPWE3CH/A': 'iphone14 product_red 256gb',
    'MPVG3CH/A': 'iphone14 blue 128gb',
    'MPXD3CH/A': 'iphone14 product_red 512gb',
    'MPUJ3CH/A': 'iphone14 starlight 128gb',
    'MPXK3CH/A': 'iphone14 blue 512gb',
    'MPWL3CH/A': 'iphone14 blue 256gb',
    'MQ393CH/A': 'iphone14plus product_red 128gb',
    'MQ3J3CH/A': 'iphone14plus starlight 512gb',
    'MQ3G3CH/A': 'iphone14plus blue 256gb',
    'MQ3P3CH/A': 'iphone14plus product_red 512gb',
    'MQ3D3CH/A': 'iphone14plus starlight 256gb',
    'MQ3Q3CH/A': 'iphone14plus blue 512gb',
    'MQ3F3CH/A': 'iphone14plus product_red 256gb',
    'MQ363CH/A': 'iphone14plus starlight 128gb',
    'MQ3E3CH/A': 'iphone14plus purple 256gb',
    'MQ3C3CH/A': 'iphone14plus midnight 256gb',
    'MQ3K3CH/A': 'iphone14plus purple 512gb',
    'MQ373CH/A': 'iphone14plus purple 128gb',
    'MQ353CH/A': 'iphone14plus midnight 128gb',
    'MQ3A3CH/A': 'iphone14plus blue 128gb',
    'MQ3H3CH/A': 'iphone14plus midnight 512gb',
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
    try {
        const res = await axios.get(url);
        const {stores} = res.data.body.content.pickupMessage;
        const {subHeader} = res.data.body.content.deliveryMessage[productName].regular;
        if (Array.isArray(stores) && stores.length > 0) {
            for (const store of stores) {
                try {
                    const {pickupDisplay} = store.partsAvailability[productName];
                    const filePath = path.join(__dirname, "hyl.mp3");
                    if (pickupDisplay === 'available') {
                        await sound.play(filePath);
                        process.exit(1);
                    }
                } catch (e) {
                    console.error('解析店铺信息出错');
                }
            }
        }
        console.log(subHeader, locationName, '无货可用商店');

    } catch (e) {
        console.error(e.message);
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
        choices: choices.sort((a, b) => a.name.localeCompare(b.name)),
        default: ['MQ873CH/A', 'MQ8A3CH/A', 'MQ883CH/A'],
        // default: ['MPVU3CH/A']
    },
    {
        type: "input",
        name: "address",
        message: "请输入您的省市区（例：浙江 杭州 上城区 / 上海 上海 杨浦区） :",
        validate: function (value) {
            if (/.+/.test(value)) {
                return true;
            }
            return "address is required";
        },
        default: '上海 上海 杨浦区'
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
                console.error(e.message);
            }
        }, 1000 * interval); // 5s
    });

