
window.onload = function () {
  //sconsole.log("onload virtuaKeyboard");  

}

//当前窗口得到焦点 
window.onfocus = function() { 
    window.top.focusStateVirtualKey(1)
  }; 
   
  //当前窗口失去焦点 
  window.onblur = function() { 
    window.top.focusStateVirtualKey(0)
  };

 //这里禁用所有按键功能
window.onkeydown = function () {
  window.event.preventDefault = false;
  return false;
} 

