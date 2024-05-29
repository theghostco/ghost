  let codeBlocks = document.querySelectorAll('.code-block');
  
  codeBlocks.forEach((codeBlock)=>{
    let sourceCode = codeBlock.querySelector('.source-code')
    if(sourceCode != null && sourceCode != undefined ){
      let button = document.createElement('a');
      button.innerText = 'Copy Code';
      button.className = "copied-button";
      sourceCode.before(button)
      button.addEventListener('click', () => {
        window.navigator.clipboard.writeText(sourceCode.textContent).then(function() {
          button.innerText = 'Code Copied';
          setTimeout(function() {
            button.innerText = 'Copy Code';
          }, 5000);
        });
      });
    }
  });