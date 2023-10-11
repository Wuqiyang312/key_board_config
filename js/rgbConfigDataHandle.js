import { cmdSend } from './usb/usb.js'

//获取按键当前的RGB 配置
async function getRgbConfig() {
    let temp = new Uint8Array([0x55, 0xaa, 0x00, 0x00, 0x00, 0x84]);
    console.log("getKeyValue");
    cmdSend(temp, 1)
}

//HID cmd 设置颜色
async function setColor(v,c) {
    let temp = new Uint8Array([0x55, 0xaa, 0x00, 0x00, 0x00, 0x85,0,0,0,0,0]);
    if(v >9)
    {
        temp[3] = 4;
        temp[6] = 4;
        temp[7] = (c>>16) & 0xff;
        temp[8] = (c>>8) & 0xff;
        temp[9] = c&0xff;

    }
    else
    {
        temp[3] = 5;
        temp[6] = 5;

        temp[7] = v;
        temp[8] = (c>>16) & 0xff;
        temp[9] = (c>>8) & 0xff;
        temp[10] = c&0xff;
    }

    console.log("setColor",v,c);
    cmdSend(temp, 1)
}

//HID cmd 设置模式
async function setMode(v,c) {
    let temp = new Uint8Array([0x55, 0xaa, 0x00, 0x00, 0x00, 0x85,0,0,0,0,0]);
    temp[3] = 2;
    temp[6] = v;
    temp[7] = c;
    cmdSend(temp, 1)
}

export {
    getRgbConfig,
    setMode,
    setColor,
  }
  
  