<script>
const checkPlugin = document.querySelectorAll('[data-ghost-blur]');
  if (typeof(checkPlugin) != 'undefined' && checkPlugin != null){
    const sliderCount = 1;
    checkPlugin.forEach(function(el){
      const getSliderContentUrl = el.getAttribute('data-blog-href')
      const getPluginName = el.getAttribute('data-ghost-plugin-name')
      if( getPluginName == 'blur-summary' ){
        const blurSummaryWrapper = document.createElement('div')
        blurSummaryWrapper.className = 'blur-summary-wrapper'
        
        el.append(blurSummaryWrapper)
        
        fetch(`${document.location.origin}${getSliderContentUrl}?format=json-pretty`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then(data => {
          
          data.items.forEach((item) =>{
          	const getItemTitle = item.title
            const getItemExcerpt = item.excerpt
            const getItemImage = item.assetUrl
            const getItemUrl = item.fullUrl
            
            const blurSummaryItem = document.createElement('div')
            blurSummaryItem.className = 'blur-summary-item'
            blurSummaryItem.innerHTML = `
				<a class='blur-item-link' href='${getItemUrl}'>
					<div class='blur-item-img'>
  						<img src='${getItemImage}'>
  					</div>
					<h3 class='blur-item-title'>${getItemTitle}</h3>
  				</a>`
            
            blurSummaryWrapper.append(blurSummaryItem)
          })
            const blurItems = blurSummaryWrapper.querySelectorAll('.blur-summary-item');

              blurItems.forEach(item => {
                item.addEventListener('mouseover', () => {
                  blurItems.forEach(el => {
                    if (el !== item) {
                      el.classList.add('blur');
                    }
                  });
              });

              item.addEventListener('mouseout', () => {
                blurItems.forEach(el => {
                  el.classList.remove('blur');
                });
             });
          });
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });

      }
    })
  }

</script>
