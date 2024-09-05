<script>
  const values = {
    sectionAttribute: 'img-on-hover',
    limit: 6,
    gap: 15,
    itemsInRow: 3
};

    (function (dataAttr, limitOfItems, gap, count) {

    function fetchData(path) {

        const url = document.location.origin + '/' + path + '?format=json-pretty';
        return fetch(url)
            .then((response) => response.json())
    }

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

    setAttrParents(dataAttr, 'section');
    setAttrParents(dataAttr, 'body');

    document.documentElement.style.setProperty('--blur-items-gap', `${gap}px`);
    document.documentElement.style.setProperty('--items-count', `${count}`);

    const plugin = document.querySelector(`div[${dataAttr}]`);
    const buildHtml = (items) => {
    const sectionItems = [];

    let visibleItems;

    if(limitOfItems < items.length) {
    visibleItems = limitOfItems;
} else {
    visibleItems = items.length;
}

    for (let i = 0; i < visibleItems; i++) {
    const itemTitle = items[i].title;
    const itemExcerpt = items[i].excerpt;

    const itemImage = items[i].assetUrl;
    const body = items[i].body;
    const html = document.createElement('div');
    html.innerHTML = body;
    const url = items[i].fullUrl;

    const createItem = `
<a href=${url} class="blur-item">
    <figure class="blur-item-image">
     <img src=${itemImage}>
    </figure>
    <div class="blur-item-text-container">
		<div class="text-container-top">
			        <h2 class="text-container-title">
        ${itemTitle}
</h2>
		 </div>
		<div class="text-container-bottom">
			  <buttont type="button" class="read-more-btn">
</button>
		 </div>
    </div>
</a>`;

    sectionItems.push(createItem);
}

    const injectHtmlCode = (data) => {
    plugin.innerHTML = data;
}


    injectHtmlCode(`<div class="blur-container">
              ${sectionItems.join('')}
</div>`);
}

    function initGalleryAnimation() {
    const section = document.querySelector(`section[${dataAttr}]`);
    const itemList = section.querySelectorAll('.blur-item');
    const itemArr = Array.from(itemList);
    const itemContainer = document.querySelector('.blur-container');


      
          function setImgAttribute(el) {
    		el.setAttribute('img-on-hover', '');
}
    
                function removeImgAttribute(el) {
    		el.removeAttribute('img-on-hover');
}
      
          itemContainer.addEventListener('mouseleave', () => {
    removeActiveAttr(itemArr);
})


    itemList.forEach((item, i) => {
      
    item.addEventListener('mouseenter', () => {
    removeActiveAttr(itemArr);
    setActiveAttr(item);
      
})
})

    function setActiveAttr(el) {
    el.setAttribute('data-active', '');
      
        const title = el.querySelector('.text-container-title');
    const readMore = el.querySelector('.read-more-btn');
      
        title.addEventListener('mouseenter', () => {
      setImgAttribute(el);
})
      
      title.addEventListener('mouseleave', () => {
      removeImgAttribute(el);
})
      
            
        readMore.addEventListener('mouseenter', () => {
      setImgAttribute(el);
})
      
      readMore.addEventListener('mouseleave', () => {
      removeImgAttribute(el);
})
}

    function removeActiveAttr(arr) {
    arr.forEach((pic) => {
    pic.removeAttribute("data-active")
});
}
}

    document.addEventListener('DOMContentLoaded', () => {
    const homepage = document.querySelector(`body[${dataAttr}]`);

    if (homepage && plugin) {
    const contentListUrl = plugin.getAttribute('data-blog-href');
    fetchData(contentListUrl)
    .then((dataList) => {
    buildHtml(dataList.items);
    initGalleryAnimation();
});
}
})

}(values.sectionAttribute, values.limit, values.gap, values.itemsInRow));
</script>
