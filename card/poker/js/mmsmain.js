// main 
var app = 'motechat';
var devType = '.mc';
var mms;
var EdgeInfo = { "DDN": "", "Owner": "", "Name": "", "Type": devType, "Tag": "", "Loc": "" };
var mcState = '';
var nearbylist = [];
var wsurl = 'boss.ypcloud.com:8081';

$(function () {

	 startmms(app, wsurl);
	 
	 /*Nearby*/
	 $('#near_nav').on('click', function (e) {
		 e.preventDefault();
		 //getMotelist();
		 getNearby();
	 });
	 $('#btn-exit-nearby').on('click', function(e){
		 e.preventDefault();
		 $.nearby.exitNearby();
     });
	 $('#btn-exit-nearbyWaiting').on('click', function(e){
		 e.preventDefault();
		 $('#nearbyWaiting').modal('hide'); 
     });
	 $('#btn-save-nearby').on('click', function(e){
         e.preventDefault();
         $.nearby.saveNearby();
     });

});
function open_button(e_type) {
    if (e_type == "setting") {
        setting(settingConfig.open);
	} else if (e_type == "waiting") {
		$('#nearbyWaiting').modal('show');
		console.log("waiting");
    } else if (e_type == "nearby") {
		$('#nearbyWaiting').modal('show');
		$.nearby.openSelect();
		console.log("nearby");
		/*webmms.StateMMS( 'nearby', '', '', 
              function(devlist){
                  console.log('nearby: list=%s', JSON.stringify(devlist));
             }
          );*/
		//getNearby();
    } else if (e_type == "apps") {
        // window.event.stopPropagation();
        toggle_app_menu();

        $(".apps_menu").click(function(e) {
            e.stopPropagation();
        });

        document.getElementById("main_menu").addEventListener("touchstart", close_appMenu);
        document.getElementById("main_contain").addEventListener("touchstart", close_appMenu);
        document.getElementById("jujue_background").addEventListener("touchstart", close_appMenu);
    } else if (e_type == "notify") {

        // loadScript("https://unpkg.com/mqtt/dist/mqtt.min.js", listenNotify);

    }
}

// connect and register to websocket server OK callback
var regwsOK = function (result) {
	 console.log('ws: ' + result);
	 mcState = 'web';
}

var wsStat = function (result) {
	 mcState = 'web error';
	 console.log('ws state:' + result);
}

// register to DCenter OK callback
var regdcOK = function (reply) {
	 //console.log('regdOK result=%s', JSON.stringify(result));
	 if (reply.ErrCode == 0) {
		 EdgeInfo.DDN = reply.result.DDN;
	 }
	 var str = 'reg: ' + ' ' + reply.ErrMsg;
	 console.log(str);
	 if (reply.ErrCode == 0) {
     mmsGetDevice(function (reply) {
		 if (reply.ErrCode == 0) {
			 EdgeInfo.Owner = reply.result.EiOwner;
			 EdgeInfo.Name = reply.result.EiName;
			 //EdgeInfo.Type = reply.result.EiType;
			 EdgeInfo.Tag = reply.result.EiTag;
			 EdgeInfo.Loc = reply.result.EiLoc;
			 console.log('webmain:regdOK EdgeInfo=%s', JSON.stringify(EdgeInfo));
			 mcState = 'dc';
		 }
     });
	 }
	 
	 if( reply.ErrMsg == 'OK'){
		 console.log(reply.ErrMsg);
		 document.getElementById("nearbyButtonWaiting").style.display = "none";
		 document.getElementById("nearbyButton").style.display = "block";
	 }
}


// mms api function
var startmms = function (appname, wurl) {
	 mms = new MMS(appname, wurl);
	 mms.OpenMMS(regwsOK, regdcOK, wsStat, rcveMsg);
	 console.log('mms: open: ' + wurl);
}

var mmsSendXmsg = function (target, data) {
	 var cookies = document.cookie.split(";");
	 //console.log('cookie:' + cookies[cookies.length-1]);
	 //console.log('mmsSendXmsg:'+ target + '::::' + data);
	 mms.SendMMS(cookies[cookies.length-1],data,function cb(reply){});
}

// receive x-message callback from websocket
var rcveMsg = function (from, data) {
	 if (typeof data == 'object') {
		 console.log(from + ' ' + JSON.stringify(data));
	 }
	 else if (typeof data == 'string') {
		 console.log(from + ' ' + data);
	 }
}

var mmsCallXrpc = function (target, func, args) {
	 var data, str;
	 if (target != '' && func != '' && args != '') {
		 str = target + " " + func + " " + args;
		 console.log(str);
		 mms.CallMMS(target, func, args, function (reply) {
			 if (typeof reply == 'object')
				 //$.con.out('xprcCall result ' + JSON.stringify(reply), 'rcve');
				 console.log(JSON.stringify(reply));
			 else if (typeof reply == 'string')
				 //$.con.out('xprcCall result ' + reply, 'rcve');
				 console.log(reply);
			 else
				 console.log('reply type error');
		 });
	 }
	 else {
		 console.log('invalid input');
	 }
}

var mmsGetDevice = function (cb) {
	 mms.StateMMS('get', 'device', '', function (reply) {
		 console.log('GetDevice reply=%s', JSON.stringify(reply));
		 if (typeof cb == 'function') cb(reply);
	 });
}

var mmsSetDevice = function (setting, cb) {
	 mms.StateMMS('set', 'device', setting, function (reply) {
		 console.log('SetDevice reply=%s', JSON.stringify(reply));
		 if (typeof cb == 'function') cb(reply);
	 });
}

var mmsNearby = function (cb) {
	 mms.StateMMS('nearby', '', '', function (reply) {
		 if (typeof cb == 'function') cb(reply);
	 });
}

/*Get nearby*/ 
var getNearby = function(){
	 mmsNearby(function(reply){
		 console.log('getNearby: reply=%s,', JSON.stringify(reply));
		 if ( reply.ErrCode == 0 ){
		 /*console.log(reply.result);*/
			 var ddn, dname, dtype, ei;
			 var len = reply.result.length;
			 var i, k;
			 var str = '';
			 if ( len > 0 ){
             
            
              
			 }
			 else str = 'no device';
		 }
		 else {
			 str = reply.ErrMsg;
		 }
     
	 });
}