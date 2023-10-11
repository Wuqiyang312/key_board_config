import { getRgbConfig } from './rgbConfigDataHandle.js'
import { setColor } from './rgbConfigDataHandle.js'
import { setMode } from './rgbConfigDataHandle.js'

export {
    rgbConfigPagesInit,
    rgbConfigButton,
    rgbConfigViewUpdate,
    rgbConfigStateGet,
}

var rgbConfigPagesPageDocment;
function rgbConfigPagesInit(v) {
    rgbConfigPagesPageDocment = v;

    rgbConfigPagesPageDocment.querySelector('#rgbConfigMenuKey').addEventListener('click', rgbMenuSelect);
    rgbConfigPagesPageDocment.querySelector('#rgbConfigMenuBack').addEventListener('click', rgbMenuSelect);
    rgbConfigPagesPageDocment.querySelector('#rgbConfigMenuFree').addEventListener('click', rgbMenuSelect);

    rgbConfigPagesPageDocment.querySelector('#lightModeKey0').addEventListener('click', rgbMenuKeySelect);
    rgbConfigPagesPageDocment.querySelector('#lightModeKey1').addEventListener('click', rgbMenuKeySelect);
    rgbConfigPagesPageDocment.querySelector('#lightModeKey2').addEventListener('click', rgbMenuKeySelect);

    rgbConfigPagesPageDocment.querySelector('#lightModeBack0').addEventListener('click', rgbMenuBackSelect);
    rgbConfigPagesPageDocment.querySelector('#lightModeBack1').addEventListener('click', rgbMenuBackSelect);
    rgbConfigPagesPageDocment.querySelector('#lightModeBack2').addEventListener('click', rgbMenuBackSelect);
    rgbConfigPagesPageDocment.querySelector('#lightModeBack3').addEventListener('click', rgbMenuBackSelect);
    rgbConfigPagesPageDocment.querySelector('#lightModeBack4').addEventListener('click', rgbMenuBackSelect);

    rgbConfigPagesPageDocment.querySelector('#lightModeFree0').addEventListener('click', rgbMenuFreeSelect);
    rgbConfigPagesPageDocment.querySelector('#lightModeFree1').addEventListener('click', rgbMenuFreeSelect);
    rgbConfigPagesPageDocment.querySelector('#lightModeFree2').addEventListener('click', rgbMenuFreeSelect);

    rgbConfigPagesPageDocment.getElementById("color11").addEventListener('change', rgbConfigColorChange)
    rgbConfigPagesPageDocment.getElementById("color11").style.background = "#2e90f4";
    rgbConfigPagesPageDocment.getElementById('color12').addEventListener('change', rgbConfigColorChange)
    rgbConfigPagesPageDocment.getElementById("color12").style.background = "#2e90f4";
    rgbConfigPagesPageDocment.getElementById('color13').addEventListener('change', rgbConfigColorChange)
    rgbConfigPagesPageDocment.getElementById("color13").style.background = "#2e90f4";
    rgbConfigPagesPageDocment.getElementById('color14').addEventListener('change', rgbConfigColorChange)
    rgbConfigPagesPageDocment.getElementById("color14").style.background = "#2e90f4";

    rgbConfigPagesPageDocment.getElementById('freeTime').addEventListener('change',rgbConfigModeChange)
}

function rgbConfigModeChange(v)
{
    setMode(3,v.target.value);
    console.log("rgbConfigModeChange",v.target.id,v.target.value);
}

var RgbConfigState = 0;
function rgbConfigStateGet() {
    return RgbConfigState;
}
function rgbConfigButton(v) {
    if (v) {//切换RGB设置页
        getRgbConfig();
        RgbConfigState = 1;
    }
    else {
        RgbConfigState = 0;
    }
}

function onmouseEvent(v) {
    if (v.type == "mouseout") {
        rgbConfigPagesPageDocment.getElementById(v.target.id).style.background = "#ffffff";
    }
    if (v.type == "mouseover") {
        rgbConfigPagesPageDocment.getElementById(v.target.id).style.background = "#2e90f4";
    }
    return;
}

//颜色改变时候的回调
function rgbConfigColorChange(v) {
    var colorList = ["color1", "color2", "color3", "color4", "color5", "color6", "color7", "color8", "color9", "color10"];
    var i = 0;
    for (i = 0; i < 10; i++) {
        if (colorList[i] == v.target.id) break;
    }
    setColor(i, parseInt(v.target.value.substring(1), 16));
    if (i > 9) {
        rgbConfigPagesPageDocment.getElementById(v.target.id).style.display = "block"
        rgbConfigPagesPageDocment.getElementById("color11").value = v.target.value;
        rgbConfigPagesPageDocment.getElementById("color12").value = v.target.value;
        rgbConfigPagesPageDocment.getElementById("color13").value = v.target.value;
        rgbConfigPagesPageDocment.getElementById("color14").value = v.target.value;
    }
    console.log("rgbConfigColorChange ", v.target.id, v.target.value.substring(1));
}

function rgbSetPagesRgbColorInit11(v) {
    var color11 = (v[8] << 16) + (v[9] << 8) + v[10]; //原始值
    var colorS11 = color11.toString(16); //16进制值
    for (var j = 0; j < 6; j++) {        //补上00
        if (colorS11.length < 6) {
            colorS11 = "0" + colorS11;
        }
        else {
            break;
        }
    }
    colorS11 = "#" + colorS11;

    rgbConfigPagesPageDocment.getElementById("color11").value = colorS11;
    rgbConfigPagesPageDocment.getElementById("color12").value = colorS11;
    rgbConfigPagesPageDocment.getElementById("color13").value = colorS11;
    rgbConfigPagesPageDocment.getElementById("color14").value = colorS11;
}

function rgbSetPagesRgbColorInit0(v) {
    for (var i = 1; i < 11; i++) {
        var tempid = "color" + i;
        var color = (v[13 + (i - 1) * 3] << 16) + (v[14 + (i - 1) * 3] << 8) + v[15 + (i - 1) * 3];
        //console.log("rgbConfigViewUpdate ", i, color.toString(16));
        var colorS = color.toString(16);
        for (var j = 0; j < 6; j++) {
            if (colorS.length < 6) {
                colorS = "0" + colorS;
            }
            else {
                break;
            }
        }
        colorS = "#" + colorS;
        rgbConfigPagesPageDocment.getElementById(tempid).value = colorS;
        rgbConfigPagesPageDocment.getElementById(tempid).style.background = "#ffffff";
        rgbConfigPagesPageDocment.getElementById(tempid).addEventListener('change', rgbConfigColorChange)
        rgbConfigPagesPageDocment.getElementById(tempid).onmouseover = onmouseEvent;
        rgbConfigPagesPageDocment.getElementById(tempid).onmouseout = onmouseEvent;

    }
}

//收到当前RGB配置，更新界面，同时菜单定位到1
function rgbConfigViewUpdate(v) {

    rgbMenuKeyStateSet(v[6]);
    rgbMenuBackStateSet(v[7]);
    rgbMenuFreekStateSet(v[11])

    var select = rgbConfigPagesPageDocment.getElementById("freeTime");
    for (var k = 0; k < 5; k++) {
        if (select.options[k].value == v[7 + 3 + 2]) {
            select.options[k].selected = true;
        }
    }

    rgbSetPagesRgbColorInit11(v); //后面那一个
    rgbSetPagesRgbColorInit0(v); // 前面循环的10个

    var kTemp = new Object();
    kTemp.target = new Object();
    kTemp.target.id = "rgbConfigMenuKey";
    rgbMenuState = 0xff;
    rgbMenuSelect(kTemp);

}


//菜单选择
var rgbMenuState = 0;
async function rgbMenuSelect(v) {
    var modeList = ["rgbConfigMenuKey", "rgbConfigMenuBack", "rgbConfigMenuFree"];
    var LightmodeList = ["lightModeKey", "lightModeBack", "lightModeFree"];
    var i = 0;

    for (i = 0; i < 3; i++) {
        if (v.target.id == modeList[i]) break;
    }

    if (rgbMenuState == i) return;

    rgbConfigPagesPageDocment.getElementById("freeTimeSelect").style.display = "none"
    for (var k = 0; k < 3; k++) {
        rgbConfigPagesPageDocment.getElementById(modeList[k]).style.backgroundColor = "#eeeeee"
        rgbConfigPagesPageDocment.getElementById(LightmodeList[k]).style.display = "none"//显示虚拟键盘，
        rgbConfigPagesPageDocment.getElementById(modeList[k]).style.color = "#848484"
    }

    rgbConfigPagesPageDocment.getElementById("lightModeDvSpace1").style.backgroundColor = "#eeeeee"
    rgbConfigPagesPageDocment.getElementById("lightModeDvSpace2").style.backgroundColor = "#eeeeee"
    rgbMenuState = i;
    if (rgbMenuState == 0) {
        rgbConfigPagesPageDocment.getElementById("lightModeDvSpace2").style.backgroundColor = "#dfdddd"
    }
    if (rgbMenuState == 2) {
        rgbConfigPagesPageDocment.getElementById("lightModeDvSpace1").style.backgroundColor = "#dfdddd"
        rgbConfigPagesPageDocment.getElementById("freeTimeSelect").style.display = "block"
    }
    rgbConfigPagesPageDocment.getElementById(modeList[i]).style.backgroundColor = "#4d93db"
    rgbConfigPagesPageDocment.getElementById(modeList[i]).style.color = "#ffffff"
    rgbConfigPagesPageDocment.getElementById(LightmodeList[i]).style.display = "block"
    // i 0 1 2
    var tempMenu = [rgbMenuKeyState, rgbMenuBackState, rgbMenuFreeState]
    setMode(i, tempMenu[i]);

    console.log(v.target.id);
}


var rgbMenuKeyState = 0;
function rgbMenuKeyStateSet(v) {
    rgbMenuKeyState = v;
    for (var k = 0; k < 3; k++) {
        var temp = "lightModeKey" + k;
        rgbConfigPagesPageDocment.getElementById(temp).style.backgroundColor = "#d4d3d3"
        rgbConfigPagesPageDocment.getElementById(temp).style.borderColor = "#ffffff"
    }
    rgbConfigPagesPageDocment.getElementById("lightModeKey" + rgbMenuKeyState).style.backgroundColor = "#2e90f4"
    rgbConfigPagesPageDocment.getElementById("lightModeKey" + rgbMenuKeyState).style.borderColor = "#ff9000"

}
async function rgbMenuKeySelect(v) {//选择key Light 模式
    var i = 0;

    for (i = 0; i < 3; i++) {
        var temp = "lightModeKey" + i;
        if (v.target.id == temp) {
            break;
        }
    }

    if (rgbMenuKeyState == i) return;
    setMode(0, i);
    for (var k = 0; k < 3; k++) {
        var temp = "lightModeKey" + k;
        rgbConfigPagesPageDocment.getElementById(temp).style.backgroundColor = "#d4d3d3"
        rgbConfigPagesPageDocment.getElementById(temp).style.borderColor = "#ffffff"
    }

    rgbMenuKeyState = i;
    rgbConfigPagesPageDocment.getElementById("lightModeKey" + i).style.backgroundColor = "#2e90f4"
    rgbConfigPagesPageDocment.getElementById("lightModeKey" + i).style.borderColor = "#ff9000"
    console.log(v.target.id);
}

var rgbMenuBackState = 0;
function rgbMenuBackStateSet(v) {
    rgbMenuBackState = v;
    for (var k = 0; k < 5; k++) {
        var temp = "lightModeBack" + k;
        rgbConfigPagesPageDocment.getElementById(temp).style.backgroundColor = "#d4d3d3"
        rgbConfigPagesPageDocment.getElementById(temp).style.borderColor = "#ffffff"
    }

    if (rgbMenuBackState == 2) {
        rgbConfigPagesPageDocment.getElementById("color11").style.display = "block"

    }
    if (rgbMenuBackState == 4) {
        rgbConfigPagesPageDocment.getElementById("color12").style.display = "block"
    }

    console.log("lightModeBack" + rgbMenuBackState);
    rgbConfigPagesPageDocment.getElementById("lightModeBack" + rgbMenuBackState).style.backgroundColor = "#2e90f4"
    rgbConfigPagesPageDocment.getElementById("lightModeBack" + rgbMenuBackState).style.borderColor = "#ff9000"
}

async function rgbMenuBackSelect(v) {//选择背光 Light 模式
    var i = 0;
    console.log("rgbMenuBackSelect 1", v.target.id);
    if (v.target.id != "color11" && v.target.id != "color12") {
        rgbConfigPagesPageDocment.getElementById("color11").style.display = "none"
        rgbConfigPagesPageDocment.getElementById("color12").style.display = "none"
    }
    console.log("rgbMenuBackSelect 2", v.target.id);
    for (i = 0; i < 5; i++) {
        var temp = "lightModeBack" + i;
        if (v.target.id == temp) {
            break;
        }
    }
    console.log("rgbMenuBackSelect 3", v.target.id);
    if (i == 2) {
        rgbConfigPagesPageDocment.getElementById("color11").style.display = "block"
    }
    if (i == 4) {
        rgbConfigPagesPageDocment.getElementById("color12").style.display = "block"
    }
    console.log("rgbMenuBackSelect 5", v.target.id);
    if (i == 5) return;
    if (rgbMenuBackState == i) return;
    console.log("rgbMenuBackSelect 6", v.target.id);
    setMode(1, i);
    for (var k = 0; k < 5; k++) {
        var temp = "lightModeBack" + k;
        rgbConfigPagesPageDocment.getElementById(temp).style.backgroundColor = "#d4d3d3"
        rgbConfigPagesPageDocment.getElementById(temp).style.borderColor = "#ffffff"
    }
    console.log("rgbMenuBackSelect 7", v.target.id);
    rgbMenuBackState = i;
    rgbConfigPagesPageDocment.getElementById("lightModeBack" + i).style.backgroundColor = "#2e90f4"
    rgbConfigPagesPageDocment.getElementById("lightModeBack" + i).style.borderColor = "#ff9000"
    console.log("rgbMenuBackSelect 8", v.target.id);
    console.log(v.target.id);
}

var rgbMenuFreeState = 0;
function rgbMenuFreekStateSet(v) {
    rgbMenuFreeState = v;
    for (var k = 0; k < 3; k++) {
        var temp = "lightModeFree" + k;
        rgbConfigPagesPageDocment.getElementById(temp).style.backgroundColor = "#d4d3d3"
        rgbConfigPagesPageDocment.getElementById(temp).style.borderColor = "#ffffff"
    }
    if (rgbMenuFreeState == 1) {
        rgbConfigPagesPageDocment.getElementById("color13").style.display = "block"
    }
    if (rgbMenuFreeState == 2) {
        rgbConfigPagesPageDocment.getElementById("color14").style.display = "block"
    }
    console.log("rgbMenuFreeState", rgbMenuFreeState);
    rgbConfigPagesPageDocment.getElementById("lightModeFree" + rgbMenuFreeState).style.backgroundColor = "#2e90f4"
    rgbConfigPagesPageDocment.getElementById("lightModeFree" + rgbMenuFreeState).style.borderColor = "#ff9000"
}

async function rgbMenuFreeSelect(v) {//闲置模式 Light 模式
    var i = 0;
    if (v.target.id == "color13" || v.target.id == "color14") return;
    rgbConfigPagesPageDocment.getElementById("color13").style.display = ""
    rgbConfigPagesPageDocment.getElementById("color14").style.display = ""
    for (i = 0; i < 3; i++) {
        var temp = "lightModeFree" + i;
        if (v.target.id == temp) {
            break;
        }
    }
    if (i == 1) {
        rgbConfigPagesPageDocment.getElementById("color13").style.display = "block"
    }
    if (i == 2) {
        rgbConfigPagesPageDocment.getElementById("color14").style.display = "block"
    }
    if (rgbMenuFreeState == i) return;
    setMode(2, i);
    for (var k = 0; k < 3; k++) {
        var temp = "lightModeFree" + k;
        rgbConfigPagesPageDocment.getElementById(temp).style.backgroundColor = "#d4d3d3"
        rgbConfigPagesPageDocment.getElementById(temp).style.borderColor = "#ffffff"
    }

    rgbMenuFreeState = i;
    rgbConfigPagesPageDocment.getElementById("lightModeFree" + i).style.backgroundColor = "#2e90f4"
    rgbConfigPagesPageDocment.getElementById("lightModeFree" + i).style.borderColor = "#ff9000"
    console.log(v.target.id);
}

