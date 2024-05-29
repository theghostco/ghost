
window.Squarespace.onInitialize(Y, function() { 
	document.querySelectorAll('.sqs-block-summary-v2 .sqs-gallery-design-autogrid .summary-item-list .summary-item .summary-title-link').forEach(function(thisNode){

		var slideParent = thisNode.closest('.summary-item');
		slideParent.insertAdjacentHTML('afterbegin', '<a class="slide-custom-uni-link" href="'+thisNode.getAttribute('href')+'"></a>');


		slideParent.querySelectorAll('.summary-title')[0].appendChild(slideParent.querySelectorAll('.summary-metadata-container')[0]);

	});
});