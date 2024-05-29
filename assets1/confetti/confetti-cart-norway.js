
import t from "https://cdn.skypack.dev/canvas-confetti";
function addClassNameListener(elemId){
	document.querySelectorAll(elemId).forEach(function(elem){

		let originalHtml = elem.outerHTML,
		intermediateHtml = '<div class="sqs-add-to-cart-button-inner inter">Lagt til!</div>';


		window.setInterval( function() {
			let currentHtml = elem.outerHTML;
			if (currentHtml !== originalHtml && currentHtml.includes("Lagt til!") && !currentHtml.includes("inter")) {          
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






