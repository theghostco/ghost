 var typedElement = document.querySelector('.sqs-block-content '+globalGhostTypingAnimation.stringsElement);
  if (typeof(typedElement) != 'undefined' && typedElement != null){
    var typedElementInner = typedElement.querySelector('strong');
    if (typeof(typedElementInner) != 'undefined' && typedElementInner != null){
      typedElement.classList.add('element-with-typed-text');
      //typedElementInner.classList.add('hide-for-loading');
      typedElementInner.insertAdjacentHTML('afterEnd', '<div id="typed"></div>');
      globalGhostTypingAnimation.stringsElement += ' strong';
      var typedParams = {
        stringsElement: globalGhostTypingAnimation.stringsElement,
        typeSpeed: globalGhostTypingAnimation.typeSpeed,
        backDelay: globalGhostTypingAnimation.backDelay,
        startDelay: globalGhostTypingAnimation.startDelay,
        shuffle: globalGhostTypingAnimation.shuffle,
        loop: globalGhostTypingAnimation.loop,
        loopCount: globalGhostTypingAnimation.loopCount,
        showCursor: globalGhostTypingAnimation.showCursor,
        cursorChar: globalGhostTypingAnimation.cursorChar
      };
      var typed = new Typed('#typed', typedParams);

    }
  }
  document.querySelectorAll('.sqs-block-content strong em').forEach(function(thisEm){
    console.log(thisEm);
    thisEm.classList.add('loaded');

  });