var webmms;
var app = 'jujue';

$(function(){
	setting(settingConfig.initial);
	var appname = 'jujue';
	var wsurl = 'boss.ypcloud.com:8081';
	OpenMsg(appname,wsurl);
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
	document.getElementById("div_nearby").addEventListener("click", function() {
		$("#div_nearby").fadeOut();
		document.getElementById("div_nearby").innerHTML = "";
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
function doKeypressSearch(e){
	e = e || window.event;
    if (e.which == 13) doSearch();
}
function doSearch(keyword) {
    var keyword = keyword || document.getElementById("input_value").value;
	var div = document.getElementById('display');
	var messeng = "<div class='messengDIVstyle'><div class='messeng_content_DIVstyle'>" + keyword +"</div></div>"
	div.innerHTML += messeng;
	document.getElementById("input_value").value="";
	div.scrollTop = div.scrollHeight;
}
var regwsOK = function(result){
	console.log('ws: ' + result,'state');
	//mcState = 'web';  
}
	
var wsStat = function(result){
	//mcState = 'web error';
	console.log('ws state:' + result,'state');
}

// register to DCenter OK callback
var regdcOK = function(reply){
    //console.log('regdOK result=%s', JSON.stringify(result));
	if ( reply.ErrCode == 0 ){
		//EdgeInfo.DDN = reply.result.DDN;
	}
	var str = 'reg: ' + ' ' + reply.ErrMsg;
		console.log(str,'state');
	
	if( reply.ErrMsg == 'OK'){
		console.log(reply.ErrMsg);
		document.getElementById("nearbyButtonWaiting").style.display = "none";
		document.getElementById("nearbyButton").style.display = "block";
		//mmsGetFavoriteListInfo();
		//mmsGetBannerInfo();
	}
	
}
 
// receive x-message callback from websocket
var rcveMsg = function(from, data){
	if ( typeof data == 'object'){
		console.log(from + ' ' + JSON.stringify(data),'rcve');
	}
	else if ( typeof data == 'string'){
		console.log(from + ' ' + data, 'rcve');
	}
}
	
var OpenMsg = function(appname, wurl){
	
	/*$.mdevice.getinfo(app,
        function(reply){
            if ( reply.ErrCode == 0 ){
                //var data = {"ddn":$.mdevice.ddn,"dname":$.mdevice.dname,"dtype":$.mdevice.dtype,"dtag":$.mdevice.dtag,"username":$.login.username,"token":$.login.token};
                
			} 
        },
        function(err){
            var str = 'get user profile error: ' + err.ErrMsg;
        }
    );*/
	checking_device();
	webmms= new MMS(appname,wurl);
    webmms.OpenMMS( regwsOK, regdcOK, wsStat, rcveMsg );
}

var getNearby = function(){
    mmsNearby(function(reply){
        console.log('getNearby: reply=%s,', JSON.stringify(reply));
        if ( reply.ErrCode == 0 ){
            var ddn, dname, dtype, ei;
            var len = reply.result.length;
            var i, k;
            var str = '';
            if ( len > 0 ){
                str = '<table class="table table-striped" style="font-size:1em">';
                str += '<thead><tr><th>#</th><th>DDN</th><th>Name</th><th>Type</th></tr></thead>';
                str += '<tbody>';
                for ( i = 0; i < len; i++ ){
                    m = i + 1;
                    ei = reply.result[i];
					if(ei.EiType == ".tv"){
						if (ei.DDN != null) ddn = ei.DDN;
						else ddn = '';
						if (ei.EiName != null) dname = ei.EiName;
						else dname = '';
						if ( ei.EiType != null) dtype = ei.EiType;
						else dtype = '';
						str += '<tr><td>'+m.toString()+'</td><td>'+ddn+'</td><td>'+dname+'</td><td>'+dtype+'</td></tr>'
					}
				}
                str += '</tbody>';
                str += '</table>';
                //buildDevicelist(reply.result);
            }
            else str = 'no device';
        }
        else {
            str = reply.ErrMsg;
        }
        BootstrapDialog.alert({"title":"NearBy","message":str});
    });
}

var mmsNearby = function(cb){
    webmms.StateMMS('nearby', '', '', function(reply){
        if ( typeof cb == 'function' ) cb(reply);
    });
}

var mmsGetFavoriteListInfo = function(){
	var serverDDN = 'A6vZ8S2F';
	webmms.CallMMS(serverDDN , 'getFavoriteList' , {"uid":"DG05zpf1", "pageNum": 1, "pageSize":5}, function(reply){
		console.log("FavoriteList : " + JSON.stringify(reply));
		for(var i=0 ;i<reply.Reply.result.length; i++){
			document.getElementById('cardName'+i).innerHTML = reply.Reply.result[i].cardName;
			document.getElementById('iconPath'+i).src = reply.Reply.result[i].iconPath;
			document.getElementById('cardLink'+i).href = reply.Reply.result[i].cardLink;
		}
	});
}

var mmsGetBannerInfo = function(){
	var serverDDN = 'A6vZ8S2F';
	webmms.CallMMS(serverDDN , 'getBannerList' , {"uid":"DG05zpf1"}, function(reply){
		console.log("Banner : " + JSON.stringify(reply));
		for(var i=0 ;i<reply.Reply.result.length; i++){
			document.getElementById('banner'+i).src = reply.Reply.result[i];
		}
	});
}

var getCookieByName = function(name){
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}