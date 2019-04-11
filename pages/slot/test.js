(() => {
    const slotComponent = container.querySelector('x-slot');
    
    console.assert(slotComponent !== null, '<x-slot> should be defined');
    console.assert(slotComponent.shadowRoot !== null, '<x-slot> should have an associated shadow root');
    console.assert(slotComponent.shadowRoot.childElementCount === 3, 'Invalid number of child elements');
    
    const slot = slotComponent.shadowRoot.querySelector('slot');
    console.assert(slot.children.length === 0, '<slot> should have no children');
    console.assert(slot.assignedElements().length === 1, '<slot> should have 1 assigned element');
    console.assert(slot.assignedElements()[0].textContent === 'I am a slotted content', '<slot> assigned element should have the right text content');
})();