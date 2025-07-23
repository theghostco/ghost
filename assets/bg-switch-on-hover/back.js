<script>
  
  /*
  Code block
  <div 
    data-body-bg-trigger 
    data-ghost-plugin-name='body-bg-hover' 
    data-blog-href='/body-bg-hover'>
  </div> */
  
  
  const values = {
  	page: '#collection-687b1088b61d2531582003b7',  //page ID
    attribute: 'data-body-bg-trigger'     // code block's attribute
  };
  
(function (dataAttr) {
    const utils = (function () {
        function getParentEl(el, tagName) {
            let searchEl = el;

            while (searchEl.parentElement) {
                if (searchEl.parentElement.tagName.toLowerCase() === tagName.toLowerCase()) {
                    return searchEl.parentElement;
                }

                searchEl = searchEl.parentElement;
            }

            return null;
        }

        function setAttrParents(attr, tag) {
            let list = document.querySelectorAll(`[${attr}]`);
            list.forEach((el) => {
                const tagEl = getParentEl(el, tag);

                if (!tagEl) {
                    return;
                }
                tagEl.setAttribute(attr, '');
            })
        }

        function fetchData(path) {
            const url = document.location.origin + path + '?format=json-pretty';

            return fetch(url)
                .then((response) => response.json())
        }

        return {
            setAttrParents, fetchData
        };
    })();

    utils.setAttrParents(dataAttr, 'section');

    const plugin = document.querySelector(`div[${dataAttr}]`);

    const injectHtmlCode = (data) => {
        plugin.innerHTML = data;
      	setHoverEffect();
    }

    const buildHtml = (items) => {
      	const arrOfItems = [];
        for (let i = 0; i < items.length; i++) {
          	console.log('items[i]', items[i])
            const itemTitle = items[i].title;
          	const url = items[i].fullUrl;
            const iItemImage = items[i].assetUrl;
            const body = items[i].body;
            const html = document.createElement('div');
            html.innerHTML = body;
  
            const gif = html.querySelector('img');
          	const gifSrc = gif ? gif.getAttribute('data-src') : '';
          
            const div = `<a href=${url} data-color=${items[i].tags} class="bg-trigger-item">
                 <h1>${itemTitle}</h1>
				
				<div class="bg-trigger-img-box">
                <figure class="bg-trigger-img">
                 	<img src=${iItemImage}>
                </figure>
				<div class="bg-trigger-media">
                  <img src=${gifSrc}>
                </div>
				</div>
			 </a>`;
          
           arrOfItems.push(div);
        } 
   
      injectHtmlCode(arrOfItems.join('')); 
    }

    const createContent = () => {
        const contentListUrl = plugin.getAttribute('data-blog-href')

        utils.fetchData(contentListUrl)
            .then((dataList) => {
                buildHtml(dataList.items);
            });
    }

    function setHoverEffect() {
    	const links = document.querySelectorAll('.bg-trigger-item');
      	
        links.forEach((link) => {
          link.addEventListener('mouseenter', () => {
            const color = link.getAttribute('data-color');
            document.documentElement.style.setProperty('--hover-color', color);
            document.body.classList.add('hover-active');
          });

          link.addEventListener('mouseleave', () => {
            document.documentElement.style.setProperty('--hover-color', '');
            document.body.classList.remove('hover-active');
          });
        });
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        const homepage = document.querySelector(values.page);
		
        if (homepage) {
            createContent();
        }
    })


}(values.attribute));
  
</script>
