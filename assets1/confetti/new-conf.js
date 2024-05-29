//import t from"https://cdn.skypack.dev/canvas-confetti";var isProduct = document.querySelectorAll('.collection-type-products.view-item')[0];if (typeof(isProduct) != 'undefined' && isProduct != null){function addClassNameListener(t,e){var o=document.querySelector(t),n=o.textContent;window.setInterval(function(){var t=o.textContent;t!==n&&(t.includes("Added!")&&cartPostSubmitGhost(),n=t)},20)}window.cartPostSubmitGhost=function(){let e={colors:ghostCartConfettiOptions.colors,spread:ghostCartConfettiOptions.spread,particleCount:ghostCartConfettiOptions.particleCount};ghostCartConfettiOptions.loop?(t(e),setInterval(()=>{t(e)},ghostCartConfettiOptions.loopDelay)):t(e)},addClassNameListener(".sqs-add-to-cart-button-inner");}


/*
function addClassNameListener(elemId) {
	var elem = document.querySelector(elemId);
	var lastClassName = elem.textContent;
	window.setInterval( function() {   
		var className = elem.textContent;
		var mobileNewLayout = document.querySelector('.hidden-sm-up .sqs-add-to-cart-button-inner').querySelector('.status-text');
		if (className !== lastClassName && className.includes("Added!")) {          
			cartPostSubmitGhost();
			lastClassName = className;
		}
	},200);
}


(window.cartPostSubmitGhost = function () {

	let e = { colors: ghostCartConfettiOptions.colors, spread: ghostCartConfettiOptions.spread, particleCount: ghostCartConfettiOptions.particleCount };
	ghostCartConfettiOptions.loop
	? (t(e),
		setInterval(() => {
			t(e);
		}, ghostCartConfettiOptions.loopDelay))
	: t(e);
}),

addClassNameListener(".sqs-add-to-cart-button-inner");


// function cartPostSubmitGhost(){
// 	let options =  { colors: ghostCartConfettiOptions.colors, 
// 		spread: ghostCartConfettiOptions.spread, 
// 		particleCount: ghostCartConfettiOptions.particleCount };
// 	ghostCartConfettiOptions.loop
// }
*/

import t from "https://cdn.skypack.dev/canvas-confetti";
function addClassNameListener(elemId){
	document.querySelectorAll(elemId).forEach(function(elem){

		let originalHtml = elem.outerHTML,
		intermediateHtml = '<div class="sqs-add-to-cart-button-inner inter">Added!</div>';


		window.setInterval( function() {
			let currentHtml = elem.outerHTML;
			if (currentHtml !== originalHtml && currentHtml.includes("Added!") && !currentHtml.includes("inter")) {          
				cartPostSubmitGhost();
				elem.innerHTML = intermediateHtml;
			}
		},200);
	});
}



(window.cartPostSubmitGhost = function () {

	let e = { colors: ghostCartConfettiOptions.colors, spread: ghostCartConfettiOptions.spread, particleCount: ghostCartConfettiOptions.particleCount };
	ghostCartConfettiOptions.loop
	? (t(e),
		setInterval(() => {
			t(e);
		}, ghostCartConfettiOptions.loopDelay))
	: t(e);
}),


addClassNameListener(".sqs-add-to-cart-button-inner");

