<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

<script>

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() =>{
    if (!document.body.classList.contains('sqs-edit-mode')) {
      fetch(document.location.origin + '/page-for-announcement-bar')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
            return response.text();
         })
         .then(html => {
           const parser = new DOMParser();
           const doc = parser.parseFromString(html, 'text/html');
           const sectionForAnnouncement = doc.querySelector('main .page-section');
           const announcementContent = document.querySelector('.sqs-announcement-bar .sqs-announcement-bar-content')
           const announcementContentText = document.querySelector('.sqs-announcement-bar .sqs-announcement-bar-text')
           
           const newAnnouncement = document.createElement('div');
           newAnnouncement.className = 'new-announcement-wrapper'
           newAnnouncement.append(sectionForAnnouncement)
           
           announcementContent.append(newAnnouncement)
          
           const newAnnouncementSection = document.querySelector('.new-announcement-wrapper section')
          newAnnouncementSection.prepend(announcementContentText)
          
          announcementContentText.addEventListener('click', () => {
          	const newAnnouncementSectionContentWrapper = newAnnouncementSection.querySelector('.content-wrapper')
            announcementContentText.classList.toggle("rotate")
            $(newAnnouncementSectionContentWrapper).slideToggle() 
          })
          
          const showAnnoumncement = document.querySelector('.sqs-announcement-bar');
          showAnnoumncement.style.opacity = '1';

        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  },500)
});

</script>
