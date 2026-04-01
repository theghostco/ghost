
<script>
const CONFIG = {
  RIPPLE_COLOR_1: "rgb(171,209,198)",
  RIPPLE_COLOR_2: "rgb(249,188,96)",
  RIPPLE_COLOR_3: "rgb(225,97,98)"
};

(function(CONFIG){

  const {
    RIPPLE_COLOR_1,
    RIPPLE_COLOR_2,
    RIPPLE_COLOR_3
  } = CONFIG;

  document.addEventListener("DOMContentLoaded",()=>{

    const buttons=document.querySelectorAll('#siteWrapper a[href*="#wave-btn"], #siteWrapper a[href*="?btn=wave"]');

    buttons.forEach(btn=>{
      if(btn.dataset.waveBuilt==="true")return;

      const label=btn.textContent.trim();

      const ripple1=document.createElement("span");
      const ripple2=document.createElement("span");
      const ripple3=document.createElement("span");

      const textWrap=document.createElement("span");
      const textCurrent=document.createElement("span");
      const textHover=document.createElement("span");

      ripple1.className="wave-ripple-1";
      ripple2.className="wave-ripple-2";
      ripple3.className="wave-ripple-3";

      ripple1.style.background=RIPPLE_COLOR_1;
      ripple2.style.background=RIPPLE_COLOR_2;
      ripple3.style.background=RIPPLE_COLOR_3;

      textWrap.className="wave-btn-text";
      textCurrent.className="wave-btn-text-current";
      textHover.className="wave-btn-text-hover";

      textCurrent.textContent=label;
      textHover.textContent=label;

      textWrap.appendChild(textCurrent);
      textWrap.appendChild(textHover);

      ripple2.appendChild(ripple3);
      ripple1.appendChild(ripple2);

      btn.innerHTML="";
      btn.appendChild(ripple1);
      btn.appendChild(textWrap);

      btn.dataset.waveBuilt="true";
    });

  });

})(CONFIG);
</script>
