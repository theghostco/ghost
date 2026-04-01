
const CONFIG = {
  SECTION_CARDS: '#card-stack',

  IMAGE_WIDTH: '300px',
  IMAGE_HEIGHT: '390px',

  IMAGE_WIDTH_MOBILE: '220px',
  IMAGE_HEIGHT_MOBILE: '300px',

  IMAGE_ASPECT_RATIO: '4 / 5',
  IMAGE_BORDER_RADIUS: '24px',

  DROP_SHADOW: 'rgba(0, 0, 0, 0.2) 0px 10px 20px',

  ANIMATION_SPEED: 0.5
};

;(function (CONFIG) {
  const {
    SECTION_CARDS,
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    IMAGE_WIDTH_MOBILE,
    IMAGE_HEIGHT_MOBILE,
    IMAGE_ASPECT_RATIO,
    IMAGE_BORDER_RADIUS,
    DROP_SHADOW,
    ANIMATION_SPEED
  } = CONFIG;

  const init = () => {
    if (document.body.classList.contains('sqs-edit-mode')) return;

    const section = document.querySelector(SECTION_CARDS);
    if (!section || section.dataset.cardsInit === 'true') return;

    const galleryBlock = section.querySelector('.gallery-block');
    const images = galleryBlock?.querySelectorAll('img');
    let wrapper = section.querySelector('.gallery-block-custom');

    if (!galleryBlock || !images?.length) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const finalImageWidth = isMobile ? IMAGE_WIDTH_MOBILE : IMAGE_WIDTH;
    const finalImageHeight = isMobile ? IMAGE_HEIGHT_MOBILE : IMAGE_HEIGHT;
    const stackOffsetY = isMobile ? -12 : -20;
    const stackRotate = isMobile ? -7 : -10;

    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'gallery-block-custom gallery-block-custom__list';
      galleryBlock.insertAdjacentElement('afterend', wrapper);
    }

    section.dataset.cardsInit = 'true';
    wrapper.style.height = finalImageHeight;
    wrapper.innerHTML = '';
    galleryBlock.style.display = 'none';

    const figures = [];
    let loaded = 0;

    const HOVER_SCALE = 1.02;
    const HOVER_TRANSITION = 'transform 0.18s cubic-bezier(.22,1,.36,1), opacity 0.4s ease';
    const STACK_TRANSITION = `transform ${ANIMATION_SPEED}s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease`;
    const RETURN_TRANSITION = 'transform 0.32s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease';
    const SEND_BACK_TRANSITION = 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease';

    const getStackValues = (index) => {
      const offset = figures.length - 1 - index;
      return {
        y: offset * stackOffsetY,
        scale: 1 - offset * 0.02,
        rotate: offset * stackRotate
      };
    };

    const getFigureTransform = (figure, extraX = 0, extraY = 0, hoverScale = null) => {
      const y = Number(figure.dataset.y || 0);
      const scale = Number(figure.dataset.scale || 1);
      const rotate = Number(figure.dataset.rotate || 0);
      const isTop = figure.classList.contains('is-top');
      const isHovered = figure.matches(':hover');
      const finalHoverScale = hoverScale ?? (isTop && isHovered ? HOVER_SCALE : 1);

      return `translate(${extraX}px, ${extraY + y}px) scale(${scale * finalHoverScale}) rotate(${rotate}deg)`;
    };

    const setFigureTransform = (figure, extraX = 0, extraY = 0, hoverScale = null) => {
      figure.style.transform = getFigureTransform(figure, extraX, extraY, hoverScale);
    };

    const markTopFigure = () => {
      figures.forEach((figure) => figure.classList.remove('is-top'));
      if (figures.length) figures[figures.length - 1].classList.add('is-top');
    };

    const bindHover = (figure) => {
      figure.addEventListener('mouseenter', () => {
        if (figure.classList.contains('is-dragging') || !figure.classList.contains('is-top')) return;
        figure.style.transition = HOVER_TRANSITION;
        setFigureTransform(figure, 0, 0, HOVER_SCALE);
      });

      figure.addEventListener('mouseleave', () => {
        if (figure.classList.contains('is-dragging')) return;
        if (figure.classList.contains('is-top')) {
          figure.style.transition = HOVER_TRANSITION;
        }
        setFigureTransform(figure);
      });
    };

    const applyTransforms = (skip = null) => {
      figures.forEach((figure, index) => {
        const { y, scale, rotate } = getStackValues(index);
        figure.dataset.y = y;
        figure.dataset.scale = scale;
        figure.dataset.rotate = rotate;

        if (figure !== skip) {
          figure.style.transition = STACK_TRANSITION;
          setFigureTransform(figure);
        }
      });

      markTopFigure();

      figures.forEach((figure) => {
        if (figure === skip) return;
        if (figure.classList.contains('is-top') && figure.matches(':hover')) {
          figure.style.transition = HOVER_TRANSITION;
          setFigureTransform(figure, 0, 0, HOVER_SCALE);
        }
      });
    };

    const fadeInThenStack = () => {
      figures.forEach((figure) => {
        figure.style.transition = 'opacity 0.4s ease';
        figure.style.opacity = '1';
      });

      const lastFigure = figures[figures.length - 1];
      if (!lastFigure) return;

      lastFigure.addEventListener(
        'transitionend',
        (e) => {
          if (e.propertyName !== 'opacity') return;

          figures.forEach((figure, index) => {
            const { y, scale, rotate } = getStackValues(index);
            figure.dataset.y = y;
            figure.dataset.scale = scale;
            figure.dataset.rotate = rotate;
            figure.style.transition = STACK_TRANSITION;
            setFigureTransform(figure);
            bindHover(figure);
            initDrag(figure);
          });

          markTopFigure();
        },
        { once: true }
      );
    };

    const sendToBack = (figure, x, y) => {
      const flyX = x * 1.03;
      const flyY = y * 1.03;

      figure.style.transition = 'transform 0.1s ease-out, opacity 0.4s ease';
      setFigureTransform(figure, flyX, flyY, HOVER_SCALE);

      setTimeout(() => {
        wrapper.insertBefore(figure, wrapper.firstChild);
        figures.splice(figures.indexOf(figure), 1);
        figures.unshift(figure);

        const { y, scale, rotate } = getStackValues(0);
        figure.dataset.y = y;
        figure.dataset.scale = scale;
        figure.dataset.rotate = rotate;

        figure.style.transition = 'none';
        setFigureTransform(figure, flyX, flyY, 1);

        requestAnimationFrame(() => {
          applyTransforms(figure);

          requestAnimationFrame(() => {
            figure.style.transition = SEND_BACK_TRANSITION;
            setFigureTransform(figure);
            figure.style.zIndex = '';
            figure.style.willChange = '';
            figure.classList.remove('is-dragging');
          });
        });
      }, 70);
    };

    const initDrag = (figure) => {
      let startX = 0;
      let startY = 0;
      let currentX = 0;
      let currentY = 0;
      let isDragging = false;

      const dragMove = (e) => {
        if (!isDragging) return;
        const point = e.touches ? e.touches[0] : e;
        currentX = point.clientX - startX;
        currentY = point.clientY - startY;
        setFigureTransform(figure, currentX, currentY, HOVER_SCALE);
      };

      const dragEnd = () => {
        if (!isDragging) return;
        isDragging = false;

        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchend', dragEnd);

        const dist = Math.hypot(currentX, currentY);

        if (dist > 80) {
          sendToBack(figure, currentX, currentY);
        } else {
          figure.style.transition = RETURN_TRANSITION;
          setFigureTransform(figure, 0, 0, HOVER_SCALE);
          figure.style.zIndex = '';
          figure.style.willChange = '';
          figure.classList.remove('is-dragging');
        }
      };

      const dragStart = (e) => {
        if (!figure.classList.contains('is-top')) return;

        isDragging = true;

        const point = e.touches ? e.touches[0] : e;
        startX = point.clientX;
        startY = point.clientY;
        currentX = 0;
        currentY = 0;

        figure.classList.add('is-dragging');
        figure.style.transition = 'none';
        figure.style.zIndex = '100';
        figure.style.willChange = 'transform';
        setFigureTransform(figure, 0, 0, HOVER_SCALE);

        document.addEventListener('mousemove', dragMove);
        document.addEventListener('touchmove', dragMove, { passive: true });
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
      };

      figure.addEventListener('mousedown', dragStart);
      figure.addEventListener('touchstart', dragStart, { passive: true });
    };

    images.forEach((img) => {
      const figure = document.createElement('figure');
      const clonedImg = document.createElement('img');

      figure.className = 'gallery-block-custom__figure';
      figure.style.opacity = '0';
      figure.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';
      figure.style.width = finalImageWidth;
      figure.style.height = finalImageHeight;
      figure.style.aspectRatio = IMAGE_ASPECT_RATIO;
      figure.style.borderRadius = IMAGE_BORDER_RADIUS;
      figure.style.boxShadow = DROP_SHADOW;

      clonedImg.src = `${img.dataset.src || img.src}?format=500w`;
      clonedImg.loading = 'eager';
      clonedImg.className = 'gallery-block-custom__img';

      clonedImg.addEventListener('load', () => {
        loaded++;

        if (loaded === images.length) {
          figures.forEach((figure) => {
            figure.style.opacity = '0';
            figure.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';
          });

          fadeInThenStack();
        }
      });

      figure.appendChild(clonedImg);
      wrapper.appendChild(figure);
      figures.push(figure);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(CONFIG);
