(function(global) {
    function colorfulSliderPlugin(intervalTime, transitionStyle) {
        document.addEventListener("DOMContentLoaded", function() {
            const pageSections = document.querySelectorAll('.page-section');

            pageSections.forEach(function(section) {
                const codeBlock = section.querySelector('.code-block');
                if (codeBlock) {
                    const colorfulSliderBlock = codeBlock.querySelector('.colorful-slider-block');
                    if (colorfulSliderBlock) {
                        section.classList.add('colorful-slider-plugin');
                    }
                }
            });

            const slides = document.querySelectorAll('.colorful-slider-plugin .sqs-gallery .slide'); 
            const totalSlides = slides.length;
            let middleIndex;

            if (totalSlides % 2 === 0) {
                middleIndex = Math.floor(totalSlides / 2) - 1;
            } else {
                middleIndex = Math.floor(totalSlides / 2);
            }

            const perspective = parseFloat(getComputedStyle(document.querySelector('.sqs-gallery')).perspective);
            const maxTranslateZ = (2 / 3) * perspective;

            slides.forEach((slide, index) => {
                let translateY, translateZ;

                if (index < middleIndex) {
                    let halfSlides = (totalSlides / 2);
                    let factor = (middleIndex - index);
                    let verticalPosition = 100 / halfSlides;
                    let tempValue = verticalPosition * factor;
                    translateY = -tempValue;
                    translateZ = -(factor * maxTranslateZ / middleIndex);
                } else if (index > middleIndex) {
                    let halfSlides = (totalSlides / 2);
                    let factor = (index - middleIndex);
                    let verticalPosition = 100 / halfSlides;
                    translateY = (factor * verticalPosition);
                    translateZ = -((index - middleIndex) / (totalSlides - middleIndex - 1) * maxTranslateZ);
                } else {
                    translateY = 0;
                    translateZ = 0;
                }

                slide.style.transform = `translate3d(0, ${translateY}%, ${translateZ}px)`;
            });

            const pageSection = document.querySelector('.colorful-slider-plugin');
            const sectionBorder = pageSection.querySelector('.section-border');
            const sectionBackground = pageSection.querySelector('.section-background');

            let intervalID;

            slides.forEach(slide => {
                slide.style.transition = transitionStyle;
            });

            function shiftTransforms() {
                let transforms = [];
                slides.forEach((slide, index) => {
                    let computedStyle = window.getComputedStyle(slide);
                    let transformValue = computedStyle.transform || "none";
                    transforms.push(transformValue);
                });

                for (let i = slides.length - 1; i > 0; i--) {
                    slides[i].style.transform = transforms[i - 1];

                    if (transforms[i - 1] === "matrix(1, 0, 0, 1, 0, 0)") {
                        slides[i].classList.add('active-slide');
                        const altText = slides[i].querySelector('img').alt;
                        sectionBorder.style.backgroundColor = altText;
                        sectionBackground.style.backgroundColor = altText;
                    } else {
                        slides[i].classList.remove('active-slide');
                    }
                }

                slides[0].style.transform = transforms[slides.length - 1];

                if (transforms[slides.length - 1] === "matrix(1, 0, 0, 1, 0, 0)") {
                    slides[0].classList.add('active-slide');
                    const altText = slides[0].querySelector('img').alt;
                    sectionBorder.style.backgroundColor = altText;
                    sectionBackground.style.backgroundColor = altText;
                } else {
                    slides[0].classList.remove('active-slide');
                }
            }

            function startInterval() {
                intervalID = setInterval(shiftTransforms, intervalTime);
            }

            function stopInterval() {
                clearInterval(intervalID);
            }

            document.addEventListener('visibilitychange', function() {
                if (document.hidden) {
                    stopInterval();
                } else {
                    startInterval();
                }
            });

            startInterval();
        });
    }

    global.colorfulSliderPlugin = colorfulSliderPlugin;
})(window);
