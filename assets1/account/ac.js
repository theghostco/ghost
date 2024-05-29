
console.log('wiw');
setTimeout(function(){
	console.log('pah')
	document.querySelectorAll("#user-profile-page-root span").forEach(function(span){
		console.log(span);
		span.classList.add(span.textContent);
	});
},5000);

