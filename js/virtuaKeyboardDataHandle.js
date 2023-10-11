
import { keyValueList } from './keyValueDictionaries.js'
import { keyValueList2 } from './keyValueDictionaries.js'
import { keyValueListMedia } from './keyValueDictionaries.js'
import { keyValueListMouse } from './keyValueDictionaries.js'
import { keyValueListSpecial } from './keyValueDictionaries.js'
import { virtualKeyboardKeyShowStateSet } from './virtuaKeyboardPages.js'
import { keyValueListMouseAndKey } from './keyValueDictionaries.js'

var keyValueBuff = new Object();

function setActiveKeyNumbe(v) {
  keyValueBuff.active = v;
  keyValueBuff.count = 0;
  keyValueBuff.data = [0,0,0,0,0,0,0,0];
}

function cleenActiveKeyNumbe(v) {
  keyValueBuff.active = 0xff;
}

function getActiveKeyNumbe(v) {
  return keyValueBuff.active;
}


function virtuaKeyboardBuffCheck(v) {
  for (var key in keyValueList) {
    if (keyValueList[key] == v) {
      return 1;
    }
  }
  return 0;
}

function hidCmdDataHadle(v) {
  keyValueBuff.count = 0;
  keyValueBuff.data = new Array();
  var k = 0;

  if(v[1] == 0x00)
  {
    for (var i = 0; i < 8; i++) {
      if (i > 1 && v[i] != 0) {
        if (k == 0) {
          if (virtuaKeyboardBuffCheck(v[i])) {
            keyValueBuff.count++;
            keyValueBuff.data[i] = v[i];
          }
          else {
            k = 1;
            keyValueBuff.data[i] = 0;
          }
        }
        else {
          keyValueBuff.data[i] = 0;
        }
      }
      else {
        keyValueBuff.data[i] = v[i];
      }
    }
  }
  else
  {
    for (var i = 0; i < 8; i++) {
      keyValueBuff.data[i] = v[i];
    }
  }
  //console.log("hidCmdDataHadle", keyValueBuff.count);
}

//鼠标和键盘组合键的更新需要单独处理
function virtuaKeyboardShowUpdateByBUff4Handle(v)
{
  var i = 0;
  for (var key in keyValueListSpecial) {
    if(keyValueListSpecial[key] == v[2])
    {
      break;
    }
    i++;
  }

  if(v[5] > 1)
  {
    i+=4;
  }
  return i;
}


function virtuaKeyboardShowUpdateByBUff() {
  if(keyValueBuff.data[1] == 0x00)
  {
    for (var i = 0; i < 6; i++) {
      for (var key in keyValueList) {
        if (keyValueList[key] == keyValueBuff.data[i + 2]) {
          virtualKeyboardKeyShowStateSet(keyValueList2[key], 2);
        }
      }
    }
    for (var key in keyValueListSpecial) {
      if (keyValueListSpecial[key] & keyValueBuff.data[0]) {
        virtualKeyboardKeyShowStateSet(keyValueList2[key], 2);
      }
    }
  }
  else if(keyValueBuff.data[1] == 0x02)
  {
    for (var key in keyValueListMedia) {
      if (keyValueListMedia[key] == keyValueBuff.data[2]) {
        virtualKeyboardKeyShowStateSet(keyValueList2[key], 2);
      }
    }
  }
  else if(keyValueBuff.data[1] == 0x03)
  {
    for (var key in keyValueListMouse) {
      if (keyValueListMouse[key] == keyValueBuff.data[2]) {
        virtualKeyboardKeyShowStateSet(keyValueList2[key], 2);
      }
    }
  }
  else if(keyValueBuff.data[1] == 0x04)
  {
    var tempxx = virtuaKeyboardShowUpdateByBUff4Handle(keyValueBuff.data);
    for (var key in keyValueListMouseAndKey) {
      if (keyValueListMouseAndKey[key] == tempxx) {
        virtualKeyboardKeyShowStateSet(keyValueList2[key], 1);
      }
    }
  }

}

function keyValueClassify(v) {
  
  if (keyValueList[v] != undefined) return 0;               //普通按键
  if (keyValueListSpecial[v] != undefined) return 1;        //特殊按键 
  if (keyValueListMedia[v] != undefined) return 2;          //多媒体键
  if (keyValueListMouse[v] != undefined) return 3;          //鼠标体键
  if (keyValueListMouseAndKey[v] != undefined) return 4;    //鼠标键盘组合键
  
  return 0xff;
}

function virtuaKeyboardValueBuffUpdate0(v) {
  var k = 0;
  var tempppK = 0;
  if(keyValueBuff.data[1] != 0) //之前是别的按键 ,得告诉外面，要重新初始化界面
  {
    for(var i = 0;i<8;i++)
    {
      keyValueBuff.data[i] = 0;
    }
    keyValueBuff.count = 0;
    k =1 ;
  }
  for (var i = 0; i < 6; i++) {
    if (tempppK == 0) {
      if (keyValueBuff.data[i + 2] == keyValueList[v]) {
        if (i == 5) {
          keyValueBuff.data[i + 2] = 0;
        }
        else {
          keyValueBuff.data[i + 2] = keyValueBuff.data[i + 3];
        }
        tempppK = 1;
      }
    }
    else {
      if (i < 5) {
        keyValueBuff.data[i + 2] = keyValueBuff.data[i + 3];
      }
      else {
        keyValueBuff.data[7] = 0;
      }
    }
  }
  if (tempppK) {
    keyValueBuff.count--;
    return 1;
  }

  if (keyValueBuff.count >= 6) {
    alert("最多6个普通按键");
    return 2;
  }

  keyValueBuff.data[2 + keyValueBuff.count] = keyValueList[v];
  keyValueBuff.count++;
  if(k) return 3;
  return 0;
}

function virtuaKeyboardValueBuffUpdate1(v) {
  var k = 0;
  if(keyValueBuff.data[1] != 0) //之前是别的按键 ,得告诉外面，要重新初始化界面
  {
    for(var i = 0;i<8;i++)
    {
      keyValueBuff.data[i] = 0;
    }
    keyValueBuff.count = 0;
    k = 1;
  }

  if (keyValueBuff.data[0] & keyValueListSpecial[v]) {
    keyValueBuff.data[0] &= ~keyValueListSpecial[v];
    if(k) return 3;
    return 1;
  }
  else {
    keyValueBuff.data[0] |= keyValueListSpecial[v];
  }
  if(k) return 3;
  return 0;
}

function virtuaKeyboardValueBuffUpdate2(v) {
  var k = 0;
  if(keyValueBuff.data[1] != 2) //之前是别的按键 ,得告诉外面，要重新初始化界面
  {
    for(var i = 0;i<8;i++)
    {
      keyValueBuff.data[i] = 0;
    }
    keyValueBuff.data[1] = 2;
    keyValueBuff.count = 0;
    keyValueBuff.data[2] = 0xff;
    k = 1;
  }
  keyValueBuff.data[2] = (keyValueBuff.data[2] == keyValueListMedia[v])?0xff:keyValueListMedia[v];
  return 3;
}

function virtuaKeyboardValueBuffUpdate3(v) {
  var k = 0;
  if(keyValueBuff.data[1] != 3) //之前是别的按键 ,得告诉外面，要重新初始化界面
  {
    for(var i = 0;i<8;i++)
    {
      keyValueBuff.data[i] = 0;
    }
    keyValueBuff.data[1] = 3;
    keyValueBuff.count = 0;
    keyValueBuff.data[2] = 0xff;
    k = 1;
  }
  keyValueBuff.data[2] = (keyValueBuff.data[2] == keyValueListMouse[v])?0xff:keyValueListMouse[v];
  return 3;
}

function virtuaKeyboardValueBuffUpdate4(v) {
  var k = 0;
  if(keyValueBuff.data[1] != 4) //之前是别的按键 ,得告诉外面，要重新初始化界面
  {
    for(var i = 0;i<8;i++)
    {
      keyValueBuff.data[i] = 0;
    }
    keyValueBuff.data[1] = 4;
    keyValueBuff.count = 0;
    keyValueBuff.data[2] = 0xff;
    k = 1;
  }

  var MouseValue = 0;
  var keyValue = 0;
  if(keyValueListMouseAndKey[v] < 4) MouseValue =1;
  else MouseValue = 0xff;

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

  if(keyValueBuff.data[2] == keyValue && keyValueBuff.data[5] == MouseValue)
  {
    keyValueBuff.data[2] = keyValueBuff.data[3] = keyValueBuff.data[4] = keyValueBuff.data[5] = 0;
  }
  else
  {
    keyValueBuff.data[2] = keyValue;
    keyValueBuff.data[5] = MouseValue;
  }


  return 3;
}


//0,正常添加，2，超过6个，1，之前有的，取消，3需要刷新,大于3，就是没有按键被选中
function virtuaKeyboardValueBuffUpdate(vk) {
  var v = vk.code;
  console.log("virtuaKeyboardValueBuffUpdate",keyValueBuff.active)
  if (keyValueBuff.active > 15)  return 0xff;//没有按键被选中
  var type = keyValueClassify(v);

  console.log("keyValueClassify",type);

  switch (type) {
    case 0:
    {
        return virtuaKeyboardValueBuffUpdate0(v)
    }
    case 1:
    {

        return virtuaKeyboardValueBuffUpdate1(v);
    }
    case 2:
    {
        return virtuaKeyboardValueBuffUpdate2(v)
    }
    case 3:
    {
        return virtuaKeyboardValueBuffUpdate3(v);
    }

    case 4:
    {
        return virtuaKeyboardValueBuffUpdate4(v);
    }

    default:
    {
        alert("无效输入");
        return 0xff;
    }
  }
}
import { cmdSend } from './usb/usb.js'

//获取缓存数，设置到键盘里
async function KeyboardSetKeyValue() {
  let temp = new Uint8Array([0x55, 0xaa, 0x00, 0x09, 0x00, 0x82, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  temp[6] = keyValueBuff.active
  for (var i = 0; i < 8; i++) {
    temp[i + 7] = keyValueBuff.data[i];
  }
  cmdSend(temp, 1)
}



export {
  setActiveKeyNumbe,
  hidCmdDataHadle,
  virtuaKeyboardShowUpdateByBUff,
  virtuaKeyboardValueBuffUpdate,
  KeyboardSetKeyValue,
  cleenActiveKeyNumbe,
  keyValueClassify,
  virtuaKeyboardBuffCheck,
  getActiveKeyNumbe,
}
