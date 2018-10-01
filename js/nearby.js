$.nearby = {
    devlist: [],
    selectdev: '',
    openSelect: function(){
        $.nearby.getNearby(function(result){
            if ( result == 'OK'){
				$('#nearbyWaiting').modal('hide'); 
               $.nearby.showNearbyList();
            }
            else {
                BootstrapDialog.alert({"title":"Nearby","message":result});
            }
        });
    },
    getNearby: function(cb){
		mmsNearby(function(reply){
        //console.log('getNearby: reply=%s,', JSON.stringify(reply));
        if ( reply.ErrCode == 0 ){
			console.log('~~~~~~~~~~~~~~~~~~ ok!!!!!!');
            var dname, dtype, ei;
            var len = reply.result.length;
            var i, k;
            var str = '';
            if ( len > 0 ){
                for ( i = 0; i < len ; i++ ){
                    k = i+1;
                    dname = '';
                    dtype = '';
                    ei = reply.result[i];
                    if ( ei.EiName != null ) dname = ei.EiName;
                    else dname = ei.DDN;
                    if ( ei.EiType != null ) dtype = ei.EiType;
                    if ( dname != '' )
                        str += k.toString() + '. ' + dname;
                    if ( dtype != '' )
                        str += ' [' + dtype + ']';
                    str += '\n';
                }
				console.log(len);
            }
            else {
				str = 'no device';
				console.log(len);
			}
			_nearby(reply.result,cb);
        }
        else {
            str = reply.ErrMsg;
        }
		
        //BootstrapDialog.alert({"title":"NearBy","message":str});
		});
	},
    showNearbyList: function(){
		$.nearby.selectdev = getCookie();
        var str, i, len, m, strbtn, dname;
        var devlist = $.nearby.devlist;
        len = devlist.length;
        $('#control_nearby_list').empty();
        if ( len > 0 ){
            str = '<table class="table table-striped" style="font-size:1.2em">';
            str += '<thead><tr><th></th><th>#</th><th>Name</th><th>Type</th></tr></thead>';
            str += '<tbody>';
            for ( i = 0; i < len; i++ ){
                m = i + 1;
                dname = devlist[i].EiName;
                if ( $.nearby.selectdev != '' && $.nearby.selectdev.indexOf(dname) >= 0)
                    strbtn = '<input type="checkbox" value="'+dname+'" checked="checked">';
                else
                    strbtn = '<input type="checkbox" value="'+dname+'">';
                str += '<tr><td style="margin-left:2em">'+strbtn+'</td><td>'+m.toString()+'</td><td>'+dname+'</td><td>'+devlist[i].EiType+'</td></tr>'
            }
            str += '</tbody>';
            str += '</table>';
            $('#control_nearby_list').html(str);
        }
        else {
            str = '<table class="table" style="font-size:1.2em">';
            str += '<tbody>';
            str += '<tr><td>No take item</td></tr>';
            str += '</tbody>';
            str += '</table>';
            $('#control_nearby_list').html(str);
        }
        $('#nearbyModal').modal('show');
		console.log('nearbyModal SHOW!!');
    },
    saveNearby: function(){
        var val = '';
        $('#control_nearby_list input[type="checkbox"]:checked').each(function() {
            if ( val == '' ) val = this.value;
            else val += ',' + this.value;
        });
		setCookie(val,null);
        //BootstrapDialog.alert('save nearby OK: ' + val);
        $('#nearbyModal').modal('hide'); 
		console.log('nearbyModal HIDE! saveNearby');
    },
    exitNearby: function(){ 
        //BootstrapDialog.alert('exit nearby OK: ');
        $('#nearbyModal').modal('hide'); 
		console.log('nearbyModal HIDE! exitNearby');
    }
}

var  _nearby = function(data,cb) {
		var str, i, len, EiName, Eitype,tempData,index = 0;
		tempData
		//alert('nearby='+JSON.stringify(data));
		//alert(data.length);
		len = 0;
		len = data.length;
		if ( len >= 0 ){
			$.nearby.devlist = [];
			for ( i = 0; i < len; i++ ){
				EiName = data[i].EiName;
				Eitype = data[i].EiType;
				
				//console.log("EiType: " + Eitype);
				//if ( Eitype == '.tv'){
					//tempData[index].EiName = EiName;
					//tempData[index].Eitype = EiType;
					$.nearby.devlist.push(data[i]);
					//index++;
					//console.log($.nearby.devlist);
				//}
			}
			if ( typeof cb == 'function' ) cb('OK');
		}
}

var setCookie = function(val,exdays) {
		//document.cookie = val;
		document.cookie = val+'; path = /';
}

var getCookie = function() {
		//console.log("getCookie:"+document.cookie);
        return document.cookie;
}