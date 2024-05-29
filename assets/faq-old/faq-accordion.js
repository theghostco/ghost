var $ghostFaqAccordion = $('.ghost-begin-faq-accordion');

if ($ghostFaqAccordion.length){
  $ghostFaqAccordion.each(function(){
    $(this).closest('.sqs-col-12').addClass('ghost-section-contains-faq');
  });

  $('.ghost-begin-faq-accordion').each(function(){
    $(this).closest('.code-block').addClass('start-faq-section');
  });

  $('.ghost-end-faq-accordion').each(function(){
    $(this).closest('.code-block').addClass('end-faq-section');
  });



  $('.start-faq-section').each(function(){
    $(this).nextUntil($('.end-faq-section')).wrapAll('<div class="ghost-faq-wrapper-item"></div>');
  });


  $('.ghost-faq-wrapper-item h3').each(function(){
    $(this).addClass('ghost-faq-accordion-title');
    $('<div class="ghost-faq-item-end"></div>').insertBefore($(this));
    $('<div class="ghost-begin-faq-item"></div>').insertBefore($(this));
    $('<div class="plusminus-wrapper"><div class="plusminus"></div></div>').insertBefore($(this));

  });
  $('.ghost-faq-wrapper-item p').each(function(){
    $(this).addClass('ghost-faq-body');
  });

  $('.ghost-begin-faq-item').each(function(){
    $(this).nextUntil($('.ghost-faq-item-end')).wrapAll('<div class="faq-item"></div>');
  });


  $('.faq-item').click(function(){
    $(this).toggleClass('active-faq-item');
    $(this).find('.ghost-faq-body').slideToggle();
  });

}