const treeWalker = document.createTreeWalker(
    document.body, 
    NodeFilter.SHOW_ELEMENT,
);

function rehydrateSlot(slotElement) {
    if (slotElement.hasAttribute('ssr-slot-fallback')) {
        // If the current slot content is the fallback content, there is nothing to do
        // except removing the flag.
        slotElement.removeAttribute('ssr-slot-fallback');
    } else {
        const shadowRoot = slotElement.getRootNode();
        const hostElement = shadowRoot.host;

        let fallbackContent;

        // 2 types of nodes can be found in the slot, either:
        //   - a template tag with a ssr-slot-fallback attribute, the content of the template
        //     represents the fallback content that need to be inserted into the slot.
        //   - any other nodes, those nodes are the slotted nodes and should be added to the 
        //     host element.
        while (slotElement.firstChild) {
            const slottedNode = slotElement.firstChild;
            if (
                slottedNode.nodeType === Node.ELEMENT_NODE && 
                slottedNode.tagName === 'TEMPLATE' &&
                slottedNode.hasAttribute('ssr-slot-fallback')
            ) {
                fallbackContent = slottedNode.content;
                slotElement.removeChild(slottedNode);
            } else {
                hostElement.appendChild(slottedNode);
            }
        }

        // All the nodes in the slot are processed, we can finally
        if (fallbackContent !== undefined) {
            slotElement.appendChild(fallbackContent);
        }
    }
}

function rehydrateShadowRoot(hostElement) {
    const shadow = hostElement.attachShadow({
        mode: 'open',
    });

    // Add all the children nodes into the element shadow root.
    while (hostElement.firstChild) {
        shadow.appendChild(hostElement.firstChild);
    }
    hostElement.removeAttribute('ssr-shadow-root');

    // Recursively rehydrate the element shadow root.
    treeWalker.currentNode = hostElement.shadowRoot;
    rehydrateTree();
    treeWalker.currentNode = hostElement;
}

function rehydrateTree() {
    while(treeWalker.nextNode()) {
        const { currentNode } = treeWalker;

        if (currentNode.hasAttribute('ssr-shadow-root')) {
            currentNode.removeAttribute('ssr-shadow-root');
            rehydrateShadowRoot(currentNode);
        }

        if (currentNode.tagName === 'SLOT') {
            rehydrateSlot(currentNode);
        }
    }
}

rehydrateTree(container);