  var isProductButton = document.querySelectorAll(".sqs-add-to-cart-button-wrapper")[0];
  if (typeof isProductButton != "undefined" && isProductButton != null) {
    document.querySelectorAll(".sqs-add-to-cart-button-wrapper").forEach(function(thisElem){
    	thisElem.insertAdjacentHTML("beforeend", '<a class="go-to-cart sqs-suppress-edit-mode  sqs-add-to-cart-button sqs-button-element--primary" href="' + globalGoToCart.buttonLink + '">' + globalGoToCart.buttonText + "</a>");
    });
  }