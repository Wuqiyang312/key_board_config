import { virtualKeyboardShowInit } from '../virtuaKeyboardPages.js'
import { tagetButtonText } from '../virtuaKeyboardPages.js'
import { tagetBoxMessageCtrl,getTagetBoxMessageState } from './targetFunctionShow.js'

import 
{ 
    deleteKeyButtonDataTarget,
    keyValueBuffTargetDeleteValue,
    keyValueBuffTargetAddNewValue,
    setActiveKeyButtonTarget ,
    getActiveKeyButtonTarget,
    getActiveKeyNumbeTarget,
    getActiveKeykeyDataCountTarget,
    cleanKeyButtonDataTarget,
    setKeyButtonDelyaTimeTarget,
    setKeyButtonLoppTimeTarget,
    getActiveDeleteTimeTarget,
    setKeyButtonLoopNumberTarget,
} from './virtuaKeyboardDataHandleTarget.js'
import { updateTargetButtonShow,updateTargetButtonShowAll,virtuaKeyboardShowUpdateByBUffTarget } from './targetFunctionShow.js'


var toolForm = null;
var delayList = null;
var loopNuberInput =null;
var delayInput =null;

window.miniKeyPagesPageGreatDocment = null;

function miniKeyGreatPagesInit(v) {

    miniKeyPagesPageGreatDocment = v;
    if(miniKeyPagesPageGreatDocment.getElementById("greatKey1") != null)
    {
        miniKeyPagesPageGreatDocment.querySelector('#greatKey1').addEventListener('click', greatValueBoxButtonAdd);
        miniKeyPagesPageGreatDocment.querySelector('#greatKey2').addEventListener('click', greatValueBoxButtonDelete);
        miniKeyPagesPageGreatDocment.querySelector('#greatKey3').addEventListener('click', greatValueBoxButtonClean);

        toolForm = miniKeyPagesPageGreatDocment.getElementById("toolForm");
        toolForm.onchange = toolFormOnchange;
        loopNuberInput = miniKeyPagesPageGreatDocment.getElementById("loopNuberInputID");
        loopNuberInput.oninput = loopNuberInputOninput;
    
        delayList=miniKeyPagesPageGreatDocment.getElementById("delayList");
        delayList.onchange = delayListOnchange;
        delayInput = miniKeyPagesPageGreatDocment.getElementById("delayInputID");
        delayInput.oninput = delayInputOninput;
    }

}


//获取单选框的值 延时
var delayMode = 0;
function delayListOnchange() {

    if(getActiveKeyNumbeTarget()==0xff) 
    {
        alert("请先选中一个按键");
        delayListWrite(0);
        return 0;
    }

    const tools = miniKeyPagesPageGreatDocment.getElementsByName("delay");
    for (let i = 0; i <tools.length ; i++) {
        if(tools[i].checked) 
        {
            if(delayMode != tools[i].value)
            {
                delayMode = tools[i].value
                console.log("delayMode",delayMode);
                if(tools[i].value == 1)
                {
                    miniKeyPagesPageGreatDocment.getElementById("delayID").style.display  = "block"
                    miniKeyPagesPageGreatDocment.getElementById("delayInputID").value = "10"
                    setKeyButtonDelyaTimeTarget(10);
                }
                else
                {
                    miniKeyPagesPageGreatDocment.getElementById("delayID").style.display  = "none"
                    setKeyButtonDelyaTimeTarget(0);
                }
            }
        }
    }
    updateTargetButtonShowAll(miniKeyPagesPageGreatDocment);
}
//手动更新延时时间框的内容
function delayListWrite(t)
{
    if(t != 0) delayMode = 1;
    else  delayMode = 0;
    const tools = miniKeyPagesPageGreatDocment.getElementsByName("delay");
    for (let i = 0; i <tools.length ; i++) {
        tools[i].checked = false;
        if(i == delayMode) 
        {
            tools[i].checked = true;
            if(tools[i].value == 1)
            {
                miniKeyPagesPageGreatDocment.getElementById("delayID").style.display  = "block"
                miniKeyPagesPageGreatDocment.getElementById("delayInputID").value = ""+t;
            }
            else
            {
                miniKeyPagesPageGreatDocment.getElementById("delayID").style.display  = "none"
            }
        }
    }
}

//延时输入框
function delayInputChage(v)
{//手动更新限时值得时候，需要更新这个延时时间
    setKeyButtonDelyaTimeTarget(v);
}

//判断输入合法性，并更新延时时间变量
var delayInputOld = null
function delayInputOninput (v){
    var temp = miniKeyPagesPageGreatDocment.getElementById("delayInputID").value;
    if(temp == delayInputOld) return ;
    delayInputOld = temp;
    if(miniKeyPagesPageGreatDocment.getElementById("delayInputID").value == null) return;
    var delayTime = 0;

    if(isNaN(Number(temp,10)) == false && (temp.indexOf(".") == -1))    
    {
        delayTime = parseInt(temp)
        if(delayTime > 50000 || delayTime == 0)
        {
            delayTime = 10;
            miniKeyPagesPageGreatDocment.getElementById("delayInputID").value = "10";
            
            alert("请输入1-50000数字");
        }
    }
    else
    {
        delayTime  = 10;
        miniKeyPagesPageGreatDocment.getElementById("delayInputID").value = "10";
        alert("请输入1-50000数字");
    }
    setKeyButtonDelyaTimeTarget(delayTime); 
    updateTargetButtonShowAll(miniKeyPagesPageGreatDocment);
    console.log("delayInputOninput 2,",temp,delayTime);
}
//---------------------------------------------------------------延时框结束

//---------------------------------------------------------------循环框开始
//获取单选框的值 循环
function toolFormOnchange(){
    if(getActiveKeyNumbeTarget()==0xff) 
    {
        loopListWrite();
        alert("请先选中一个按键");
        return 0;
    }
    const tools = miniKeyPagesPageGreatDocment.getElementsByName("loop");
    for (let i = 0; i <tools.length ; i++) {
        if(tools[i].checked) 
        {
          console.log("tools[i].checked",i,tools[i].value)
          if(tools[i].value == '1')
          {//无限循环
            miniKeyPagesPageGreatDocment.getElementById("loopNumberID").style.display  = "none"
            setKeyButtonLoppTimeTarget(1)
            loopMode =1;
          }
          else if(tools[i].value == '2')
          {
            var temp = miniKeyPagesPageGreatDocment.getElementById("loopNuberInputID").value;
            var loopNumber = parseInt(temp)
            if(loopNumber>1  && loopNumber <= 50000) 
            {
                miniKeyPagesPageGreatDocment.getElementById("loopNumberID").style.display  = "block"
                setKeyButtonLoppTimeTarget(loopNumber)
            }
            else
            {
                miniKeyPagesPageGreatDocment.getElementById("loopNuberInputID").value = "2";
                loopNumber = 2;
                miniKeyPagesPageGreatDocment.getElementById("loopNumberID").style.display  = "block"
                setKeyButtonLoppTimeTarget(loopNumber)
            }
            loopMode = 2;
          }
          else
          {
            miniKeyPagesPageGreatDocment.getElementById("loopNumberID").style.display  = "none"
            setKeyButtonLoppTimeTarget(0)
            miniKeyPagesPageGreatDocment.getElementById("loopNuberInputID").value = "0"
            loopMode = 0;
          }
        }
    }
}



//input框输入 循环 判断数据合法性
var loopInputOld = null
function loopNuberInputOninput (v){
    var temp = miniKeyPagesPageGreatDocment.getElementById("loopNuberInputID").value;
    if(temp == loopInputOld) return ;
    delayInputOld = temp;
    if(temp == null) return;
    var loopNumber = 0;

    

    if(isNaN(Number(temp,10)) == false && (temp.indexOf(".") == -1))    
    {
        loopNumber = parseInt(temp)
        console.log("loopNumber ----- ",loopNumber)
        if(loopNumber > 50000 || loopNumber == 0)
        {
            loopNumber = 2;
            miniKeyPagesPageGreatDocment.getElementById("loopNuberInputID").value = "2";
            
            alert("请输入1-50000数字");
        }
    }
    else
    {
        loopNumber  = 2;
        miniKeyPagesPageGreatDocment.getElementById("loopNuberInputID").value = "2";
        alert("请输入1-50000数字");
    }
    if(loopNumber < 2) loopNumber = 2;
    setKeyButtonLoopNumberTarget(loopNumber); 
    console.log("delayInputOninput 2,",temp,loopNumber);
}


//手动更新循环框的内容
var loopMode = 0;
function loopListWrite(t)
{
    if(t == 0) loopMode = 0;
    else if(t == 1) loopMode = 1;
    else if(t == 2) loopMode = 2;

    const tools = miniKeyPagesPageGreatDocment.getElementsByName("loop");
    for (let i = 0; i <tools.length ; i++) {
        tools[i].checked = false;
    }
    tools[loopMode].checked = true;
    
    if(loopMode == 2) 
    {
        miniKeyPagesPageGreatDocment.getElementById("loopNumberID").style.display  = "block"
        miniKeyPagesPageGreatDocment.getElementById("loopNuberInputID").value = ""+t
    }
    else
    {
        miniKeyPagesPageGreatDocment.getElementById("loopNumberID").style.display  = "none"
    }

}

//---------------------------------------------------------------循环框结束

//宏功能框添加一个新的步骤
function greatValueBoxButtonAdd(v)
{
    if(getActiveKeyNumbeTarget()==0xff) 
    {
        alert("请先选中一个按键");
        return 0;
    }
    if(getActiveKeykeyDataCountTarget() > 15) 
    {
        alert("最多16个");
        return ;
    }

    if(getTagetBoxMessageState(miniKeyPagesPageGreatDocment))
    {
        miniKeyPagesPageGreatDocment.getElementById('greatValueBoxID').innerHTML =null
    }

    var button = miniKeyPagesPageGreatDocment.createElement('button');
    button.className = 'greatValueButtonBoxActivation'
    button.id = "button"+ (getActiveKeykeyDataCountTarget()+1);
    button.innerText = '点击键盘';
    button.addEventListener('click', greatValueBoxButtonEvent);
    miniKeyPagesPageGreatDocment.querySelector('#greatValueBoxID').appendChild(button);
    if(delayMode != 0)
    {
        var delay = miniKeyPagesPageGreatDocment.createElement('button');
        delay.className = 'greatValueDelayBox'
        delay.innerText = getActiveDeleteTimeTarget()+"ms";
        delay.id = "delay"+ getActiveKeykeyDataCountTarget()+1; 
        miniKeyPagesPageGreatDocment.querySelector('#greatValueBoxID').appendChild(delay);
        var temp = getActiveDeleteTimeTarget()+"ms";
        delay.style.width = ((temp.length * 10) + 5) + "px"
    }
    virtualKeyboardShowInit();
    var temp = getActiveKeyButtonTarget()
    keyValueBuffTargetAddNewValue(button.id);
    greatValueButtonBoxActivationStateChage(temp,button.id)
}
//宏功能框删除一个步骤
function greatValueBoxButtonDelete(v)
{
    
    if(getActiveKeyNumbeTarget()==0xff) 
    {
        alert("请先选中一个按键");
        return 0;
    }
    var ActivationButtonID = getActiveKeyButtonTarget()
    
    if(ActivationButtonID != null)
    {
        virtualKeyboardShowInit();
        console.log("delay"+ ActivationButtonID.substring(6),ActivationButtonID)
        miniKeyPagesPageGreatDocment.getElementById(ActivationButtonID).remove();
        keyValueBuffTargetDeleteValue(ActivationButtonID);
        if(miniKeyPagesPageGreatDocment.getElementById("delay"+ ActivationButtonID.substring(6)) != undefined)
        {
            miniKeyPagesPageGreatDocment.getElementById("delay"+ ActivationButtonID.substring(6)).remove();
        }
        setActiveKeyButtonTarget(null);
        deleteKeyButtonDataTarget(ActivationButtonID);
       
        updateTargetButtonShowAll(miniKeyPagesPageGreatDocment)
    }
    
}

//宏功能框删除所有步骤
function greatValueBoxButtonClean(v) 
{ 

    if(getActiveKeyNumbeTarget()==0xff) 
    {
        alert("请先选中一个按键");
        return 0;
    }
    if(getTagetBoxMessageState(miniKeyPagesPageGreatDocment) == 0)
    {
        tagetBoxMessageCtrl(miniKeyPagesPageGreatDocment);
        setActiveKeyButtonTarget(null);
        virtualKeyboardShowInit();
        cleanKeyButtonDataTarget();
        delayListWrite(0);
        loopListWrite(0);
    }

}


//宏功能框某个步骤被选中
function greatValueBoxButtonEvent(v)
{
    virtualKeyboardShowInit();
    if(miniKeyPagesPageGreatDocment.getElementById(v.target.id).className == "greatValueButtonBoxActivation")
    {//本来是激活态
        miniKeyPagesPageGreatDocment.getElementById(v.target.id).className = "greatValueButtonBox"
        updateTargetButtonShow(miniKeyPagesPageGreatDocment);
        setActiveKeyButtonTarget(null);
    }
    else
    {
        greatValueButtonBoxActivationStateChage(getActiveKeyButtonTarget(),v.target.id);
    }
}
//宏功能框激活步骤转换
function greatValueButtonBoxActivationStateChage(v1,v2)
{
    if(v1 != null) //之前有激活的框
    {
        miniKeyPagesPageGreatDocment.getElementById(v1).className = "greatValueButtonBox"
        updateTargetButtonShow(miniKeyPagesPageGreatDocment);
    }
    miniKeyPagesPageGreatDocment.getElementById(v2).className = "greatValueButtonBoxActivation"
    setActiveKeyButtonTarget(v2);
    virtuaKeyboardShowUpdateByBUffTarget();
    updateTargetButtonShow(miniKeyPagesPageGreatDocment);
}

//控制宏功能大框是否显示出来
window.greatFunctionButton = greatFunctionButton;
function greatFunctionButton(v){
    if(miniKeyPagesPageGreatDocment.getElementById("greatFunctionConfigBoxID").style.display != "block")
    {
        miniKeyPagesPageGreatDocment.getElementById("greatFunctionConfigBoxID").style.display  = "block"
        miniKeyPagesPageGreatDocment.getElementById("miniKeyboardID").style.float = "left";
        miniKeyPagesPageGreatDocment.getElementById("miniKeyboardID").style.marginLeft = "70px";
        tagetButtonText("普通功能设置")
    }
    else
    {
        miniKeyPagesPageGreatDocment.getElementById("greatFunctionConfigBoxID").style.display  = "none"
        miniKeyPagesPageGreatDocment.getElementById("miniKeyboardID").style.float = "none";
        miniKeyPagesPageGreatDocment.getElementById("miniKeyboardID").style.marginLeft = "auto";
        tagetButtonText("宏功能设置")
    }
}

//获取宏功能框的显示状态
function TargetFunctionBoxShowState()
{
    if(miniKeyPagesPageGreatDocment.getElementById("greatFunctionConfigBoxID") == null) return 0;
    return miniKeyPagesPageGreatDocment.getElementById("greatFunctionConfigBoxID").style.display == "block"
}

function greatValueBoxInit(v)
{
    if(miniKeyPagesPageGreatDocment.getElementById("greatFunctionConfigBoxID") == null) return ;
    tagetBoxMessageCtrl(miniKeyPagesPageGreatDocment);
    const tools = miniKeyPagesPageGreatDocment.getElementsByName("delay");
    tools[0].checked = true;
    miniKeyPagesPageGreatDocment.getElementById("delayID").style.display  = "none"
    const tool2 = miniKeyPagesPageGreatDocment.getElementsByName("loop");
    tool2[0].checked = true;
    miniKeyPagesPageGreatDocment.getElementById("loopNumberID").style.display  = "none"
}

export {
    miniKeyGreatPagesInit,
    delayInputChage,
    delayListWrite,
    TargetFunctionBoxShowState,
    greatValueBoxButtonEvent,
    greatValueBoxInit,
    loopListWrite,
}
  