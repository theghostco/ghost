document.addEventListener('DOMContentLoaded', function () {
    const pluginBgValues = window.pluginBgValues;

    if (pluginBgValues) {
        initializePluginBackground(pluginBgValues);
    } else {
        console.error('pluginBgValues is not defined.');
    }
});

function initializePluginBackground(pluginBgValues) {
    const { pageId, animationDuration, textItems } = pluginBgValues;
    const page = document.getElementById(`${pageId}`);

    if (!page) {
        console.error(`Page with ID ${pageId} not found.`);
        return;
    }

    const bgContainer = document.createElement('div');
    bgContainer.classList.add('background-container');
    
    const inner = document.createElement('div');
    inner.classList.add('background-container-inner');
    inner.appendChild((document.querySelector('.header-title')).cloneNode(true));

    const innerContent = document.createElement('div');
    innerContent.classList.add('text-list');

    // Додаємо текстові елементи з масиву textItems
    textItems.forEach((text) => {
        const p = document.createElement('p');
        p.classList.add('text-item', 'sqsrte-large');
        p.textContent = text;
        innerContent.appendChild(p);
    });

    inner.appendChild(innerContent);
    bgContainer.appendChild(inner);

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
        }
    });

    let i = 0;
    textList[i].classList.add('active');

    function setActiveElement(progress) {
        if (progress <= step) {
            return;
        } else if (progress >= 1) {
            textList.forEach((el) => el.classList.remove('active'));
            textList[textList.length - 1].classList.add('active');
        } else {
            textList.forEach((el) => el.classList.remove('active'));
            i++;
            step += 1 / textList.length;
            textList[i].classList.add('active');
        }
    }
}
