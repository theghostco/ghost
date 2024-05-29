;(function(){

  let menuItems = document.querySelectorAll('header .header-display-desktop .header-nav-item');
  for( let i = 0; i < menuItems.length; i++){

    let menuItem = menuItems[i];
    let menuContent = menuItem.textContent;
    let menuLink = menuItem.getElementsByTagName('a')[0].getAttribute('href');


    let itemContent = document.createElement('a');
    itemContent.classList.add('menu-item-text');
    itemContent.innerText = menuContent;
    itemContent.setAttribute('href', menuLink);
    menuItem.insertAdjacentElement('beforeend', itemContent);

    var br = itemContent.getElementsByTagName('br');
    while (br.length) {
      br[0].parentNode.removeChild(br[0]);
    }
  }
}());
