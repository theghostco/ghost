window.Squarespace.onInitialize(Y, function() { 
	var newDatePicker = flatpickr('.field-element.text[placeholder="date_picker"]',{
		altInput: true,
		altFormat: "F j, Y",
		dateFormat: "Y-m-d",
		minDate: new Date(),
		inline: true,
		defaultDate: new Date()
	});
});
