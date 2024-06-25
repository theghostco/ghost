  ;(function () {

  const values = {
  	href: '/picture-list',
    attribute: 'data-pic-animation'
  };
    
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
        const url = path + '?format=json-pretty';

        return fetch(url)
            .then((response) => response.json())

    }

    return {
        setAttrParents, fetchData
    };
})();


(
    function (apiPath, dataAttr) {
        let isLoading = false;

        function setAnimationSection() {
            utils.setAttrParents(dataAttr, 'section');
        }

        setAnimationSection();

        function buildContent(items) {
            const result = [];
            for (let i = 0; i < items.length; i++) {
                const getItemUrl = items[i].assetUrl;
                const createItem = `
                    <li class="pic-item" data-hidden>
                    <img src=${getItemUrl} alt="">
                </li>
`;
                result.push(createItem);
            }
            return result.join('');
        }

        function getListOfPictures() {
            const listOfPictures = document.createElement('ul');
            listOfPictures.setAttribute('class', 'pic-list');

            utils.fetchData(apiPath)
                .then((response) => (buildContent(response.items)))
                .then((html) => {
                    listOfPictures.innerHTML = html;
                    return preloadImages(listOfPictures);
                })
                .then(() => {
                    changeImagesVisibiliy(list);
                    animateImages(list);
                })

            return listOfPictures;
        }

        function changeImagesVisibiliy(list) {
            const listOfPictures = list.querySelectorAll('.pic-item');
            listOfPictures.forEach((li) => {
                li.removeAttribute('data-hidden');
                li.classList.add('rotate-item');

            });
        }


        function preloadImages(list) {
            const images = Array.from(list.querySelectorAll('.pic-item img'));

            return Promise.all(images.map((img) => preloadImage(img.src)))

        }

        function preloadImage(src) {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = resolve
                image.onerror = reject
                image.src = src
            })
        }

        function animateItem(img, delay, index) {
            let result;


            return new Promise((resolve, reject) => {

                const animateOddEl = [
                    {
                        transform: "translateY(300%) rotate(-5deg)",
                    },
                    {
                        transform: "translateY(5%) rotate(-5deg)",
                    },

                ];

                const animateOEvenEl = [
                    {
                        transform: "translateY(300%) rotate(5deg)",
                    },
                    {
                        transform: "translateY(5%) rotate(5deg)",
                    },

                ];

                if (index % 2 === 0) {
                    result = animateOddEl;
                } else {
                    result = animateOEvenEl;
                }

                const animation = img.animate(result,

                    {
                        delay,
                        duration: 600,
                        easing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
                        fill: "backwards",

                    }
                )

                animation.onfinish = (e) => {
                    resolve();          
                }
                
                animation.oncancel = () => {
                    resolve();
                }
            })

        }


        function animateImages(list) {
            const pictureContainer = document.querySelector('.pic-list');

            if (isLoading) {
                return;
            }

            isLoading = true;

            const items = Array.from(list.querySelectorAll('.pic-item'));

            const animations = items.map((li, i) => {

                return animateItem(li, i * 200, i)
                
            })


            Promise.all(animations)
                .then(() => {
                    isLoading = false;

                    const animateBox = pictureContainer.animate([
                            {
                                transform: 'scale(1)'
                            },
                            {
                                transform: 'scale(0)'
                            }
                        ],
                        {
                            duration: 500,
                            easing: 'cubic-bezier(0.65, 0, 0.35, 1)'

                        })

                    animateBox.onfinish = () => {
                        pictureContainer.classList.remove('rotate-items');
                        const listOfPictures = section.querySelectorAll('.pic-item');

                        listOfPictures.forEach((img) => {
                            img.setAttribute('data-hidden', '');
                            img.classList.remove('rotate-item');
                       
                        })

                        trackPointerPosition();

                    }
                })
        }

        function animateImage(img, delay) {
            return new Promise((resolve) => {
                const anime = img.animate([
                        {
                            transform: 'translateY(0)',
                          	opacity: 1
                           
                        },

                        {
                            transform: 'translateY(200%)',
                          	opacity: 0
                         
                        }
                    ],
                    {
                        duration: 800,
                        delay
                    }
                )
                anime.onfinish = () => resolve();
                anime.oncancel = () => resolve();
            })

        }

        function trackPointerPosition() {
            const container = document.querySelector('div[data-pic-animation]');
            let animationStarted = false;
            const containerOffset = parseFloat(section.style.paddingTop);

            const listOfPictures = section.querySelectorAll('.pic-item');

            container.addEventListener('mousemove', (e) => {
              
              console.log('mousemove')

                if (!animationStarted) {
                    animationStarted = true;

                    listOfPictures.forEach((img, index) => {
                        const step = 200 * (index + 1);
                        img.removeAttribute('data-hidden');
                      
                        img.style.transition = `top ${step}ms, left ${step}ms`;

                    })

                 
                    Promise.all(Array.from(listOfPictures).map((img, i) => {
                        return animateImage(img, 180 * (i + 1));
                    }))
                        .then(() => {
                            animationStarted = false;

                            listOfPictures.forEach((img, index) => {

                                img.setAttribute('data-hidden', '');

                            })
                        })

                }

                const x = e.clientX;
                const y = e.offsetY;


                for (let i = 0; i < listOfPictures.length; i++) {
                    const img = listOfPictures[i];


                    img.style.left = `${x}px`;
                    img.style.top = `${y}px`;


                }

            })
        }

        const section = document.querySelector(`section[${dataAttr}]`);
    
        const innerContainer = section.querySelector('.fluid-engine');
        const contentWrapper = section.querySelector('.content-wrapper');

        innerContainer.style.position = "static";
        const plugin = section.querySelector(`div[${dataAttr}`);
        const innerBox = document.createElement('div');
        innerBox.setAttribute("class", "animation-inner-box");
        const list = getListOfPictures();
      
        plugin.appendChild(list);


    })(values.href, values.attribute);

      })();
