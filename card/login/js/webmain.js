// main 
const app = 'motechat';
const devType = '.mc';
var mms;
var UserInfo = {"UToken":"","Uid":"","UserName":"","NickName":"","MobileNo":"","Sex":"","EmailVerified":false,"MobileVerified":false};
var EdgeInfo = {"DDN":"","Owner":"","Name":"","Type":devType,"Tag":"","Loc":"","UserInfo":UserInfo};
var mcState = '';
var islogin = false;
var nearbylist = [];
const wsockserver = 'http://boss.ypcloud.com:88';

$(function(){
    //$('#nav_page').show();
    //$('#disp_page').show();
    //$('#xrpcdiv').show();
    startmms(app, wsockserver,regwsOK, regdcOK);
    
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
    $('#near_nav').on('click', function(e){
        e.preventDefault();
        //getMotelist();
        getNearby();
    });
    $('#mbus_nav').on('click', function(e){
        e.preventDefault();
        startmbus();
    });
    $('#xrpc_nav').on('click', function(e){
        e.preventDefault();
        startxrpc();
    });*/
	/******************************目前未使用***********************************/
	/*
    $('#logout_nav').on('click', function(e){ 
        e.preventDefault();
        if ( islogin == true ){
            mmsCallUC('logout', [], function(reply){
                if ( typeof reply == 'object' ) console.log('webmain: logout reply=%s', JSON.stringify(reply));
                else console.log('webmain: logout reply=%s', reply);
                islogin = false;
                var UserInfo = {"UToken":"","Uid":"","UserName":"","NickName":"","MobileNo":"","Sex":"","EmailVerified":false,"MobileVerified":false};
                EdgeInfo.UserInfo = UserInfo;
                setTimeout(function(){
                    startLogin();
                }, 1000);
            });    
        }
    });
	*/
    // button event handler
	/*
    $('#send_btn_xmsg').on('click', function(e){
        e.preventDefault();
        var target = $('#target_xmsg').val();
        var data = $('#msg_xmsg').val();
        mmsSendXmsg(target, data);
    });
    $('#clear_btn_xmsg').on('click', function(e){
        e.preventDefault();
        clearConsole();
    });
    $('#save_btn_setting').on('click', function(e){
        e.preventDefault();
        saveMoteSetting();
    });
    $('#send_btn_xrpc').on('click', function(e){
        e.preventDefault();
        var target = $('#target_xrpc').val();
        var func = $('#func_xrpc').val();
        var args = $('#arg_xrpc').val();
        mmsCallXrpc(target, func, args);
    });
    $('#clear_btn_xrpc').on('click', function(e){
        e.preventDefault();
        clearConsole();
    });
	*/
    // button of loginh
    $('#submit_btn_login').on('click', function(e){
		console.log("submit_btn_login click!!!");
        e.preventDefault();
        var email = $('#email_login').val();
        var pwd = $('#pwd_login').val();
        var keep = false;
		
        if ( email != '' && pwd != '' ){
            mmsCallUC('login', [email, pwd, keep], function(reply){
                if ( typeof reply == 'object' ) console.log('webmain: login reply=%s', JSON.stringify(reply));
                else console.log('webmain: login reply=%s', reply);
                if ( typeof reply.ErrCode == 'undefined' ){
                    if ( typeof reply.UToken == 'string' ){
                        if ( reply.UToken != '' )
                            EdgeInfo.UserInfo = JSON.parse(JSON.stringify(reply));
                        islogin = true;
                        //$.con.out('uc login: OK','state');
                        $('#result_login').html('UC Login: OK');
                        EdgeInfo.UserInfo.UToken = reply.UToken ? reply.UToken : '';
                        EdgeInfo.UserInfo.Uid = reply.Uid ? reply.Uid : '';
                        EdgeInfo.UserInfo.UserName = reply.UserName ? reply.UserName : '';
                        EdgeInfo.UserInfo.NickName = reply.NickName ? reply.NickName : '';
                        EdgeInfo.UserInfo.MobileNo = reply.MobileNo ? reply.MobileNo : '';
                        EdgeInfo.UserInfo.Sex = reply.Sex ? reply.Sex : '';
                        EdgeInfo.UserInfo.EmailVerified = reply.EmailVerified ? reply.EmailVerified : '';
                        EdgeInfo.UserInfo.MobileVerified = reply.MobileVerified ? reply.MobileVerified : '';
                        var uname = '';
                        uname = EdgeInfo.UserInfo.NickName != '' ? EdgeInfo.UserInfo.NickName : EdgeInfo.UserInfo.UserName;
                        //$('#uname_disp').html(uname);
                        setTimeout(function(){startMain();}, 3000);
                    }
                }
                else {
                    $('#result_login').html(reply.ErrMsg);
                    //$.con.out('uc login:' + reply.ErrMsg,'state');
                }
            });
        }else{
			$('#result_login').html("Incomplete information");
		}
    });
    $('#signup_btn_login').on('click', function(e){
		console.log("signup_btn_login click!!!");
        e.preventDefault();
        $('#login_page').hide();
        $('#signup_page').show();
    });

    // button of signup
    $('#login_btn_signup').on('click', function(e){
		console.log("login_btn_signup click ~~Back to login_page!!!");
        e.preventDefault();
        $('#signup_page').hide();
        $('#login_page').show();
    });
    $('#submit_btn_signup').on('click', function(e){
		console.log("submit_btn_signup click!!!");
        e.preventDefault();
        var uname = $('#uname_signup').val();
        var email = $('#email_signup').val();
        var pwd = $('#pwd_signup').val();
        var pwd2 = $('#pwd2_signup').val();
        if ( uname != '' && email != '' && pwd != '' && pwd2 != '' && pwd == pwd2 ){
            var usrinfo = {"NickName":uname};
            mmsCallUC('signup', [email, pwd, usrinfo], function(reply){
                if ( typeof reply == 'object' ) console.log('webmain: signup reply=%s', JSON.stringify(reply));
                else console.log('webmain: signup reply=%s', reply);
                if ( typeof reply.ErrCode == 'undefined' ){
                    if ( typeof reply.NickName == 'string' ){
                        //if ( reply.NickName != '' )
                        //    EdgeInfo.UserInfo = JSON.parse(JSON.stringify(reply));
                        //$.con.out('uc signup: OK','state');
                        $('#result_signup').html('UC Signup: OK');
                        setTimeout(function(){startMain();}, 3000);
                        //$('#signup_page').hide();
                        //$('#login_page').show();
                    }
                }
                else {
                    //$.con.out('uc signup:' + reply.ErrMsg,'state');
                }
            });    
        }
		else{
			$('#result_signup').html('UC Signup: incorrect!!!!');
		}
    });
});


// connect and register to websocket server OK callback
var regwsOK = function(result){
    //$.con.out('ws: ' + result,'state');
	console.log('ws: ' + result,'state');
    mcState = 'web';
    //buildMsglist();
    //buildFunclist();
    //buildArglist();
    //buildUrllist();
    //buildDatalist();   
}

var wsStat = function(result){
    mcState = 'web error';
    //$.con.out('ws state:' + result,'state');
	console.log('ws state:' + result,'state');
}

// register to DCenter OK callback
var regdcOK = function(reply){
    //console.log('regdOK result=%s', JSON.stringify(result));
    var str = 'reg: ' + ' ' + reply.ErrMsg;
    //$.con.out(str,'state');
	console.log(str,'state');
    if ( reply.ErrCode == 0 ){
        EdgeInfo.DDN = reply.result.DDN;
        EdgeInfo.Owner = reply.result.EiOwner ? reply.result.EiOwner : '';
        EdgeInfo.Name = reply.result.EiName ? reply.result.EiName : '';
        EdgeInfo.Tag = reply.result.EiTag ? reply.result.EiTag : '';
        EdgeInfo.Loc = reply.result.EiLoc ? reply.result.EiLoc : '';
        console.log('webmain:regdOK EdgeInfo=%s', JSON.stringify(EdgeInfo));
        //buildSettingValue();
        mcState = 'dc';
        EdgeInfo.UserInfo.UToken = reply.result.UToken ? reply.result.UToken : '';
        EdgeInfo.UserInfo.Uid = reply.result.Uid ? reply.result.Uid : '';
        EdgeInfo.UserInfo.UserName = reply.result.UserName ? reply.result.UserName : '';
        EdgeInfo.UserInfo.NickName = reply.result.NickName ? reply.result.NickName : '';
        EdgeInfo.UserInfo.MobileNo = reply.result.MobileNo ? reply.result.MobileNo : '';
        EdgeInfo.UserInfo.Sex = reply.result.Sex ? reply.result.Sex : '';
        EdgeInfo.UserInfo.EmailVerified = reply.result.EmailVerified ? reply.result.EmailVerified : '';
        EdgeInfo.UserInfo.MobileVerified = reply.result.MobileVerified ? reply.result.MobileVerified : '';
        if ( EdgeInfo.UserInfo.Uid != '' ) islogin = true;
        if ( islogin == true ) {
            //$.con.out('uc login: OK','state');
            var uname = '';
            uname = EdgeInfo.UserInfo.NickName != '' ? EdgeInfo.UserInfo.NickName : EdgeInfo.UserInfo.UserName;
            //$('#uname_disp').html(uname);
            $('#disp_page').show();
            //$('#xrpcdiv').show();
        }
        else  $('#login_page').show();
    }
} 

var startMain = function(){
	window.location.replace("http://web.jujue.tv");
	/*
    $('#result_login').empty();
    $('#login_page').hide();
    $('#result_signup').empty();
    $('#signup_page').hide();
    $('#set_page').hide();
    $('#xrpcdiv').show();
    $('#disp_page').show();
	*/
}
/*-------------------------未使用----------------------------------*/
var startLogin = function(){
    $('#result_login').empty();
    $('#uname_disp').html('');
    $('#set_page').hide();
    $('#disp_page').hide();
    $('#login_page').show();
}
/*-------------------------未使用----------------------------------*/
var startmbus = function(){
    $('#xrpcdiv').hide();
    $('#xmsgdiv').show();
}
/*-------------------------未使用----------------------------------*/
var startxrpc = function(){
    $('#xmsgdiv').hide();
    $('#xrpcdiv').show();
}
/*-------------------------未使用----------------------------------*/
var startSetting = function(){
    //alert('startSetting');
    $('#disp_page').hide();
    $('#set_page').show();
}
/*-------------------------未使用----------------------------------*/
var buildDevicelist = function(nrlist){
    var i, len, dev, dname, dtype, sname;
    var datalist = [];
    nearbylist = [];
    nearbylist = nrlist.slice();
    for ( var i = 0; i < nearbylist.length; i++ ){
        if ( nearbylist[i].EiName != null )
            dname = nearbylist[i].EiName;
        else
            dname = nearbylist[i].DDN;
        if ( nearbylist[i].EiType != null )
            dtype = nearbylist[i].EiType;
        else
            dtype = '';
        if ( dtype != '' ) sname = dname + ' [' + dtype + ']';
        else sname = dname;
        if ( sname != '' ) datalist.push({"name":sname,"value":dname});
    }
    if ( datalist.length > 0 ){
        fillSelectOption( 'dev_select', 'target_xmsg', datalist);
        fillSelectOption( 'xrpc_select', 'target_xrpc', datalist);
    }
}
/*-------------------------未使用----------------------------------*/
var buildMsglist = function(){
    fillSelectOption( 'msg_select', 'msg_xmsg', msgsample);
}
/*-------------------------未使用----------------------------------*/
var fillSelectOption = function( id, vid, data ){
    var i, len, dev;
    $('#' + id).off('change');
    $('#' + id).empty();
    var options = '<option value="" style="background-color:gray">Select sample</option>';
    len = data.length;
    for (i = 0; i < len; i++) {
        options += '<option value="' +
            i.toString() + '">' +
            data[i].name +
            '</option>';
    }
    $('#' + id).append(options);
    $('#' + id).on('change',function(e){
        e.preventDefault();
        //alert('select: ' + this.value);
        var v = this.value;
        var val, str;
        if ( v != ''){
            var index = parseInt(v);
            var val = data[index].value;
            if ( typeof val == 'object') str = JSON.stringify(val);
            else str = val;
            $('#' + vid).val(str);
        }
    });
}
/*-------------------------未使用----------------------------------*/
var buildFunclist = function(){
    fillSelectOption( 'func_select', 'func_xrpc', xrpcfuncsample);
}
/*-------------------------未使用----------------------------------*/
var buildArglist = function(){
    fillSelectOption( 'arg_select', 'arg_xrpc', msgsample);
}
/*-------------------------未使用----------------------------------*/
var buildUrllist = function(){
    fillSelectOption( 'url_select', 'url_rest', resturlsample);
}
/*-------------------------未使用----------------------------------*/
var buildDatalist = function(){
    fillSelectOption( 'data_select', 'data_rest', restargsample);
}
/*-------------------------未使用----------------------------------*/
var buildSettingValue = function()
{
    $('#set_ddn').val(EdgeInfo.DDN);
    $('#set_owner').val(EdgeInfo.Owner);
    $('#set_name').val(EdgeInfo.Name);
    $('#set_type').val(EdgeInfo.Type);
    $('#set_tag').val(EdgeInfo.Tag);
    $('#set_location').val(EdgeInfo.Loc);
}
/*-------------------------未使用----------------------------------*/
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
        console.log('webmain:saveMoteSetting reply=%s', JSON.stringify(reply));
        BootstrapDialog.alert({"title":"SetDevice","message":reply.ErrMsg});
    });
}
/*-------------------------未使用----------------------------------*/
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
                    if (ei.DDN != null) ddn = ei.DDN;
                    else ddn = '';
                    if (ei.EiName != null) dname = ei.EiName;
                    else dname = '';
                    if ( ei.EiType != null) dtype = ei.EiType;
                    else dtype = '';
                    str += '<tr><td>'+m.toString()+'</td><td>'+ddn+'</td><td>'+dname+'</td><td>'+dtype+'</td></tr>'
                }
                str += '</tbody>';
                str += '</table>';
                buildDevicelist(reply.result);
            }
            else str = 'no device';
        }
        else {
            str = reply.ErrMsg;
        }
        BootstrapDialog.alert({"title":"NearBy","message":str});
    });
}
/*-------------------------未使用----------------------------------*/
var clearConsole = function()
{
    //$.con.clear();
}
// uc function
/*-------------------------未使用----------------------------------*/
var chkLogin = function(){

}
// mms api function

var startmms = function(appname, wurl, wscb, dccb){
    mms= new MMS(appname, wurl);
    mms.OpenMMS( wscb, dccb, wsStat, rcveMsg);
    //$.con.out('mms: open: ' + wurl,'state');
}
/*-------------------------未使用----------------------------------*/
var mmsSendXmsg = function(target, data, cb){
    var str;
    //alert('send cmd: to=' + to + ',msg=' + msg);
    if ( typeof data == 'object' ) sdata = JSON.stringify(data);
    else sdata = data;
    if ( target != '' && sdata != ''){
        str = target + " " + sdata;
        //$.con.out( str, 'send');
        mms.SendMMS( target, data, function(result){
            var str = 'send: ';
            str += JSON.stringify(result);
            //if ( typeof result.State == 'string' ) str += result.State;
            //else str += result.ErrMsg;
            //$.con.out(str, 'state');
            if ( typeof cb == 'function' ) cb(result);
        } );
    }
}

// receive x-message callback from websocket
var rcveMsg = function(from, data){
    if ( typeof data == 'object'){
        //$.con.out(from + ' ' + JSON.stringify(data),'rcve');
    }
    else if ( typeof data == 'string'){
        //$.con.out(from + ' ' + data, 'rcve');
    }
}
/*-------------------------未使用----------------------------------*/
var mmsCallXrpc = function(target, func, args, cb){
    if ( typeof args == 'object') sarg = JSON.stringify(args);
    else sarg = args;
    if ( target != '' && func != '' && sarg != '' ){
        str = target + " " + func + " " +  sarg;
        //$.con.out(str,'send');
        mms.CallMMS( target, func, args, function(reply){
            if ( typeof reply == 'object'){
                //$.con.out('xprcCall result ' + JSON.stringify(reply), 'rcve');
                //$.con.out(JSON.stringify(reply), 'state');
			}
            else if ( typeof reply == 'string'){
                //$.con.out('xprcCall result ' + reply, 'rcve');
               //$.con.out(reply, 'state');
			}
            else{
                //$.con.out('reply type error', 'state');
			}
            if ( typeof cb == 'function' ) cb(reply);
        });
    }
    else {
        //$.con.out('invalid input', 'state');
    }
}
/*-------------------------未使用----------------------------------*/
var mmsGetDevice = function(cb){
    mms.StateMMS('get', 'device', '', function(reply){
        console.log('GetDevice reply=%s', JSON.stringify(reply));
        if ( typeof cb == 'function' ) cb(reply);
    });
}
/*-------------------------未使用----------------------------------*/
var mmsSetDevice = function(setting, cb){
    mms.StateMMS('set', 'device', setting, function(reply){
        console.log('SetDevice reply=%s', JSON.stringify(reply));
        if ( typeof cb == 'function' ) cb(reply);
    });
}
/*-------------------------未使用----------------------------------*/
var mmsNearby = function(cb){
    mms.StateMMS('nearby', '', '', function(reply){
        if ( typeof cb == 'function' ) cb(reply);
    });
}

var mmsCallUC = function( func, args, cb ){
    console.log('webmain: mmsCallUC func=%s, args=%s', func, JSON.stringify(args));
    switch( func ){
        case 'login':
            // args: [UserName, Password, KeepLogin]
            mms.CallMMS('UC', 'ucLogin', args, function(reply){
                if ( typeof cb == 'function' ) cb(reply);
            });
            break;
        case 'checklogin':
            // args: [UserName]
            mms.CallMMS('UC', 'ucCheckUser', args, function(reply){
                if ( typeof cb == 'function' ) cb(reply);
            });
            break;
        case 'signup':
            // args: [UserName, Password, UserInfo]
            // UserInfo: {MobileNo, NickName, FirstName, LastName, Sex}
            mms.CallMMS('UC', 'ucSignup', args, function(reply){
                if ( typeof cb == 'function' ) cb(reply);
            });
            break;
        case 'logout':
            // args: []
            mms.CallMMS('UC', 'ucLogout', args, function(reply){
                if ( typeof cb == 'function' ) cb(reply);
            });
            break;
        case 'getinfo':
            // args: []
            mms.CallMMS('UC', 'ucGetUserInfo', args, function(reply){
                if ( typeof cb == 'function' ) cb(reply);
            });
            break;
        case 'setinfo':
            // args: [UserInfo]
            // UserInfo: {MobileNo, NickName, FirstName, LastName, Sex}
            mms.CallMMS('UC', 'ucSetUserInfo', args, function(reply){
                if ( typeof cb == 'function' ) cb(reply);
            });
            break;
        case 'edgepair':
            // args: [Key]
            mms.CallMMS('UC', 'ucEdgePair', args, function(reply){
                // reply EdgeInfo: {DDN,EiName,EiType,EiTag,EiLoc}
                if ( typeof cb == 'function' ) cb(reply);
            });
            break;
        case 'edgeadd':
            // args: [EdgeInfo]
            // EdgeInfo: {DDN,EiName,EiType,EiTag,EiLoc}
            mms.CallMMS('UC', 'ucEdgeAdd', args, function(reply){
                if ( typeof cb == 'function' ) cb(reply);
            });
            break;
        case 'edgeremove':
            // args: [DDN]
            mms.CallMMS('UC', 'ucEdgeRemove', args, function(reply){
                if ( typeof cb == 'function' ) cb(reply);
            });
            break;
        case 'edgeset':
            // args: [EdgeInfo]
            // EdgeInfo: {DDN,EiName,EiType,EiTag,EiLoc}
            mms.CallMMS('UC', 'ucEdgeSet', args, function(reply){
                if ( typeof cb == 'function' ) cb(reply);
            });
            break;
        case 'edgelist':
            // args: [Key]
            mms.CallMMS('UC', 'ucEdgeList', args, function(reply){
                // reply EdgeInfo: [{DDN,EiName,EiType,EiTag,EiLoc}]
                if ( typeof cb == 'function' ) cb(reply);
            });
            break;
        default:
            break;
    }
}



