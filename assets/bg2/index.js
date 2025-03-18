//!function(){let{pageId:e,animationDuration:t,textItems:a}=window.pluginBgValues||{},i=document.getElementById(`${e}`),l=document.createElement("div");l.classList.add("background-container");let n=document.querySelector(".header-title"),d=document.createElement("div");d.classList.add("background-container-inner"),d.appendChild(n.cloneNode(!0));let s=document.createElement("div");s.classList.add("text-list"),s.innerHTML=a.map(e=>`<p class="text-item sqsrte-large">${e}</p>`).join(""),d.appendChild(s),l.appendChild(d),document.addEventListener("DOMContentLoaded",()=>{if(i){i.appendChild(l);let e=document.querySelectorAll(".text-item"),a=1/e.length;!function e({timing:t,draw:a,duration:i}){let l=performance.now();requestAnimationFrame(function e(n){let d=(n-l)/i;d>1&&(d=1);a(t(d)),d<1&&requestAnimationFrame(e)})}({duration:t,timing:e=>Math.pow(e,2),draw(t){var i;l.style.background=`linear-gradient(150deg, #ffffff ${100-100*t}%, rgb(250, 255, 184))`,1===t&&l.classList.add("invisible"),!((i=t)<=a)&&(i>=1?(e.forEach(e=>e.classList.remove("active")),e[e.length-1].classList.add("active")):(e.forEach(e=>e.classList.remove("active")),n++,a+=1/e.length,e[n].classList.add("active")))}});let n=0;e[n].classList.add("active")}})}();

//!function(){let{pageId:e,animationDuration:t,textItems:a}=window.pluginBgValues||{},i=document.getElementById(`${e}`),n=document.createElement("div");n.classList.add("background-container");let d=document.querySelector(".header-title"),l=document.createElement("div");l.classList.add("background-container-inner"),l.appendChild(d.cloneNode(!0));let s=document.createElement("div");s.classList.add("text-list"),s.innerHTML=a.map(e=>`<p class="text-item sqsrte-large">${e}</p>`).join(""),l.appendChild(s),n.appendChild(l),document.addEventListener("DOMContentLoaded",()=>{if(e&&document.body.classList.add("page-with-bg"),i){i.appendChild(n);let a=document.querySelectorAll(".text-item"),d=1/a.length;!function e({timing:t,draw:a,duration:i}){let n=performance.now();requestAnimationFrame(function e(d){let l=(d-n)/i;l>1&&(l=1),a(t(l)),l<1&&requestAnimationFrame(e)})}({duration:t,timing:e=>Math.pow(e,2),draw(e){var t;n.style.background=`linear-gradient(150deg, #ffffff ${100-100*e}%, rgb(250, 255, 184))`,1===e&&n.classList.add("invisible"),(t=e)<=d||(t>=1?(a.forEach(e=>e.classList.remove("active")),a[a.length-1].classList.add("active")):(a.forEach(e=>e.classList.remove("active")),l++,d+=1/a.length,a[l].classList.add("active")))}});let l=0;a[l].classList.add("active")}})}();

document.addEventListener("DOMContentLoaded", () => {
    let pageElement = document.getElementById(`${pageId}`);

    if (pageId) {
        document.body.classList.add("page-with-bg");
    }

    if (pageElement) {
        pageElement.appendChild(backgroundContainer);

        let textElements = document.querySelectorAll(".text-item");
        let textStep = 1 / textElements.length;
        let activeIndex = 0;

        function animate({ timing, draw, duration }) {
            let start = performance.now();

            requestAnimationFrame(function animateFrame(time) {
                let progress = (time - start) / duration;
                if (progress > 1) progress = 1;

                draw(timing(progress));

                if (progress < 1) {
                    requestAnimationFrame(animateFrame);
                }
            });
        }

        animate({
            duration: animationDuration,
            timing: progress => Math.pow(progress, 2),
            draw(progress) {
                let rootStyles = getComputedStyle(document.body);
                let color1 = rootStyles.getPropertyValue('--color1') || '#ffffff';
                let color2 = rootStyles.getPropertyValue('--color2') || 'rgb(250, 255, 184)';

                backgroundContainer.style.background = 
                    `linear-gradient(150deg, ${color1.trim()} ${100 - 100 * progress}%, ${color2.trim()})`;

                if (progress === 1) {
                    backgroundContainer.classList.add("invisible");
                }

                if (progress > textStep) {
                    if (progress >= 1) {
                        textElements.forEach(el => el.classList.remove("active"));
                        textElements[textElements.length - 1].classList.add("active");
                    } else {
                        textElements.forEach(el => el.classList.remove("active"));
                        activeIndex++;
                        textStep += 1 / textElements.length;
                        textElements[activeIndex].classList.add("active");
                    }
                }
            }
        });

        textElements[activeIndex].classList.add("active");
    }
});
