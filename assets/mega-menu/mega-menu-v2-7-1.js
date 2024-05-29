






// MM = megamumega-menu-item-host-element
function appendMegaMenu(){

	document.querySelectorAll('#header')[0].insertAdjacentHTML('afterend', '<div id="mega-menu-host-element"></div>');
	var hostElem = document.getElementById('mega-menu-host-element');
	var mainHeader = document.querySelectorAll('#header')[0];
	


	function removeActiveMegaMenu(){
		if(document.querySelectorAll('.active-menu')[0]){
			document.querySelectorAll('.active-menu')[0].classList.remove('active-menu');
			document.querySelectorAll('.active-header-item')[0].classList.remove('active-header-item');
		}
	}

	document.querySelectorAll('[data-mega-menu]').forEach(function(thisNode){
		thisNode.closest('.code-block').style.display = 'none';
		var parentSection = thisNode.closest('section');

		parentSection.classList.add('mega-menu-item');
		parentSection.setAttribute('id', 'mega-menu-item-section-'+thisNode.getAttribute('data-mega-menu'));
	});

	document.querySelectorAll('.header-nav-item--external a[href*="mega-menu"]').forEach(function(thisNav){
		var thisHref = thisNav.getAttribute('href').replace("/", "");
		thisNav.classList.add('header-menu-mega-menu-parent');
		thisNav.setAttribute('data-mm', thisHref);
		hostElem.insertAdjacentHTML('beforeend', '<div class="mm-item" data-menu="'+thisHref+'" id="mega-menu-item-'+thisHref+'"></div>');

		document.getElementById('mega-menu-item-'+thisHref).appendChild(document.getElementById('mega-menu-item-section-'+thisHref));


	});



	document.querySelectorAll('.header-menu-mega-menu-parent').forEach(function(aElem){
		aElem.addEventListener("mouseenter", function( event ) {   
			document.getElementById('mega-menu-item-'+aElem.getAttribute('data-mm')).classList.add('active-menu');

			aElem.classList.add('active-header-item');
		}, false);

	});



	document.querySelectorAll('.header-nav-item').forEach(function(headerElem){
		headerElem.addEventListener("mouseenter", function( event ) {   
			removeActiveMegaMenu();
		}, false);
	})



	document.querySelectorAll('.mm-item').forEach(function(menuElem){
		//menuElem.style.top = headerHeightMegaMenu+'px';
		menuElem.addEventListener("mouseenter", function( event ) {
			mainHeader.querySelectorAll('a[href="/'+menuElem.getAttribute('data-menu')+'"]')[0].classList.add('active-header-item');
			menuElem.classList.add('active-menu');
		}, false);

		menuElem.addEventListener("mouseleave", function( event ) {
			removeActiveMegaMenu();
		}, false);

	});




	mainHeader.addEventListener("mouseleave", function( event ) {  
		removeActiveMegaMenu();
	}, false);



	window.addEventListener('scroll', function(e) {
		removeActiveMegaMenu();
	});


	/*MOBILE*/
	document.querySelectorAll('.header-menu--folder-list')[0].insertAdjacentHTML('beforeend', '<div id="mega-menu-item-mobile-host-element"></div>');
	document.querySelectorAll('.header-menu-nav-item--external a[href*="mega-menu"]').forEach(function(megaMenuItem){
		var thisHref = megaMenuItem.getAttribute('href').replace("/", "");
		var thisItemId = 'mega-menu-mobile-item-'+thisHref;

		megaMenuItem.classList.add('header-mobile-mega-menu-parent-mobile');
		megaMenuItem.setAttribute('data-mm', thisHref);

		document.querySelectorAll('#mega-menu-item-mobile-host-element')[0].insertAdjacentHTML('beforeend', '<div class="mm-item-mobile" data-menu="'+thisHref+'" id="'+thisItemId+'"></div>');

		// document.getElementById('mega-menu-item-mobile-host-element').appendChild(document.getElementById(thisItemId));

		var mobileSection = document.getElementById('mega-menu-item-section-'+thisHref).cloneNode(true);
		mobileSection.setAttribute('id', 'mega-menu-item-mobile-section-'+thisHref);

		document.getElementById(thisItemId).appendChild(mobileSection);

	});

	document.querySelectorAll('.header-mobile-mega-menu-parent-mobile').forEach(function(aElem){
		aElem.addEventListener("click", function( event ) {   
			event.preventDefault();
			event.stopPropagation();
			document.getElementById('mega-menu-mobile-item-'+aElem.getAttribute('data-mm')).classList.add('active-mm-mobile');
		});
	});
	document.querySelectorAll('.mm-item-mobile').forEach(function(elemElem){
		elemElem.querySelectorAll('.sqs-layout > .sqs-row')[0].insertAdjacentHTML('afterbegin', '<a class="header-menu-controls-control header-menu-controls-control--active mega-menu-mob-close" data-action="back" href="/" tabindex="0"><span class="chevron chevron--left"></span><span>Back</span></a>')
		//elemElem.style.paddingTop = headerHeightMegaMenu+'px';


	});



	document.querySelectorAll('.mega-menu-mob-close').forEach(function(aElem){
		aElem.addEventListener("click", function( event ) {
			event.preventDefault();
			event.stopPropagation();
			document.querySelectorAll('.active-mm-mobile')[0].classList.remove('active-mm-mobile');
		});
	});
	function setDynamicCss(){
		console.log('resize')
		var headerHeightMegaMenu = mainHeader.offsetHeight;
		document.querySelectorAll('.mm-item').forEach(function(menuElem){
			menuElem.style.top = headerHeightMegaMenu+'px';
		});
		document.querySelectorAll('.mm-item-mobile').forEach(function(elemElem){
			elemElem.style.paddingTop = headerHeightMegaMenu+'px';
		});
	}
	setDynamicCss();

	window.addEventListener('resize', function(event){
		setDynamicCss();
	});

	 window.addEventListener('scroll', function(e) {
		setDynamicCss();
	});
}


if(document.querySelectorAll('[data-mega-menu]')[0]){
	appendMegaMenu();
	
}




