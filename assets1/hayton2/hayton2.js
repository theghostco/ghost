;(function(){
  let isGallery = document.querySelectorAll('.sqs-gallery-design-carousel')[0];
  let pluginName = 'hayton2';
  if (typeof(isGallery) != 'undefined' && isGallery != null){
    document.querySelectorAll('.sqs-gallery-design-carousel').forEach(function(thisSummary){
      var thisHeadingElement = thisSummary.querySelector('.summary-header-text');
      var thisHeadText = thisHeadingElement.innerText || thisHeadingElement.textContent;
      if(thisHeadText == pluginName){
        thisSummary.classList.add(pluginName+'-plugin');
        var thisSummaryParent = thisSummary.closest('.sqs-block');
        var thisSummaryId = thisSummaryParent.getAttribute('id');
        thisSummary.closest('section').classList.add('section-with-'+pluginName+'-slider');
        thisSummary.closest('body').classList.add('page-with-'+pluginName+'-plugin');
      }
    });
  }
}());