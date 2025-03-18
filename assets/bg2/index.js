//!function(){let{pageId:e,animationDuration:t,textItems:a}=window.pluginBgValues||{},i=document.getElementById(`${e}`),l=document.createElement("div");l.classList.add("background-container");let n=document.querySelector(".header-title"),d=document.createElement("div");d.classList.add("background-container-inner"),d.appendChild(n.cloneNode(!0));let s=document.createElement("div");s.classList.add("text-list"),s.innerHTML=a.map(e=>`<p class="text-item sqsrte-large">${e}</p>`).join(""),d.appendChild(s),l.appendChild(d),document.addEventListener("DOMContentLoaded",()=>{if(i){i.appendChild(l);let e=document.querySelectorAll(".text-item"),a=1/e.length;!function e({timing:t,draw:a,duration:i}){let l=performance.now();requestAnimationFrame(function e(n){let d=(n-l)/i;d>1&&(d=1);a(t(d)),d<1&&requestAnimationFrame(e)})}({duration:t,timing:e=>Math.pow(e,2),draw(t){var i;l.style.background=`linear-gradient(150deg, #ffffff ${100-100*t}%, rgb(250, 255, 184))`,1===t&&l.classList.add("invisible"),!((i=t)<=a)&&(i>=1?(e.forEach(e=>e.classList.remove("active")),e[e.length-1].classList.add("active")):(e.forEach(e=>e.classList.remove("active")),n++,a+=1/e.length,e[n].classList.add("active")))}});let n=0;e[n].classList.add("active")}})}();

// !function(){let{pageId:e,animationDuration:t,textItems:a}=window.pluginBgValues||{},i=document.getElementById(`${e}`),n=document.createElement("div");n.classList.add("background-container");let d=document.querySelector(".header-title"),l=document.createElement("div");l.classList.add("background-container-inner"),l.appendChild(d.cloneNode(!0));let s=document.createElement("div");s.classList.add("text-list"),s.innerHTML=a.map(e=>`<p class="text-item sqsrte-large">${e}</p>`).join(""),l.appendChild(s),n.appendChild(l),document.addEventListener("DOMContentLoaded",()=>{if(e&&document.body.classList.add("page-with-bg"),i){i.appendChild(n);let a=document.querySelectorAll(".text-item"),d=1/a.length;!function e({timing:t,draw:a,duration:i}){let n=performance.now();requestAnimationFrame(function e(d){let l=(d-n)/i;l>1&&(l=1),a(t(l)),l<1&&requestAnimationFrame(e)})}({duration:t,timing:e=>Math.pow(e,2),draw(e){var t;n.style.background=`linear-gradient(150deg, #ffffff ${100-100*e}%, rgb(250, 255, 184))`,1===e&&n.classList.add("invisible"),(t=e)<=d||(t>=1?(a.forEach(e=>e.classList.remove("active")),a[a.length-1].classList.add("active")):(a.forEach(e=>e.classList.remove("active")),l++,d+=1/a.length,a[l].classList.add("active")))}});let l=0;a[l].classList.add("active")}})}();

!function() {
    let { pageId: e, animationDuration: t, textItems: a } = window.pluginBgValues || {},
        i = document.getElementById(`${e}`),
        n = document.createElement("div");
    n.classList.add("background-container");
    
    let d = document.querySelector(".header-title"),
        l = document.createElement("div");
    l.classList.add("background-container-inner"), l.appendChild(d.cloneNode(!0));
    
    let s = document.createElement("div");
    s.classList.add("text-list"),
        s.innerHTML = a.map(e => `<p class="text-item sqsrte-large">${e}</p>`).join(""),
        l.appendChild(s),
        n.appendChild(l);

    document.addEventListener("DOMContentLoaded", () => {
        if (e && document.body.classList.add("page-with-bg"), i) {
            i.appendChild(n);
            
            // Отримуємо значення CSS-змінних
            let rootStyles = getComputedStyle(document.documentElement);
            let color1 = rootStyles.getPropertyValue("--color1").trim() || "#ffffff"; 
            let color2 = rootStyles.getPropertyValue("--color2").trim() || "rgb(250, 255, 184)";

            let a = document.querySelectorAll(".text-item"),
                d = 1 / a.length;

            !function e({ timing: t, draw: a, duration: i }) {
                let n = performance.now();
                requestAnimationFrame(function e(d) {
                    let l = (d - n) / i;
                    l > 1 && (l = 1),
                        a(t(l)),
                        l < 1 && requestAnimationFrame(e);
                });
            }({
                duration: t,
                timing: e => Math.pow(e, 2),
                draw(e) {
                    var t;
                    n.style.background = `linear-gradient(150deg, ${color1} ${100 - 100 * e}%, ${color2})`,
                        1 === e && n.classList.add("invisible"),
                        (t = e) <= d ||
                            (t >= 1
                                ? (a.forEach(e => e.classList.remove("active")), a[a.length - 1].classList.add("active"))
                                : (a.forEach(e => e.classList.remove("active")),
                                    l++,
                                    d += 1 / a.length,
                                    a[l].classList.add("active")));
                }
            });

            let l = 0;
            a[l].classList.add("active");
        }
    });
}();
