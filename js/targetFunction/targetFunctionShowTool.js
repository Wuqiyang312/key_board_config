import { keyValueBuffTarget } from './virtuaKeyboardDataHandleTarget.js'
import { keyValueListSpecial } from '../keyValueDictionaries.js'
import { keyValueList } from '../keyValueDictionaries.js'
import { keyValueListMedia } from '../keyValueDictionaries.js'
import { keyValueListMouse } from '../keyValueDictionaries.js'
import { keyValueListMouseAndKey } from '../keyValueDictionaries.js'
import { keyValueListShortName } from '../keyValueDictionaries.js'

//更新某个步骤的显示内容，普通键盘
function updateTargetButtonShow0(doc)
{
  var temp = null;
  var tempValue = keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].keyValue;
  var i= 0;

  for(let key in keyValueListSpecial)
  {
    if(tempValue[2] & (1<<i))
    {
      var name = keyValueListShortName[key];
      if(temp != null)
      {
        temp += '+';
        temp += name;   
      }
      else
      {
        temp = name;
      }
    }
    i++;
  }
  for(var j = 3;j<6;j++)
  {

    for(let key in keyValueList)
    {
      if(tempValue[j] == keyValueList[key])
      {
        var name = null;
        if(keyValueListShortName[key] != undefined) name = keyValueListShortName[key] ;
        else name = key

        if(temp != null)
        {
          temp += ' + ';
          temp += name;   
        }
        else
        {
          temp = name;
        }
        break;     
      }
    }
  } 
  updateActiveButtonShow(doc,temp)
}

//更新某个步骤的显示内容，媒体键
function updateTargetButtonShow2(doc)
{
  var temp = null;
  var tempValue = keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].keyValue;
  for (var key in keyValueListMedia) {
    if (keyValueListMedia[key] == tempValue[2]) {
      var name = null;
      if(keyValueListShortName[key] != undefined) name = keyValueListShortName[key] ;
      else name = key
      if(temp != null)
      {
        temp += ' + ';
        temp += name;   
      }
      else
      {
        temp = name;
      }
    }
  }
  updateActiveButtonShow(doc,temp)
}

//更新某个步骤的显示内容，鼠标键
function updateTargetButtonShow3(doc)
{
  var temp = null;
  var tempValue = keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].keyValue;
  for (var key in keyValueListMouse) {
    if (keyValueListMouse[key] == tempValue[2]) {
      var name = null;
      if(keyValueListShortName[key] != undefined) name = keyValueListShortName[key] ;
      else name = key
      if(temp != null)
      {
        temp += ' + ';
        temp += name;   
      }
      else
      {
        temp = name;
      }
    }
  }
  updateActiveButtonShow(doc,temp)
}

//更新某个步骤的显示内容，键盘加鼠标组合键
function updateTargetButtonShow4(doc)
{
  var temp = null;
  var tempValue = keyValueBuffTarget.keyData[keyValueBuffTarget.activeButton].keyValue;
  var tempxx = MouseAndKeyValueHandle(tempValue);
  for (var key in keyValueListMouseAndKey) {
    if (keyValueListMouseAndKey[key] == tempxx) {
      var name = null;
      console.log(key);
      if(keyValueListShortName[key] != undefined) name = keyValueListShortName[key];
      else name = key
      if(temp != null)
      {
        temp += ' + ';
        temp += name;   
      }
      else
      {
        temp = name;
      }
      break;
    }
  }
  updateActiveButtonShow(doc,temp)
}

//根据显示内容，计算宽度
function getTextWidth(text, font) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d"); 
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
  }
   
  //更新某个步骤的显示内容
  function updateActiveButtonShow(doc,temp)
  {
    if(temp == null)
    {
      doc.getElementById(keyValueBuffTarget.activeButton).innerHTML = "空"
      doc.getElementById(keyValueBuffTarget.activeButton).style.width = "35px"
    }
    else
    {
      doc.getElementById(keyValueBuffTarget.activeButton).innerHTML = temp
      var len = (getTextWidth(temp, "25px arial") + 20) +"px";
      doc.getElementById(keyValueBuffTarget.activeButton).style.width = len
    }
  }
  
//鼠标加键盘值对应字典值，鼠标键盘组合特殊，需要转换
function MouseAndKeyValueHandle(v)
{
  if(v[2] == 0)
  {
    if(v[5] > 0X80)
    {
      return 9;
    }
    else
    {
      return 8;
    }
  }
  else
  {
    var i = 0;
    for(let key in keyValueListSpecial)
    {
      if(v[2] & (1<<i))
      {
        if(i>3) i-=4;
        break;
      }
      i++;
    }

    if(v[5] > 0X80) i+=4;
    return i;
  }
}

export{
  updateTargetButtonShow0,
  updateTargetButtonShow2,
  updateTargetButtonShow3,
  updateTargetButtonShow4,
}