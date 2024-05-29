$(document).ready(function(){
  if($('html').hasClass('touch')){
   $("body").on("click",".sqs-gallery-design-list .summary-item", function(){
    $(this).toggleClass('hovered');
  })
 } else {
   $('body').on("mouseenter mouseleave",".sqs-gallery-design-list .summary-item", function(e){
     if (e.type == "mouseenter") {
       $(this).addClass('hovered');
     } else {
       $(this).removeClass('hovered');
     }
   })
 }
});