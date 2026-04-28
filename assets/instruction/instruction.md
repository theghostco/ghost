# hosting-plugin-guide

### Create folder with the name of project `/test-plugin`
- Add files to the folder:
  - `back.js` — code from Code Injection Footer + Header
  - `full.less` — all LESS from Custom CSS
  - `full.js` — leave empty
  - `index.js` — [minified](https://www.toptal.com/developers/javascript-minifier) code inside (function(path, collection){})();
  - `style.css` — full LESS without variables
    Example:
    :root {
  --variable: #ff0000;
    }
    @primary-color: #ff0000;

    [converted](https://jsonformatter.org/less-to-css) to CSS, then [minified](https://www.toptal.com/developers/cssminifier)

### GO the Website:
  
### Paste into Code Injection Header 
 ```html
<link href="https://ghosthub.boo/assets/TEST-PLUGIN/style.css" rel="stylesheet"> 
```

### Paste the code into Code Injection Footer:
```html
<script src="https://ghosthub.boo/assets/TEST-PLUGIN/index.js"></script> 
```

### Paste into Custom CSS — only `:root{}` and styles using those variables (format + minify first)

### Create a usage guide (how to connect the plugin to a site) 

