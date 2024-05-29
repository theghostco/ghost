
  let checkPlugin = document.querySelectorAll('[data-ghost]');
  if (typeof(checkPlugin) != 'undefined' && checkPlugin != null){

    checkPlugin.forEach(function(el){
      var getSliderContentUrl = el.getAttribute('data-blog-href')
      var getPluginName = el.getAttribute('data-ghost-plugin-name')
      if( getPluginName == 'switcher-tabs' ){
        el.innerHTML = '<div class="'+getPluginName+' switcher"><div class="switcher-head"></div><div class="switcher-body"></div></div>'
        //vanilla js JSON request
        var request = new XMLHttpRequest();
        request.open('GET', ''+document.location.origin+''+getSliderContentUrl+'?format=json-pretty', true);
        request.onload = function(curEl) {
          if (this.status >= 200 && this.status < 400) {
            /* Success!*/
            var data = JSON.parse(this.response);
            for (var i = 0; i < data.items.length; i++) {
              var getItemTitle = data.items[i].title
              var getItemExcerpt = data.items[i].excerpt
              var getItemImage = data.items[i].assetUrl
              var getItemBody = data.items[i].body
              var getItemTags = data.items[i].tags
              console.log(getItemTags)
              //slide markup
              var createItem = '<div class="item-content '+getItemTags+'" data-tab="'+i+'"><div class="image"><img src="'+getItemImage+'"></div><div class="body-wrap">'+getItemBody+'</div></div>';
              var createTitleHeading = '<h3 class="title" data-heading="'+i+'">'+getItemTitle+'</h3>'
              var getParent = el.querySelector('.switcher-body');
              var getHeader = el.querySelector('.switcher-head');
              getParent.innerHTML =  getParent.innerHTML + createItem;
              getHeader.innerHTML =  getHeader.innerHTML + createTitleHeading;
              //end if
              activateFirstTab(el);
            }
          } else {}
        };
        request.onerror = function() {};
        request.send();   
        // Function to activate the first tab
        function activateFirstTab(el) {
          var firstTitle = el.querySelector('.switcher-head .title');
          var firstContent = el.querySelector('.switcher-body .item-content');

          if (firstTitle && firstContent) {
            firstTitle.classList.add('active');
            firstContent.classList.add('active');
            firstContent.style.display = 'flex'; // Or 'block', depending on your layout
            firstContent.style.opacity = 1; // Ensure it's visible
          }
        }

        // Assuming 'el' is your plugin container with class 'switcher-tabs'
        var switcherHead = el.querySelector('.switcher-head');
        var switcherBody = el.querySelector('.switcher-body');
        // Attach a click event listener to the switcher head
        switcherHead.addEventListener('click', function(event) {
          if (event.target.classList.contains('title')) {
            var headingNum = event.target.getAttribute('data-heading');

            // Remove active class from all titles
            switcherHead.querySelectorAll('.title').forEach(function(title) {
              title.classList.remove('active');
            });

            // Add active class to the clicked title
            event.target.classList.add('active');

            // Hide and reset the currently active item content
            var currentlyActiveItem = switcherBody.querySelector('.item-content.active');
            if (currentlyActiveItem) {
              currentlyActiveItem.classList.remove('active');
              setTimeout(function() {
                currentlyActiveItem.style.opacity = 0; // Fade out
                currentlyActiveItem.style.display = 'none'; // Hide element after fade out
              }, 300); // Delay to allow fade out transition
            }

            // Delay the display of new active item content
            setTimeout(function() {
              // Find the corresponding item content and prepare to show
              var correspondingItem = switcherBody.querySelector('.item-content[data-tab="' + headingNum + '"]');
              if (correspondingItem) {
                correspondingItem.style.display = 'flex'; // Or 'flex'
                // Use double requestAnimationFrame to ensure opacity transition occurs after display change
                requestAnimationFrame(function() {
                  requestAnimationFrame(function() {
                    correspondingItem.style.opacity = 1; // Fade in
                    correspondingItem.classList.add('active');
                  });
                });
              }
            }, 300); // Match this delay with the CSS transition time for the fade out effect
          }
        });  
      }
    })
  }
