document.querySelectorAll('.image-block-outer-wrapper img[alt*="+"]').forEach(function(thisImg){
	//thisImg.closest('.sqs-image-shape-container-element').classList.add('ghost-image-animation');
	//thisImg.closest('.content-fill').classList.add('ghost-image-animation');
	
	thisImg.closest('div').classList.add('ghost-image-animation');
});






