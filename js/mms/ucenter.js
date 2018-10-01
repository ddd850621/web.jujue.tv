// login module for uCenter
// Date: 2017/9/15
// Version: 0.95

$.login = {
	islogin: false,
	auto_login: true,
	login_ok: false,
	uid: '',
	token: '',
	token_expire: '',
	ddn: '',
	username: '',
	nick_name: '',
	device_name: '',
	logincallback: null,
	logoutcallback: null,
	afterlogin: null,
	afterLogout: null,
	init: function( logincb, logoutcb ){
		if ( typeof logincb === 'function' )
			$.login.logincallback = logincb;
		if ( typeof logoutcb === 'function' )
			$.login.logoutcallback = logoutcb;
		var str;
		str = '<div class="row"><div class="col-md-4 col-xs-2"></div><div class="col-md-4 col-xs-6"><h3 style="text-align:center;margin-top:3em;margin-bottom:3em">User Login</h3>';
		str += '<form><div class="form-group"><label for="acc_ulogin">Email address</label><input type="email" class="form-control" id="acc_login" placeholder="Email"></div>';
		str += '<div class="form-group"><label for="pwd_ulogin">Password</label><input type="password" class="form-control" id="pwd_login" placeholder="Password"></div>';
		str += '<div class="form-group"><label for="dname_ulogin">Device name</label><input type="text" class="form-control" id="dname_login" placeholder=""></div>';
		str += '<button type="submit" class="btn btn-default" style="margin-top:2em" id="btn_submit_login">Submit</button></form></div></div>';
		$('#btn_submit_login').off('click');
		$('#login_page').empty();
		$('#login_page').html(str);
		$('#btn_submit_login').on('click', function(e){
			e.preventDefault();
			var acc, pwd, dname;
			acc = $('#acc_login').val();
			if ( acc.indexOf('@') < 3 ) {
				alert('login account error!');
			}
			else {
				pwd = $('#pwd_login').val();
				dname = $('#dname_login').val();
				if ( dname == '' ) dname = 'mscreen-' + acc.substr(0, acc.indexOf('@'));
				if ( acc != '' && pwd != '' && dname != '')
					$.login.login(acc, pwd, dname);
				else
					alert('login error!');
			}
		});	
	},
	minit: function( cb, locb ){
		if ( typeof cb === 'function' )
			$.login.afterlogin = cb;
		if ( typeof locb === 'function' )
			$.login.afterLogout = locb;
	},
	checkit: function() { 
		upp_checkit(
			function( data ) {	// success
				//alert( "checkit: " + JSON.stringify( data ) );
				if ( data.ErrCode == 0 ) {
					if ( data.login_ok == true ) {
						$.login.islogin = true;
						$.login.auto_login = data.auto_login;
						$.login.login_ok = data.login_ok;
						$.login.uid = data.uid;
						$.login.token = data.token;
						$.login.token_expire = data.token_expire;
						$.login.ddn = data.ddn;
						$.login.username = data.username;
						$.login.nick_name = data.nick_name;
						$.login.device_name = data.device_name;
//						alert( "checkit success: " + JSON.stringify( data ) );
						if ( typeof $.login.logincallback == 'function' ) $.login.logincallback(data);
						if ( typeof $.login.afterlogin == 'function' ) $.login.afterlogin(data);
					}
					else {
//						alert( "checkit fail: " + JSON.stringify( obj ) );
						$.login.showForm();								
					}
				}
				else {
					$.login.showForm();
				}
			},
			function( obj ) {	// fail
				//alert( "checkit ulogin fail: " + JSON.stringify( obj ) );
				$.login.showForm();				
			},
			null				// always
		);
	},
	login: function( acc, pwd, dname ) {
//		alert( 'Browser is ' + browser );
		upp_login( acc, pwd, "", dname, true,
			function( data ) {		// success
//				alert( "login: " + JSON.stringify( data ) );
				if ( data.ErrCode == 0 ) {
					if ( data.login_ok == true ) {
						$.login.islogin = true;
						$.login.login_ok = true;
						$.login.uid = data.uid;
						$.login.token = data.token;
						$.login.token_expire = data.token_expire;
						$.login.ddn = data.ddn;
						$.login.username = data.username;
						$.login.nick_name = data.nick_name;
						$.login.device_name = data.device_name;
						//alert( "login: " + JSON.stringify( data ) );
						$.login.clearForm();
						if ( typeof $.login.logincallback == 'function' ) $.login.logincallback(data);
						if ( typeof $.login.afterlogin == 'function' ) $.login.afterlogin(data);
					}
					else {
						alert( "login fail: " + JSON.stringify( data ) );	
					}
				}
				else {
					alert( "login fail: " + JSON.stringify( data ) );									
				}
			},
			function( obj ) {	//fail
				alert( "login backend fail: " + JSON.stringify( obj ) );						
			},
			null				// always
		);
	},
	logout: function(){
		if ($.login.islogin == true && $.login.login_ok == true){
			// save login information
			var ddn = $.login.ddn;
			upp_logout(
				function( obj ) {
					//alert( "logout: " + JSON.stringify( obj ) );
					if ( obj.ErrCode == 0 ) {
						$.login.islogin = false;
						$.login.login_ok = false;
						$.login.uid = '';
						$.login.token = '';
						$.login.token_expire = '';
						$.login.ddn = '';
						$.login.username = '';
						$.login.device_name = '';
						$.mdevice.cleardevice();
						$.login.showForm();
						var ret = {"ErrCode":obj.ErrCode,"ErrMsg":obj.ErrMsg,"ddn":ddn};
						if ( typeof $.login.logoutcallback === 'function' ) $.login.logoutcallback(ret);
						if ( typeof $.login.afterLogout === 'function' ) $.login.afterLogout(ret);			
					}
				},
				function( obj ) {
					alert( "logout: " + JSON.stringify( obj ) );
				},
				null
			);
		}
	},
	showForm: function(){
		//alert('showFrom');
		$('#login_page').show();
	},
	clearForm: function(){
		$('#login_page').hide();
		$('#acc_login').val('');
		$('#pwd_login').val('');
		$('#dname_login').val('');
	}
}

$.mdevice = {
	address: '',
	face: '',
	ddn: '',
	owner: '',
	dname: '',
	dtype: '',
	dtag: '',
	location: '',
	mirror: '',
	moteweb: '',
	appweb: '',
	appdata: '',
	cleardevice: function(){
		$.mdevice.address = '';
		$.mdevice.face = '';
		$.mdevice.ddn = '';
		$.mdevice.owner = '';
		$.mdevice.dname = '';
		$.mdevice.dtype = '';
		$.mdevice.dtag = '';
		$.mdevice.location = '';
		$.mdevice.mirror = '';
		$.mdevice.moteweb = '';
		$.mdevice.appweb = '';
		$.mdevice.appdata = '';
	},
	getinfo: function(app, cbok,cbfail){
		var ddn = $.login.ddn;
		if ( ddn != '' ){
			upp_settings( 'load', ddn, app, {}, 
				function(obj){
					var app_settings;
					//alert('mdevice.getinfo='+JSON.stringify(obj));
					if ( obj.ErrCode == 0 ){
						if ( obj.app_settings != ''){
							app_settings = JSON.parse(obj.app_settings);
							$.mdevice.address = app_settings.address;
							$.mdevice.face = app_settings.face;
							$.mdevice.ddn = app_settings.ddn;
							$.mdevice.owner = app_settings.owner;
							$.mdevice.dname = app_settings.dname;
							$.mdevice.dtype = app_settings.dtype;
							$.mdevice.dtag = app_settings.dtag;
							$.mdevice.location = app_settings.location;
							$.mdevice.mirror = app_settings.mirror;
							$.mdevice.moteweb = app_settings.moteweb;
							$.mdevice.appweb = app_settings.appweb;
							$.mdevice.appdata = app_settings.appdata;	
						}
						else {
							$.mdevice.ddn = $.login.ddn;
							$.mdevice.owner = $.login.username;
							$.mdevice.dname = $.login.device_name;
							$.mdevice.dtype = '.tv';
						}
					}
					if ( typeof cbok == 'function' ) cbok(obj);
					else if ( typeof cbfail == 'function' ) cbfail(obj);
				}, 
				function(obj){
					if ( typeof cbfail == 'function' ) cbfail(obj);
				}, 
				function(obj){}
			);	
		}
		else alert('No ddn');
	},
	saveinfo: function( app, appsettings, cbok, cbfail ){
		var ddn = appsettings.ddn;
		if ( ddn != '' ){
			//alert('appsettings='　+　JSON.stringify(appsettings));
			upp_settings( 'save', ddn, app, JSON.stringify(appsettings),
				function(obj){
					//alert('saveinfo: ' + obj.ErrMsg);
					if ( typeof cbok == 'function' ) cbok(obj);
				},
				function(obj){
					//alert('saveinfo: ' + obj.ErrMsg);
					if ( typeof cbfail == 'function' ) cbfail(obj);
				},
				function(obj){}
			);
		}	
	}
}

