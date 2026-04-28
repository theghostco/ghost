# Plugin Checklist

- Create folder with the name of project `/test-plugin`
- Add files to the folder:
  - `back.js` — code from Code Injection Footer + Header
  - `full.less` — all LESS from Custom CSS
  - `full.js` — leave empty
  - `index.js` — [minified](https://www.toptal.com/developers/javascript-minifier)
  - `style.css` — LESS [converted](https://jsonformatter.org/less-to-css) to CSS, then [minified](https://www.toptal.com/developers/cssminifier)
- Update the site:
  - Paste into Code Injection Header - 
  - Paste into Code Injection Footer
  - Paste into Custom CSS — only `:root{}` and styles using those variables (format + minify first)
- Create Google Doc
