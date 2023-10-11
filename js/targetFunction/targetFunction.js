

import { virtuaKeyboardValueBuffUpdateTarget } from './virtuaKeyboardDataHandleTarget.js'
import { virtualKeyboardShowInit } from '../virtuaKeyboardPages.js'
import { delayListWrite ,loopListWrite} from './targetFunctionPage.js'
import { TargetFunctionBoxShowState } from './targetFunctionPage.js'
import { keyValueBuffTargetkeyDataWrite } from './virtuaKeyboardDataHandleTarget.js'
import { updateTargetButtonShow,updateTargetButtonShowAll,virtuaKeyboardShowUpdateByBUffTarget } from './targetFunctionShow.js'
import { getActiveKeyButtonTarget,updateDataToDevice,getActiveKeyNumbeTarget} from './virtuaKeyboardDataHandleTarget.js'




//HID数据处理
function greatValueBoxInit(v){

    loopListWrite(v.loop);
    delayListWrite(v.delayTime); //更新页面上的数据
    keyValueBuffTargetkeyDataWrite(v);//更新缓存里面的数据
    if(TargetFunctionBoxShowState() != true)
    {
        greatFunctionButton();
    }
    updateTargetButtonShowAll(miniKeyPagesPageGreatDocment);
    virtualKeyboardShowInit();
}

//初始，备用，但是不显示
function greatValueBoxInitUnShow(v){

    var temp = {};

    temp.delayTime = 0;
    temp.loop = 0;
    temp.count = 0;
    temp.activeKey = v;
    temp.keyData= {};

    keyValueBuffTargetkeyDataWrite(temp);//更新缓存里面的数据
    updateTargetButtonShowAll(miniKeyPagesPageGreatDocment);
}


//虚拟键盘被点击
function miniKeyGreatConfigVirtuaKeyboardHandle(v)
{
    if(TargetFunctionBoxShowState() != true) return null;
    if(getActiveKeyNumbeTarget()>14) return 2;
    if(getActiveKeyButtonTarget()==null)  return 2; //如果没有激活的button就不用处理
    var temp =  virtuaKeyboardValueBuffUpdateTarget(v);//更新数据
    updateDataToDevice();
    updateTargetButtonShow(miniKeyPagesPageGreatDocment);//更新显示
    if(temp ==  3)
    {
        virtualKeyboardShowInit();
        virtuaKeyboardShowUpdateByBUffTarget();
    }
    return temp;
}

export {
    miniKeyGreatConfigVirtuaKeyboardHandle,
    greatValueBoxInit,
    greatValueBoxInitUnShow,
}

