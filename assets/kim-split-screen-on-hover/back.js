<!-- Code Block in section:
<div image-scroll-split data-blog-href="image-scroll-split">
  </div>

Blog href: /image-scroll-split
  -->

<script>
 

const pluginValues = {
    attr: 'image-scroll-split',
  	background: '#ffe6e3',
};


(function (attribute, background) {
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
            const url = document.location.origin + '/' + path + '?format=json-pretty';

            return fetch(url)
                .then((response) => response.json())
        }

        return {
            setAttrParents, fetchData
        };
    })();

    utils.setAttrParents(`${attribute}`, 'section');
    
	 document.documentElement.style.setProperty('--split-section-bg', background);
    const parentSection = document.querySelector(`section[${attribute}]`);
    const contentWrapper = parentSection.querySelector('.content-wrapper');
    const plugin = parentSection.querySelector(`div[${attribute}]`);
	
    const div = document.createElement('div');
    div.classList.add('custom-section');

    const injectHtmlCode = (html) => {

        div.innerHTML = html;
        parentSection.insertBefore(div, contentWrapper);

        createSplitAnimation(parentSection);
    }

    const buildContent = (items) => {
        const result = [];

        for (let i = 0; i < items.length; i++) {

            const picBg = items[i].assetUrl;
            const body = items[i].body;
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = body;
            let svgElement = tempDiv.querySelector('svg');
            
            const createItem = `
						 
      <figure class="section-main-pic"><img src=${picBg} alt=""></figure>
       <div class="top-image">
			<div class=svg-container>
            	${svgElement.parentNode.innerHTML}
              </div>
      </div>
 <div class="bottom-image">
			<div class=svg-container>
            	${svgElement.parentNode.innerHTML}
              </div>
      </div>
    
    				`;
            result.push(createItem);
        }

        injectHtmlCode(result.join(''));
    }

    const contentListUrl = plugin.getAttribute('data-blog-href');
        utils.fetchData(contentListUrl)
            .then((dataList) => {
                buildContent(dataList.items);
            });


    function createSplitAnimation(parentSection) {

        const topImageContainer = parentSection.querySelector('.top-image');
        const bottomImageContainer = parentSection.querySelector('.bottom-image');
        const section = parentSection.querySelector('.custom-section');

        window.addEventListener('scroll', () => {

            const rect = parentSection.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            const sectionHeight = section.clientHeight;
            let visiblePercentage;

            if (sectionTop <= 0 && sectionBottom >= 0) {

                visiblePercentage = Math.abs(sectionTop / sectionHeight * 100);

                let percent = visiblePercentage * 2;

                if (percent > 100) {

                    percent = 100;
                }

                topImageContainer.style.transform = `translateY(-${percent}%)`;
                bottomImageContainer.style.transform = `translateY(${percent}%)`;

                document.documentElement.style.setProperty('--scale-bg', `${1 + visiblePercentage / 3 / 300}`);

            }

        });

    }

} (pluginValues.attr, pluginValues.background))

  
</script>
