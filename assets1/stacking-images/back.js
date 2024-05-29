<script src="https://code.jquery.com/jquery-latest.min.js"></script>

<script>
  $(document).ready(function(){

    //section names
    let isSection = document.querySelectorAll('.section-name');
    if (typeof(isSection) != 'undefined' && isSection != null){
      isSection.forEach(function(thisBlock){
        let sectionName = thisBlock.getAttribute('data-name');
        thisBlock.closest('section').classList.add(sectionName+'-section');
        //thisBlock.closest('.sqs-block-code').style.display = 'none';
      });
    }

  });
</script>

<script>
  setTimeout(function() {
    if (!$('body').hasClass('sqs-edit-mode')) {
      $('.scale-plugin-section').wrapAll('<div class="scale-plugin-body"></div>');

      function wrapElements() {
        $(".scale-plugin-header-section, .scale-plugin-body").wrapAll("<div class='scale-plugin-wrapper'></div>");
      }

      wrapElements();
    }
  }, 50);
</script>

<script>
  $(document).ready(function() {
    $(window).scroll(function() {
      var bottom_of_window = $(window).scrollTop() + $(window).height();
      $('.scale-plugin-section').each(function(index) {
        var top_of_object = $(this).offset().top;
        var bottom_of_object = $(this).offset().top + $(this).outerHeight();


        if (bottom_of_window > top_of_object && $(window).scrollTop() < bottom_of_object) {
          if (index > 0 && index < $('.scale-plugin-section').length) {
            var scaleValue = 1 - ((bottom_of_window - top_of_object) / $(window).height()) * 0.3;
            $('.scale-plugin-section').eq(index - 1).css('transform', 'perspective(1200px) translateX(0px) translateY(0px) scale(' + scaleValue + ') rotate(0deg) rotateX(0deg) rotateY(0deg) translateZ(0px)');
          }
        } else if (index === $('.scale-plugin-section').length - 1 && $(window).scrollTop() >= bottom_of_object) {

          var scaleValue = 0.7;
          $('.scale-plugin-section').eq(index - 1).css('transform', 'perspective(1200px) translateX(0px) translateY(0px) scale(' + scaleValue + ') rotate(0deg) rotateX(0deg) rotateY(0deg) translateZ(0px)');
        }
      });
    });
  });

</script>

<!--
<script>
  setTimeout(function() {
    document.querySelector(".draw-to-reveal-section").insertAdjacentHTML("beforeend", '<canvas id="draw"></canvas>');

    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineJoin = "round";
    ctx.lineWidth = 300;

    ctx.globalCompositeOperation = "destination-out";

    let isDrawing = true;
    let lastX = 0;
    let lastY = 0;


    function draw(e) {
      if (!isDrawing) return;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    canvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => (isDrawing = false));
    canvas.addEventListener("mouseout", () => (isDrawing = false));

  }, 20);
</script>
-->