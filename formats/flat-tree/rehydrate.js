// Create a reusable tree walker that would only match on <slot> elements and elements with a shadow 
// attribute.
const treeWalker = document.createTreeWalker(
    document.body, 
    NodeFilter.SHOW_ELEMENT, 
    {
        acceptNode(el) {
            return el.tagName === 'SLOT' || el.hasAttribute('shadow');
        }
    },
);

function rehydrateTree() {
    while(treeWalker.nextNode()) {
        const el = treeWalker.currentNode;

        if (el.tagName === 'SLOT') {
            // Slot elements
            const isFallback = el.hasAttribute('fallback');

            // If the slot content is not fallback, the nodes in the slots need to
            // be added in the light DOM of host element, otherwise let it there.
            if (isFallback === false) {
                const shadowRoot = el.getRootNode();
                const hostElement = shadowRoot.host;

                while (el.firstChild) {
                    hostElement.appendChild(
                        el.firstChild,
                        hostElement.firstChild,
                    );
                }
            } else {
                el.removeAttribute('fallback');
            }
            
        } else {
            // Elements with shadow root
            const shadow = el.attachShadow({
                mode: 'open',
            });

            // Add all the children nodes into the element shadow root.
            while (el.firstChild) {
                shadow.appendChild(el.firstChild, shadow.firstChild);
            }
            el.removeAttribute('shadow');

            // Recursively rehydrate the element shadow root.
            treeWalker.currentNode = el.shadowRoot;
            rehydrateTree();
            treeWalker.currentNode = el;
        }
    }
}

rehydrateTree();