function customGhostVerification(){
    if(localStorage.getItem('hideGhostVerification')){
       document.querySelector('body').classList.add('show-body');
    }else{
      let verificationTitle = globalGhostPopUpVerificatonOptions.verificationTitle;
      let verificationDescription = globalGhostPopUpVerificatonOptions.verificationDescription;
      let verificationConfirmText = globalGhostPopUpVerificatonOptions.verificationConfirmText;
      let verificationRejectText = globalGhostPopUpVerificatonOptions.verificationRejectText;
      let websiteOptionalLogo = globalGhostPopUpVerificatonOptions.websiteOptionalLogoUrl;
      let verificationOptionalImage = globalGhostPopUpVerificatonOptions.verificationOptionalImageUrl;
      let verificationFailText = globalGhostPopUpVerificatonOptions.verificationFailText;


      var isImageExist = (websiteOptionalLogo)? 'with-image': 'no-image';
      var isLogoExist = (websiteOptionalLogo)? 'with-logo': 'no-logo';
      let verificationHTML = '<div class="verification-main-overlay '+isImageExist+'"><div class="verification-pop-up"><div class="verification-pop-up-inner"><div class="verification-left-part"><div class="verification-left-part-inner"><div class="fail-verification">'+verificationFailText+'</div><div class="verifyLogo"><img src="'+websiteOptionalLogo+'"></div><h2>'+verificationTitle+'</h2><p>'+verificationDescription+'</p><div class="verification-options"><button class="verify-confirm-button sqs-block-button-element--medium sqs-block-button-element">'+verificationConfirmText+'</button><button class="verify-reject-button sqs-block-button-element--medium sqs-block-button-element">'+verificationRejectText+'</button></div></div></div><div class="verification-right-part"><img src="'+verificationOptionalImage+'"></div></div></div></div>';

      document.querySelector('body').insertAdjacentHTML('afterbegin', verificationHTML);
      document.querySelector('body').classList.add('show-body');


      document.querySelector('.verify-reject-button').addEventListener("click", function (e) {
        document.querySelector('.fail-verification').classList.add('active-fail');
      });

      document.querySelector('.verify-confirm-button').addEventListener("click", function (e) {
        localStorage.setItem('hideGhostVerification', true);
        document.querySelector('body').classList.add('opacity-verification');
        setTimeout(function(){
           document.querySelector('body').classList.add('hide-verification');
        },500);
      });
    }
  }

  customGhostVerification();