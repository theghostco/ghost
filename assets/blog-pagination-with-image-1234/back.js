<script>
  
  const values = {
  	 path: '/blog',
    collectionClass: 'collection-66c58cc4781ed5709afa7a43',
  };
</script>

  <script>
  (function(path, collection){
    
  		fetch(document.location.origin + path +'?format=json-pretty')

            .then(response => response.json())
            .then(data => {
        		const blogList = buildList(data);
          		setPaginationImg(blogList);
        })
  
  function buildList(data) {
	const blogList = [];
    
  	for (let i = 0; i < data.items.length; i++) {
      	let prevIndex;
      	let nextIndex;
      	
      if(i === 0) {
        	prevIndex = data.items.length-1
        } else {
        	prevIndex = i - 1
        }
      
       if(i === data.items.length-1) {
        	nextIndex = 0
        } else {
        	nextIndex = i + 1;
        }
           
    	blogList.push({id: data.items[i].id, urlPrev: data.items[prevIndex].assetUrl, urlNext: data.items[nextIndex].assetUrl})
    }
    
    	return blogList;
  }
  
      function setPaginationImg (list) {
       document.querySelector(`.${collection}.view-item`).classList.add('blog-img-pagination')
       const blogItem =  document.querySelector(`.${collection}.view-item .blog-item-wrapper`);
       const root = document.documentElement;
       
    if (blogItem){
  	  const blogItemImgSrc = document.head.querySelector("[property='og:image']").content; 
      const blogId = document.body.getAttribute('id');
      root.style.setProperty('--project-bg', `url(${blogItemImgSrc})`);
      
      let url;
      
      list.forEach((el, i) => {
        if(blogId.includes(el.id)){
           urlPrev = el.urlPrev;
           urlNext = el.urlNext;
          
            root.style.setProperty('--blog-pagination-prev', `url(${urlPrev})`);
            root.style.setProperty('--blog-pagination-next', `url(${urlNext})`);
           }
      	})
    	}
      }   
  })(values.path, values.collectionClass)
 
</script>
