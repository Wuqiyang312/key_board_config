
import { windowsLoadConnectButton } from './connectDevicePage.js'
import { minikeySelectHandle ,KnboKeyShowCtrl } from './miniKeyboard.js'
import { miniKeyPagesInit } from './miniKeyboard.js'
import { keyButtonMouseHandle } from './miniKeyboard.js'
import { virtuaKeyboardPagesInit } from './virtuaKeyboardPages.js'
import { keyboardClickHandle } from './virtuaKeyboardPages.js'
import { rgbConfigPagesInit } from './rgbConfig.js'
import { rgbConfigButton } from './rgbConfig.js'
import { usbDeviceInit } from './usb/usb.js'
import { getKeyboardFwV } from './usb/usbHidCmd.js'
import { delayInputChage } from './targetFunction/targetFunctionPage.js'



 
//这个是按键被选中的回调
window.minikeySelectHandleFunction = minikeySelectHandle;
window.minikeyButtonMouseFunction = keyButtonMouseHandle;
window.keySetPagesInitFunction = keySetPagesInit;
window.rgbConfigButtonFunction = rgbConfigButton;
window.getKeyboardFwVFunction = getKeyboardFwV;
window.targetDelayInputChage = delayInputChage;
window.KnboKeyShowCtrl = KnboKeyShowCtrl;

function keySetPagesInit(d1,d2,RGBv)
{
  miniKeyPagesInit(d1);
  virtuaKeyboardPagesInit(d2)

  if(d2.getElementById("an_id_314") == null)
  {
    document.addEventListener('keyup', keyboardClickHandle);
  }
  
  if(RGBv != null)
    rgbConfigPagesInit(RGBv)
}

//页面加载完成
window.onload = function () {
    console.log("onload");

    if(navigator.hid == null)
    {
      document.getElementById("message").style.display = "block"
    }
    else
    {
      usbDeviceInit();
      document.getElementById("connectDevicePages").style.display = "block"
      windowsLoadConnectButton();
    }
    
}

var focusState = 0; 
var focusStateKeyV = 1;
var focusStateVirtualKeyV = 0;

function getFocusState() {
  //console.log("getFocusState test ", focusState , focusStateKeyV ,focusStateVirtualKeyV);
  return focusState | focusStateKeyV |focusStateVirtualKeyV;
}

//当前窗口得到焦点 
window.onfocus = function () {
  //console.log("onfocus")
  focusState = 1;
};

//当前窗口失去焦点 
window.onblur = function () {
  //console.log("onblur")
  focusState = 0;
};

window.focusStateKey = function (v) { 
  //console.log("focusStateKey ",v)
  focusStateKeyV = v;
}
 
window.focusStateVirtualKey = function (v) {
  //console.log("focusStateVirtualKey ",v)
  focusStateVirtualKeyV = v;
}

export { 
  getFocusState,
  keySetPagesInit,
}