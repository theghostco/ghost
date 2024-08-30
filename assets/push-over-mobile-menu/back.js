<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script> 

function initializeLayout() {
    const siteWrapper = document.querySelector('#siteWrapper');
    const headerNav = document.querySelector('.header .header-nav');
    const existingNavigationWrapper = document.querySelector('.new-navigation-wrapper');
    const body = document.querySelector('body')

    if (window.innerWidth > 767) {
        if (!existingNavigationWrapper) {
            const main = document.querySelector('main');
            const footer = document.querySelector('footer');
            const headerWrapper = document.querySelector('#header')
            const headerHeight = window.getComputedStyle(headerWrapper).height;
            const headerAnnouncementWrapper = document.querySelector('.header .header-announcement-bar-wrapper');
            const headerAnnouncementWrapperPadding = window.getComputedStyle(headerAnnouncementWrapper).paddingLeft;
            
            headerNav.style.paddingLeft = headerAnnouncementWrapperPadding;

            const menuToggleButton = document.createElement('div');
            menuToggleButton.className = "menu-toggle-button";
            menuToggleButton.innerHTML = '<span>Menu</span>';
            headerNav.before(menuToggleButton);

            const newNavigationWrapper = document.createElement('div');
            newNavigationWrapper.className = "new-navigation-wrapper";
            newNavigationWrapper.style.paddingTop = headerHeight;

            newNavigationWrapper.append(headerNav);

            const siteContentWrapper = document.createElement('div');
            siteContentWrapper.className = "site-content-wrapper";

            const siteContentInner = document.createElement('div');
            siteContentInner.className = "site-content-inner";

            siteContentInner.append(main);
            siteContentInner.append(footer);

            siteContentWrapper.append(newNavigationWrapper);
            siteContentWrapper.append(siteContentInner);

            siteWrapper.append(siteContentWrapper);

            menuToggleButton.addEventListener('click', () => {
                newNavigationWrapper.classList.toggle('open-menu');
                menuToggleButton.classList.toggle('active');
                body.classList.toggle('open-side-menu');
            });
          
          $('.new-navigation-wrapper .header-nav-item--folder').on('click', function () {
            $(this).find('.header-nav-folder-content').slideToggle();
            $(this).find('.header-nav-folder-title').toggleClass('open');
          });
        }
    } else {
        if (existingNavigationWrapper) {
            existingNavigationWrapper.style.display = 'none';
        }
    }
}

function handleResize() {
    const existingNavigationWrapper = document.querySelector('.new-navigation-wrapper');
    const headerAnnouncementWrapper = document.querySelector('.header .header-announcement-bar-wrapper');
    const headerAnnouncementWrapperPadding = window.getComputedStyle(headerAnnouncementWrapper).paddingLeft;

    if (window.innerWidth > 767) {
        if (existingNavigationWrapper) {
            existingNavigationWrapper.style.display = 'flex';
            const headerNav = existingNavigationWrapper.querySelector('.header-nav');
            headerNav.style.paddingLeft = headerAnnouncementWrapperPadding;
        }
    } else {
        if (existingNavigationWrapper) {
            existingNavigationWrapper.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', initializeLayout);
window.addEventListener('resize', handleResize);
</script>
