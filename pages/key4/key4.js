document.querySelector('#guideButton').addEventListener('click', guideButtonHandle);
document.getElementById("guideButton").addEventListener('mouseenter', guideButtonHandle)
document.getElementById("guideButton").addEventListener('mouseleave', guideButtonHandle)

function guideButtonHandle(v) {
  if (v.type == "mouseenter") {
      document.getElementById(v.target.id).style.background = "#f9a539";
  }
  if (v.type == "mouseleave") {
      document.getElementById(v.target.id).style.background = "#4d93db";
  }

  if (v.type == "click") {
      window.open("../guide/guideKey4.html")
  }
  
}

//当前窗口得到焦点 

const keyCount = 4;

window.onload = function () {
  console.log("onload key ",keyCount);  
  var temp = null;
  if(window.parent.getKeyboardFwVFunction() > 1)
  {
    temp = document.getElementById("virtualKeyboardPagesP").contentDocument;
    document.getElementById("virtualKeyboardPagesP").style.display = "block"
  }
  else
  {
    temp = document.getElementById("virtualKeyboardPages").contentDocument;
    document.getElementById("virtualKeyboardPages").style.display = "block"
  }

  window.parent.keySetPagesInitFunction(document,temp,null);

  for(var i=0;i<4;i++)
  {
    var idTemp = "#key" + (i+1)
    document.querySelector(idTemp).addEventListener('click',  window.parent.minikeySelectHandleFunction);
    document.querySelector(idTemp).addEventListener('mouseenter', window.parent.minikeyButtonMouseFunction);
    document.querySelector(idTemp).addEventListener('mouseleave', window.parent.minikeyButtonMouseFunction);
  }

}

window.onfocus = function() { 
    window.parent.focusStateKey(1)
}; 
   
  //当前窗口失去焦点 
window.onblur = function() { 
  window.parent.focusStateKey(0)
};

 //这里禁用所有按键功能
 window.onkeydown = function () {
  window.event.preventDefault = false;
  return false;
} 

