

import  { updateTargetButtonShow0,updateTargetButtonShow2,updateTargetButtonShow3,updateTargetButtonShow4, }from'./targetFunctionShowTool.js'
import { virtualKeyboardKeyShowStateSet} from '../virtuaKeyboardPages.js'
import { keyValueBuffTarget ,getActiveKeyNumbeTarget} from './virtuaKeyboardDataHandleTarget.js'
import { greatValueBoxButtonEvent} from './targetFunctionPage.js'
import { keyValueListSpecial } from '../keyValueDictionaries.js'
import { keyValueList } from '../keyValueDictionaries.js'
import { keyValueList2 } from '../keyValueDictionaries.js'
import { keyValueListMedia } from '../keyValueDictionaries.js'
import { keyValueListMouse } from '../keyValueDictionaries.js'
import { keyValueListMouseAndKey } from '../keyValueDictionaries.js'

//每次虚拟键盘的点击，会先更新数据，更新完成后会用这个接口更新宏功能框里面激活步骤的显示内容
function updateTargetButtonShow(doc)
{
  var buff = keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].keyValue;
  switch(buff[1])
  {
    case 0: updateTargetButtonShow0(doc); break;//普通键
    case 1: updateTargetButtonShow0(doc); break;//普通键
    case 2: updateTargetButtonShow2(doc); break;//媒体键
    case 3: updateTargetButtonShow3(doc); break;//鼠标
    case 4: updateTargetButtonShow4(doc); break;//鼠标加键盘
   
  }
}

//选中宏的某一个步骤的时候，跟据该步骤的内容，更新虚拟键盘的显示
function virtuaKeyboardShowUpdateByBUffTarget() {
var temp = keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].keyValue;
  if(temp[1] == 0x00)
  {
    for (var i = 3; i < 6; i++) {
      for (var key in keyValueList) {
        if (keyValueList[key] == temp[i]) {
          virtualKeyboardKeyShowStateSet(keyValueList2[key], 1);
        }
      }
    }
    for (var key in keyValueListSpecial) {
      if (keyValueListSpecial[key] & temp[2]) {
        virtualKeyboardKeyShowStateSet(keyValueList2[key], 1);
      }
    }
  }
  else if(temp[1] == 0x02)
  {
    for (var key in keyValueListMedia) {
      if (keyValueListMedia[key] == temp[2]) {
        console.log("virtualKeyboardKeyShowStateSet",keyValueList2[key])
        virtualKeyboardKeyShowStateSet(keyValueList2[key], 1);
      }
    }
  }
  else if(temp[1] == 0x03)
  {
    for (var key in keyValueListMouse) {
      if (keyValueListMouse[key] == temp[2]) {
        virtualKeyboardKeyShowStateSet(keyValueList2[key], 1);
      }
    }
  }
  else if(temp[1] == 0x04) //这里需要转换
  {
    
    var tempxx = virtuaKeyboardShowUpdateByBUffTarget4Handle(temp);
    console.log("temp",virtuaKeyboardShowUpdateByBUffTarget4Handle(temp))
    for (var key in keyValueListMouseAndKey) {
      if (keyValueListMouseAndKey[key] == tempxx) {
        virtualKeyboardKeyShowStateSet(keyValueList2[key], 1);
      }
    }
  }
}

//获取到HID数据，或者更新循环，更新延时的时候，更新整个大框，每一步的内容
function updateTargetButtonShowAll(doc)
{
  var temp = keyValueBuffTarget.activeButton;
  var delayMode = (keyValueBuffTarget.delayTime > 0);
  //清除所有数据
  if(  doc.getElementById('greatValueBoxID') == null) return ;
  doc.getElementById('greatValueBoxID').innerHTML = "";

  var i = 0;
  for(let key in keyValueBuffTarget.keyData)
  {
    var button = doc.createElement('button');
    button.className = 'greatValueButtonBox'
    button.id = key;
    button.innerText = ' ';
    button.addEventListener('click',greatValueBoxButtonEvent );
    doc.querySelector('#greatValueBoxID').appendChild(button);

    if(delayMode)
    {
        var delay = doc.createElement('button');
        delay.className = 'greatValueDelayBox'
        delay.innerText = keyValueBuffTarget.delayTime+"ms";
        delay.id = "delay"+ i; 
        doc.querySelector('#greatValueBoxID').appendChild(delay);
        var temp = keyValueBuffTarget.delayTime+"ms";
        delay.style.width = ((temp.length * 10) + 5) + "px"
    }
    i++
    keyValueBuffTarget.activeButton = key;
    updateTargetButtonShow(doc);
  }

  if(doc.getElementById('greatValueBoxID').innerHTML == "")
  {
    tagetBoxMessageCtrl(doc)
  }

  keyValueBuffTarget.activeButton = null;
}

//鼠标和键盘组合键的更新需要单独处理
function virtuaKeyboardShowUpdateByBUffTarget4Handle(v)
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

function tagetBoxMessageCtrl(doc)
{
  if(doc.getElementById('greatValueBoxID') == null) return ;
  if(getActiveKeyNumbeTarget()<9)
  {
    doc.getElementById('greatValueBoxID').innerHTML = "<div style = \"text-align:center; position: relative;left: 0px;top: 110px; color: #ccc2c2; \">点击添加开始设置宏功能</div>" 
  }
  else
  {
    doc.getElementById('greatValueBoxID').innerHTML = "" 
  }
  
}

function getTagetBoxMessageState(doc)
{
  var str = doc.getElementById('greatValueBoxID').innerHTML;
  if((str.indexOf("点击添加开始设置") == -1) || (str == null)||(str == ""))
    return 0;
  return 1;
}

export {
    virtuaKeyboardShowUpdateByBUffTarget,
    updateTargetButtonShowAll,
    updateTargetButtonShow,
    tagetBoxMessageCtrl,
    getTagetBoxMessageState,
  }
  