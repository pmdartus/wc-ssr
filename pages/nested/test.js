(() => {
    const parent = container.querySelector('x-parent');
    console.assert(parent !== null, '<x-parent> should be defined');
    console.assert(parent.shadowRoot !== null, '<x-parent> should have an associated shadow root');
    console.assert(parent.shadowRoot.childElementCount === 3, 'Invalid number of child elements');
    
    const nested = parent.shadowRoot.querySelector('x-nested');
    console.assert(nested !== null, '<x-nested> should be defined');
    console.assert(nested.shadowRoot !== null, '<x-nested> should have an associated shadow root');
    console.assert(nested.shadowRoot.textContent === 'I am nested', 'Invalid text content');
})();