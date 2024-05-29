

  (function () {
    'use strict';

    var init = function () {                

      var isRangeSlider = document.querySelectorAll('.form-inner-wrapper .form-item.number')[0];

      if (typeof(isRangeSlider) != 'undefined' && isRangeSlider != null){



        document.querySelectorAll('.form-item.number .field-element').forEach(function(rangeItem){

          var additionalInfo = '<div class="range-control"><input type="button" value="Clear" class="clear-range"></div>';

          var rangeVal = rangeItem.getAttribute('placeholder').split(',');
          var lowEnd = +rangeVal[0];
          var highEnd = +rangeVal[1];
          var inputParent = rangeItem.closest('.form-item');
          var stepRange = globalSliderRangeParams.steps;

          rangeItem.insertAdjacentHTML('afterend', additionalInfo);
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

          clearButton.addEventListener("click", function (e) {
            slider2.setValues(lowEnd);
          });

        })
      }
    };
    window.onload = init;
  })();

