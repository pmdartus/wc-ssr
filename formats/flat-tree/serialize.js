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
            // First allocate the slotted content in the right slot
            while(currentNode.firstChild) {
                const { assignedSlot } = currentNode.firstChild;
                
                if (assignedSlot !== null) {
                    const slottedNode = currentNode.firstChild;

                    // We can remove the slot attribute at this point because it is not needed over the wire
                    // the rehydration figures out which slot the element belongs to and will attach the right
                    // attribute
                    if (slottedNode.nodeType === Node.ELEMENT_NODE) {
                        currentNode.firstChild.removeAttribute('slot');
                    }

                    assignedSlot.appendChild(slottedNode);
                } else {
                    // If the node is slotted, we can safely get rid of it.
                    currentNode.removeChild(firstChild);
                }
            }

            // We set the shadow attribute on the host element, so the rehydration process can pick
            // it up and attach a new shadow root.
            currentNode.setAttribute('shadow', '');
    
            // Now that all the host elements are associated to the right slot (host element has no children), 
            // we can attach all the shadow root child nodes to the host element.
            const { shadowRoot } = currentNode;
            while (shadowRoot.firstChild) {
                currentNode.appendChild(shadowRoot.firstChild);
            }
        }
    }

    // Return the generated HTML via innerHTML
    return root.innerHTML;
}