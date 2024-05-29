// Select the div with the class 'left-header'
var leftHeader = document.querySelector('.left-header');

// Select the element with the ID 'header'
var headerElement = document.getElementById('header');

if (leftHeader && headerElement) {
        // If left-header exists, add a class to header
        headerElement.classList.add('left-header'); // Replace 'your-new-class' with the class you want to add

        document.addEventListener('DOMContentLoaded', function() {
            var folderTitles = document.querySelectorAll('.header-nav-folder-title');

            folderTitles.forEach(function(folderTitle) {
                folderTitle.addEventListener('click', function() {
                    var navItem = this.closest('.header-nav-item');
                    var folderContent = navItem.querySelector('.header-nav-folder-content');

                    if (getComputedStyle(folderContent).display === 'none') {
                // Open the folder content
                folderContent.style.display = 'block'; // Make it visible
                let fullHeight = folderContent.scrollHeight + 'px'; // Get full height
                folderContent.style.height = '0px'; // Reset height to start animation
                setTimeout(() => {
                    folderContent.style.height = fullHeight;
                }, 10); // Small delay to ensure the style change has taken effect
                navItem.classList.add('active-folder'); // Add active class
            } else {
                // Close the folder content
                folderContent.style.height = '0px'; // Start collapsing animation
                setTimeout(() => {
                    folderContent.style.display = 'none'; // Hide it after animation
                    navItem.classList.remove('active-folder'); // Remove active class
                }, 300); // The delay should match the transition duration
            }
        });
            });
        });

        var headerActions = document.querySelector('.header-actions');

        if (headerActions) {
        // Check if .header-actions contains children with the specified class
        var actionElements = headerActions.querySelectorAll('.header-actions-action');
        if (actionElements.length === 0) {
            // If no elements with the specified class are found
            headerActions.classList.add('empty');
            headerActions.classList.remove('not-empty');
        } else {
            // If elements with the specified class are found
            headerActions.classList.add('not-empty');
            headerActions.classList.remove('empty');
        }
    }

}