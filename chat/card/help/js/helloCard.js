$(function(){
	var web_url = url;
	if(document.URL.indexOf(web_url) >-1){
		for(var i=0;i<js_src.length;i++){
			console.log(js_src[i].src);
			var newScript = document.createElement('script');
			newScript.type = 'text/javascript';
			newScript.src = js_src[i].src;
			document.getElementsByTagName('head')[0].appendChild(newScript);
			//console.log(document.getElementsByTagName('head')[0]);
		}
	}
	
});