window.Squarespace.onInitialize(Y, function() { 

	var svgIcon = '<div class="svg-bg-item"><svg width="842" height="256" viewBox="0 0 842 256" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 90.1764L41.9689 87.8535C78.4754 85.8328 115.008 91.3316 149.302 104.009L187.057 117.966C222.608 131.108 261.302 133.197 298.061 123.96L386.702 101.685C417.174 94.0278 446.906 83.681 475.549 70.7666L490.773 63.9023C579.441 23.9235 682.142 30.3853 765.1 81.1623L842 128.231V159.941H0V90.1764Z" class="svg-color" fill="#fbc531" fill-opacity="0.2"/><path d="M842 213.547L735.5 217.178H666.676C623.766 217.178 582.148 202.499 548.733 175.579L544.092 171.841C519.878 152.334 492.487 137.139 463.12 126.923L420.667 112.155C299.471 69.9933 167.273 72.0315 47.4345 117.909L0 136.068V178.231V252.396H842V213.547Z" fill="white"/><path d="M842 213.547L735.5 217.178H666.676C623.766 217.178 582.148 202.499 548.733 175.579L544.092 171.841C519.878 152.334 492.487 137.139 463.12 126.923L420.667 112.155C299.471 69.9933 167.273 72.0315 47.4345 117.909L0 136.068V178.231V252.396H842V213.547Z" class="svg-color" fill="#fbc531" fill-opacity="0.4"/><path d="M0 216.152L7.99352 209.371C61.4103 164.058 137.734 157.74 197.875 193.653V193.653C225.745 210.296 259.341 214.419 290.409 205.009L395.5 173.18V173.18C473.685 137.668 559.148 118.385 645 116.536V116.536L681.892 119.496C736.421 123.872 790.199 134.978 842 152.562V152.562V180.835V255H0V216.152Z" fill="white"/><path opacity="0.6" d="M0 216.152L7.99352 209.371C61.4103 164.058 137.734 157.74 197.875 193.653V193.653C225.745 210.296 259.341 214.419 290.409 205.009L395.5 173.18V173.18C473.685 137.668 559.148 118.385 645 116.536V116.536L681.892 119.496C736.421 123.872 790.199 134.978 842 152.562V152.562V180.835V255H0V216.152Z" class="svg-color" fill="#fbc531"/><path d="M842 156.626L769.016 160.801L683.5 166.065L577.5 162.253L525.322 163.524H469.244H429.831C412.211 163.524 394.678 161.047 377.748 156.166L344.717 146.642L329.768 142.222C266.205 123.43 199.008 120.485 134.045 133.646L0 160.801V231.597H842V156.626Z" fill="white"/><path opacity="0.8" d="M842 156.626L769.016 160.801L683.5 166.065L577.5 162.253L525.322 163.524H469.244H429.831C412.211 163.524 394.678 161.047 377.748 156.166L344.717 146.642L329.768 142.222C266.205 123.43 199.008 120.485 134.045 133.646L0 160.801V231.597H842V156.626Z" class="svg-color" fill="#fbc531" fill-opacity="0.9"/><path d="M0 196.968L60.6597 194.127C84.9806 192.988 109.343 195.181 133.07 200.645L209.457 218.236C230.332 223.043 251.875 224.248 273.156 221.797L419 205L584 188L747.971 181.621C782.829 180.265 816.75 193.083 842 217.152V217.152V256H0V196.968Z" class="svg-color" fill="#fbc531"/></svg></div>';
	var linkForItem = '<div class="cta-button-price"></div>';

	document.querySelectorAll('.summary-item-list.sqs-gallery .summary-item').forEach(function(thisNode){

		thisNode.insertAdjacentHTML('beforeend', svgIcon);
		thisNode.insertAdjacentHTML('beforeend', linkForItem);

		thisNode.insertAdjacentHTML('afterbegin', '<a class="slide-price-link" href="'+thisNode.querySelectorAll('.summary-title-link')[0].getAttribute('href')+'"></a>');
		thisNode.insertAdjacentHTML('afterbegin', '<div class="box-shadow-hover"></div>');

		if(thisNode.querySelectorAll('.summary-metadata-item--tags a')[0]){
			
			var colorOfSvg = thisNode.querySelectorAll('.summary-metadata-item--tags a')[0].textContent;


			thisNode.querySelectorAll('.svg-color').forEach(function(thisSvg){
				thisSvg.style.fill = colorOfSvg;
			});


			thisNode.querySelectorAll('.summary-title-link').forEach(function(thisLink){
				thisLink.style.backgroundColor = colorOfSvg;
			});

			thisNode.style.borderColor = colorOfSvg;
		}


		thisNode.querySelectorAll('.summary-excerpt p strong').forEach(function(thisParag){
			thisParag.closest('p').classList.add('plus-icon');
		});

		thisNode.querySelectorAll('.summary-excerpt p em').forEach(function(thisParag){
			thisParag.closest('p').classList.add('x-icon');
		});
	});


});


