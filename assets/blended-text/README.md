

## 1.Paste the code into Code Injection (Header or Footer).
```html
<link href="https://ghosthub.boo/assets/blended-text/style.css" rel="stylesheet"> - header
<script src="https://ghosthub.boo/assets/blended-text/index.js"></script> - footer
```

(or on a specific page Page Settings > Advanced)

## 2.Create section with ID #blended-text. Add Heading1 text

## Preview

<img width="1688" height="707" alt="image" src="https://github.com/user-attachments/assets/5d210307-1dbf-4026-aa21-49455f26bee5" />


## 3. Editable properties (paste into Code Injection Footer):

```html
<script>
const CONFIG = {
steps: 8, // number of shadow layers
distance: 140, // max layer offset distance
minDistance: 1, // min layer offset distance
faceColor: '#ffffff', // top text color
color1: '#fff', // end gradient color
color2: '#fff', // start gradient color
strokePx: 0.8, // max stroke width
smooth: 0.05, // mouse follow smoothing
expandSmooth: 0.04, // expand smoothing
selector: 'h1 a' // target text selector
};
</script>
```











