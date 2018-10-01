/*
##############################################################
#
#	Since 2016.12.6 @chi
#	c_devicerConfig.js
#	set/load web device config
#
#	basic on javascript
#
###############################################################
*/

// 搖一搖 初始化
var last_update = last_alpha = last_beta = last_gamma =  0;
var SHAKE_THRESHOLD = 3000;
function deviceMotionEventHandler(eventData) 
{
	var acceleration = eventData.accelerationIncludingGravity;
	var curTime = new Date().getTime();

	if ((curTime - last_update) > 100) {
		var diffTime = curTime - last_update;
		last_update = curTime;
		alpha = acceleration.z;
		beta = acceleration.y;
		gamma = acceleration.z;
		var speed = Math.abs(alpha + beta + gamma - last_alpha - last_beta - last_gamma) / diffTime * 10000;
		var status = document.getElementById("status");

		if (speed > SHAKE_THRESHOLD) {
			doResult();
		}
		last_alpha = alpha;
		last_beta = beta;
		last_gamma = gamma;
	}
}
function doResult(){
	console.log("event: shake");
	doMoteCommend_useDDN("shake");
	return true;
}
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', deviceMotionEventHandler, false);
} else {
	// 不支援搖晃
}

function checking_device(){
	if (window.Web2App) {
		console.log("is mobile device");
		//doChangeSearchDevice();
        //document.getElementById("seach_mark").style.display = "none";
        //document.getElementById("mi_icon").style.display = "inline";
        //document.getElementById("decoder").style.opacity = "1";
	} else {
		console.log("not mobile device");
        //document.getElementById("seach_mark").style.display = "inline";
        //document.getElementById("mi_icon").style.display = "none";
        //document.getElementById("decoder").style.opacity = "0";
	}
}