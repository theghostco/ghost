(function(){

  document.querySelectorAll('#header .header-menu')[0].insertAdjacentHTML('afterend', '<div class="header-menu-close-trigger"></div>');

  function clickFire(elem){
    if (elem.onclick) {
      elem.onclick();
    } else if (elem.click) {
      elem.click();
    }
  }

  let closeButton = document.querySelectorAll('.header-burger-btn')[0];

  document.querySelectorAll('.header-menu-close-trigger')[0].addEventListener('click', event => {
    clickFire(closeButton);
  })
}());