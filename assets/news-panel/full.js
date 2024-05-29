<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>

<script>
  $(function() {
    $('<div id="overlayMenu" class="overlay-menu-section page-section"><div class=" overlay-menu-wrapper content-wrapper"><div class="overlay_menu-title-wrapper"><div class="overlay_menu-title"><span>Incoming</span></div><div class="overlay_menu-subtitle"><span>Notifications</span></div></div><div class="overlay-menu-list content"></div></div></div>').appendTo('body');
    $('.overlay-menu-section .content').load('/overlay-menu' + ' #page-section-6433f94798251c4a5f3b420d',function(){
      window.Squarespace.initializeLayoutBlocks(Y);
    });   
 
    $('body').prepend('<div class="opened-popup-menu-overlay"></div>');

    $('body').append('<a id="closeBtn" class="closebtn">Close</a>');
    $('body #closeBtn').hide();
    $('.opened-popup-menu-overlay').fadeOut(0);

    $('a[href*="#panel"]').on( "click", function() {
      $('body').addClass('opened-popup-menu');
 
      $('#overlayMenu .overlay-menu-list').delay(100).fadeIn(200);
      $('#overlayMenu .overlay_menu-logo-wrapper').delay(100).fadeIn(200);
      $('.opened-popup-menu-overlay').fadeIn(200); 
      $('.opened-popup-menu-overlay').css("opacity", "1");
      $('.opened-popup-menu-overlay').css("z-index", "10");
      $('body #closeBtn').delay(600).fadeIn(200);
    });
    
    $("#closeBtn").on( "click", function() {
      $('body').removeClass('opened-popup-menu');

      $('#overlayMenu .overlay_menu-logo-wrapper').fadeOut(100);      
      $('#overlayMenu .overlay-menu-list').fadeOut(100);    
      $('.opened-popup-menu-overlay').fadeOut(100);
      $('.opened-popup-menu-overlay').css("opacity", "0");
      $('.opened-popup-menu-overlay').css("z-index", "0"); 
      $(this).hide();
      //$('a[href*="#overlay-panel-button"]').show();
    });

    $(".opened-popup-menu-overlay").on( "click", function() {
      $('body').removeClass('opened-popup-menu');

      $('#overlayMenu .overlay_menu-logo-wrapper').fadeOut(100);      
      $('#overlayMenu .overlay-menu-list').fadeOut(100);    
      $('.opened-popup-menu-overlay').fadeOut(100);
      $("#closeBtn").hide();
      $(this).css("opacity", "0");
      $(this).css("z-index", "0"); 
    });
  });
</script>