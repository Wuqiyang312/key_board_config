//这里只需要连接上USB设置，并返回连接的对象
import { getKeyboardUserPID } from './usbHidCmd.js'
import { usbHidDataHandle } from './usbHidCmd.js'

const vendorId = 0x5131;
const productId = 0x5345;

let device = null

//页面加载完成后初始化USB状态
async function usbDeviceInit()
{
  const devices = await navigator.hid.getDevices();
  for(var i =0;i<devices.length;i++)
  {
    devices[i].forget();
  }
}


//连接USB设备
async function getOpenedDevice() {
  
  device = await navigator.hid.requestDevice({
      filters: [{ vendorId, productId,usagePage:0xff00}],
  });
  const devices = await navigator.hid.getDevices();
  console.log("---------", devices);
  device = devices.find(d => d.vendorId === vendorId && d.productId === productId && d.collections[0].usagePage === 0xff00) ;

  if(device != null) {
      try {
        await device.open();
      } catch (error) {
        console.error("open device erro", error);
      }
  }

  return device;
}

async function usbHidConnectDevice()
{
    device = await getOpenedDevice();
    if(device == null)
    {   
      console.log("test connect erro"); 
        return 0;
    }

    device.oninputreport = usbHidDataHandle
    getKeyboardUserPID(1);//通知键盘当前连接状态
    navigator.hid.addEventListener('disconnect', disconnectCallback);
    return 1;
}

//拔掉USB的回调
function disconnectCallback(v) {
  console.log("connectCallback");
  window.location.reload(); 
  device = null;
}

let cmdCount = 0;
async function cmdSend(v, flag) {
  if (device == null || (!device.opened)) {
    alert("未连接到键盘请点击'连接键盘'");
    return
  }

  if (flag) v[2] = cmdCount++;
  const reportId = 0;

  let str = "";
  var len = v[3]
  if (len > 58) len = 58
  for (var j = 0; j < len + 6; j++) {
    str += v[j].toString(16) + ' '
  }
  console.log("tx data :" + str);

  try {
    await device.sendReport(reportId, v);
  } catch (error) {
    console.error("send CMD erro", error);
  }

}

export {
    cmdSend,
    usbHidConnectDevice,
    usbDeviceInit,
}