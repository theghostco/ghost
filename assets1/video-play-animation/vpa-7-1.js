 (function(){
 	'use strict';

 	function insertPlayButton(){
 		document.querySelectorAll('.video-block .sqs-video-overlay').forEach(function(video){
 			console.log('test1')
 			var svgEl = document.createElement('div');
 			svgEl.setAttribute('id', 'svg-text');
 			svgEl.innerHTML = '<div id="circle-for-plugin"> <span class="icon-wrap"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 300 300" enable-background="new 0 0 300 300" xml:space="preserve"> <defs> <path id="circlePath" d=" M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 "/> </defs> <circle cx="150" cy="100" r="75" fill="none"/> <g> <use xlink:href="#circlePath" fill="none"/> <text fill="#fff"> <textPath xlink:href="#circlePath">WATCH THE VIDEO</textPath> </text>   <text fill="#fff" x="190"> <textPath xlink:href="#circlePath">WATCH THE VIDEO</textPath> </text> </g></svg> </span></div>';
 			if(video){
 				video.append(svgEl);
 			}
 		});
 	}


 	insertPlayButton();


 }());