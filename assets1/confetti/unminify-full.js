import t from "https://cdn.skypack.dev/canvas-confetti";
function addClassNameListener(t, e) {
    var o = document.querySelector(t),
        n = o.textContent;
    window.setInterval(function () {
        var t = o.textContent;
        t !== n && (t.includes("Added!") && cartPostSubmitGhost(), (n = t));
    }, 20);
}
(window.cartPostSubmitGhost = function () {
    let e = { colors: ghostCartConfettiOptions.colors, spread: ghostCartConfettiOptions.spread, particleCount: ghostCartConfettiOptions.particleCount };
    ghostCartConfettiOptions.loop
        ? (t(e),
          setInterval(() => {
              t(e);
          }, ghostCartConfettiOptions.loopDelay))
        : t(e);
}),
    addClassNameListener(".sqs-add-to-cart-button-inner");



<script>
  $( document ).ready(function() {
    // your code goes here
    function addClassNameListener(elemId) {
      var elem = document.querySelector(elemId);
      var lastClassName = elem.textContent;
      window.setInterval( function() {   

        var className = elem.textContent;
        if (className !== lastClassName && className.includes("Added!")) {          
          window.location.href = "/upsell-page"; // class was changed
          lastClassName = className;
        }
      },20);
    }
    addClassNameListener(".sqs-add-to-cart-button-inner");

  });



________________



//import t from"https://cdn.skypack.dev/canvas-confetti";var isProduct = document.querySelectorAll('.collection-type-products.view-item')[0];if (typeof(isProduct) != 'undefined' && isProduct != null){function addClassNameListener(t,e){var o=document.querySelector(t),n=o.textContent;window.setInterval(function(){var t=o.textContent;t!==n&&(t.includes("Added!")&&cartPostSubmitGhost(),n=t)},20)}window.cartPostSubmitGhost=function(){let e={colors:ghostCartConfettiOptions.colors,spread:ghostCartConfettiOptions.spread,particleCount:ghostCartConfettiOptions.particleCount};ghostCartConfettiOptions.loop?(t(e),setInterval(()=>{t(e)},ghostCartConfettiOptions.loopDelay)):t(e)},addClassNameListener(".sqs-add-to-cart-button-inner");}

import t from "https://cdn.skypack.dev/canvas-confetti";


/*function addClassNameListener(t, e) {
    var o = document.querySelector(t),
        n = o.textContent;
    window.setInterval(function () {
        var t = o.textContent;
        var mobileNewLayout = document.querySelector('.hidden-sm-up .sqs-add-to-cart-button-inner').querySelector('.status-text');
        console.log(mobileNewLayout);
        
        t !== n && (t.includes("Added!") && cartPostSubmitGhost(), (n = t));
        if(mobileNewLayout && mobileNewLayout.textContent.includes("Added!")){
          cartPostSubmitGhost();
          return;
        }

    }, 200);
}*/

function addClassNameListener(elemId) {
  var elem = document.querySelector(elemId);
  var lastClassName = elem.textContent;




  window.setInterval( function() {   

    var className = elem.textContent;
    var mobileNewLayout = document.querySelector('.hidden-sm-up .sqs-add-to-cart-button-inner').querySelector('.status-text');



    if (className !== lastClassName && className.includes("Added!")) {          
      cartPostSubmitGhost();
      lastClassName = className;
    }

    /*
    if(mobileNewLayout){
      lastClassName = 'Added!';
      className = mobileNewLayout.textContent;


      console.log(mobileNewLayout.textContent);
      if (className !== lastClassName && mobileNewLayout.textContent.includes("Added!")) {          
        cartPostSubmitGhost();
        className = lastClassName;
      }
    }else{
      console.log('no');
    }*/
  },200);
}


(window.cartPostSubmitGhost = function () {

  let e = { colors: ghostCartConfettiOptions.colors, spread: ghostCartConfettiOptions.spread, particleCount: ghostCartConfettiOptions.particleCount };
  ghostCartConfettiOptions.loop
  ? (t(e),
    setInterval(() => {
      t(e);
    }, ghostCartConfettiOptions.loopDelay))
  : t(e);
}),
addClassNameListener(".sqs-add-to-cart-button-inner");
    /*

     function addClassNameListener(elemId) {
      var elem = document.querySelector(elemId);
      var lastClassName = elem.textContent;
      window.setInterval( function() {   

        var className = elem.textContent;
        if (className !== lastClassName && className.includes("Added!")) {          
          window.location.href = "/upsell-page"; // class was changed
          lastClassName = className;
        }
      },20);
    }

    function cartPostSubmitGhost(){


    }
    addClassNameListener(".sqs-add-to-cart-button-inner");

*/


