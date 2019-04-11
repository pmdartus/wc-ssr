(() => {
    const parent = container.querySelector('x-parent');
    assert(parent !== null, '<x-parent> should be defined');
    assert(parent.shadowRoot !== null, '<x-parent> should have an associated shadow root');
    assert(parent.shadowRoot.childElementCount === 3, 'Invalid number of child elements');
    
    const nested = parent.shadowRoot.querySelector('x-nested');
    assert(nested !== null, '<x-nested> should be defined');
    assert(nested.shadowRoot !== null, '<x-nested> should have an associated shadow root');
    assert(nested.shadowRoot.textContent === 'I am nested', 'Invalid text content');
})();