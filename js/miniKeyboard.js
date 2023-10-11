import { getKeyValue } from './usb/usbHidCmd.js'
import { virtualKeyboardShowInit } from './virtuaKeyboardPages.js'
import { cleenActiveKeyNumbe } from './virtuaKeyboardDataHandle.js'
import { cleenActiveKeyNumbeTarget } from './targetFunction/virtuaKeyboardDataHandleTarget.js'
import { keyboardClickHandle } from './virtuaKeyboardPages.js'
import { miniKeyGreatPagesInit ,greatValueBoxInit } from './targetFunction/targetFunctionPage.js'


var miniKeyPagesPageDocment;


function knboShowState(v)
{
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",v)

    if(miniKeyPagesPageDocment.getElementById("knboShowCtrl") == null) return ;
    if(miniKeyPagesPageDocment.getElementById("knboShowCtrl2") == null) //一个旋钮
    {
        if(v >2)  miniKeyPagesPageDocment.getElementById("knboShowCtrl").style.display  = "block"
        else miniKeyPagesPageDocment.getElementById("knboShowCtrl").style.display  = "none"
    }
    else //两个旋钮
    {
        if(v == 9 || v == 11 || v == 12)  
        {
            miniKeyPagesPageDocment.getElementById("knboShowCtrl").style.display  = "block"
            miniKeyPagesPageDocment.getElementById("knboShowCtrl2").style.display  = "none"
        }
        else  if(v == 10 || v == 13 || v == 14)  
        {
            miniKeyPagesPageDocment.getElementById("knboShowCtrl2").style.display  = "block"
            miniKeyPagesPageDocment.getElementById("knboShowCtrl").style.display  = "none"
        }
        else
        {
            miniKeyPagesPageDocment.getElementById("knboShowCtrl2").style.display  = "none"
            miniKeyPagesPageDocment.getElementById("knboShowCtrl").style.display  = "none"
        }
    }

}

var miniKeyNameBack = [null,null,null,null,null,null,null,null,null,null]
function miniKeyPagesInit(v) {
    miniKeyPagesPageDocment = v;
    miniKeyGreatPagesInit(v);
    cleenActiveKeyNumbe();
    cleenActiveKeyNumbeTarget();
    for (var i = 1; i < 16; i++) {
        var temp = "key" + i;
        if (miniKeyPagesPageDocment.getElementById(temp) != null) {
            miniKeyNameBack[i-1] = miniKeyPagesPageDocment.getElementById(temp).innerHTML;
        }
        else {
            break;
        }
    }

}

//宏功能控制按钮，旋钮的3个选项
function KnboKeyShowCtrl(v)
{
    //把所有的小按键回复到初始状态
    var i = 0;
    for (i = 1; i < 16; i++) {
        var temp = "key" + i;
        if (miniKeyPagesPageDocment.getElementById(temp) != null) {
            miniKeyPagesPageDocment.getElementById(temp).style.background = "#000000";
            miniKeyPagesPageDocment.getElementById(temp).innerHTML = miniKeyNameBack[i-1];
        }
        else {
            break;
        }
    }

    oldID = null;
    virtualKeyboardShowInit();
    cleenActiveKeyNumbe();
    cleenActiveKeyNumbeTarget();
    greatValueBoxInit();


    var temp = "knboShowCtrl"
    var temp2 = "knboShowCtrl"

    if(v.target.id != "knbo")
    {
        if(v.target.id == "knbo1") 
        {
            temp = "knboShowCtrl";
            temp2 = "knboShowCtrl2";
        }
        else
        {
            temp2 = "knboShowCtrl";
            temp = "knboShowCtrl2";
        }
    }

    if(miniKeyPagesPageDocment.getElementById(temp).style.display != "block")
    {
        miniKeyPagesPageDocment.getElementById(temp).style.display  = "block"
        if(v.target.id != "knbo")
        {
            miniKeyPagesPageDocment.getElementById(temp2).style.display  = "none"
        }
    }
    else
    {
        miniKeyPagesPageDocment.getElementById(temp).style.display  = "none"
    }
}

//把所有的小按键回复到初始状态
function minikeyButtonInit(v) {
    var i = 0;
    var number = 0;
    for (i = 1; i < 16; i++) {
        var temp = "key" + i;
        //console.log("v.target.id",v.target.id,temp,number);
        if (v.target.id == temp) 
        {
            number = i - 1;
        }
        if (miniKeyPagesPageDocment.getElementById(temp) != null) {
            miniKeyPagesPageDocment.getElementById(temp).style.background = "#000000";
            miniKeyPagesPageDocment.getElementById(temp).innerHTML = miniKeyNameBack[i-1];
        }
        else {
            break;
        }
    }

    if(miniKeyPagesPageDocment.getElementById("greatFunctionConfigBoxID") == null)
    {
        miniKeyPagesPageDocment.addEventListener('keyup', keyboardClickHandle);
    }

    
    return number
}

//迷你小键盘被选中调用这个接口
import { rgbConfigStateGet } from './rgbConfig.js'
var oldID = null;
async function minikeySelectHandle(v) {
    if(rgbConfigStateGet()) return ;
    
    var activationKeyNumber = minikeyButtonInit(v); 
    if (v.target.id != oldID) {
        miniKeyPagesPageDocment.getElementById(v.target.id).style.background = 'red';
        miniKeyPagesPageDocment.getElementById(v.target.id).innerHTML = "确定 ";
        oldID = v.target.id;
        getKeyValue(activationKeyNumber);
    }
    else {
        oldID = null;
        virtualKeyboardShowInit();
        cleenActiveKeyNumbe();
        cleenActiveKeyNumbeTarget();
        greatValueBoxInit();
        
    }
}

function keyButtonMouseHandle(v) {
    if (v.type == "mouseenter") {
        miniKeyPagesPageDocment.getElementById(v.target.id).style.borderColor = "#f9a539"
    }
    if (v.type == "mouseleave") {
        miniKeyPagesPageDocment.getElementById(v.target.id).style.borderColor = "#c0c0c0"
    }
}

export {
    minikeySelectHandle,
    miniKeyPagesInit,
    keyButtonMouseHandle,
    KnboKeyShowCtrl,
    knboShowState,
}