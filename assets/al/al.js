
;(function(){
console.log('wtf');

	var checkOffset = function(){
		var fixedHeader = document.querySelectorAll('body.tweak-fixed-header')[0];
		var shrinkHeader = document.querySelectorAll('#header.shrink')[0];
		var topOffset = 0;
		if (typeof(fixedHeader) != 'undefined' && fixedHeader != null){
			if (typeof(shrinkHeader) != 'undefined' && shrinkHeader != null){
				topOffset = document.querySelectorAll('#header')[0].offsetHeight;
			}
		}
		console.log(topOffset);
		return topOffset;
	}


	document.querySelectorAll('a[href*="#"]').forEach(function(anchorLink) {
		anchorLink.addEventListener("click", function(event) {
			var getId = anchorLink.getAttribute('href').split('#')[1]; 
			console.log(getId);
			var existId = document.querySelectorAll('#'+getId)[0];
			if (typeof(existId) != 'undefined' && existId != null){
				event.preventDefault();
				event.stopPropagation(); 
				console.log(checkOffset());
				smscScroll.scrollVerticalToElementById(getId, checkOffset());
			}else{
				return;
			}
		});
	});

	document.querySelectorAll('a[href="scroll-to-section"]').forEach(function(anchorLink) {
		anchorLink.classList.add('anchor-link-to-section');
		anchorLink.closest('section').classList.add('section-with-anchor-link');
		anchorLink.closest('section').setAttribute('id', anchorLink.innerHTML);
	}); 

	document.querySelectorAll('a[href="scroll-to-link"]').forEach(function(anchorLink) {
		anchorLink.classList.add('anchor-link-to-link');
		anchorLink.setAttribute('id', anchorLink.innerHTML);
	});      
	function clickFire(elem){    
		if (elem.onclick) {       
			elem.onclick();  
		} else if (elem.click) {
			elem.click();
		}  
	} 

	function simulateClick(closeSecetor){     
		clickFire(closeSecetor);  
	}    

	document.querySelectorAll(".header-menu-nav-item a[href*='#']").forEach(function(thisLink){        
		thisLink.addEventListener("click", function() {      
			simulateClick(document.querySelectorAll(".header-burger-btn.burger .burger-inner")[0]);
		});  
	}) 
}());