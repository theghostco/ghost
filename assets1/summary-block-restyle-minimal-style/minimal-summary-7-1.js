/* 

⚠️ Ghost Plugin Code Start ⚠️ 
Copyright 2020.
 
*/



document.querySelectorAll('.sqs-block-summary-v2 .sqs-gallery-design-list .summary-item-list .summary-item .sqs-gallery-image-container').forEach(function(thisNode){
	thisNode.insertAdjacentHTML('afterbegin', '<div class="go-ico"></div>');
});



document.querySelectorAll('.sqs-gallery-design-list .summary-item-list').forEach(function(thisNodeSlide){
	thisNodeSlide.closest('section.page-section').classList.add('box-sizing-style');
	var slider = tns({
		container: thisNodeSlide,
		items: 4,
		gutter: 15,
		edgePadding: 0,
		nav: true,
		navPosition: 'bottom',
		loop: true,
		edgePadding: 0,
		mouseDrag: true,
		controlsPosition: 'bottom',
		prevButton: false,
		controlsText: ['', ''],
		responsive: {
			0: {
				items: 1
			},
			640: {
				items: 2
			},
			1100: {

				items: 4
			}
		}

	});


	thisNodeSlide.querySelectorAll('.sqs-block .sqs-gallery-design-list  .summary-item a').forEach(function(aElem){

		aElem.addEventListener("mouseenter", function( event ) {   
			aElem.closest('.summary-item').classList.add('mouseover');

		}, false);

		aElem.addEventListener("mouseleave", function( event ) {   
			aElem.closest('.summary-item').classList.remove('mouseover');
		}, false);
	});




});


/* 

⚠️ Ghost Plugin Code END ⚠️ 
 
*/




