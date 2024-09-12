<script src="https://www.ghosthub.boo/assets/helpers/jq/jq.js"></script>
<script>
const values = {
  	 path: '/page-for-announcement-bar',
  };
</script>

<script>

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() =>{
    if (!document.body.classList.contains('sqs-edit-mode')) {
      const announcementBar = document.querySelector('.sqs-announcement-bar')
      const announcementBarBackground = window.getComputedStyle(announcementBar).backgroundColor
      
      fetch(document.location.origin + values.path)
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
           const sectionForAnnouncementSectionBg = sectionForAnnouncement.querySelector('.section-background')
           sectionForAnnouncementSectionBg.style.background = announcementBarBackground
           const announcementContent = document.querySelector('.sqs-announcement-bar .sqs-announcement-bar-content')
           const announcementContentText = document.querySelector('.sqs-announcement-bar .sqs-announcement-bar-text')
         
           const newAnnouncement = document.createElement('div');
           newAnnouncement.className = 'new-announcement-wrapper'
           newAnnouncement.append(announcementContentText)
           newAnnouncement.append(sectionForAnnouncement)
           
           announcementContent.append(newAnnouncement)
          
           const newAnnouncementSection = document.querySelector('.new-announcement-wrapper section')
           
            const announcementText = document.querySelector('.sqs-announcement-bar-text-inner p')
           const announcementTextColor = window.getComputedStyle(announcementText).color
           
           const sectionParagraph = newAnnouncementSection.querySelectorAll('p')
           sectionParagraph.forEach((p) => {
           	p.style.color = announcementTextColor
           })
        
        const sectionHeaderL = newAnnouncementSection.querySelectorAll('h1')
           sectionHeaderL.forEach((h) => {
           	h.style.color = announcementTextColor
           })
        
        const sectionHeaderSL = newAnnouncementSection.querySelectorAll('h2')
           sectionHeaderSL.forEach((h) => {
           	h.style.color = announcementTextColor
           })
        
       const sectionHeaderM = newAnnouncementSection.querySelectorAll('h3')
           sectionHeaderM.forEach((h) => {
           	h.style.color = announcementTextColor
           })
        
        const sectionHeaderS = newAnnouncementSection.querySelectorAll('h4')
           sectionHeaderS.forEach((h) => {
           	h.style.color = announcementTextColor
           })
           
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
