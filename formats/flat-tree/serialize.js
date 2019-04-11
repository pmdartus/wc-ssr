function flattenSlots(hostElement) {
    const slots = hostElement.shadowRoot.querySelectorAll('slot');

    for (const slot of slots) {
        const assignedNodes = slot.assignedNodes();
        
        const isFallback = assignedNodes.length === 0;
        const hasFallback = slot.childNodes.length !== 0;

        if (isFallback) {
            // If the fallback content is applied, there is nothing to do except marking the slot
            // with an attribute to indicate to the rehydration not to touch those nodes.
            slot.setAttribute('ssr-slot-fallback', '');
        } else {
            // If the slotted content is applied and if the slot has a fallback content, we will
            // store the fallback content is a special template stored in the slot element.
            if (hasFallback) {
                const fallbackContent = document.createElement('template');
                fallbackContent.setAttribute('ssr-slot-fallback', '');
                
                while (slot.firstChild) {
                    fallbackContent.content.appendChild(slot.firstChild);
                }

                slot.appendChild(fallbackContent);
            }

            // We can insert the assigned nodes into the slot.
            for (let slottedNode of assignedNodes) {
                slot.appendChild(slottedNode);
            }
        }
    }
}

function flattenShadowRoot(hostElement) {
    // Assign the slotted content to the right slots.
    flattenSlots(hostElement);

    // We set the shadow attribute on the host element, so the rehydration process can pick
    // it up and attach a new shadow root.
    hostElement.setAttribute('ssr-shadow-root', '');

    // Now that all the host elements are associated to the right slot (host element has no children), 
    // we can attach all the shadow root child nodes to the host element.
    const { shadowRoot } = hostElement;
    while (shadowRoot.firstChild) {
        hostElement.appendChild(shadowRoot.firstChild);
    }
}

function serialize(root) {
    // Create a template to easily manipulate the existing tree without having the custom elements
    // lifecycle callback running
    const template = document.createElement('template');
    document.body.appendChild(template);

    template.content.appendChild(root);

    const treeWalker = document.createTreeWalker(
        template.content,
        NodeFilter.SHOW_ELEMENT
    );
    
    while (treeWalker.nextNode()) {
        const { currentNode } = treeWalker;
    
        if (currentNode.shadowRoot) {
            flattenShadowRoot(currentNode);
        }
    }

    // Return the generated HTML via innerHTML
    return root.innerHTML;
}