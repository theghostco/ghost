(function (values){
  
    const {dataAttr, clickable} = values;
  
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
               const body = getParentEl(tagEl, 'body');
             body.setAttribute(attr, '');
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
    const plugin = document.querySelector('div[data-animated-headings]');

    const injectHtmlCode = (html) => {
        const ul = document.createElement('ul');
        ul.innerHTML = html;
        plugin.appendChild(ul);
    }

    const buildHtml = (items) => {
        const result = [];
        let createItem;

        for (let i = 0; i < items.length; i++) {
          
            const itemTitle = items[i].title;
            const href = items[i].sourceUrl ? items[i].sourceUrl : items[i].fullUrl;
            const hrefFull = items[i].fullUrl;
            const itemExcerpt = items[i].excerpt;
            const iItemImage = items[i].assetUrl;
            const body = items[i].body;
        const target = items[i].passthrough ? 'target="_blank"' : '' 
          if( clickable) {
             createItem = `
    <li class="heading-block-wrap">
        <a href=${href} class="heading" ${target}>
  <h1>${itemTitle}</h1>
  </a>
    <div class="img-container">
            <div class="img-title">${itemExcerpt}</div>
              <figure>
                  <img src="${iItemImage}" alt="">
              </figure>
      </div>
    </a>
    </li>`;
            
          } else {
              createItem = `
    <li class="heading-block-wrap">
        <div class="heading">
  <h1>${itemTitle}</h1>
  </a>
    <div class="img-container">
            <div class="img-title">${itemExcerpt}</div>
              <figure>
                  <img src="${iItemImage}" alt="">
              </figure>
      </div>
    </div>
    </li>`;
          }
   
            result.push(createItem);
        }

        injectHtmlCode(result.join(''));
    }

    const createContent = () => {
    if(plugin) {
           const contentListUrl = plugin.getAttribute('data-blog-href');
              utils.fetchData(contentListUrl)
            .then((dataList) => {
                buildHtml(dataList.items);
                setImgPosition();
            });
        }
    }

    const setImgPosition = () => {
        const contentList = document.querySelectorAll('section[data-animated-headings] li');

        contentList.forEach((li) => {
            const heading = li.querySelector('.heading');
            const img = li.querySelector('.img-container');
            const h1 = heading.querySelector('h1');
          
          const pic = img.querySelector('figure');
          
          const widthOfPic = h1.offsetWidth;
           const heightOfPic = h1.offsetHeight + 40;
          
        
            img.style.height = `${heightOfPic}px`;

            img.style.display = "block";
          
            img.style.top = `${heading.offsetTop - (img.offsetHeight - heading.offsetHeight) / 2}px`;
            img.style.left = `${heading.offsetLeft + h1.offsetWidth - img.offsetWidth / 1.2}px`;
            img.style.display = "none";

            heading.addEventListener('pointerenter', () => {

                const img = li.querySelector('.img-container');
       
                img.style.display = "block";

                requestAnimationFrame(() => {
                    img.animate([
                        {opacity: "0"},
                        {opacity: "1"}
                    ], {
                        duration: 600,
                        easing: "ease-out"
                    })
                })

                heading.addEventListener('pointerleave', () => {
                    const img = li.querySelector('.img-container');
                
                    const animation = img.animate([
                        {opacity: "1"},
                        {opacity: "0"}
                    ], {
                        duration: 200,
                    })
                    animation.onfinish = () => {
                        img.style.display = "none";
                    }
                })
            })
        })   
    };
  
            const homepage= document.querySelector('body[data-animated-headings]');

            if(homepage) {
                createContent();
        }

}(ghostHeadingsAttr));