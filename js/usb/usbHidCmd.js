import { cmdSend } from './usb.js'
import { hidCmd3Delay } from './../virtuaKeyboardPages.js'
import { minikeySelectHandle } from './../miniKeyboard.js'
import { greatValueBoxInit } from '../targetFunction/targetFunction.js'
import { setActiveKeyNumbe } from '../virtuaKeyboardDataHandle.js'
import { greatValueBoxInitUnShow } from '../targetFunction/targetFunction.js'

//获取键盘的pid ，根据键盘的PID设置键值
async function getKeyboardUserPID(v) {
  let temp = new Uint8Array([0x55, 0xaa, 0x00, 0x01, 0x00, 0x80, 0x01, 0x00]);
  temp[6] = v;
  cmdSend(temp, 1)
}
import { TargetFunctionBoxShowState } from '../targetFunction/targetFunctionPage.js'
//迷你按键被选中（hid CMD）的处理
import { getFocusState } from './../main.js'
function hidCmd3Handle(v) {
  if ((v[0] == 0x55) && (v[1] == 0xaa)) {
    var temp = new Object(); 
    temp.target = new Object();
    temp.target.id = "key"+(v[6]+1);
    hidCmd3Delay();
    if(getFocusState() == 0) return ;
    minikeySelectHandle(temp)
  }
}
import { rgbConfigViewUpdate } from './../rgbConfig.js'
function hidCmd4Handle(v) {
  rgbConfigViewUpdate(v)
}

import { virtuaKeyboardShowUpadte } from './../virtuaKeyboardPages.js'
//按键获取键值的返回
function hidCmd1Handle(v) {//这里判断类型，宏或者，单独快捷键
  if ((v[0] == 0x55) && (v[1] == 0xaa)) {
    greatValueBoxInitUnShow(v[6]);
    if(TargetFunctionBoxShowState())
    {
      window.greatFunctionButton()
    }
    virtuaKeyboardShowUpadte(v[6],v.slice(7,15))
  }
}

//根据键盘的PID显示按键的数量
var pages = [null,null,"./pages/key2/key2.html"
              ,"./pages/key3/key3.html",
              "./pages/key4/key4.html",
              "./pages/key5/key5.html",
              "./pages/key6/key6.html",null,
              "./pages/key8/key8.html",
              "./pages/key9/key9.html"]

var connect_state = 0
var keyTemp = 0xff;

var fwV = 0;

function getKeyboardFwV()
{
  return fwV;
}
async function keyboardPidHandle(v) {
  if(connect_state != 0)
  {//兼容旧的固件
    var temp = [0,0,0,0,0,0,0,0]
    virtuaKeyboardShowUpadte(keyTemp,temp);
    return 0;
  } 
  connect_state = 1;


   //这里禁用所有按键功能
   window.onkeydown = function () {
    window.event.preventDefault = false;
    return false;
  } 


  if ((v[0] == 0x55) && (v[1] == 0xaa)) {
    fwV = v[6];
    console.log(" fwV = v[6];",fwV);
    if(v[7] == 1)
    {
      document.getElementById("connectDevicePages").src = "./pages/keyRgb/keyRgb.html"
    }
    else if(v[7] == 2)
    {
      if(v[8] == 3) document.getElementById("connectDevicePages").src = "./pages/key3knbo/key3.html"
      else document.getElementById("connectDevicePages").src = "./pages/key9knbo/key9.html"

    }
    else
    {
      document.getElementById("connectDevicePages").src = pages[v[8]]
    }
  }
}
import { knboShowState } from '../miniKeyboard.js'
function cmdTargetKeyValueHandle(vk)
{
    var temp = {};
    var v =vk.value;
    temp.activeKey = vk.keyNumber;

    setActiveKeyNumbe(vk.keyNumber);
    knboShowState(vk.keyNumber);//是否展开

    temp.delayTime = (v[2]<<8)+v[3];
    temp.loop = (v[4]<<8)+v[5];
    temp.count = (v[6]<<8)+v[7];
    temp.keyData= {};
    var i = 0;
    for(i=0;i<temp.count;i++)
    {
      var buttonId = "button"+i;
      var j = 0;
      temp.keyData[buttonId] = {};
      temp.keyData[buttonId].keyValue = [];
      for(j = 0;j<6;j++)
      {
        temp.keyData[buttonId].keyValue[j] = v[8+6*i+j]
      }
    }
    greatValueBoxInit(temp);
}


var keyValueTemp = {};
function hidCmd7Handle(v) {

  if ((v[0] == 0x55) && (v[1] == 0xaa)) 
  {
    if(v[8] == 0)
    {
       keyValueTemp.keyNumber = v[6];
       keyValueTemp.value = [];
      var i = 0;
      for(i=0;i<52;i++)
      {
        keyValueTemp.value[i] = v[i+9];
      }
    }
    else if(v[8] == 1)
    {
      if(keyValueTemp.keyNumber != v[6])
      {
        keyValueTemp = {};
        return 1;
      }
      var i = 0;
      for(i=0;i<52;i++)
      {
        keyValueTemp.value[i+52] = v[i+9];
      }
      cmdTargetKeyValueHandle(keyValueTemp);
      
    }
  }
}

async function usbHidDataHandle({ device, reportId, data }) {

  let temp = new Uint8Array(data.buffer);
  let str = "";
  var len = temp[3]

  if (len > 58) len = 58
  for (var j = 0; j < len + 6; j++) {
    str += temp[j].toString(16) + ' '
  }
  
  console.log("rx data :" + str);

  if (temp[5] == 0) {
    keyboardPidHandle(temp);//可能是获取到的PID
  }

  if (temp[5] == 3) {
    hidCmd3Handle(temp);//按键被选中
  }

  if (temp[5] == 1) {
    hidCmd1Handle(temp);//
  }

  if (temp[5] == 4) {
    hidCmd4Handle(temp);//
  }
  if (temp[5] == 7) { //带宏的键值数据
    hidCmd7Handle(temp);//
  }

  if (temp[5] == 8) { //设置键值的第一包已经收到了
    hidCmd8Handle(temp);//
  }

}

//获取按键当前的键值
async function getKeyValue(v) {
    let temp = new Uint8Array([0x55, 0xaa, 0x00, 0x01, 0x00, 0x81, 0x01, 0x00]);
    keyTemp = v;
    temp[6] = v;
    cmdSend(temp, 1)
  }

function hidCmd8Handle(v)
{
  let hand = new Uint8Array([0x55, 0xaa, 0x00, 54, 0x00, 0x87,0,2,0]);
  let temp = new Uint8Array(61);
  var i = 0;
  for(i=0;i<9;i++)
  {
    temp[i] = hand[i];
  }
  temp[6] = sendKeyVale.keynumben;
  if(sendKeyVale.keynumben == v[6] && v[7] == 0)
  {
    
    for(i=0;i<52;i++)
    {
      temp[i+9] = sendKeyVale.data[i+52];
    }
    temp[8] = 1;
    cmdSend(temp, 1)
  }
}
var sendKeyVale = {};
 async function updateKeyValueTarget(v)
 {
  let hand = new Uint8Array([0x55, 0xaa, 0x00, 55, 0x00, 0x87,0,2,0]);
  let temp = new Uint8Array(61);
  let keyValue = new Uint8Array(104);

  //对应大类
  keyValue[0] = 0;
  keyValue[1] =1;
  //对应间隔
  keyValue[2] = v.delayTime>>8;
  keyValue[3] = v.delayTime & 0xff;
  //对应循环
  keyValue[4] = v.loop>>8;
  keyValue[5] = v.loop & 0xff;
  //数量
  keyValue[6] = v.keyDataCount>>8;
  keyValue[7] = v.keyDataCount & 0xff;

  var i = 0;
  for(let key in v.keyData)
  {
    for(var j=0;j<6;j++)
    {
      keyValue[8+i*6+j] = v.keyData[key].keyValue[j]
    }
    i++
  }
  sendKeyVale.keynumben = v.activeKey;
  sendKeyVale.data = keyValue;
  for(i=0;i<9;i++)
  {
    temp[i] = hand[i];
  }
  for(i=0;i<52;i++)
  {
    temp[i+9] = keyValue[i];
  }
  temp[6] = v.activeKey;
  cmdSend(temp, 1)
}  

export {
  getKeyboardUserPID,
  usbHidDataHandle,
  getKeyValue,
  getKeyboardFwV,
  updateKeyValueTarget,
}
