<!-- mood board -->
<script>

 const draggbleElements = ['h1', 'h2', '.sqs-block-button-element', '.horizontalrule-block', '.newsletter-form', '.sqs-gallery-container', '.sqs-shape-rectangle'];
  
</script>
<script src="https://www.ghostplugins.dev/assets/helpers/jq/jq.js"></script>
<script src="https://www.ghostplugins.dev/assets/helpers/jq/jq-ui.js"></script>

<script>
 (function (sectionAttr) {
    const utils = (function () {
        function getParentEl(el, tagName) {
            let searchEl = el;

            while (searchEl.parentElement) {
                if (searchEl.parentElement.tagName.toLowerCase() === tagName.toLowerCase()) {
                    return searchEl.parentElement;
                }

                searchEl = searchEl.parentElement;
            }

            return null;
        }

        function setAttrParents(attr, selector) {
            let list = document.querySelectorAll(`[${attr}]`);
            list.forEach((el) => {
                const tagEl = getParentEl(el, selector);

                if (!tagEl) {
                    return;
                }
                tagEl.setAttribute(attr, '');
            })
        }

        function fetchData(path) {
            const url = document.location.origin + path + '?format=json-pretty';

            return fetch(url)
                .then((response) => response.json())
        }

        return {
            setAttrParents, fetchData
        };
    })();
    utils.setAttrParents(sectionAttr, 'section');

    const section = document.querySelector(`section[${sectionAttr}]`);

    if (section) {

        draggbleElements.forEach((tag) => {

            const el = section.querySelector(tag);

            el.classList.add('draggable');
            el.classList.add('element');
        })

        const draggableList = Array.from(section.querySelectorAll('.draggable'));

        draggableList.forEach((el) => {
            const draggable = $('.draggable');

            draggable.draggable({
                cursor: "grabbing",
                containment: ".background",
                stack: ".element",
            });

        })
    }

}('drag-container'))

</script>
<!-- mood board end -->
