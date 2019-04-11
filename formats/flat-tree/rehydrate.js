// Create a reusable tree walker that would only match on <slot> elements and elements with a shadow 
// attribute.
const treeWalker = document.createTreeWalker(
    document.body, 
    NodeFilter.SHOW_ELEMENT,
);

function rehydrateTree() {
    while(treeWalker.nextNode()) {
        const el = treeWalker.currentNode;

        if (el.hasAttribute('shadow')) {
            // Elements with shadow root
            const shadow = el.attachShadow({
                mode: 'open',
            });

            // Add all the children nodes into the element shadow root.
            while (el.firstChild) {
                shadow.appendChild(el.firstChild);
            }
            el.removeAttribute('shadow');

            // Recursively rehydrate the element shadow root.
            treeWalker.currentNode = el.shadowRoot;
            rehydrateTree();
            treeWalker.currentNode = el;
        }

        if (el.tagName === 'SLOT') {
            const slotName = el.getAttribute('name');

            // If the slot content is not fallback, the nodes in the slots need to
            // be added in the light DOM of host element, otherwise let it there.
            if (!el.hasAttribute('fallback')) {
                const shadowRoot = el.getRootNode();
                const hostElement = shadowRoot.host;

                while (el.firstChild) {
                    const slottedNode = el.firstChild;

                    if (slotName !== null) {
                        slottedNode.setAttribute('slot', slotName);
                    }

                    hostElement.appendChild(slottedNode);
                }
            } else {
                el.removeAttribute('fallback');
            }
            
        }
    }
}

rehydrateTree(container);