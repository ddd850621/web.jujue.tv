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

  $('#send_btn_xmsg1').on('click', function (e) {
    e.preventDefault();
    mmsSendXmsg('', "drop https://www.youtube.com/watch?v=XxJKnDLYZz4");
  });

  $('#send_btn_xmsg2').on('click', function (e) {
    e.preventDefault();
    mmsSendXmsg('', "drop https://www.youtube.com/watch?v=rgVBe6VGWm4");
  });

  $('#send_btn_xmsg3').on('click', function (e) {
    e.preventDefault();
    mmsSendXmsg('', 'drop https://www.youtube.com/watch?v=TL8mmew3jb8');
  });

  $('#send_btn_xmsg4').on('click', function (e) {
    e.preventDefault();
    mmsSendXmsg('', 'drop http://cdn.ypcall.com/users/A2A36DCB-A1FE-48C0-8799-741926446DDF/drive/robin/photo6305293337111930859.jpg');
  });

  $('#send_btn_xmsg5').on('click', function (e) {
    e.preventDefault();
    mmsSendXmsg('', 'drop https://www.youtube.com/watch?v=UG-el9xOAo0');
  });

  $('#send_btn_xmsg6').on('click', function (e) {
    e.preventDefault();
    mmsSendXmsg('', 'drop http://cdn.ypcall.com/miki/yp/djdemo/sugar.mp4');
  });

  $('#send_btn_xmsg7').on('click', function (e) {
    e.preventDefault();
    mmsSendXmsg('', 'drop https://www.youtube.com/watch?v=KXOcAiAkqyg');
  });
});

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
}


// mms api function

var startmms = function (appname, wurl) {
  mms = new MMS(appname, wurl);
  mms.OpenMMS(regwsOK, regdcOK, wsStat, rcveMsg);
  console.log('mms: open: ' + wurl);
}

var mmsSendXmsg = function (target, data) {
	/*
	var str;
	//alert('send cmd: to=' + to + ',msg=' + msg);
	if (target != '' && data != '') {
		str = target + " " + data;
		console.log(str);
		mms.SendMMS(target, data, function (result) {
			var str = 'send: ';
			str += JSON.stringify(result);
			//if ( typeof result.State == 'string' ) str += result.State;
			//else str += result.ErrMsg;
			console.log(str);
		});
	}*/
	var cookies = document.cookie.split(";");
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