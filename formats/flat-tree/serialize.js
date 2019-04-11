function serialize(root) {
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
            while(currentNode.firstChild) {
                const { assignedSlot } = currentNode.firstChild;
                
                if (assignedSlot !== null) {
                    const slottedNode = currentNode.firstChild;

                    if (slottedNode.nodeType === Node.ELEMENT_NODE) {
                        currentNode.firstChild.removeAttribute('slot');
                    }
    
                    assignedSlot.appendChild(slottedNode);
                }
            }

            currentNode.setAttribute('shadow', '');
    
            const { shadowRoot } = currentNode;
            while (shadowRoot.firstChild) {
                currentNode.appendChild(shadowRoot.firstChild);
            }
        }
    }

    return root.innerHTML;
}

serialize(container);