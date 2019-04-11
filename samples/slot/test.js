(() => {
    const slotComponent = container.querySelector('x-slot');
    
    assert(slotComponent !== null, '<x-slot> should be defined');
    assert(slotComponent.shadowRoot !== null, '<x-slot> should have an associated shadow root');
    assert(slotComponent.shadowRoot.childElementCount === 3, 'Invalid number of child elements');
    
    const slot = slotComponent.shadowRoot.querySelector('slot');
    assert(slot.children.length === 0, '<slot> should have no children');
    assert(slot.assignedElements().length === 1, '<slot> should have 1 assigned element');
    assert(slot.assignedElements()[0].textContent === 'I am a slotted content', '<slot> assigned element should have the right text content');
})();