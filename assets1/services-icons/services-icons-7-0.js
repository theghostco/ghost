
window.Squarespace.onInitialize(Y, function() { 
	document.querySelectorAll('.sqs-block-summary-v2 .sqs-gallery-design-autogrid .summary-item-list .summary-item .summary-title-link').forEach(function(thisNode){
		var slideParent = thisNode.closest('.summary-item');
		slideParent.insertAdjacentHTML('afterbegin', '<a class="custom-link-services-icons" href="'+thisNode.getAttribute('href')+'"></a>');
	});
});