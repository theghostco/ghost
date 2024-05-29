;(function(){
    let socialsMenu = document.querySelector('.header-menu-actions'),
        headerCta = document.querySelector('.header-menu-cta'),
        parentNav = document.querySelector('.header-menu-nav-folder-content'),
        navItem = document.querySelectorAll('.header-menu-nav-item');

    navItem.forEach(function(thisNav){
      thisNav.classList.add('header-announcement-bar-wrapper');
    });

    parentNav.appendChild(socialsMenu);
    socialsMenu.classList.add('header-announcement-bar-wrapper');

    parentNav.appendChild(headerCta);
    headerCta.classList.add('header-announcement-bar-wrapper');

    
  }());