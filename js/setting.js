function setting(setting_status){
	if(!setting_status){
		
		var node = document.createElement("dialog");
		node.setAttribute("id", "mdl-dialog");
		document.body.appendChild(node);
		
		var dialog = document.querySelector("dialog");
		var opts = {
				"html": '<input type="text" class="form-control" id = "setting" placeholder="Please input target string" value="'+defaultXrpc.to+'">'
			};
		
		fun_accept = ( opts['fun_accept'] )? opts['fun_accept']: 'close_dialog();';
		fun_cencel = ( opts['fun_cencel'] )? opts['fun_cencel']: 'close_dialog();';
		
		var html = 
		'	<h4 class="mdl-dialog__title"></h4>'+
		'	<div class="mdl-dialog__content">'+
		'		<span class="span_notice"></span>'+
				opts['html'] +
		'	</div>'+
		'	<div class="mdl-dialog__actions">'+
		'		<button class="mdl-button" style="" onclick="'+fun_accept+'">'+ 'accept' +'</button>'+
		'		<button class="mdl-button" style="" onclick="'+fun_cencel+'" >'+ 'cencel' +'</button>'+
		'	</div>';
		dialog.innerHTML = html;
		dialog.style.display = "none";
	}
	else{
		document.getElementById("mdl-dialog").style.display = "block";
	}
	function close_dialog ( opts , callback )
	{
		document.getElementById("mdl-dialog").style.display = "none";
	}
}