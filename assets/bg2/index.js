//!function(){let{pageId:e,animationDuration:t,textItems:a}=window.pluginBgValues||{},i=document.getElementById(`${e}`),l=document.createElement("div");l.classList.add("background-container");let n=document.querySelector(".header-title"),d=document.createElement("div");d.classList.add("background-container-inner"),d.appendChild(n.cloneNode(!0));let s=document.createElement("div");s.classList.add("text-list"),s.innerHTML=a.map(e=>`<p class="text-item sqsrte-large">${e}</p>`).join(""),d.appendChild(s),l.appendChild(d),document.addEventListener("DOMContentLoaded",()=>{if(i){i.appendChild(l);let e=document.querySelectorAll(".text-item"),a=1/e.length;!function e({timing:t,draw:a,duration:i}){let l=performance.now();requestAnimationFrame(function e(n){let d=(n-l)/i;d>1&&(d=1);a(t(d)),d<1&&requestAnimationFrame(e)})}({duration:t,timing:e=>Math.pow(e,2),draw(t){var i;l.style.background=`linear-gradient(150deg, #ffffff ${100-100*t}%, rgb(250, 255, 184))`,1===t&&l.classList.add("invisible"),!((i=t)<=a)&&(i>=1?(e.forEach(e=>e.classList.remove("active")),e[e.length-1].classList.add("active")):(e.forEach(e=>e.classList.remove("active")),n++,a+=1/e.length,e[n].classList.add("active")))}});let n=0;e[n].classList.add("active")}})}();

!function() {
  let { pageId: e, animationDuration: t, textItems: a } = window.pluginBgValues || {},
      i = document.getElementById(`${e}`),
      l = document.createElement("div");
  
  l.classList.add("background-container");
  let n = document.querySelector(".header-title"),
      d = document.createElement("div");
  
  d.classList.add("background-container-inner");
  d.appendChild(n.cloneNode(!0));
  
  let s = document.createElement("div");
  s.classList.add("text-list");
  s.innerHTML = a.map(e => `<p class="text-item sqsrte-large">${e}</p>`).join(""),
  d.appendChild(s),
  l.appendChild(d);

  document.addEventListener("DOMContentLoaded", () => {
    if (e === 'collection-66741875486be13c7dbab6de') {
      document.body.classList.add('page-with-bg');
    }
    
    if (i) {
      i.appendChild(l);
      let e = document.querySelectorAll(".text-item"),
          a = 1 / e.length;
          
      !function e({timing: t, draw: a, duration: i}) {
        let l = performance.now();
        requestAnimationFrame(function e(n) {
          let d = (n - l) / i;
          d > 1 && (d = 1);
          a(t(d)), d < 1 && requestAnimationFrame(e)
        })
      }({
        duration: t,
        timing: e => Math.pow(e, 2),
        draw(t) {
          var i;
          l.style.background = `linear-gradient(150deg, #ffffff ${100 - 100 * t}%, rgb(250, 255, 184))`;
          1 === t && l.classList.add("invisible"), !((i = t) <= a) && (i >= 1 ? (e.forEach(e => e.classList.remove("active")), e[e.length - 1].classList.add("active")) : (e.forEach(e => e.classList.remove("active")), n++, a += 1 / e.length, e[n].classList.add("active")))
        }
      });
      
      let n = 0;
      e[n].classList.add("active")
    }
  });
}();
