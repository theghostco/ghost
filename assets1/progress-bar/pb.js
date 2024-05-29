document.addEventListener('DOMContentLoaded', customJsCount);
window.addEventListener('mercury:load', customJsCount);

function customJsCount(){
  $(document).ready(function(){
    var scrollBarHTML = '<div class="ghost-scrollBar"><span></span></div>';
    document.querySelector('body').insertAdjacentHTML('beforeend', scrollBarHTML);
    $(document).scroll(function (e) {
      var scrollAmount = $(window).scrollTop();
      var documentHeight = $(document).height();
      var windowHeight = $(window).height();
      var scrollPercent = (scrollAmount / (documentHeight - windowHeight)) * 100;
      var roundScroll = Math.round(scrollPercent);
      $(".ghost-scrollBar").css("width", scrollPercent + "%");
      $(".ghost-scrollBar span").text(roundScroll);
    });
  });

};