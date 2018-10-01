//  MMS: MMS class
//  input: none
//  output: none
//  Sample code:
//	    var WebMMS;
//	    WebMMS = new MMS(app, ws);
//      Input:
//          app: name of app.
//          ws: URL of websocket server, '' means local host
//

function MMS(app, ws) {
    var wsOK, inOK, wsStat;
    var rcveMsg;
    var EiToken = '';
    var SToken = '';
    var DDN = '';
    var AppId = app;
    var wsUrl = ws;
    var dcStat = '';
    var CookieExpireDay = 365;
    var wip = '';
    var getipurl = 'http://boss.ypcall.com:8089';

    $.ajax({
        type: "GET",
        url: getipurl,
        crossDomain: true,
        timeout: 3000,
        success: function(response) {
            //console.log(response);
            wip = response;
        },
        error: function(jqXHR, textStatus, err) {
            //show error message
            console.log('status:%s, err:%s', textStatus, err.message);
        }
    });

    // OpenMMS : open MMS service
    //
    // input:
    //		sockOK: callback after register to websocket server
    //      regdOK: callback after register to dCenter, no callback means that the app doesn't want to register to mCenter
    //		sockState: callback when websocket state changed
	//		rcvecb: callback when websocket receive a message    
    //
    // Sample code:    
    //      WebMMS = new MMS();
    //		WebMMS.OpenMMS( regwsOK, regdOK, wsState, rcveMsg );
    //      var regwsOK = function(result){
    //          console.log('regWS OK %s', result.numUsers);
    //      }
    //      var wsState = function(result){
    //          console.log(WS error: %s', result);
    //      }
    //      var regdOK = function(result){
    //          console.log('regtoCenter: %s', result.ErrMsg);
    //      } 
    //      var rcveMsg = function(from, data){
    //          console.log('reve: from=%s, data=%s', from, JSON.stringify(data));    
    //      } 
    //
    this.OpenMMS = function( sockOK, regdOK, sockState, rcvecb ){ 
        if ( typeof sockOK == 'function') wsOK = sockOK;
        if ( typeof regdOK == 'function') inOK = regdOK;
        if ( typeof sockState == 'function') wsStat = sockState;
        if ( typeof rcvecb == 'function') rcveMsg = rcvecb;
        $.wsock.Init( _WebState, wsUrl );
        $.wsock.rcveHandler = rcvecb;
    }

    var _WebState = function(state){
        //console.log('WebState state=%s', state);
        if ( state == 'websocket connected' ){
            if ( typeof wsOK == 'function' ) wsOK(state);
            var saved = _GetCookie();
            //console.log('WebState: GetCookie=%s', JSON.stringify(saved));
            EiToken = saved.EiToken;
            SToken = saved.SToken;
            UToken = saved.UToken;
            var tm = 200 + Math.floor((Math.random() * 10) + 1) * 100;
            setTimeout(function(){
                if ( typeof wsStat == 'function' ) wsStat('wanip='+wip);
                $.mbus.RegToCenter(EiToken, SToken, wip, function(reply){
                    if ( reply.ErrCode == mmserr.OK.code ){
                        EiToken = reply.result.EiToken;
                        SToken = reply.result.SToken;
                        //console.log('EiToken=%s,SToken=%s', EiToken, SToken);
                        _SetCookie( EiToken, SToken, '', CookieExpireDay);
                        dcStat = 'conn';
                    }
                    if ( typeof inOK == 'function' ) inOK(reply);
                });
            },tm);
            //if ( typeof wsOK == 'function' ) wsOK(state);
        }
        else if ( state == 'websocket disconnect'){
            if ( typeof wsStat == 'function') {
                wsStat(state);
            }
        }
        else if ( state == 'websocket re-connected' ){
            if ( typeof wsStat == 'function') wsStat(state);
            var tm = 2000 + Math.floor((Math.random() * 10) + 1) * 100;
            setTimeout(function(){
                //console.log('websocket re-connected: RegToCenter EiToken=%s,SToken=%s', EiToken, SToken);
                $.mbus.RegToCenter(EiToken,SToken, wip, function(reply){
                    if ( reply.ErrCode == mmserr.OK.code ){
                        EiToken = reply.result.EiToken;
                        SToken = reply.result.SToken;
                        //console.log('EiToken=%s,SToken=%s', EiToken, SToken);
                        _SetCookie( EiToken, SToken, '', CookieExpireDay);
                        dcStat = 'conn';
                    }
                    if ( typeof inOK == 'function' ) inOK(reply);
                });
            },tm);    
        }
        else {
            console.log('WebState: state=%s', state);
            if ( typeof wsStat == 'function') wsStat(state);
        }
    }

    // SendMMS : send message to other devices
    //
    // input:
	//		target: target to be sent:
    //		data: data to be sent
	//		cb: callback of return (option)
    //
    // Sample code:
    //      var target = 'ylobby';      
    //      var data = 'notify Hello 60 red 3';
    //      var WebMMS = new MMS();
    //		WebMMS.SendMMS( to, data, 
    //          function(result){
    //              console.log('SendMMS: result=%s', JSON.stringify(result));
    //          }
    //      );
    //    
    this.SendMMS = function(target, data, cb){
        //console.log('SendMMS: target=%s, data=%s', target, JSON.stringify(data));
        $.mbus.XmsgSend(target, data, function(result){
            if ( typeof cb == 'function') cb(result);
        });
    }

    // StateMMS : Set or Get motechat state or information
    //
    // input:
	//		cmd: command:
	// 			list of command:
    //			"nearby": get mbus device nearby
    //          "search": search device
    //			"get": get state or information, depond on arg
    //          "set": get state or information, depond on arg and argv
    //		arg: argument of the command
    //      argv: value of the argument
	//		cb: callback of return
    //
    // Descroption:
    // nearby: query nearby motebus device from mCenter
    //      var WebMMS = new MMS();
    //		WebMMS.StateMMS( 'nearby', '', '', 
    //          function(devlist){
    //              console.log('nearby: list=%s', JSON.stringify(devlist));
    //          }
    //      );
    //
    // get device: get my device information
    //      var WebMMS = new MMS();
    //      WebMMS.StateMMS( 'get', 'device', '',
	//		    function(info) {
	//			    console.log('get device: info=%s', JSON.stringify(info));
    //		    }
    //      );
    //
    // set device: set my device information
    //      var EiInfo = {"DDN":"","EiOwner":"","EiName","eiHello","EiType":".mc","EiTag:"#hello","EiLog":""};
    //      var WebMMS = new MMS();
    //      WebMMS.StateMMS( 'set', 'device', EiInfo,
	//		    function(result) {
	//			    console.log('set device: result=%s', JSON.stringify(result));
    //		    }
    //      );
    // get app: get my app information
    //      var WebMMS = new MMS();
    //      WebMMS.StateMMS( 'get', 'app', '',
	//		    function(info) {
	//			    console.log('get app: info=%s', JSON.stringify(info));
    //		    }
    //      );
    //
    // set app: set my app information
    //      var AppInfo = {"Address":"","Face":"","Mirror":"","MoteWeb":"","AppWeb":"","AppData":""};
    //      var WebMMS = new MMS();
    //      WebMMS.StateMMS( 'set', 'app', AppInfo,
	//		    function(result) {
	//			    console.log('set app: result=%s', JSON.stringify(result));
    //		    }
    //      );
    //				
    this.StateMMS = function(cmd, arg, argv, cb){
        var qcmd = cmd;
        if ( qcmd != '' ) qcmd = qcmd.toLowerCase();
        switch(qcmd){
            case 'nearby':
                _Nearby( cb );
                break;
            case 'get':
                var opt = arg;
                if ( opt != '' ) opt = opt.toLowerCase();
                switch( opt ){
                    case 'device':
                        _GetDeviceInfo( cb );
                        break;
                    case 'app':
                        _GetAppSetting( cb );
                        break;
                    default:
                        if ( typeof cb == 'function') {
                            var ret = {"ErrCode":mmserr.InvalidData.code,"ErrMsg":msmerr.InvalidData.msg};
                            cb(ret);
                        }
                        break;
                }
                break;
            case 'set':
                var opt = arg;
                if ( opt != '' ) opt = opt.toLowerCase();
                switch( opt ){
                    case 'device':
                        _SetDeviceInfo( argv, cb );
                        break;
                    case 'app':
                        _SetAppSetting( argv, cb );
                        break;
                    default:
                        if ( typeof cb == 'function') {
                            var ret = {"ErrCode":mmserr.InvalidCmd.code,"ErrMsg":mmserr.InvalidCmd.msg};
                            cb(ret);
                        }
                        break;
                }
                break;
            default:
                if ( typeof cb == 'function') {
                    var ret = {"ErrCode":mmserr.NullCmd.code,"ErrMsg":mmserr.NullCmd.msg};
                    cb(ret);
                }
                break;
        }
    }
    
    // CallMMS : call function of the device
    //
    // input:
	//		target: target device
    //		func: function name of XRPC
    //      args: arguments of function
	//		cb: callback of return
    //
    // Sample code:
    //      var target = 'jLobby';
    //      var func = 'mbus'      
    //      var args = {"target":"yscreen","data":"drop http://cdn.ypcall.com/miki/yp/djdemo/sugar.mp4"};
    //      var WebMMS = new MMS();
    //      ...
    //		WebMMS.CallMMS( app, func, args, 
    //          function(result){
    //              console.log('CallMMS: result=%s', JSON.stringify(result));
    //          }
    //      );
    //    
    this.CallMMS = function(target, func, args, cb){
        //console.log('CallMMS: target=%s, func=%s, args=%s', target, func, JSON.stringify(args));
        $.mbus.XrpcCall(target, func, args,
            function(reply) {
                if ( typeof cb == 'function' ) cb(reply);
            }
        );
    }

    // internal used function
    var _Nearby = function(cb){
        //console.log('webmms:Nearby SToken=%s', SToken);
        if ( dcStat == 'conn' ){
            if ( SToken != '' )
                $.mbus.Nearby( SToken, cb );
            else {
                if ( typeof cb == 'function' ){
                    var ret = {"ErrCode":mmserr.NullSToken.code,"ErrMsg":mmserr.NullSToken.msg};
                    cb(ret);
                }
            }
        }
        else {
            if ( typeof cb == 'function' ){
                var ret = {"ErrCode":mmserr.DCNotConn.code,"ErrMsg":mmserr.DCNotConn.msg};
                cb(ret);
            }
        }    
    }

    var _GetDeviceInfo = function( cb ){
        //console.log('webmms:GetDeviceInfo SToken=%s', SToken);
        if ( dcStat == 'conn' ){
            if ( SToken != '' )
                $.mbus.GetDeviceInfo( SToken, cb );
            else {
                if ( typeof cb == 'function' ){
                    var ret = {"ErrCode":mmserr.NullSToken.code,"ErrMsg":mmserr.NullSToken.msg};
                    cb(ret);
                }
            }
        }
        else {
            if ( typeof cb == 'function' ){
                var ret = {"ErrCode":mmserr.DCNotConn,"ErrMsg":mmserr.DCNotConn.msg};
                cb(ret);
            }
        }
    }

    var _SetDeviceInfo = function( DeviceInfo, cb ){
        //console.log('webmms:SetDeviceInfo DeviceInfo=%s', JSON.stringify( DeviceInfo ));
        if ( dcStat == 'conn' ){
            if ( SToken!= '' )
                $.mbus.SetDeviceInfo( SToken, DeviceInfo, cb );
            else {
                if ( typeof cb == 'function' ){
                    var ret = {"ErrCode":mmserr.NullSToken.code,"ErrMsg":errmsg.NullSToken.msg};
                    cb(ret);
                }
            }
        }
        else {
            if ( typeof cb == 'function' ){
                var ret = {"ErrCode":mmserr.DCNotConn.code,"ErrMsg":errmsg.DCNotConn.msg};
                cb(ret);
            }
        }
    }

    var _GetAppSetting = function( cb ){
        //console.log('webmms:GetDeviceInfo SToken=%s', SToken);
        if ( dcStat == 'conn' ){
            if ( SToken != '' )
                $.mbus.GetAppSetting( SToken, cb );
            else {
                if ( typeof cb == 'function' ){
                    var ret = {"ErrCode":mmserr.NullSToken.code,"ErrMsg":mmserr.NullSToken.msg};
                    cb(ret);
                }
            }
        }
        else {
            if ( typeof cb == 'function' ){
                var ret = {"ErrCode":mmserr.DCNotConn.code,"ErrMsg":mmserr.DCNotConn.msg};
                cb(ret);
            }
        }
    }

    var _SetAppSetting = function( AppSetting, cb ){
        //console.log('webmms:SetDeviceInfo DeviceInfo=%s', JSON.stringify( DeviceInfo ));
        if ( dcStat == 'conn' ){
            if ( SToken!= '' )
                $.mbus.SetAppSetting( SToken, AppSetting, cb );
            else {
                if ( typeof cb == 'function' ){
                    var ret = {"ErrCode":mmserr.NullSToken.code,"ErrMsg":mmserr.NullSToken.msg};
                    cb(ret);
                }
            }
        }
        else {
            if ( typeof cb == 'function' ){
                var ret = {"ErrCode":mmserr.DCNotConn.code,"ErrMsg":mmserr.DCNotConn.msg};
                cb(ret);
            }
        }
    }


    var _SetCookie = function(EiToken,SToken,UToken,exdays){
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = d.toUTCString();
        if ( AppId == '' ){
            _DoSetCookie('EiToken', EiToken, expires, '/');
            _DoSetCookie('SToken', SToken, expires, '/');
            _DoSetCookie('UToken', UToken, expires, '/');
        }
        else {
            var parm = EiToken + '.' + SToken + '.' + UToken;
            _DoSetCookie( AppId, parm, expires, '/'); 
        }
    }

    var _DoSetCookie = function( arg, argv, expires, path ){
        var saved = arg + '=' + argv + ';expires=' + expires + ';path=' + path;
        document.cookie = saved;
    }
    
    var _GetCookie = function(){
        var ret = {"EiToken":"","SToken":"","UToken":""};
        var ca = document.cookie.split(';');
        //console.log('GetCookie=%s', JSON.stringify(ca));
        if ( AppId == '' ){
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                var arg = c.split('=');
                if ( arg[0] == 'EiToken') ret.EiToken = arg[1];
                else if ( arg[0] == 'SToken' ) ret.SToken = arg[1];
                else if ( arg[0] == 'UToken' ) ret.UToken = arg[1];
            }
        }
        else {
            var conf = '';
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                var arg = c.split('=');
                if ( arg[0] == AppId ) {
                    conf = arg[1];
                    break;
                }
            }
            if ( conf != '' ){
                var parr = conf.split('.');
                if ( parr.length == 3 ){
                    ret.EiToken = parr[0];
                    ret.SToken = parr[1];
                    ret.UToken = parr[2];
                }
            }
        }
        return ret;
    }
}

$.mbus = {
    mlist: [],
    RegToCenter: function( EiToken, SToken, wip, cb ){
        //console.log('regtoCenter: data=%s', JSON.stringify(data));
        var rdata = {"EiToken":EiToken,"SToken":SToken,"WIP":wip};
        var req = {"func":"regdc","data":rdata};
        //console.log('RegToCenter: req=%s', JSON.stringify(req));
        $.wsock.sendSocketMsg(req,
            function(reply){
                //console.log('webmms:RegToDcenter reply=%s', JSON.stringify(reply));
                if ( typeof cb == 'function' ) cb(reply);
            }
        ); 
    },
    UnregToCenter: function( SToken ){
        $.wsock.sendSocketMsg({"func":"unregdc","SToken":SToken},
            function(reply){
                
            }
        );    
    },
    GetDeviceInfo: function( SToken, cb ){
        var rdata = {"SToken":SToken};
        var req = {"func":"getinfo","data":rdata};
        //console.log('GetDeviceInfo: req=%s', JSON.stringify(req));
        $.wsock.sendSocketMsg(req,
            function(reply){
                //console.log('webmms:GetDeviceInfo result=%s', JSON.stringify(reply));
                if ( typeof cb == 'function' ) cb(reply);
            }
        ); 
    },
    SetDeviceInfo: function( SToken, DeviceInfo, cb ){
        var rdata = {"SToken":SToken,"EdgeInfo":DeviceInfo};
        var req = {"func":"setinfo","data":rdata};
        //console.log('GetDeviceInfo: req=%s', JSON.stringify(req));
        $.wsock.sendSocketMsg(req,
            function(reply){
                //console.log('webmms:SetDeviceInfo result=%s', JSON.stringify(reply));
                if ( typeof cb == 'function' ) cb(reply);
            }
        ); 
    },
    GetAppSetting: function( SToken, cb ){
        var rdata = {"SToken":SToken};
        var req = {"func":"getapp","data":rdata};
        //console.log('GetAppSetting: req=%s', JSON.stringify(req));
        $.wsock.sendSocketMsg(req,
            function(reply){
                //console.log('webmms:GetAppSetting result=%s', JSON.stringify(reply));
                if ( typeof cb == 'function' ) cb(reply);
            }
        ); 
    },
    SetAppSetting: function( SToken, Setting, cb ){
        var rdata = {"SToken":SToken,"Setting":JSON.stringify(Setting)};
        var req = {"func":"setapp","data":rdata};
        //console.log('SetAppSetting: req=%s', JSON.stringify(req));
        $.wsock.sendSocketMsg(req,
            function(reply){
                //console.log('webmms:SetAppSetting result=%s', JSON.stringify(reply));
                if ( typeof cb == 'function' ) cb(reply);
            }
        ); 
    },
    Nearby: function( SToken, cb ) {
	    var rdata = {"SToken":SToken};
        var req = {"func":"nearby","data":rdata};
        //console.log('Nearby: req=%s', JSON.stringify(req));
        $.wsock.sendSocketMsg(req,
            function(reply){
                //console.log('webmms:Nearby result=%s', JSON.stringify(reply));
                if ( typeof cb == 'function' ) cb(reply);
            }
        ); 
    },
    XrpcStart: function(cb){
        $.wsock.sendSocketMsg({"func":"xrpcStart"}, 
            function(reply){
                //console.log('XrpcStart: reply=%s', JSON.stringify(reply));
            }    
        );
    },
    XrpcCall: function(target, func, args, cb){
        $.wsock.sendSocketMsg({"func":"call","data":{"target":target,"func":func,"args":args}}, 
            function(reply){
                if ( typeof cb == 'function' ) {
                    if ( typeof reply == 'object') cb(reply);
                    else if ( typeof reply == 'string' ) cb(reply);
                }
            }
        );
    },
    XmsgSend: function(target, data, cb){
        $.wsock.sendSocketMsg({"func":"send","body":{"target":target,"data":data}}, 
            function(reply){
                if ( typeof cb == 'function' ) {
                    if ( typeof reply == 'object') cb(reply);
                    else if ( typeof reply == 'string' ) cb(reply);
                }
            }
        );
    }
}

mmserr = {
    "OK":{"code":0,"msg":"OK"},
    "InvalidData":{"code":-10501,"msg":"mms: invalid data"},
    "InvalidCmd": {"code":-10502,"msg":"mms: invalid command"},
    "NullSToken":{"code":-10503,"msg":"mms: null stoken"},
    "DCNotConn":{"code":-10504,"msg":"mms: DC not connected"},
    "NullCmd":{"code":-10505,"msg":"mms: null command"}
}

