//这里处理连接设备的页面逻辑

import { usbHidConnectDevice } from './usb/usb.js'

//点击都背景颜色不改变
var deviceConnectButtonClickState = 0;
var connectPageDocment = null;
//连接设置，按钮
function ConnectButtonOnmouseEvent(v)
{
    //console.log("tempClick",v.type);
    if(v.type == "mouseenter")
    {
        connectPageDocment.getElementById(v.target.id).style.background = "#f9a539";
    }
    if(v.type == "mouseleave")
    {
        if(deviceConnectButtonClickState != 1)
        connectPageDocment.getElementById(v.target.id).style.background = "#4d93db";
    }
    return ;
}

//连接键盘，或者断开键盘的处理
async function deviceConnectButton(v) {
    deviceConnectButtonClickState = 1;
    var temp = await usbHidConnectDevice()

    if(temp == 1)
    {
        connectPageDocment.getElementById(v.target.id).style.background = "#4d93db";
    }
    else
    {
        connectPageDocment.getElementById(v.target.id).style.background = "#4d93db";
    }
    deviceConnectButtonClickState = 0;
}

function windowsLoadConnectButton()
{
    connectPageDocment = document.getElementById("connectDevicePages").contentDocument;
    connectPageDocment.querySelector('#connectDevice').addEventListener('click', deviceConnectButton);
    connectPageDocment.querySelector('#connectDevice').addEventListener('mouseenter',ConnectButtonOnmouseEvent)
    connectPageDocment.querySelector('#connectDevice').addEventListener('mouseleave',ConnectButtonOnmouseEvent)
}

export {
    windowsLoadConnectButton,
}