
## 1.Paste the code into Code Injection (Header or Footer).
```html
<link href="https://ghosthub.boo/assets/flip-cards/style.css" rel="stylesheet"> - header
<script src="https://ghosthub.boo/assets/flip-cards/index.js"></script> - footer
```

(or on a specific page Page Settings > Advanced)

## 2.Create a new page with ID #card-stack. Add gallery. 


## 3. Editable properties (Paste into Code Injection Footer:

```html
<script>
const CONFIG = {
  SECTION_CARDS: '#card-stack',

  IMAGE_WIDTH: '300px',
  IMAGE_HEIGHT: '390px',

  IMAGE_WIDTH_MOBILE: '220px',
  IMAGE_HEIGHT_MOBILE: '300px',

  IMAGE_ASPECT_RATIO: '4 / 5',
  IMAGE_BORDER_RADIUS: '24px',

  DROP_SHADOW: 'rgba(0, 0, 0, 0.2) 0px 10px 20px',

  ANIMATION_SPEED: 0.5
};
</script>
```
## Preview

<img width="1484" height="773" alt="image" src="https://github.com/user-attachments/assets/5be33d5a-fe03-4c3d-bbb9-7ec75c1816bc" />










