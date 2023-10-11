

import { keyValueListSpecial } from '../keyValueDictionaries.js'
import { keyValueList } from '../keyValueDictionaries.js'
import { keyValueList2 } from '../keyValueDictionaries.js'
import { keyValueListMedia } from '../keyValueDictionaries.js'
import { keyValueListMouse } from '../keyValueDictionaries.js'
import { keyValueListMouseAndKey } from '../keyValueDictionaries.js'
import { updateKeyValueTarget } from '../usb/usbHidCmd.js'


/*
keyValueBuffTarget //某个按键的宏功能数据
keyValueBuffTarget.activeKey,这个按键的序号
keyValueBuffTarget.delaytTime,宏功能延时控制
keyValueBuffTarget.activeButton,宏功能框里，激活的步骤的ID
keyValueBuffTarget.loop,宏功能框里，激活的步骤的ID
keyValueBuffTarget.keyDataCount，宏功能步骤的总数，
keyValueBuffTarget.keyData,宏功能的每个步骤具体的数据，一个字典，key是步骤的ID，value是内容
keyValueBuffTarget.keyData[key].keyValue 具体的值
keyValueBuffTarget.keyData[key].count    普通按键的个数
*/
var keyValueBuffTarget = new Object();

function cleenActiveKeyNumbeTarget()
{
  keyValueBuffTarget.activeKey =0xff;
}

function setActiveKeyButtonTarget(v)
{
  keyValueBuffTarget.activeButton = v;
}

function getActiveKeyButtonTarget()
{
  return keyValueBuffTarget.activeButton;
}

function getActiveKeyNumbeTarget()
{
  return keyValueBuffTarget.activeKey;
}

function getActiveDeleteTimeTarget()
{
  return keyValueBuffTarget.delayTime;
}

function deleteKeyButtonDataTarget(v)
{
  delete keyValueBuffTarget.keyData[v];
  keyValueBuffTarget.keyDataCount --;
  updateDataToDevice();
}

function cleanKeyButtonDataTarget()
{
  keyValueBuffTarget.keyData = {};
  keyValueBuffTarget.keyDataCount = 0;
  keyValueBuffTarget.delayTime = 0;

  updateDataToDevice();
}

function setKeyButtonLoppTimeTarget(v)
{
  keyValueBuffTarget.loop = v;
  updateDataToDevice();
  console.log("setKeyButtonLoppTimeTarget");
}

function setKeyButtonDelyaTimeTarget(v)
{
  keyValueBuffTarget.delayTime = v;
  updateDataToDevice();
}

function setKeyButtonLoopNumberTarget(v)
{
  keyValueBuffTarget.loop = v;
  updateDataToDevice();
}

function getActiveKeykeyDataCountTarget()
{ 
  return keyValueBuffTarget.keyDataCount;
}

function targetKeyValueHandle(v)
{
  keyValueBuffTarget.activeKey = v;
  keyValueBuffTarget.activeButton = null;
  keyValueBuffTarget.keyDataCount = 0;
}

function keyValueBuffTargetAddNewValue(v)
{
  if(undefined == keyValueBuffTarget.keyData)
  {
    keyValueBuffTarget.keyData  = {};
    keyValueBuffTarget.keyDataCount  = 0;
  }
  keyValueBuffTarget.keyData[v] = {};
  keyValueBuffTarget.keyData[v].keyValue = [0,0,0,0,0,0]
  keyValueBuffTarget.keyData[v].activeButton = v;
  keyValueBuffTarget.keyData[v].count = 0;
  keyValueBuffTarget.keyDataCount++;

  updateDataToDevice();
}

import { virtuaKeyboardBuffCheck } from '../virtuaKeyboardDataHandle.js'
//计算count 值
function keyValueBuffTargetkeyDataCount(v)
{
  var count = 0;
  if(v[0] == 0x00)
  {
    for (var i = 0; i < 3; i++) 
    {
        if (virtuaKeyboardBuffCheck(v[i+3])) {
            count++; 
        }
    }
  }
  return count;
}
//HID数据直接写进buff里
function keyValueBuffTargetkeyDataWrite(v)
{
  
  keyValueBuffTarget.delayTime = v.delayTime;
  keyValueBuffTarget.activeKey = v.activeKey;
  keyValueBuffTarget.activeButton = null;
  keyValueBuffTarget.keyData = v.keyData;
  keyValueBuffTarget.keyDataCount = v.count;
  keyValueBuffTarget.loop = 0;
  for(let key in keyValueBuffTarget.keyData)
  {
    if(keyValueBuffTarget.keyData[key]!=undefined)
    {
      keyValueBuffTarget.keyData[key].count = keyValueBuffTargetkeyDataCount(keyValueBuffTarget.keyData[key].keyValue);
    }
  }
}
function keyValueBuffTargetDeleteValue(v)
{
  delete keyValueBuffTarget.keyData[v];
}

function virtuaKeyboardValueBuffUpdateTarget0(v) {
  var k = 0;
  var tempppK = 0;
  var tempValue = keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].keyValue;
  if(tempValue[1] != 0) //之前是别的按键 ,得告诉外面，要重新初始化界面
  {
    for(var i = 0;i<6;i++)
    {
      tempValue[i] = 0;
    }
    keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].count = 0;
    k =1 ;
  }
  for (var i = 3; i < 6; i++) {
    if (tempppK == 0) {
      if (tempValue[i] == keyValueList[v]) {
        if (i == 5) {
          tempValue[i] = 0;
        }
        else {
          tempValue[i] = tempValue[i + 1];
        }
        tempppK = 1;
      }
    }
    else {
      if (i < 5) {
        tempValue[i] = tempValue[i+1];
      }
      else {
        tempValue[5] = 0;
      }
    }
  }
  if (tempppK) {
    keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].count--;
    return 1;
  }

  if (keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].count >= 3) {
    alert("最多3个普通按键");
    return 2;
  }
  tempValue[3 + keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].count] = keyValueList[v];
  keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].count++;
  if(k) return 3;
  return 0;
}

function virtuaKeyboardValueBuffUpdateTarget1(v) {
  var k = 0;
  var tempValue = keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].keyValue;
  if(tempValue[1] != 0) //之前是别的按键 ,得告诉外面，要重新初始化界面
  {
    for(var i = 0;i<6;i++)
    {
      tempValue[i] = 0;
    }
    keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].count = 0;
    k =1 ;
  }

  if (tempValue[2] & keyValueListSpecial[v]) {
    tempValue[2] &= ~keyValueListSpecial[v];
    if(k) return 3;
    return 1;
  }
  else {
    tempValue[2] |= keyValueListSpecial[v];
  }
  if(k) return 3;
  return 0;
}

function virtuaKeyboardValueBuffUpdateTarget2(v) {
  console.log("virtuaKeyboardValueBuffUpdateTarget2");
  var tempValue = keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].keyValue;
  if(tempValue[1] != 2) //之前是别的按键 ,得告诉外面，要重新初始化界面
  {
    for(var i = 0;i<6;i++)
    {
      tempValue[i] = 0;
    }
    tempValue[1] = 2;
    keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].count = 0;
    tempValue[2]= 0xff;
  }
  console.log(v,keyValueListMedia[v])
  tempValue[2] = (tempValue[2] == keyValueListMedia[v])?0xff:keyValueListMedia[v];
  return 3;
}

function virtuaKeyboardValueBuffUpdateTarget3(v) {
  console.log("virtuaKeyboardValueBuffUpdateTarget3");
  var tempValue = keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].keyValue;
  if(tempValue[1] != 3) //之前是别的按键 ,得告诉外面，要重新初始化界面
  {
    for(var i = 0;i<6;i++)
    {
      tempValue[i] = 0;
    }
    tempValue[1] = 3;
    keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].count = 0;
    tempValue[2] = 0xff;
  }

  tempValue[2] = (tempValue[2] == keyValueListMouse[v])?0xff:keyValueListMouse[v];
  
  return 3;
}

//添加键盘鼠标组键的值，这里有bug
function virtuaKeyboardValueBuffUpdateTarget4(v) {
  console.log("virtuaKeyboardValueBuffUpdateTarget4",v);
  var tempValue = keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].keyValue;
  if(tempValue[1] != 4) //之前是别的按键 ,得告诉外面，要重新初始化界面
  {
    for(var i = 0;i<6;i++)
    {
      tempValue[i] = 0;
    }
    tempValue[1] = 4;
    keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].count = 0;
    tempValue[2] = 0xff;
  }
  var MouseValue = 0;
  var keyValue = 0;
  if(keyValueListMouseAndKey[v] < 4) MouseValue =1;
  else MouseValue = 0xff;

  console.log("keyValueListMouseAndKey[v]",keyValueListMouseAndKey[v])

  var i = 0;
  for (var key in keyValueListSpecial) {
    if(i == (keyValueListMouseAndKey[v] %4 ))
    {
      keyValue = keyValueListSpecial[key]
      console.log("keyValue",keyValue,key)
      break;
    }
    i++;
  }
  if(tempValue[2] == keyValue && tempValue[5] == MouseValue)
  {
    tempValue[2] = tempValue[3] = tempValue[4] = tempValue[5] = 0;
  }
  else
  {
    tempValue[2] = keyValue;
    tempValue[5] = MouseValue;
  }

  return 3;
}

import { keyValueClassify } from '../virtuaKeyboardDataHandle.js'
//0,正常添加，2，超过6个，1，之前有的，取消，3需要刷新,大于3，就是没有按键被选中
//虚拟键盘点击后，将值添加到对象里
function virtuaKeyboardValueBuffUpdateTarget(vk) {
  var v = vk.code;
  var type = keyValueClassify(v);
  switch (type) {
    case 0:
    {
        return virtuaKeyboardValueBuffUpdateTarget0(v)
    }
    case 1:
    {
        return virtuaKeyboardValueBuffUpdateTarget1(v);
    }
    case 2:
    {
        return virtuaKeyboardValueBuffUpdateTarget2(v)
    }
    case 3:
    {
        return virtuaKeyboardValueBuffUpdateTarget3(v);
    }
    case 4:
    {
        return virtuaKeyboardValueBuffUpdateTarget4(v);
    }
    default:
    {
        alert("无效输入");
        return 0xff;
    }
  }
}

//把数据更新给键盘
function updateDataToDevice()
{
  updateKeyValueTarget(keyValueBuffTarget);
  return ;
}



export {
  keyValueBuffTargetAddNewValue,
  keyValueBuffTargetDeleteValue,
  virtuaKeyboardValueBuffUpdateTarget,
  keyValueBuffTargetkeyDataWrite,
  targetKeyValueHandle,
  cleenActiveKeyNumbeTarget,
  keyValueBuffTarget,
  setActiveKeyButtonTarget,
  getActiveKeyButtonTarget,
  getActiveKeyNumbeTarget,
  getActiveKeykeyDataCountTarget,
  deleteKeyButtonDataTarget,
  cleanKeyButtonDataTarget,
  setKeyButtonDelyaTimeTarget,
  updateDataToDevice,
  setKeyButtonLoppTimeTarget,
  getActiveDeleteTimeTarget,
  setKeyButtonLoopNumberTarget,
}
