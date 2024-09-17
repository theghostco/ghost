<script>
  var ghostGlobalImageListView = {
    url: '/gallery-content',
    listViewOptions:{
    	counterTitle: 'Project №',
    	projectNameTitle: 'Name',
    	projectLocationTitle: 'Location'
    }
  }
</script>
<!--<script src="https://ghosthub.boo/assets/image-list-view/index.js"></script>-->
<script>
  
function switcherGallery(){
	var urlForGallery = document.location.origin + ghostGlobalImageListView.url + '?format=json-pretty';
	const galleryWrapper = document.querySelector('.switcher-gallery-wrapper')
    
    if(galleryWrapper){
      let switcherContainer = document.createElement('div');
            switcherContainer.className = "switcher-outer-container";
            switcherContainer.innerHTML = `
<div class="switcher-container">
<p class="image-view">Image View</p>
<div class="switcher-block">
	<div class="switcher"></div>
</div>
<p class="list-view">List View</p>
</div>`;
       		
       		galleryWrapper.append(switcherContainer)
       
       		let galleryContainer = document.createElement('div');
            galleryContainer.className = "gallery-container";
            
            let galleryItems = document.createElement('div');
            galleryItems.className = "gallery-items"
      
      		galleryContainer.append(galleryItems)
       		galleryWrapper.append(galleryContainer)
      
      		let listContainer = document.createElement('div');
            listContainer.className = "list-container";
      		listContainer.classList.add ('hidden-block')
            
       		galleryWrapper.append(listContainer)
      
      		let listItems = document.createElement('div');
              listItems.className = "list-items";
              listItems.innerHTML = `
<div class = "list-item first-row">
  <a class="list-link">
    <p>${ghostGlobalImageListView.listViewOptions.counterTitle}</p>
    <p>${ghostGlobalImageListView.listViewOptions.projectNameTitle}</p>
    <p>${ghostGlobalImageListView.listViewOptions.projectLocationTitle}</p>
  </a>
</div>`
              listContainer.append(listItems)
    
     fetch(urlForGallery)
        .then(response => response.json())
        .then(data => {
       			
       		for (let i = 0; i < data.items.length; i++){
              const itemImg = data.items[i].assetUrl
              const itemTitle = data.items[i].title
              const itemExcerpt = data.items[i].excerpt
              const itemPassThrough = data.items[i].passthrough
              const itemPostUrl = data.items[i].fullUrl
              const itemSourceUrl = data.items[i].sourceUrl
              
             
              let counter = (i + 1).toString().padStart(3, '0');
              
              let galleryItem = document.createElement('div');
              galleryItem.className = "gallery-item";
              
              let listItem = document.createElement('div');
              listItem.className = "list-item";
              
              
              if(itemPassThrough){
              	galleryItem.innerHTML = `
<a class="item-link" href="${itemSourceUrl}" target="_blank">
  <div class="item-image">
      <img src = ${itemImg}>
  </div>
<div class="item-decription">
<div class="item-description-text">
  <div class="item-header_title">
      <p>${itemTitle}</p>
  </div>
  <div class="item-header_title-exerpt">
      <div><p>${itemTitle}</p></div>
      <div>${itemExcerpt}</div>
  </div>
</div>
<div class="icon-wrapper"><div class="arrow-icon"></div></div>
</div>
</a>`
                
                listItem.innerHTML = `
<a class="list-link" href="${itemSourceUrl}" target="_blank">
	<p class="list-item_counter">${counter}</p>
	<p>${itemTitle}</p>
    <div>${itemExcerpt}</div>
</a>`
                
              }else{
              	galleryItem.innerHTML = `
<a class="item-link" href = "${document.location.origin}${itemPostUrl}">
  <div class="item-image">
      <img src = ${itemImg}>
  </div>
<div class="item-decription">
<div class="item-description-text">
  <div class="item-header_title">
      <p>${itemTitle}</p>
  </div>
  <div class="item-header_title-exerpt">
      <div><p>${itemTitle}</p></div>
      <div>${itemExcerpt}</div>
  </div>
</div>
<div class="icon-wrapper"><div class="arrow-icon"></div></div>
</div>
</a>`
                
                   listItem.innerHTML = `
<a class="list-link" href = "${document.location.origin}${itemPostUrl}">
	<p class="list-item_counter">00${i+1}</p>
	<p>${itemTitle}</p>
    <div>${itemExcerpt}</div>
</a>`
              }
              
              
              galleryItems.append(galleryItem)
              listItems.append(listItem)
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
} 

switcherGallery()
  
  document.addEventListener('DOMContentLoaded', function() {
   const gallerySwitcherWrapper = document.querySelector('.switcher-gallery-wrapper')
    if(gallerySwitcherWrapper){
      const switcherCircle = gallerySwitcherWrapper.querySelector('.switcher');
      const switcher = gallerySwitcherWrapper.querySelector('.switcher-container');
      const galleryBlock = gallerySwitcherWrapper.querySelector('.gallery-container');
      const listBlock = gallerySwitcherWrapper.querySelector('.list-container');

      switcher.addEventListener('click', function() {
          if (galleryBlock.classList.contains('hidden-block')) {
              galleryBlock.classList.remove('hidden-block');
              listBlock.classList.add('hidden-block');
              switcherCircle.style.left = '3px'
          } else {
              galleryBlock.classList.add('hidden-block');
              listBlock.classList.remove('hidden-block');
              switcherCircle.style.left = 'calc(100% - 19px)'
          }
      });
   }
});

  
</script>
