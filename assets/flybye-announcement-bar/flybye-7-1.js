 $(document).ready(function(){
  var slickOpts = {
    speed: 6000,
    autoplay: true,
    autoplaySpeed: 0,
    centerMode: true,
    cssEase: 'linear',
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    infinite: true,
    initialSlide: 1,
    arrows: false,
    buttons: false,
    pauseOnHover:false,
    responsive: [{
      breakpoint: 640,
      settings: {
        variableWidth: true
      }
    }]
  };
  function callSlider(){
    $('#announcement-bar-text-inner-id').slick({
      speed: 6000,
      autoplay: false,
      autoplaySpeed: 0,
      centerMode: true,
      cssEase: 'linear',
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      infinite: true,
      initialSlide: 1,
      arrows: false,
      buttons: false,
      pauseOnHover:false,
      centerMode: true,
      focusOnSelect: true,
      pauseOnHover:false,
      responsive: [{
        breakpoint: 640,
        settings: {
          variableWidth: true
        }
      }]
    })
    .slick('slickPlay')
    .slick('setOption', 'autoplay', true)
    $('.sqs-announcement-bar-dropzone').addClass('show-announcement');
  }
  
  var timerId2 = setInterval(function() {

    if($('#announcement-bar-text-inner-id').length > 0){
      console.log('call');
      callSlider();
      clearInterval(timerId2);
    }else{
        //console.log('');
      }
    }, 1000);
});