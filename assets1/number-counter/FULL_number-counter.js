
document.addEventListener('DOMContentLoaded', customJsCounter);
window.addEventListener('mercury:load', customJsCounter);


function customJsCounter(){

  var isCounter = document.querySelectorAll('.number-counter-plugin')[0];

  if (typeof(isCounter) != 'undefined' && isCounter != null){

    const easingFn = function (t, b, c, d) {
      var ts = (t /= d) * t;
      var tc = ts * t;
      return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 * t);
    }
    
    const options = {
      duration: globalGhostNumbersControl.amimationDuration,
      easingFn,
      prefix: globalGhostNumbersControl.prefix,
      suffix: globalGhostNumbersControl.suffix,
      separator: globalGhostNumbersControl.separator !== undefined ? globalGhostNumbersControl.separator: ','
    };

    var isStart = 0;
    var position = 0;

    var element = document.querySelectorAll('.number-counter-plugin')[0];

    function callAnimation() {
     if(element){
      position = element.getBoundingClientRect();
    }

    if(position.top < window.innerHeight && position.bottom >= 0) {
      if(isStart<1){
        document.querySelectorAll('.number-counter-slide .conter-number').forEach(function(thisNode){
          let thisId = thisNode.getAttribute('id');
          let thisNum = thisNode.getAttribute('data-num');
          new CountUp(thisId, thisNum, options).start();
        });
      }
      isStart++;
      return false;
    }
  }
  callAnimation();

  window.addEventListener('scroll', function() {
    callAnimation();

  });
}
}







// if (window.location.href.indexOf("michael-davis") > -1) {
//  console.log("yes");

function customJsCounter(){var t=document.querySelectorAll(".number-counter-plugin")[0];if(void 0!==t&&null!=t){let n=function(t,n,e,r){var o=(t/=r)*t,i=o*t;return n+e*(i*o+-5*o*o+10*i+-10*o+5*t)},e={duration:globalGhostNumbersControl.amimationDuration,easingFn:n,prefix:globalGhostNumbersControl.prefix,suffix:globalGhostNumbersControl.suffix,separator:void 0!==globalGhostNumbersControl.separator?globalGhostNumbersControl.separator:","};function r(t){var n=t.getBoundingClientRect();return n.bottom>0&&n.right>0&&n.left<(window.innerWidth||document.documentElement.clientWidth)&&n.top<(window.innerHeight||document.documentElement.clientHeight)}function o(t){var n=0;if(t&&(n=t.getBoundingClientRect()),console.log(r(t)+" = "+t),r(t))return t.querySelectorAll(".number-counter-slide .conter-number").forEach(function(t){let n=t.getAttribute("id"),r=t.getAttribute("data-num");new CountUp(n,r,e).start()}),t.classList.add("counting-is-done"),!1}document.querySelectorAll(".number-counter-plugin:not(.counting-is-done)").forEach(function(t){o(t)}),window.addEventListener("scroll",function(){document.querySelectorAll(".number-counter-plugin:not(.counting-is-done)").forEach(function(t){o(t)})})}}document.addEventListener("DOMContentLoaded",customJsCounter),window.addEventListener("mercury:load",customJsCounter);




  document.addEventListener('DOMContentLoaded', customJsCounter);
  window.addEventListener('mercury:load', customJsCounter);


  function customJsCounter(){

    var isCounter = document.querySelectorAll('.number-counter-plugin')[0];

    if (typeof(isCounter) != 'undefined' && isCounter != null){

      const easingFn = function (t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 * t);
      }

      const options = {
        duration: globalGhostNumbersControl.amimationDuration,
        easingFn,
        prefix: globalGhostNumbersControl.prefix,
        suffix: globalGhostNumbersControl.suffix,
        separator: globalGhostNumbersControl.separator !== undefined ? globalGhostNumbersControl.separator: ','
      };

      

      function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();

        return rect.bottom > 0 &&
        rect.right > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
        rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */;
      }

      function callAnimation(element) {

        var position = 0;
        if(element){
          position = element.getBoundingClientRect();
        }

        console.log(isElementInViewport(element) + ' = '+ element);
        if(isElementInViewport(element)) {

          element.querySelectorAll('.number-counter-slide .conter-number').forEach(function(thisNode){
            let thisId = thisNode.getAttribute('id');
            let thisNum = thisNode.getAttribute('data-num');
            new CountUp(thisId, thisNum, options).start();
          });
          element.classList.add('counting-is-done');

          return false;
        }
      }

      document.querySelectorAll('.number-counter-plugin:not(.counting-is-done)').forEach(function(elements){
        callAnimation(elements);
      });
      

      window.addEventListener('scroll', function() {
        document.querySelectorAll('.number-counter-plugin:not(.counting-is-done)').forEach(function(elements){
          callAnimation(elements);
        });
      });
    }
  }
/*

}else{




  document.addEventListener('DOMContentLoaded', customJsCounter);
  window.addEventListener('mercury:load', customJsCounter);


  function customJsCounter(){

    var isCounter = document.querySelectorAll('.number-counter-plugin')[0];

    if (typeof(isCounter) != 'undefined' && isCounter != null){

      const easingFn = function (t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (tc * ts + -5 * ts * ts + 10 * tc + -10 * ts + 5 * t);
      }

      const options = {
        duration: globalGhostNumbersControl.amimationDuration,
        easingFn,
        prefix: globalGhostNumbersControl.prefix,
        suffix: globalGhostNumbersControl.suffix,
        separator: globalGhostNumbersControl.separator !== undefined ? globalGhostNumbersControl.separator: ','
      };

      var isStart = 0;
      var position = 0;

      var element = document.querySelectorAll('.number-counter-plugin')[0];

      function callAnimation() {
        if(element){
          position = element.getBoundingClientRect();
        }

        if(position.top < window.innerHeight && position.bottom >= 0) {
          if(isStart<1){
            document.querySelectorAll('.number-counter-slide .conter-number').forEach(function(thisNode){
              let thisId = thisNode.getAttribute('id');
              let thisNum = thisNode.getAttribute('data-num');
              new CountUp(thisId, thisNum, options).start();
            });
          }
          isStart++;
          return false;
        }
      }
      callAnimation();

      window.addEventListener('scroll', function() {
        callAnimation();

      });
    }
  }
}*/