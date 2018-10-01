// main 
const app = 'motechat';
const devType = '.mc';
var mms;
var EdgeInfo = {"DDN":"","Owner":"","Name":"","Type":devType,"Tag":"","Loc":""};
var mcState = '';
var nearbylist = [];
var station = '';
var channel = [];
var sel_ddn = '';
var chanstat = {"state":"idle","frame":"main","activeBtn":"","activeChan":-1,"target":"","playstat":{"url":"","duration":"","playtime":"","state":""}};
var playhistory = [];
const wsockserver = 'http://boss.ypcloud.com:8084';

$(function(){
    //$('#nav_page').show();
	$('#home_page').show();
    //$('#wait_page').show();
    startmms(app, wsockserver);
    
    // page event handler
	/*
    $('#main_nav').on('click', function(e){
        e.preventDefault();
        startMain();
    });
    $('#set_nav').on('click', function(e){
        e.preventDefault();
        if ( mcState == 'dc' ) 
            startSetting();
    });
    $('#con_nav').on('click', function(e){
        e.preventDefault();
        startConsole();
    });
    $('#save_btn_setting').on('click', function(e){
        e.preventDefault();
        saveMoteSetting();
    });
    $('#chfirst_btn').on('click', function(e){
        e.preventDefault();
        touchControl('chfirst','');
    }); 
    $('#chnext_btn').on('click', function(e){
        e.preventDefault();
        touchControl('chnext','');
    });
    $('#chprev_btn').on('click', function(e){
        e.preventDefault();
        touchControl('chprev','');
    });
    $('#chlast_btn').on('click', function(e){
        e.preventDefault();
        touchControl('chlast','');
    });
    $('#playfirst_btn').on('click', function(e){
        e.preventDefault();
        touchControl('playfirst','');
    }); 
	*/
    $('#playnext_btn').on('click', function(e){
        e.preventDefault();
        touchControl('playnext','');
    });
    $('#playprev_btn').on('click', function(e){
        e.preventDefault();
        touchControl('playprev','');
    });
	/*
    $('#playlast_btn').on('click', function(e){
        e.preventDefault();
        touchControl('playlast','');
    });
	*/
    $('#play_btn').on('click', function(e){
        e.preventDefault();
        touchControl('play','');
    });
    $('#pause_btn').on('click', function(e){
        e.preventDefault();
        touchControl('pause','');
    });
	/*
    $('#volumeup_btn').on('click', function(e){
        e.preventDefault();
        touchControl('volup','');
    });
    $('#volumedown_btn').on('click', function(e){
        e.preventDefault();
        touchControl('voldown','');
    });
    $('#con_onoff_btn').on('click', function(e){
        e.preventDefault();
        //console.log('onoff button clicked');
        consoleControl('console','onoff');
    });
    $('#con_clear_btn').on('click', function(e){
        e.preventDefault();
        consoleControl('console','clear');
    });
    $('#con_scrollup_btn').on('click', function(e){
        e.preventDefault();
        consoleControl('console','scrollup');
    });
    $('#con_scrolldown_btn').on('click', function(e){
        e.preventDefault();
        consoleControl('console','scrolldown');
    });
    $('#rmt_set_onoff_btn').on('click', function(e){
        e.preventDefault();
        settingControl('setting', 'onoff');
    });
    $('#rmt_set_btn').on('click', function(e){
        e.preventDefault();
        ei = {"name":"","tag":"","loc":""};
        ei.name = $('#rmt_set_name').val();
        ei.tag = $('#rmt_set_tag').val();
        ei.loc = $('#rmt_set_loc').val();
        settingControl('eisetting', ei);
    });
    $('#near_refresh_btn').on('click', function(e){
        e.preventDefault();
        //console.log('near_refresh_btn clicked!');
        getNearby();
    });
    $('#get_pl_btn').on('click', function(e){
        e.preventDefault();
        //console.log('get_pl_btn clicked!');
        $('#div_playlist').empty();
        touchControl('playlist','');
    });
    $('#rmt_status_onoff_btn').on('click', function(e){
        e.preventDefault();
        if ( $.trackPlay.timer == null ){
            $.trackPlay.start();
            $('#rmt_status_onoff_btn').removeClass('btn-default').addClass('btn-success');
        }
        else {
            $.trackPlay.stop();
            $('#rmt_status_onoff_btn').removeClass('btn-success').addClass('btn-default');
        }
    });
	*/
});


// connect and register to websocket server OK callback
var regwsOK = function(result){
    //$.con.out('ws: ' + result,'state');
	console.log('ws: ' + result,'state');
    mcState = 'web';
}

var wsStat = function(result){
    mcState = 'web error';
    //$.con.out('ws state:' + result,'state');
	console.log('ws state:' + result,'state');
}

// register to DCenter OK callback
var regdcOK = function(reply){
    //console.log('regdOK result=%s', JSON.stringify(result));
    if ( reply.ErrCode == 0 ){
        EdgeInfo.DDN = reply.result.DDN;
        //$('#wait_page').hide();
        //$('#nav_page').show();
        //$('#home_page').show();
    }
    var str = 'reg: ' + ' ' + reply.ErrMsg;
    //$.con.out(str,'state');
	console.log(str,'state');
    if ( reply.ErrCode == 0 ){
        mmsGetDevice(function(reply){
            if ( reply.ErrCode == 0 ){
                EdgeInfo.Owner = reply.result.EiOwner;
                EdgeInfo.Name = reply.result.EiName;
                //EdgeInfo.Type = reply.result.EiType;
                EdgeInfo.Tag = reply.result.EiTag;
                EdgeInfo.Loc = reply.result.EiLoc;
                //console.log('webmain:regdOK EdgeInfo=%s', JSON.stringify(EdgeInfo));
                //buildSettingValue();
                mcState = 'dc';
				/*
                getNearby();
                $.getJSON( 'js/json/chanlist.json', function(data) {
                    //console.log('get chanlist=%s',JSON.stringify(data));
                    buildPlayMenu(data);
                });
				*/
            }
        });
    }
} 
/*
var startMain = function(){
    $('#set_page').hide();
    $('#con_page').hide();
    $('#home_page').show();
}


var startSetting = function(){
    //alert('startSetting');
    $('#home_page').hide();
    $('#con_page').hide();
    $('#set_page').show();
}

var startConsole = function(){
    $('#home_page').hide();
    $('#set_page').hide();
    $('#con_page').show();
}

var buildSettingValue = function()
{
    $('#set_ddn').val(EdgeInfo.DDN);
    $('#set_owner').val(EdgeInfo.Owner);
    $('#set_name').val(EdgeInfo.Name);
    $('#set_type').val(EdgeInfo.Type);
    $('#set_tag').val(EdgeInfo.Tag);
    $('#set_location').val(EdgeInfo.Loc);
}

var saveMoteSetting = function()
{
    var setting = {"DDN":"","EiOwner":"","EiName":"","EiType":"","EiTag":"","EiLoc":""};
    setting.DDN = EdgeInfo.DDN;
    setting.EiOwner = EdgeInfo.Owner;
    setting.EiName = $('#set_name').val();
    setting.EiType = EdgeInfo.Type;
    setting.EiTag = $('#set_tag').val();
    setting.EiLoc = $('#set_location').val();
    mmsSetDevice( setting, function(reply){
        //console.log('webmain:saveMoteSetting reply=%s', JSON.stringify(reply));
        BootstrapDialog.alert({"title":"SetDevice","message":reply.ErrMsg});
    });
}

var getNearby = function(){
    $('#near_dev').empty();
    //$('#wait_page').show();
    mmsNearby(function(reply){
        //console.log('getNearby: reply=%s,', JSON.stringify(reply));
        $('#near_dev').empty();
        sel_ddn = '';
        //$('#wait_page').hide();
        if ( reply.ErrCode == 0 ){
            var ddn, dname, dtype, ei;
            var len = reply.result.length;
            var i, k;
            var str = '';
            if ( len > 0 ){
                k = 0;
                str = '<table class="table table-striped table-hover" style="font-size:1em">';
                str += '<thead><tr><th>#</th><th>DDN</th><th>Name</th><th>Type</th></tr></thead>';
                str += '<tbody>';
                for ( i = 0; i < len; i++ ){
                    ei = reply.result[i];
                    if (ei.DDN != null) ddn = ei.DDN;
                    else ddn = '';
                    if (ei.EiName != null) dname = ei.EiName;
                    else dname = '';
                    if (ei.EiType != null) dtype = ei.EiType;
                    else dtype = '';
                    if (dtype == '.tv'){
                        k += 1;
                        str += '<tr><td>'+k.toString()+'</td><td>'+ddn+'</td><td>'+dname+'</td><td>'+dtype+'</td></tr>'
                    }
                }
                str += '</tbody>';
                str += '</table>';
                //console.log('getNearby: str=%s', str);
                //buildDevicelist(reply.result);
            }
            else str = 'no device';
        }
        else {
            str = reply.ErrMsg;
        }
        $('#near_dev').html(str);
        $('#div_near_dev').show();
        $('#near_dev').on('click', 'tbody tr', function(event){
            //console.log('near_dev clicked');
            //console.log('text=%s', $(this).find("td:eq(1)").text());
            sel_ddn = $(this).find("td:eq(1)").text();
            $('#near_dev tr').css('background-color','');
            $(this).css('background-color','brown');
            //$('#ctl_ddn').html('Active DDN: '+sel_ddn);
            //$('#ctl_keypad').show();
        } );
    });
}

var buildPlayMenu = function(media){
    if ( typeof media == 'object' && typeof media.station == 'object' ){
        //console.log('buildPlayMenu media=%s', JSON.stringify(media));
        if ( typeof media.station.name == 'string' && typeof media.station.channel != 'undefined' ){
            station = media.station.name;
            channel = [];
            var len = media.station.channel.length;
            if ( len > 0 ){
                channel = media.station.channel.slice();
                //console.log('channel=%s', JSON.stringify(channel));
                //$('#play_media').empty();
                var irow = Math.ceil(len/2);
                var html = '';
                var k = 0;
                for ( var i = 0; i < irow; i++ ){
                    html += '<div class="md">';
                    for ( var j = 0; j < 2; j++ ){
                        if ( k < len )
                            html += '<button id="m'+k.toString()+'" class="md-btn">' + media.station.channel[k].name + '</button>';
                        else
                            html += '<button class="md-btn" readonly>&nbsp;&nbsp;</button>';
                        k += 1;
                    }
                    html += '</div>';
                }
                //console.log('buildPlayMenu html=%s', html);
                $('#play_media').html(html);
                $('#div_play_media').show();
                $('#play_media').on('click', function(event){
                    //console.log('play click id=%s', event.target.id);
                    event.preventDefault();
                    if ( sel_ddn != '' ){
                        var id = event.target.id;
                        chanstat.state = "play";
                        var ab = chanstat.activeBtn;
                        if ( ab != '' ){
                            $('#'+ab).css('color','black');
                        }
                        $('#'+id).css('color','brown');
                        chanstat.activeBtn = id;
                        id = id.substr(1);
                        var ix = parseInt(id);
                        chanstat.activeChan = ix;
                        playChannel(ix);
                    }
                });
            }
        }
    }
}

var playChannel = function(chno){
    var ch = channel[chno];
    var frame = chanstat.frame;
    var duration = ( typeof ch.duration == 'string' ) ? ch.duration : '0';
    var animate = ( typeof ch.animate == 'string' ) ? ch.animate : 'fade';
    var anidur = ( typeof ch.aniduration == 'string' ) ? ch.aniduration : '3';
    var pmode = ( typeof ch.pmode == 'string' ) ? ch.pmode : '';
    var dropcmd = {"cmd":"drop","type":"url","src":[],"duration":duration,"frame":frame,"animate":animate,"aniduration":anidur,"pmode":pmode}
    if ( typeof ch.media != 'undefined' ){
        var len = ch.media.length;
        for ( var i = 0; i < len; i++ ){
            dropcmd.src.push(ch.media[i].url);
        }
    }
    var target = sel_ddn;
    if ( target != ''  && dropcmd.src.length > 0){
        //console.log('playChannel: send=%s',JSON.stringify(dropcmd));
        chanstat.target = target;
        mmsSendXmsg(target, dropcmd, function(reply){
            console.log('playChannel: send reply=%s',JSON.stringify(reply));
            $.trackPlay.start();
            $('#rmt_status_onoff_btn').removeClass('btn-default').addClass('btn-success');
            //$('#ctl_keypad').show();
        });
    }
}

var buildPlaylist = function(pl){
    var i, len, pi, id, index, actindex, name;
    //$('#div_playlist').empty();
    len = pl.list.length
    if ( len > 0 ){
        str = '<table class="table table-striped table-hover" style="font-size:1em;text-align:left">';
        //str += '<thead><tr><th>#</th><th>Name</th></tr></thead>';
        str += '<tbody>';
        actindex = pl.info.activeindex;
        for ( i = 0; i < len; i++ ){
            pi = pl.list[i];
            id = pi.id;
            if ( id != '' ) index = pi.ch + '-' + pi.id;
            else index = pi.ch;
            name = pi.name;
            str += '<tr><td><a href="#" id="m'+i.toString()+'" class="btn btn-primary" style="width:70px;margin-left:0.5em">'+index+'</a></td><td><div style="margin-top:0.5em">'+name+'</div></td></tr>'
        }
        str += '</tbody>';
        str += '</table>';
    }
    else str = 'no playlist';
    //console.log('buildPlaylist str=%s', str);
    $('#div_playlist').html(str);
    $('#div_playlist').on('click', 'tbody a', function(e){
        e.preventDefault();
        var id = event.target.id;
        console.log('buildPlaylist id=%s', id);
        id = id.substr(1);
        touchControl('playindex', id);
    });
}

var playlistRespHandler = function(reply){
    console.log('playlistresp reply=%s', JSON.stringify(reply));
    try {
        if ( reply.playlist.list.length > 0 ){
            buildPlaylist(reply.playlist);
        }
    }
    catch(e){
        console.log('playlistRespHandler error=%s', e.message);
    }
}

$.trackPlay = {
    timer: null,
    Interval: 5000,
    start: function(){
        //if ( chanstat.state == 'play' ){
            var frame = chanstat.frame;
            $.trackPlay.getStatus(frame);
            $.trackPlay.stop();
            if ( $.trackPlay.timer == null ){
                $.trackPlay.timer = setInterval(function(){
                    var frame = chanstat.frame;
                    $.trackPlay.getStatus(frame);
                }, $.trackPlay.Interval);
            }
        //}
    },
    getStatus: function(frame){
        var target = sel_ddn;
        var cmd = "status frame " + frame;
        mmsSendXmsg(target, cmd);
    },
    stop: function(){
        if ( $.trackPlay.timer != null ) {
            clearInterval( $.trackPlay.timer );
            $.trackPlay.timer = null;
        }
    }
}
*/
var getRespHandler = function(data){
    console.log('getRespHandler data=%s', JSON.stringify(data));
    var option, err, rdata, url, duration, ctime, state;
    if ( typeof data.option == 'string' ) option = data.option;
    if ( typeof data.ErrMsg == 'string' ) err = data.ErrMsg;
    if ( typeof option != 'undefined' && option.indexOf('frame') >= 0 && typeof err != 'undefined' && err == 'OK'){
        if ( typeof data.data == 'object' ) {
            rdata = data.data;
            url = rdata.url;
            if ( typeof rdata.duration == 'string' ) duration = rdata.duration;
            else duration = '';
            if ( duration != '' ){
                if ( duration.indexOf('.') > 0 ) duration = duration.substr(0, duration.indexOf('.')+2);
            }
            if ( typeof rdata.currentTime == 'string' ) ctime = rdata.currentTime;
            else ctime = '';
            if ( ctime != '' ){
                if ( ctime.indexOf('.') > 0 ) ctime = ctime.substr(0, ctime.indexOf('.')+2);
            }
            if ( typeof rdata.state == 'string' ) state = rdata.state;
            else state = '';
            var curl = $('#play_url').html();
            if ( url != curl ){
                var emSize = parseFloat($('#play_url').css("font-size"));
                //console.log('getRespHandler emSize=%f', emSize);
                var urlWidth = $('#play_url').width();
                var urlSize = parseInt(urlWidth / emSize);
                //console.log('getRespHandler urlSize=%f', urlSize);
                if ( url.length > urlSize ) url = url.substr(url.length - urlSize);
                $('#play_url').html(url);
                //$('#play_duration').html(duration);
                //$('#play_time').html(ctime);
                //$('#play_state').html(state);
            }
            else {
                //$('#play_duration').html(duration);
                //$('#play_time').html(ctime);
                //$('#play_state').html(state);
            }
        }
    }
}

var dropRespHandler = function(data){
    console.log('dropRespHandler data=%s', JSON.stringify(data));
    if ( typeof data.status == 'string' ) {
        var status = data.status;
        if ( status != '' ){
            $('#play_url').html('');
            //$('#play_duration').html('');
            //$('#play_time').html('');
            //$('#play_state').html(status);
        }
    }
}

var touchControl = function(action, value, cb){
    var tcmd = {"cmd":"touch","option":"","value":value};
    switch(action){
        case 'play':
        case 'pause':
        case 'stop':
        case 'clear':
            tcmd.option = action;
            break;
        case 'playfirst':
        case 'playlast':
        case 'playnext':
        case 'playprev':
        case 'chfirst':
        case 'chlast':
        case 'chnext':
        case 'chprev':
            tcmd.option = action;
            break;
        case 'volup':
        case 'voldown':
        case 'mute':
        case 'unmute':
            tcmd.option = action;
            break;
        case 'playlist':
            tcmd.option = action;
            break;
        case 'playindex':
            tcmd.option = action;
            break;
        default:
            break;
    }
    if ( tcmd.option != '' ){
        var target = sel_ddn;
        //if ( target != '' ){
            console.log('touchControl: send=%s',JSON.stringify(tcmd));
            mmsSendXmsg(target, tcmd, function(reply){
                console.log('touchControl: send reply=%s',JSON.stringify(reply));
                if ( typeof cb == 'function' ) cb(reply);
            });    
        //}
    }
}
/*
var consoleControl = function(action, value, cb){
    // action: onoff, clear, scrollup, scrolldown
    var tcmd = {"cmd":"touch","option":action,"value":value};
    if ( tcmd.option != '' ){
        var target = sel_ddn;
        if ( target != '' ){
            mmsSendXmsg(target, tcmd, function(reply){
                console.log('consoleControl: send reply=%s',JSON.stringify(reply));
                if ( typeof cb == 'function' ) cb(reply);
            });    
        }
    }
}

var settingControl = function(action, value, cb){
    var tcmd = {"cmd":"touch","option":action,"value":value};
    if ( tcmd.option != '' ){
        var target = sel_ddn;
        if ( target != '' ){
            mmsSendXmsg(target, tcmd, function(reply){
                console.log('settingControl: send reply=%s',JSON.stringify(reply));
                if ( typeof cb == 'function' ) cb(reply);
            });    
        }
    }    
}

var clearConsole = function()
{
    $.con.clear();
}
*/
// mms api function

var startmms = function(appname, wurl){
    mms= new MMS(appname, wurl);
    mms.OpenMMS(regwsOK, regdcOK, wsStat, rcveMsg);
    //$.con.out('mms: open: ' + wurl,'state');
	console.log('mms: open: ' + wurl,'state');
}

var mmsSendXmsg = function(target, data, cb){
    var str;
	var cookies = document.cookie.split(";");
    //alert('send cmd: to=' + to + ',msg=' + msg);
    //if ( target != '' && data != ''){
	if ( data != ''){
        str = target + " " + data;
        console.log('send input=%s', str);
        //$.con.out( str, 'send');
		//console.log( str, 'send');
        //mms.SendMMS( target, data, function(result){
		mms.SendMMS( cookies[cookies.length-1], data, function(result){
            if ( typeof cb == 'function') cb(result);
            var str = 'send: ';
            str += JSON.stringify(result);
            //if ( typeof result.State == 'string' ) str += result.State;
            //else str += result.ErrMsg;
            //console.log('send result=%s', str);
            //$.con.out(str, 'state');
			console.log(str, 'state');
        } );
    }
}

// receive x-message callback from websocket
var rcveMsg = function(from, data){
    console.log('rcveMsg from=%s data=%s', JSON.stringify(from), JSON.stringify(data));
    if ( typeof data.response == 'string' ){
        // remote response
        var resp = data.response;
        if ( resp == 'drop' ){
            //console.log('rcveMsg from=%s data=%s', JSON.stringify(from), JSON.stringify(data));
            dropRespHandler(data);
        }
        else if ( resp == 'get' ) {
            getRespHandler(data);
        }
        else if ( resp == 'status' ){
            getRespHandler(data);
        }
        else if ( resp == 'playlist' ){
            playlistRespHandler(data);
        }
    }
    /*
    if ( typeof data == 'object'){
        $.con.out(from + ' ' + JSON.stringify(data),'rcve');
    }
    else if ( typeof data == 'string'){
        $.con.out(from + ' ' + data, 'rcve');
    }
    */
}
/*
var mmsCallXrpc = function(target, func, args){
    var str;
    if ( target != '' && func != '' && args != '' ){
        str = target + " " + func + " " +  args;
        //$.con.out(str,'send');
		console.log(str,'send');
        mms.CallMMS( target, func, args, function(reply){
            if ( typeof reply == 'object')
                //$.con.out('xprcCall result ' + JSON.stringify(reply), 'rcve');
                //$.con.out(JSON.stringify(reply), 'state');
				console.log(JSON.stringify(reply), 'state');
            else if ( typeof reply == 'string')
                //$.con.out('xprcCall result ' + reply, 'rcve');
                //$.con.out(reply, 'state');
				console.log(reply, 'state');
            else
                //$.con.out('reply type error', 'state');
				console.log('reply type error', 'state');
        });
    }
    else {
        //$.con.out('invalid input', 'state');
		console.log('invalid input', 'state');
    }
}
*/
var mmsGetDevice = function(cb){
    mms.StateMMS('get', 'device', '', function(reply){
        //console.log('GetDevice reply=%s', JSON.stringify(reply));
        if ( typeof cb == 'function' ) cb(reply);
    });
}
/*
var mmsSetDevice = function(setting, cb){
    mms.StateMMS('set', 'device', setting, function(reply){
        //console.log('SetDevice reply=%s', JSON.stringify(reply));
        if ( typeof cb == 'function' ) cb(reply);
    });
}
*/
var mmsNearby = function(cb){
    mms.StateMMS('nearby', '', '', function(reply){
        if ( typeof cb == 'function' ) cb(reply);
    });
}



