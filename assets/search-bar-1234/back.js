//Header

<div class="modal-search">
  <div class="modal-content">
    <button type="button" class="close-search">
    	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
    </button>  
    <div class="search-top-container">
        <div class="search-wrapper">
    <i class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    </i>
      <label for="search"></label>
      <input type="search" id="search" autocomplete="off">
  </div>
    </div>
    <div class="search-message"></div>
      <div class="search-results">
    </div>
  </div>
  </div>

//Footer


<script>
  
  const values = {
    paths: ['/blog', '/store', '/events'],
    searchInHeader: false,
    iconSearch: false
};
  
</script>


 	(function(object){
    	const utils = (function(){
          
    	 function fadeIn(element, duration = 400) {
          element.style.display = 'block';
          element.style.opacity = 0;
          let last = +new Date();
          let tick = function() {
          element.style.opacity = +element.style.opacity + (new Date() - last) / duration;
          last = +new Date();

            if (+element.style.opacity < 1) {
              (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
            
          };
          tick();
}

function fadeOut(element, duration = 400, callback = null) {
            element.style.opacity = 1;
            let last = +new Date();
            let tick = function() {
              element.style.opacity = +element.style.opacity - (new Date() - last) / duration;
              last = +new Date();

              if (+element.style.opacity > 0) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
              } else {
                element.style.display = 'none';
                if (callback) {
                callback();
            }
          }
            };
            tick();
          }
      
      return {
      	fadeIn, fadeOut
      }
    })()
    
    const results = [];
    const listOfItems = document.createElement('div');
    listOfItems.setAttribute('class', 'search-list');
  	const searchResults = document.querySelector('.search-results');
        
    let target;
    
      if(object.searchInHeader) {
      	const header = document.querySelector('.header-inner');
        target = document.createElement('div');
        target.innerHTML = `<button type="button" class="btn-search">Search</button>`;
        header.appendChild(target);
      } else {
      	target = document.querySelector('.btn-search');
      }
      
      if(object.iconSearch) {
    	document.querySelector('.btn-search').classList.add('search-icon-visible');	
    }
      
    const promises = object.paths.map((path) => {
        return fetch(document.location.origin + path +'?format=json-pretty')

            .then(response => response.json())
            .then(data => data)
    });

    Promise.all(promises)
        .then(responses => {
            responses.forEach((response, i) => {
                results.push(response);
            });

            listOfItems.innerHTML = buildContent(results);
           
      		searchResults.appendChild(listOfItems);
            addEventListeners();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function buildContent(data) {
        console.log('data', data)
        const items = data.reduce((acc, obj) => acc.concat(obj.items || obj.upcoming), []);
        const result = [];

        for (let i = 0; i < items.length; i++) {
           //console.log('items', items[i])
            const img = items[i].assetUrl;
            const href = items[i].fullUrl;
            const title = items[i].title;
            const excerpt = items[i].excerpt;
        
            let price;
            let category;
          
            if(items[i].variants) {
                price = items[i].variants[0].priceMoney.value;
            } else {
                price = ''
            }
          
           if(items[i].categories) {
           	 //category = (JSON.parse(items[i].categories)).join(', ');
             category = items[i].categories.join(', ')
           } else {
           	category = '';
           }

            const createItem = `
                    <div class="search-item">
					<a href=${href} class="item-link">
						<figure class="image">
							<img src=${img} alt="">
  						</figure>
						 <div class="description">
							<p class="categories">${category}</p>
  							<h4 class="title">${title}</h4>
						
							<div>${price}
								<span class="currency"></span>
  								<span class="price-value">${price}</span>
  							</div>
							<div class="excerpt">
								${excerpt}
								
  							</div>
  						</div>	
					</a>
                </div>
`;
            result.push(createItem);
        }

        return result.join('');
    }

    function addEventListeners() {
      	    filterItemsByInput();
      		openModal();
            closeModal();
    }
  
  	function filterItemsByInput() {
    	const inputSearch = document.querySelector('#search');
        const items = document.querySelectorAll('.search-item');
      	const searchMessage = document.querySelector('.search-message');

        inputSearch.addEventListener('input', (e) => {
            const filter = e.target.value.toLowerCase();
            let count = 0;
          	let condition = false;
          
            items.forEach(item => {
              let combinedInnerHTML = '';
              
              const listHtml = item.querySelectorAll('span, p, a, div');
              listHtml.forEach((el) => combinedInnerHTML+= el.innerHTML.toLowerCase());
              
                const title = item.querySelector('.title');
                const excerpt = item.querySelector('.excerpt p');
              	
              //if(title.innerHTML.toLowerCase().includes(filter) || excerpt.innerHTML.toLowerCase().includes(filter)) {
                   if(combinedInnerHTML.includes(filter)) {
                        item.style.display = 'block';
                        count++;
                } else {
                 		item.style.display = 'none';
                }

                if(count === 0) {
                    searchMessage.innerHTML = '<p>Sorry, we couldn\'t find any matches...</p>';
                } else {
                    searchMessage.innerHTML = '';
                }
            });
        })
    }
  
    function openModal () {
        const modalSearch = document.querySelector('.modal-search');

    target.addEventListener('click', (e) => {
        e.preventDefault();    
        utils.fadeIn(modalSearch, 400);
    });
    }
  
	function closeModal () {
       const btnCloseSearch = document.querySelector('.close-search');
       const modalSearch = document.querySelector('.modal-search');
      
    	btnCloseSearch.addEventListener('click', (e) => {
         const items = document.querySelectorAll('.search-item');
        
         utils.fadeOut(modalSearch, 400, function () {
           clearFilter();
         }); 
    });
    }
  
  function clearFilter () {
    const inputSearch = document.querySelector('#search');
    const modalSearch = document.querySelector('.modal-search');
    const searchMessage = document.querySelector('.search-message');

      inputSearch.value = '';
      const items = document.querySelectorAll('.search-item');
      searchMessage.innerHTML = '';
      items.forEach(item => item.style.display = 'block'); 
  }
    
    }(values))

</script>
