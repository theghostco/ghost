<script>
  ;(function () {
    var isProductFaq = document.querySelectorAll(".ProductItem-additional .accordion-block")[0];
    if (typeof isProductFaq != "undefined" && isProductFaq != null) {
      isProductFaq.classList.add('hide');
      let tabsContainer =  '<div class="tab-container"><div class="tab-buttons"></div><div class="tab-content"></div></div>';

      document.querySelectorAll(".ProductItem-details-excerpt")[0].insertAdjacentHTML('afterbegin', tabsContainer);

      let buttonsContainer = document.querySelector(".tab-buttons"),
      bodyContainer = document.querySelector(".tab-content");

      //set up markup
      isProductFaq.querySelectorAll('.accordion-item').forEach(function(thisItem, i){

        let tabTitle = thisItem.querySelector(".accordion-item__title").textContent,
        tabBody = thisItem.querySelector(".accordion-item__description").outerHTML;

        buttonsContainer.insertAdjacentHTML('beforeend', ' <button class="tab-button" data-tab="tab-'+i+'">'+tabTitle+'</button>');
        bodyContainer.insertAdjacentHTML('beforeend', '<div class="tab" data-tab="tab-'+i+'">'+tabBody+'</div>');
      });
      
      const container = document.querySelector(".tab-buttons");
      const tabs = document.getElementsByClassName("tab-button");
      
      buttonsContainer.querySelector('.tab-button').classList.add('active');
      bodyContainer.querySelector('.tab').classList.add('active-body');

      //hundle clicks
      buttonsContainer.querySelectorAll('.tab-button').forEach(function(thisTab){
        thisTab.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          let selector = thisTab.getAttribute('data-tab');

          if(!thisTab.classList.contains('active')){
            buttonsContainer.querySelector('.active').classList.remove('active');
            bodyContainer.querySelector('.active-body').classList.remove('active-body');

            thisTab.classList.add('active');
            bodyContainer.querySelector('.tab[data-tab="'+selector+'"]').classList.add('active-body');
            
          }else{
            return;
          }
        });
      })
    }
  })();
</script>