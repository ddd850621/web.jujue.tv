// websocket: module for websokcet client operation
// Date: 2018/05/07
// Version: 0.99

var socket;
var firstconn = true;
var wsurl = '';
// class

$.wsock = {
    wsState: '',
    rcveHandler: null,
    statNotify: null,
    Init: function( scb, wsockurl ){
        wsurl = wsockurl;   
        if ( typeof scb === 'function' )
            $.wsock.statNotify = scb;
        if ( wsurl != '' ){
            socket = io( wsurl,
                {
                    reconnection: true,
                    reconnectionDelay: 1000,
                    reconnectionDelayMax: 5000,
                    reconnectionAttempts: Infinity
                }
            );
        }
        else {
            socket = io( 
                {
                    reconnection: true,
                    reconnectionDelay: 1000,
                    reconnectionDelayMax: 5000,
                    reconnectionAttempts: Infinity
                }
            );
        }
        // socket handler
        socket.on('connect_error', function(error){
            if ( typeof $.wsock.statNotify == 'function' )
                $.wsock.statNotify('websocket connect error');
            else
                console.log('websocket connect error');
        });

        socket.on('connect_timeout', function(timeout){
            if ( typeof $.wsock.statNotify == 'function' )
                $.wsock.statNotify('websocket connect timeout');
            else
                console.log('websocket connect timeout');
        });

        socket.on('connect', function(){
            $.wsock.wsState = 'conn';
            //console.log('io connected');
            if ( firstconn == true ) {
                if ( typeof $.wsock.statNotify == 'function' )
                    $.wsock.statNotify('websocket connected');
                firstconn = false;
            }
            else {
                if ( typeof $.wsock.statNotify == 'function' )
                    $.wsock.statNotify('websocket re-connected');
            }   
        });

        socket.on('disconnect', function(){
            $.wsock.wsState = '';
            if ( typeof $.wsock.statNotify == 'function' )
                $.wsock.statNotify('websocket disconnect');
            else
                console.log('websocket disconnect');
        });

        socket.on('error', function(err){
            if ( typeof $.wsock.statNotify == 'function' )
                $.wsock.statNotify('websocket error='+JSON.stringify(err));
            else
                console.log('websocket error='+JSON.stringify(err));
        });

        socket.on('message', function (body) {
            //recevive cmd from server
            if ( typeof body == 'object'){
                //console.log('rcve message: body=%s', JSON.stringify(body));
                if ( typeof $.wsock.rcveHandler == 'function') {
                    var inctl = body.ctl;
                    var data = body.data;
                    var from = '';
                    if ( typeof inctl.fm.DDN != 'undefined' ) from = inctl.fm.DDN;
                    if ( typeof inctl.fm.Name != 'undefined' && inctl.fm.Name != '' ) from = inctl.fm.Name;
                    $.wsock.rcveHandler(from, data);
                }
            }
        });
    },
    sendSocketMsg: function(data, callback) {
        try {
            if ( $.wsock.wsState == 'conn'){
                if ( typeof data == 'object' ){
                    socket.emit('request', data, callback);
                }
            }
            else {
                if ( typeof $.wsock.statNotify == 'function' )
                    $.wsock.statNotify('websocket not ready');
                else
                    console.log('websocket not ready');
            }
        }
        catch(e){
            if ( typeof $.wsock.statNotify == 'function' )
                $.wsock.statNotify(e.message);    
        }
    },
    MsgHandler: function(cb){
        if ( typeof cb === 'function')
            $.wsock.rcveHandler = cb; 
    }
};

