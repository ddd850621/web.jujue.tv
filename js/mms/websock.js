// websocket: module for websokcet client operation
// Date: 2018/4/26
// Version: 0.98

var socket;
var firstconn = true;

// class

$.wsock = {
    wsState: '',
    rcveHandler: null,
    statNotify: null,
    Init: function( scb ){    
        if ( typeof scb === 'function' )
            $.wsock.statNotify = scb;
        socket = io( 
            {
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: Infinity
            }
        );
        // socket handler
        socket.on('connect_error', function(error){
            if ( typeof $.wsock.statNotify == 'function' )
                $.wsock.statNotify('websocket connect error');
            else
                alert('websocket connect error');
        });

        socket.on('connect_timeout', function(timeout){
            if ( typeof $.wsock.statNotify == 'function' )
                $.wsock.statNotify('websocket connect timeout');
            else
                alert('websocket connect timeout');
        });

        socket.on('connect', function(){
            $.wsock.wsState = 'conn';
            console.log('io connected');
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
                alert('websocket disconnect');
        });

        socket.on('error', function(err){
            if ( typeof $.wsock.statNotify == 'function' )
                $.wsock.statNotify('websocket error='+JSON.stringify(err));
            else
                alert('websocket error='+JSON.stringify(err));
        });

        socket.on('message', function (body) {
            //recevive cmd from server
            if ( typeof body == 'object'){
                console.log('rcve message: body=%s', JSON.stringify(body));
                if ( typeof $.wsock.rcveHandler == 'function') {
                    var inctl = body.ctl;
                    var data = body.data;
                    var from = '';
                    if ( typeof inctl.fm.Name != 'undefined' ) from = inctl.fm.Name;
                    else if ( from == '' && typeof inctl.fm.DDN != 'undefined' ) from = inctl.fm.DDN;
                    $.wsock.rcveHandler(from, data);
                }
            }
        });
    },
    sendSocketMsgReply: function(data, callback) {
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
                    alert('websocket not ready');
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

