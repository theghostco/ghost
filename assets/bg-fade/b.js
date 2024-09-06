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

/*  function bgFade() {
    const addCSS = (css) => {
      const style = document.createElement("style");
      style.innerHTML = css;
      document.head.appendChild(style);
    };

    addCSS(".section-border *{transition: background-color .3s ease;}");
    const sections = gsap.utils.toArray(".sections section");
    const initialThemes = sections.map(section => section.getAttribute("data-section-theme"));

    sections.forEach((section, index) => {
      let theme = section.getAttribute("data-section-theme");
      if (!theme) {
        theme = "holder";
      }
      section.setAttribute("data-default-theme", theme);
    });

    sections.forEach((section, index) => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onEnter: () => {
            if (index > 0) {
              const prevTheme = initialThemes[index - 1];
              section.setAttribute("data-section-theme", prevTheme);
            }
          },
          onLeave: () => {
            section.setAttribute("data-section-theme", section.getAttribute("data-default-theme"));
          },
          onEnterBack: () => {
            if (index > 0) {
              const prevTheme = initialThemes[index - 1];
              section.setAttribute("data-section-theme", prevTheme);
            }
          },
          onLeaveBack: () => {
            section.setAttribute("data-section-theme", section.getAttribute("data-default-theme"));
          }
        }
      });
    });
  }

  bgFade();*/
