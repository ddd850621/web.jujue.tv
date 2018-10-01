var webmms;
var app = 'jujue';
var index_i = 1;
$(function(){
	setting(settingConfig.initial);
	var appname = 'jujue';
	var wsurl = 'boss.ypcloud.com:8081';
	var div = document.getElementById('display');
	var messageReply = "<div class='messageDIVstyle'><img class='messageReply_icon' src='./img/jujue_chat_144x144.png'><div class='left_triangle'></div><div class='messageReply_content_DIVstyle'>"+ "Hi, I am jujue." + "<br/>" + "Is there anything I can do for you?" +"</div></div>"
	var messageReply_example = "<div class='messageDIVstyle'><img class='messageReply_icon' src='./img/jujue_chat_144x144.png'><div class='left_triangle'></div><div class='messageReply_content_DIVstyle'>"+ "You can talk to me and enter the name of the card you want to search. For example:Weather" +"</div></div>"
	div.innerHTML += messageReply;
	div.innerHTML += messageReply_example;
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
	$("#input_value").on("keydown",function (e) {
		if(document.getElementById("input_value").value.length == 1 && e.which == 8){
			document.getElementById("input_bar_div").style.right = "90px";
			document.getElementById("inputBarImg3").style.display = "block";
			document.getElementById("inputBarImg2").style.display = "block";
			document.getElementById("inputBar_input").style.display = "none";
		}else{
			document.getElementById("input_bar_div").style.right = "50px";
			document.getElementById("inputBarImg3").style.display = "none";
			document.getElementById("inputBarImg2").style.display = "none";
			document.getElementById("inputBar_input").style.display = "block";
		}
	});
});

function scrollToEnd(){
    document.body.scrollTop = document.body.scrollHeight;
}

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
    if (e.which == 13){
		doSearch();
		document.getElementById("input_bar_div").style.right = "90px";
		document.getElementById("inputBarImg3").style.display = "block";
		document.getElementById("inputBarImg2").style.display = "block";
		document.getElementById("inputBar_input").style.display = "none";
	}
	
}
function doClick(e){
	doSearch();
	document.getElementById("input_bar_div").style.right = "90px";
	document.getElementById("inputBarImg3").style.display = "block";
	document.getElementById("inputBarImg2").style.display = "block";
	document.getElementById("inputBar_input").style.display = "none";
}
function addSlash(e){
	document.getElementById("input_value").value = "/";
	document.getElementById("input_value").focus();
	document.getElementById("input_bar_div").style.right = "50px";
	document.getElementById("inputBarImg3").style.display = "none";
	document.getElementById("inputBarImg2").style.display = "none";
	document.getElementById("inputBar_input").style.display = "block";
}
function doSearch(keyword) {
    var keyword = keyword || document.getElementById("input_value").value;
	var div = document.getElementById('display');
	if (keyword.indexOf("%") == 0) {
		card( keyword, index_i);
		index_i = index_i + 1;
    }
	else if (keyword.indexOf("?") == 0) {
		var cookies = document.cookie.split(";");
		var messageReply = "<div class='messageDIVstyle'><img class='messageReply_icon' src='./img/jujue_chat_144x144.png'><div class='left_CardTriangle'></div><div class='messageReply_content_DIVstyle'>"+ cookies[cookies.length-1] +"</div></div>"
		div.innerHTML += messageReply;
	}
	else{
		var message = "<div class='messageDIVstyle'><div class='right_triangle'></div><div class='message_content_DIVstyle'>" + keyword +"</div></div>"
		div.innerHTML += message;
	}
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