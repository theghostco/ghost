window.Squarespace.onInitialize(Y, function() { 

  (function () {
    'use strict';

    var init = function () {  
      function eventFire(el, etype){
        if (el.fireEvent) {
          el.fireEvent('on' + etype);
        } else {
          var evObj = document.createEvent('Events');
          evObj.initEvent(etype, true, false);
          el.dispatchEvent(evObj);
        }
      }              

      var isRangeSlider = document.querySelectorAll('.form-inner-wrapper .form-item.number')[0];

      if (typeof(isRangeSlider) != 'undefined' && isRangeSlider != null){



        document.querySelectorAll('.form-item.number .field-element').forEach(function(rangeItem){

          //var additionalInfo = '<div class="range-control"><input type="button" value="Clear" class="clear-range"></div>';

          var rangeVal = rangeItem.getAttribute('placeholder').split(',');
          var lowEnd = +rangeVal[0];
          var highEnd = +rangeVal[1];
          var inputParent = rangeItem.closest('.form-item');
          var stepRange = globalSliderRangeParams.steps;

          //rangeItem.insertAdjacentHTML('afterend', additionalInfo);
          var clearButton = inputParent.querySelectorAll('.clear-range')[0];

          var slider2 = new rSlider({
            target: rangeItem,
            values: {min: lowEnd, max: highEnd},
            range: false,
            step: stepRange,
            set: [lowEnd],
            tooltip: false,
            onChange: function (vals) {

            }
          });


          inputParent.classList.add('form-range-item');

          // clearButton.addEventListener("click", function (e) {
          //   console.log(slider2.getValue());
          //   slider2.setValues(1);
          //   //eventFire(inputParent.querySelectorAll('.rs-scale span:first-child')[0], 'click');
          // });

        })
      }
    };
    window.onload = init;
  })();

})