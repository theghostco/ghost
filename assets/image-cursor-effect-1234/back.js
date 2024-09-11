<script>
  const configs = {
    delay: 1000, //animation delay       
    maxWidth: 230,  //images width
    maxHeight: 300, //images height
    minDistance: 200,   //the minimum distance you need to move the cursor to add a new image to the window
    maxTilt: 5,  //default tilt for images
    maxFinalTilt: 10,  //final tilt during image amination
    fadeStart: 0.5, //delay in changing the image opacity
    overshootFactor:1.2, // a value that controls the excess motion when animating an image.
  };

  const images = [];

  const blockWithCursorImages = document.querySelector("[data-ghost-plugin-name='image-cursor']");

  if (blockWithCursorImages) {
    const imagesPageUrl = blockWithCursorImages.getAttribute('data-page-href');

    document.addEventListener('DOMContentLoaded', function() {
      fetch(document.location.origin + '/page-with-images')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.text();
        })
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const imagesL = doc.querySelectorAll('.page-section .image-block-wrapper img');

          imagesL.forEach((img) => {
            let imgSrc = img.src;
            images.push(imgSrc);
          });
        })
        .then(() => {
          const imagesContainer = document.createElement('div');
          imagesContainer.className = "cursor-images-container";

          const imagesParrentSection = blockWithCursorImages.closest('.page-section');
          imagesParrentSection.classList.add('section-images-cursor');
          imagesParrentSection.append(imagesContainer);

          let trailImages = [];
          let currentImageIndex = 0;
          let prevMouseX = 0;
          let prevMouseY = 0;

          function animateImageTrail() {
            const currentTime = Date.now();

            trailImages = trailImages.filter((trail) => {
              const elapsed = currentTime - trail.startTime;
              const progress = elapsed / configs.delay;

              if (progress >= 1) {
                trail.imgElement.remove();
                return false;
              }

              const startY = trail.startY;
              const overshootFactor = configs.overshootFactor;
             const currentY = startY - (startY - trail.y) * Math.sin(Math.PI * progress) * overshootFactor;

              const tilt = trail.tilt + (Math.sign(trail.tilt) * (configs.maxFinalTilt - Math.abs(trail.tilt))) * progress;
              trail.imgElement.style.transform = `translate(${trail.x - trail.width / 2}px, ${currentY - trail.height / 2}px) rotate(${tilt}deg)`;

              const fadeStart = configs.fadeStart;
              if (progress >= fadeStart) {
                trail.imgElement.style.opacity = 1 - (progress - fadeStart) / (1 - fadeStart);
              }

              return true;
            });

            requestAnimationFrame(animateImageTrail);
          }

          function getDistance(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          }

          function onMouseMove(event) {
            const x = event.clientX;
            const y = event.clientY;

            if (getDistance(x, y, prevMouseX, prevMouseY) >= configs.minDistance) {
              const imageSrc = images[currentImageIndex];
              const imgElement = document.createElement('img');
              imgElement.src = imageSrc;
              imgElement.style.position = 'absolute';
              imgElement.style.width = `${configs.maxWidth}px`;
              imgElement.style.height = `${configs.maxHeight}px`;
              imgElement.style.opacity = '1';
              imgElement.style.transition = 'opacity 0.3s ease-out ';

              const randomTilt = Math.random() < 0.5 ? -configs.maxTilt : configs.maxTilt;
              imgElement.style.transform = `rotate(${randomTilt}deg)`;

              imagesContainer.appendChild(imgElement);

              trailImages.push({
                imgElement: imgElement,
                x: x,
                y: y,
                startY: y + configs.maxHeight,
                width: configs.maxWidth,
                height: configs.maxHeight,
                tilt: randomTilt,
                startTime: Date.now(),
              });

              currentImageIndex = (currentImageIndex + 1) % images.length;
              prevMouseX = x;
              prevMouseY = y;
            }
          }

          window.addEventListener('mousemove', onMouseMove);

          animateImageTrail();
        
        
        })
        .catch(error => {
          console.error('Error fetching the images page:', error);
        });
    });
  }
</script>
