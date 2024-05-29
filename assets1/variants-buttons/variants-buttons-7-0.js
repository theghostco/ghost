
window.Squarespace.onInitialize(Y, function() {
// Slugify a string
function slugify(str)
{
  str = str.replace(/^\s+|\s+$/g, '');

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i=0, l=from.length ; i<l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Remove invalid chars
    str = str.replace(/[^a-z0-9 -]/g, '') 
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-') 
    // Collapse dashes
    .replace(/-+/g, '-'); 

    return str;
  }


  document.querySelectorAll('.product-variants .variant-option').forEach(function(thisSelect){

    var thisSelectTag = thisSelect.querySelectorAll('select')[0]
    var thisSelectorType = thisSelectTag.getAttribute('data-variant-option-name');
    var thisSelectorTypeFull = thisSelectTag.getAttribute('data-variant-option-name');

    thisSelectorType = slugify(thisSelectorType);

    thisSelect.insertAdjacentHTML('beforebegin', '<div class="fakeSelector fake-'+thisSelectorType+'"><p>'+thisSelectTag.getAttribute("aria-label")+':</p><div class="fakers-inner-wrapper"></div></div>'); 

    thisSelectTag.querySelectorAll('option').forEach(function(thisValue, i){
      
      var thisValueType = thisValue.getAttribute('value'); //  value
      document.querySelectorAll('.fake-'+thisSelectorType+' .fakers-inner-wrapper')[0].insertAdjacentHTML('beforeend', '<div data-order="'+i+'" data-option="'+thisValueType+'" data-selector="'+thisSelectorTypeFull+'" class="fakeValues fake-'+thisValueType+'">'+thisValueType+'</div>');

    });
    document.querySelectorAll('.fakeValues').forEach(function(thisSelectorButton){
      thisSelectorButton.addEventListener('click', function(e) {

        var selectorParent = thisSelectorButton.closest('.fakeSelector');
        if(selectorParent.querySelectorAll('.active-color')[0]){
          selectorParent.querySelectorAll('.active-color')[0].classList.remove('active-color');
        }
        thisSelectorButton.classList.add('active-color');

        var selctorToChange = document.querySelectorAll('[data-variant-option-name="'+thisSelectorButton.getAttribute('data-selector')+'"]')[0];

        selctorToChange.selectedIndex = thisSelectorButton.getAttribute('data-order');
        selctorToChange.val = thisSelectorButton.getAttribute('data-option');

        //console.log('selctorToChange.val' + selctorToChange.val);
        if ("createEvent" in document) {
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", false, true);
          selctorToChange.dispatchEvent(evt);
        }
        else{
          element.fireEvent("onchange");
        }

      });
    });
  });
});



