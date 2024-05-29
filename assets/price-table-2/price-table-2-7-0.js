//window.Squarespace.onInitialize(Y, function() {var isGallery=document.querySelectorAll(".summary-block-wrapper.sqs-gallery-design-carousel")[0];void 0!==isGallery&&null!=isGallery&&document.querySelectorAll(".sqs-gallery-design-carousel").forEach(function(e){var r=e.querySelector(".summary-header-text");if("price"==(r.innerText||r.textContent)){e.classList.add("price-plugin"),e.closest("section").classList.add("section-with-price-slider");var i=e.closest(".sqs-block").getAttribute("id");e.insertAdjacentHTML("beforeend",'<div class="price-plugin-wrapper"><div class="price-inner-wrapper"></div></div>');var s=e.querySelector(".price-inner-wrapper");e.querySelectorAll(".summary-item").forEach(function(e,r){var t=i+"-slide-"+r;e.setAttribute("data-slide-id",t);let l=e.querySelector(".summary-title-link"),a=l.innerText||l.textContent;console.log(a);let c='<div class="price-slide image-slide" data-slide-img-id="'+t+'"><div class="price-wrapper"><h3>'+('<div class="title-wrapper"><h3>'+a+"</h3></div>")+'</h3><div class="desc-slide">'+('<div class="desc-wrapper"><p>'+(e.querySelector(".summary-excerpt").outerHTML||e.querySelector(".summary-excerpt").textContent)+"</p></div>")+"</div></div></div>";s.insertAdjacentHTML("beforeend",c)})}e.classList.add("loaded-carousel")});});

var isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];

if (typeof(isGallery) != 'undefined' && isGallery != null){

  document.querySelectorAll('.summary-block-wrapper.sqs-gallery-design-carousel').forEach(function(thisSummary){
    var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
    var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;
    console.log('gallery exist');
    thisHeadText = thisHeadText.toLowerCase();
    if(thisHeadText == 'price'){
      console.log('price gallery exist');
      thisSummary.classList.add('price-plugin');
      if( thisSummary.closest('section')){
      	thisSummary.closest('section').classList.add('section-with-price-slider');
      }else if(thisSummary.closest('.index-section')){
      	thisSummary.closest('.index-section').classList.add('section-with-price-slider');
      }else{
      	thisSummary.closest('#page').classList.add('section-with-price-slider');
      }
      
      var thisSummaryParent = thisSummary.closest('.sqs-block');
      var thisSummaryId = thisSummaryParent.getAttribute('id');
      thisSummary.insertAdjacentHTML('beforeend', '<div class="price-plugin-wrapper"><div class="price-inner-wrapper"></div></div>');
      var sliderPlace = thisSummary.querySelector('.price-inner-wrapper');

        //
        thisSummary.querySelectorAll('.summary-item').forEach(function(thisSlide, i){  
          //unique ID
          var newId = thisSummaryId+'-slide-'+i;
          thisSlide.setAttribute('data-slide-id', newId);

          //content vars
          let summaryTitle = thisSlide.querySelector('.summary-title-link');

          let summaryTitleText = summaryTitle.innerText || summaryTitle.textContent;
          console.log(summaryTitleText);

          let summaryDescription = thisSlide.querySelector('.summary-excerpt').outerHTML || thisSlide.querySelector('.summary-excerpt').textContent;

          //markup
          let slideTitle = '<div class="title-wrapper"><h3>'+summaryTitleText+'</h3></div>';

          let description = '<div class="desc-wrapper"><p>'+summaryDescription+'</p></div>';

          let mainMarkup = '<div class="price-slide image-slide" data-slide-img-id="'+newId+'"><div class="price-wrapper"><h3>'+slideTitle+'</h3><div class="desc-slide">'+ description + '</div></div></div>';
          sliderPlace.insertAdjacentHTML('beforeend', mainMarkup);
        });

      }
      thisSummary.classList.add('loaded-carousel');
    })
}