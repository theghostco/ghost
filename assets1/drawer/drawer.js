//let canvasArr=document.querySelectorAll(".canvas__container"),draw=!1;canvasArr.forEach(b=>{let a=b.querySelector(".ghostCanvas"),e={x:0,y:0};b.closest(".fluid-engine").classList.add("canvas-section"),b.closest(".fluid-engine").querySelectorAll(".button-block").forEach(a=>{a.closest(".fe-block").classList.add("button-fluid")}),b.closest(".fe-block").classList.add("canvas-block");let c=b.closest(".fe-block").offsetWidth,d=b.closest(".fe-block").offsetHeight;a.style.background=ghostDrawerOptions.canvasBackground,a.style.cursor="url("+ghostDrawerOptions.cursor+") 0 "+ghostDrawerOptions.cursorOffset+", auto",window.addEventListener("resize",function(){c=b.offsetWidth});let f=a.getContext("2d");a.height=d,a.width=c,a.addEventListener("mousedown",function(a){let b=$(this).offset();e.x=a.pageX-b.left,e.y=a.pageY-b.top,draw=!0,f.beginPath(),f.moveTo(e.x,e.y),f.strokeStyle=ghostDrawerOptions.colorLine,f.lineWidth=ghostDrawerOptions.lineWidth,f.lineJoin="round",f.lineCap="round"}),a.addEventListener("mousemove",function(a){let b=$(this).offset();!0==draw&&(e.x=a.pageX-b.left,e.y=a.pageY-b.top,f.lineTo(e.x,e.y),f.stroke())}),a.addEventListener("mouseup",function(a){let b=$(this).offset();e.x=a.pageX-b.left,e.y=a.pageY-b.top,f.lineTo(e.x,e.y),f.stroke(),f.closePath(),draw=!1})})




 let canvasArr = document.querySelectorAll('.canvas__container');
  let draw = false;
  canvasArr.forEach(canvas =>{
    let canv = canvas.querySelector('.ghostCanvas');
    let mouse = { x:0, y:0};
    canvas.closest('.fluid-engine').classList.add('canvas-section');
    canvas.closest('.fluid-engine').querySelectorAll('.button-block').forEach(sqsButton =>{
      sqsButton.closest('.fe-block').classList.add('button-fluid');
    })
    canvas.closest('.fe-block').classList.add('canvas-block');
    let ww = canvas.closest('.fe-block').offsetWidth;
    let vh = canvas.closest('.fe-block').offsetHeight;
    canv.style.backgroundColor = ghostDrawerOptions.canvasBackground;
    if ( navigator.userAgent.indexOf("Chrome") != -1 || navigator.userAgent.indexOf("Firefox") != -1 ) {
      canv.style.cursor = 'url('+ghostDrawerOptions.cursor+') 1 '+ghostDrawerOptions.cursorOffset+', auto';
    } else {
      if (ghostDrawerOptions.cursorOffset > 46){
        var newVar = 46
        canv.style.cursor = 'url('+ghostDrawerOptions.cursor+') 1 '+newVar+', auto';
      }else{
        canv.style.cursor = 'url('+ghostDrawerOptions.cursor+') 1 '+ghostDrawerOptions.cursorOffset+', auto';
      }
    }
    //  canv.style.cursor = 'url('+ghostDrawerOptions.cursor+') 1 '+ghostDrawerOptions.cursorOffset+', auto';
    window.addEventListener('resize', function(){
      ww = canvas.offsetWidth;
    });
    let context = canv.getContext("2d");
    canv.height = vh;
    canv.width= ww;
    canv.addEventListener("mousedown", function(e){
      let pos =  $(this).offset();
      mouse.x = e.pageX - pos.left;
      mouse.y = e.pageY - pos.top;
      draw = true;
      context.beginPath();
      context.moveTo(mouse.x, mouse.y);
      context.strokeStyle = ghostDrawerOptions.colorLine;
      context.lineWidth = ghostDrawerOptions.lineWidth;
      context.lineJoin = "round";
      context.lineCap = "round";
    });
    canv.addEventListener("mousemove", function(e){
      let pos =  $(this).offset();
      if(draw==true){
        mouse.x = e.pageX - pos.left;
        mouse.y = e.pageY - pos.top;
        context.lineTo(mouse.x, mouse.y);
        context.stroke();
      }
    });
    canv.addEventListener("mouseup", function(e){
      let pos =  $(this).offset();
      mouse.x = e.pageX - pos.left;
      mouse.y = e.pageY - pos.top;
      context.lineTo(mouse.x, mouse.y);
      context.stroke();
      context.closePath();
      draw = false;
    });
  });