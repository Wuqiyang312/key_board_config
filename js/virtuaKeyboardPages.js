
//页面加载完成的时候初始化
var virtuaKeyboardPageDocment;
function virtuaKeyboardPagesInit(v) {
    virtuaKeyboardPageDocment = v;
    virtualKeyboardInit();
}
import { virtuaKeyboardValueBuffUpdate } from './virtuaKeyboardDataHandle.js'
import { KeyboardSetKeyValue } from './virtuaKeyboardDataHandle.js'
import { getFocusState } from './main.js'
import { rgbConfigStateGet } from './rgbConfig.js'
import { miniKeyGreatConfigVirtuaKeyboardHandle } from './targetFunction/targetFunction.js'

async function keyboardClickHandle(v) {
    if (hidCmd3DelayFlag > 0)   return; //还在100ms内，检测到小键盘输入
    if(getFocusState() == 0)    return ;//没有焦点
    if(rgbConfigStateGet())     return;// rgb配置中
    var tempVcode = v.code;
    if (tempVcode == "") {
        tempVcode = "Pause"
    }

    console.log("----------------------------------")

    var temp = miniKeyGreatConfigVirtuaKeyboardHandle(v);
    if(temp == null)
    {
        console.log("keyboardClickHandle",temp)
        temp = virtuaKeyboardValueBuffUpdate(v);   
        console.log("keyboardClickHandle 1",temp)
        if(temp == 3)
        {
            virtualKeyboardShowInit();
            virtuaKeyboardShowUpdateByBUff();
            KeyboardSetKeyValue();
            return 0;
        }
        if (temp > 1 && temp != 3) {
            return;
        }
        virtualKeyboardKeyShowStateSet("an_id_" + v.keyCode, 2);
        KeyboardSetKeyValue();
    }
    else
    {
        if(temp == 3)
        {
            return 0;
        }
        if (temp > 1 && temp != 3) {
            return;
        }
        virtualKeyboardKeyShowStateSet("an_id_" + v.keyCode, 2);
    }

}


//虚拟键盘键盘点击事件
function virtualKeyboardClickHand(v) {
    var kTemp = new Object();
    kTemp.keyCode = v.target.id.substring(6);
    kTemp.code = v.target.getAttribute("name");
    keyboardClickHandle(kTemp);
}
//更新整个虚拟键盘
function virtualKeyboardInit() {
    var idHand = "an_id_"

    for (var i = 1; i < 323; i++) {
        var that = virtuaKeyboardPageDocment.getElementById(idHand + i);
        if (that != null) {
            var tempId = '#' + that.id;
            var str = that.getAttribute('name') + ":" + "\"" + that.id + "\",";
            virtuaKeyboardPageDocment.querySelector(tempId).addEventListener('click', virtualKeyboardClickHand);
        }
    }
    virtuaKeyboardPageDocment.querySelector("#an_id_16_2").addEventListener('click', virtualKeyboardClickHand);
    virtuaKeyboardPageDocment.querySelector("#an_id_17_2").addEventListener('click', virtualKeyboardClickHand);
    virtuaKeyboardPageDocment.querySelector("#an_id_18_2").addEventListener('click', virtualKeyboardClickHand);
    virtuaKeyboardPageDocment.querySelector("#an_id_13_2").addEventListener('click', virtualKeyboardClickHand);

    if(virtuaKeyboardPageDocment.getElementById("an_id_314") == null)
    {
        virtuaKeyboardPageDocment.addEventListener('keyup', keyboardClickHandle);
    }


}

//虚拟键盘，清除选中显示，
function virtualKeyboardShowInit() {

    var idHand = "an_id_"
    for (var i = 1; i < 323; i++) {
        var that = virtuaKeyboardPageDocment.getElementById(idHand + i);
        if (that != null) {
            virtualKeyboardKeyShowStateSet(that.id, 0)
        }
    }
    virtualKeyboardKeyShowStateSet("an_id_16_2", 0)
    virtualKeyboardKeyShowStateSet("an_id_17_2", 0)
    virtualKeyboardKeyShowStateSet("an_id_18_2", 0)
    virtualKeyboardKeyShowStateSet("an_id_13_2", 0)
}

function virtualKeyboardKeyShowStateSet(id, v) {
    if (v == 0)//显示白色
    {
        virtuaKeyboardPageDocment.getElementById(id).style.background = "#ffffff";
    }
    else if (v == 1) {
        virtuaKeyboardPageDocment.getElementById(id).style.background = "red";
    }
    else//反转颜色
    {
        if (virtuaKeyboardPageDocment.getElementById(id).style.background == "red") {
            virtuaKeyboardPageDocment.getElementById(id).style.background = "#ffffff";
        }
        else {
            virtuaKeyboardPageDocment.getElementById(id).style.background = "red"
        }
    }
}

var hidCmd3DelayFlag = 0;
function hidCmd3DelayCallback() {
    if (hidCmd3DelayFlag > 0)
        hidCmd3DelayFlag--;
   // console.log("hidCmd3DelayCallback");
}

//被选中后的100ms内键盘输入不需要
function hidCmd3Delay() {
    hidCmd3DelayFlag++;
    setTimeout(hidCmd3DelayCallback, 100);
}

import { setActiveKeyNumbe } from './virtuaKeyboardDataHandle.js'
import { hidCmdDataHadle } from './virtuaKeyboardDataHandle.js'
import { virtuaKeyboardShowUpdateByBUff } from './virtuaKeyboardDataHandle.js'
import { knboShowState } from './miniKeyboard.js'
function virtuaKeyboardShowUpadte(v, d) {

    knboShowState(v);//是否展开
    setActiveKeyNumbe(v);
    hidCmdDataHadle(d);
    virtualKeyboardShowInit();
    virtuaKeyboardShowUpdateByBUff();
}

function tagetButtonText(v)
{
    virtuaKeyboardPageDocment.getElementById("greatFunctionButtonID").innerHTML = v;

}

export {
    virtualKeyboardKeyShowStateSet,
    virtualKeyboardShowInit,
    virtuaKeyboardPagesInit,
    hidCmd3Delay,
    virtuaKeyboardShowUpadte,
    keyboardClickHandle,
    tagetButtonText,
}

