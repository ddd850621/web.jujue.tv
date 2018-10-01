
$.con = {
    showdate: false,
    line_count: 0,
	max_line_count: 30,
    dec_lines: 5,
    send_color: "black",
    rcve_color: "green",
    state_color: "orange",
    err_color: "red",
	out: function( text, color ){
        var cstr = '';
        var dcolor = '';
        if ( $.con.msg_count >= $.con.max_items ) {
            $("#text_console > p:lt(" + $.con.dec_lines.toString() + ")").remove();
            $.con.line_count -= $.con.dec_lines;	
        }
        if ( color == '')
            cstr = "<p>" + _GetCurrentTime() + " " + str + "</p>";
        else {
            switch(color){
                case 'send':
                    dcolor = $.con.send_color;
                    break;
                case 'rcve':
                    dcolor = $.con.rcve_color;
                    break;
                case 'state':
                    dcolor = $.con.state_color;
                    break;
                case 'err':
                    dcolor = $.con.err_color;
                    break;
                default:
                    break;
            }
            cstr = "<p style='color:" + dcolor + "'>" + _GetCurrentTime() + " " + text + "</p>";
        }
        $("#text_console").append( cstr );
        $.con.line_count += 1;
        $( "#text_console" )[0].scrollTop = $( "#text_console" )[0].scrollHeight;	
    },
    clear: function(){
        $("#text_console").empty();
        $.con.line_count = 0;
    }
}

var _GetCurrentTime = function()
{
    var currentdate = new Date();
    var datetime;
    var year, month, day, hours, minutes, seconds, millis;
    hours = currentdate.getHours().toString();
    minutes = currentdate.getMinutes().toString();
    seconds = currentdate.getSeconds().toString();
    millis = currentdate.getMilliseconds().toString();
    if ( hours.length == 1 ) hours = '0' + hours;
    if ( minutes.length == 1 ) minutes = '0' + minutes;
    if ( seconds.length == 1 ) seconds = '0' + seconds;
    if ( millis.length == 1 ) millis = '00' + millis;
    else if ( millis.length == 2 ) millis = '0' + millis;
    if ( $.con.showdate == true ){
        year = currentdate.getFullYear().toString();
        month = (currentdate.getMonth()+1).toString();
        day = currentdate.getDate().toString();
        if ( month.length == 1 ) month = '0' + month;
        if ( day.length == 1 ) day = '0' + day;
        datetime = year + '/' + month + '/' + day + " " + hours + ':' + minutes + ':' + seconds + ':' + millis;
    }
    else {
        datetime = hours + ':' + minutes + ':' + seconds + ':' + millis;
    }
    return datetime;
}
