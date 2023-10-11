

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
        window.open("../guide/guideConnect.html")
    }
    
}