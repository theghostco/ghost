  function bgFade(){

  // One liner function:
const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML=css;

// Usage: 
addCSS(".section-border *{transition: background-color .3s ease;}")


    var sections = gsap.utils.toArray('.sections section');
    document.querySelectorAll('section').forEach((sectionInit) => {

      let themeSchema = sectionInit.getAttribute('data-section-theme');
      if(!themeSchema){themeSchema = 'holder';}
      sectionInit.setAttribute('data-default-theme', themeSchema);

    });

    let themesArray = ["white", "white-bold", "light", "light-bold", "bright-inverse", "bright", "dark", "dark-bold", "black", "black-bold", "holder"];

    sections.forEach((section) => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          scrub: true,
          onToggle: function(){
            document.querySelectorAll('section').forEach(function(thisElem){

              thisElem.classList.remove(...themesArray);
              thisElem.classList.add(section.getAttribute('data-default-theme'));
                 thisElem.setAttribute('data-section-theme', '');

              thisElem.setAttribute('data-section-theme', section.getAttribute('data-default-theme'));
              
            });
          }
        }
      });
    });
  }
 bgFade();