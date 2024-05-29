
  (function(){
    var forcedMenuFrom = globalGhostForcedMenu;

    var winWidth = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

    function getWindowWidth(){
      var winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if(+forcedMenuFrom > winWidth || +forcedMenuFrom == 0){
        document.querySelectorAll('body')[0].classList.add('forced-mobile-menu');
      }else{
        document.querySelectorAll('body')[0].classList.remove('forced-mobile-menu');
      } 
      document.querySelectorAll('#header')[0].classList.add('loaded-header');
    }
    window.addEventListener("resize", getWindowWidth);
    getWindowWidth();
  }());