

var floatingSymbol = globalFloatButtonInfo.iconSvg || '<p>'+globalFloatButtonInfo.iconSymbol+'</p>';
var floatingMarkup = '<div class="floating-button">'+floatingSymbol+'<div class="floating-info"><div class="floating-info-inner"><a href="tel:(555)5555 555" class="floating-item phone"><svg enable-background="new 0 0 141.732 141.732" height="141.732px" id="Livello_1" version="1.1" viewBox="0 0 141.732 141.732" width="141.732px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Livello_12"><path d="M108.225,118.226h-66.22V10.889h66.22V118.226z M69.962,129.125c0-2.951,2.37-5.345,5.294-5.345   c2.925,0,5.294,2.394,5.294,5.345c0,2.95-2.369,5.348-5.294,5.348C72.332,134.469,69.962,132.075,69.962,129.125 M112.668,133.976   h0.009V5.341V5.34V5.314h-0.002C112.661,2.377,110.278,0,107.336,0c-0.021,0-0.038,0.002-0.057,0.002V0H95.282h-35H42.894   c-2.938,0.002-5.319,2.379-5.335,5.314h-0.001v128.661h0.008c-0.002,0.056-0.008,0.111-0.008,0.169   c0,2.878,2.419,5.212,5.404,5.212c0.044,0,0.087-0.006,0.131-0.007v0.007h64.316l0,0c2.904,0,5.267-2.333,5.267-5.212   C112.677,134.087,112.67,134.031,112.668,133.976"/></g><g id="Livello_1_1_"/></svg><span>(555)5555 555</span></a><a href="mailto:example@mail.to" class="floating-item email"><svg enable-background="new -0.709 -27.689 141.732 141.732" height="141.732px" id="Livello_1" version="1.1" viewBox="-0.709 -27.689 141.732 141.732" width="141.732px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Livello_106"><path d="M90.854,43.183l39.834,34.146l-3.627,3.627L86.924,46.552L70.177,60.907L53.626,46.719L13.693,80.951l-3.807-3.807   L49.5,43.182L9.68,9.044l3.627-3.627l56.676,48.587L82.8,43.016l-0.035-0.032h0.073l43.829-37.575l3.811,3.811L90.854,43.183z    M140.314,80.96V5.411c0-2.988-2.416-5.411-5.396-5.411c-0.021,0-0.041,0.003-0.062,0.004C134.835,0.003,134.814,0,134.793,0   c-0.333,0-0.655,0.035-0.975,0.098V0.018H11.158V0.01H5.564C5.508,0.007,5.453,0,5.396,0C5.376,0,5.355,0.003,5.334,0.004   C5.312,0.003,5.293,0,5.271,0C2.359,0,0,2.366,0,5.284c0,0.021,0.003,0.042,0.003,0.063C0.003,5.368,0,5.39,0,5.411V80.96   c0,2.979,2.416,5.396,5.396,5.396h129.521C137.898,86.355,140.314,83.939,140.314,80.96"/></g><g id="Livello_1_1_"/></svg><span>example@mail.to</span></a></div></div></div>';
var showIcons = true;

console.log(globalFloatButtonInfo.showPhoneEnvelopeIcons);
if(typeof globalFloatButtonInfo.showPhoneEnvelopeIcons !== "undefined"){
  showIcons = globalFloatButtonInfo.showPhoneEnvelopeIcons;
 }


document.querySelectorAll('body')[0].insertAdjacentHTML('beforeend', floatingMarkup);

  var phoneItem = document.querySelectorAll('.floating-button .floating-item.phone')[0];
  var emailItem = document.querySelectorAll('.floating-button .floating-item.email')[0];
  
  phoneItem.setAttribute('href', 'tel:'+globalFloatButtonInfo.phone);
  phoneItem.querySelectorAll('span')[0].textContent = globalFloatButtonInfo.phone;
  
  emailItem.setAttribute('href', 'mailto:'+globalFloatButtonInfo.email);
  
  emailItem.querySelectorAll('span')[0].textContent = globalFloatButtonInfo.email;

  console.log('showIcons + '+ showIcons);
  if(!showIcons){
    document.querySelector('.floating-button').classList.add('hide-icons')
  }

  document.querySelectorAll('.floating-button')[0].addEventListener("click", function() {
    if(document.querySelectorAll('html')[0].classList.contains('touch')){
      document.querySelectorAll('.floating-button')[0].classList.toggle('active-button');
    }
  })