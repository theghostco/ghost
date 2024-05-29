

var isBlogItem =  document.querySelector('.blog-item-wrapper');

if (typeof(isBlogItem) != 'undefined' && isBlogItem != null){

  if(ghostBlogStyleAltLogo){
    document.querySelector('.header-title-logo').classList.add('alt-logo');
    document.querySelector('.header-title-logo a').style.backgroundImage = 'url('+ghostBlogStyleAltLogo+')';
  }

  document.querySelector('body').classList.add('fifty-fifty-blog-item');

  document.querySelector('header .header-display-desktop').insertAdjacentHTML('beforeend', '<a class="more-articles-menu-button">More Articles</a>' );

  var blogItemImgSrc = document.head.querySelector("[property='og:image']").content;
    //var blogItemImgSrc = document.querySelector('[rel="image_src"]').getAttribute('href');
    var blogTitleEl = isBlogItem.querySelector('.blog-item-title');
    var blogTitle = blogTitleEl.innerText || blogTitleEl.textContent;

    var itemMeta = isBlogItem.querySelector('.blog-item-meta-wrapper').innerHTML;
    var itemPagination = document.querySelector('.item-pagination').innerHTML;
    //var pageNavigation = document.querySelector('.header-announcement-bar-wrapper').innerHTML;

    var getUrl = window.location.href;
    var pageLink = getUrl.substring(0, getUrl.indexOf('?'));


    var bannerMarkup = '<div class="blog-item-hero-banner"><div class="banner-image"><img src="'+blogItemImgSrc+'"></div><div class="blog-item-main-content"><div class="blog-item-title"><h1 class="blog-item-title-content">'+blogTitle+'</h1></div><div class="blog-item-meta-wrapper">'+itemMeta+'</div><div class="blog-item-pagination-wrapper">'+itemPagination+'</div></div> </div>';
    isBlogItem.insertAdjacentHTML('afterbegin', bannerMarkup);
    var request = new XMLHttpRequest();
    request.open('GET', ''+pageLink+'?format=json-pretty', true);
    request.onload = function(curEl) {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        var data = JSON.parse(this.response);
        var getImage = document.querySelector('.blog-item-hero-banner img');
        getImage.setAttribute('src', data.item.assetUrl)
      } else {
        // We reached our target server, but it returned an error
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
    };
    document.querySelector('.blog-item-hero-banner').classList.add('loaded');
  }