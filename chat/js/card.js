var target;
function card( keyword, index_i){
	 var div = document.getElementById('display');
	 keyword = keyword.split("%")[1];
     console.log("function cards get :" + keyword);
	 var cond = keyword.split(" ");
	 var message = "<div class='messageDIVstyle'><div class='right_triangle'></div><div class='message_content_DIVstyle'>" + keyword +"</div></div>"
	 var messageReply = "<div class='messageDIVstyle'><img class='messageReply_icon' src='./img/jujue_chat_144x144.png'><div class='left_CardTriangle'></div><div id='src_page' class='DIVCardstyle'><div class='divCardStyleTop'><img src='../img/button_72x72.png' class='divCardStyleTopImg'><p id = 'title_01' class = 'titleCard'>"+ keyword +"</p></div><hr color= '#EFEFEF'><div id='wrapper' style='width: 100%; height: 100%;'><iframe id='src_iframe"+ index_i +"' name='mainframe' width='100%' onload='Javascript:SetCwinHeight("+index_i+")' scrolling='No' marginwidth='0' marginheight='0' frameborder='0'></iframe></div></div></div></div>"
	 
	 /*var messageReply = "<div class='messageDIVstyle'><img class='messageReply_icon' src='./img/jujue_chat_144x144.png'><div id='src_page' class='messageReply_content_DIVstyle'><div id='wrapper' style='width: 100%; height: 100%;'><iframe id='src_iframe' name='mainframe' width='100%' onload='Javascript:SetCwinHeight()' scrolling='No' marginwidth='0' marginheight='0' frameborder='0'></iframe></div></div></div>"*/
	 div.innerHTML += message;
	 div.innerHTML += messageReply;
	
	 loadJSON(function(response) {
		 var card_obj = JSON.parse(response);
		 for(i=0;i<card_obj.length;i++){
			 if(keyword.localeCompare(card_obj[i].keyword)==0){
				 console.log(card_obj[i].url);
				 var src_iframeName = "src_iframe" + index_i ;
				 document.getElementById(src_iframeName).setAttribute("src",card_obj[i].url);
				 //document.getElementById("src_page").setAttribute("style","display:block");
				 $.ajax({url: card_obj[i].url,
						 dataType: 'jsonp', 
						 success: function(result){
							 console.log("success: "+result);
						 },
						 crossDomain :true,
						 error:function(result){
							 console.log("error: "+result)}
						 }
				 );
				 var frame = document.getElementById(src_iframeName);
				 var index = 0;
				
				 var inter = window.setInterval(function() {					
					 if (frame.contentWindow.document.readyState === "complete" && index >0) {
						 window.clearInterval(inter);
						// grab the content of the iframe here
						/*window.onmessage = function(event) {
							alert(event.data);
						};*/
						 frame.contentWindow.postMessage('','*');
					 }
					 index++;
				 }, 300);
			 }
		 }
	 });
}
function SetCwinHeight(index_i){
	 var src_iframeName = "src_iframe" + index_i ;
	 var iframeid=document.getElementById(src_iframeName); //iframe id
	 if (document.getElementById){   
		 if (iframeid && !window.opera){   
			 if (iframeid.contentDocument && iframeid.contentDocument.body.offsetHeight){   
				 iframeid.height = iframeid.contentDocument.body.offsetHeight;   
			 }
			 else if(iframeid.Document && iframeid.Document.body.scrollHeight){   
				 iframeid.height = iframeid.Document.body.scrollHeight;   
			 }   
		 }
	 }
}