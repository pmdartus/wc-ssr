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
            const shadowRootElement = document.createElement('shadow-root');
            
            while (currentNode.shadowRoot.firstChild) {
                shadowRootElement.appendChild(currentNode.shadowRoot.firstChild);
            }

            currentNode.insertBefore(
                shadowRootElement,
                currentNode.firstChild
            );
        }
    }

    // Return the generated HTML via innerHTML
    return root.innerHTML;
}