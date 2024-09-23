//!function(){let{pageId:e,animationDuration:t,textItems:a}=window.pluginBgValues||{},i=document.getElementById(`${e}`),l=document.createElement("div");l.classList.add("background-container");let n=document.querySelector(".header-title"),d=document.createElement("div");d.classList.add("background-container-inner"),d.appendChild(n.cloneNode(!0));let s=document.createElement("div");s.classList.add("text-list"),s.innerHTML=a.map(e=>`<p class="text-item sqsrte-large">${e}</p>`).join(""),d.appendChild(s),l.appendChild(d),document.addEventListener("DOMContentLoaded",()=>{if(i){i.appendChild(l);let e=document.querySelectorAll(".text-item"),a=1/e.length;!function e({timing:t,draw:a,duration:i}){let l=performance.now();requestAnimationFrame(function e(n){let d=(n-l)/i;d>1&&(d=1);a(t(d)),d<1&&requestAnimationFrame(e)})}({duration:t,timing:e=>Math.pow(e,2),draw(t){var i;l.style.background=`linear-gradient(150deg, #ffffff ${100-100*t}%, rgb(250, 255, 184))`,1===t&&l.classList.add("invisible"),!((i=t)<=a)&&(i>=1?(e.forEach(e=>e.classList.remove("active")),e[e.length-1].classList.add("active")):(e.forEach(e=>e.classList.remove("active")),n++,a+=1/e.length,e[n].classList.add("active")))}});let n=0;e[n].classList.add("active")}})}();


(function () {
  const pageId = getComputedStyle(document.documentElement).getPropertyValue('--pageWithBg').trim();
  const { animationDuration, textItems } = window.pluginBgValues || {};

  const page = document.querySelector(pageId);

  const bgContainer = document.createElement('div');
  bgContainer.classList.add('background-container');
  const logo = document.querySelector('.header-title');

  const inner = document.createElement('div');
  inner.classList.add('background-container-inner');
  inner.appendChild(logo.cloneNode(true));

  const innerContent = document.createElement('div');
  innerContent.classList.add('text-list');
  innerContent.innerHTML = textItems
    .map(text => `<p class="text-item sqsrte-large">${text}</p>`)
    .join('');
  inner.appendChild(innerContent);
  bgContainer.appendChild(inner);

  document.addEventListener("DOMContentLoaded", () => {
    if (page) {
      page.appendChild(bgContainer);

      const textList = document.querySelectorAll('.text-item');
      let step = 1 / textList.length;

      function animate({ timing, draw, duration }) {
        let start = performance.now();
        requestAnimationFrame(function animate2(time) {
          let timeFraction = (time - start) / duration;
          if (timeFraction > 1) timeFraction = 1;
          let progress = timing(timeFraction);

          draw(progress);

          if (timeFraction < 1) {
            requestAnimationFrame(animate2);
          }
        });
      }

      animate({
        duration: animationDuration,
        timing: (timeFraction) => Math.pow(timeFraction, 2),
        draw: (progress) => {
          bgContainer.style.background = `linear-gradient(150deg, #ffffff ${100 - progress * 100}%, rgb(250, 255, 184))`;

          if (progress === 1) {
            bgContainer.classList.add('invisible');
          }

          setActiveElement(progress);
        },
      });

      let i = 0;
      textList[i].classList.add('active');

      function setActiveElement(progress) {
        if (progress <= step) {
          return;
        } else if (progress >= 1) {
          textList.forEach(el => el.classList.remove('active'));
          textList[textList.length - 1].classList.add('active');
        } else {
          textList.forEach(el => el.classList.remove('active'));
          i++;
          step += 1 / textList.length;
          textList[i].classList.add('active');
        }
      }
    }
  });
})();
