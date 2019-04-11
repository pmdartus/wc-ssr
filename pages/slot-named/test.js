(() => {
    const slotComponent = container.querySelector('x-slot');
    
    console.assert(slotComponent !== null, '<x-slot> should be defined');
    console.assert(slotComponent.shadowRoot !== null, '<x-slot> should have an associated shadow root');
    console.assert(slotComponent.shadowRoot.childElementCount === 3, 'Invalid number of child elements');
    
    const defaultSlot = slotComponent.shadowRoot.querySelector('slot:not([name])');
    console.assert(defaultSlot.children.length === 0, '<slot> should have no children');
    console.assert(defaultSlot.assignedElements().length === 3);
    console.assert(defaultSlot.assignedElements()[0].textContent === 'I am in the default slot');
    console.assert(defaultSlot.assignedElements()[1].textContent === 'I am also in the default slot');
    console.assert(defaultSlot.assignedElements()[2].textContent === 'I am in the default slot as well');

    const beforeSlot = slotComponent.shadowRoot.querySelector('slot[name="before"]');
    console.assert(beforeSlot.children.length === 0, '<slot> should have no children');
    console.assert(beforeSlot.assignedElements().length === 1);
    console.assert(beforeSlot.assignedElements()[0].textContent === 'I am in the before slot');

    const afterSlot = slotComponent.shadowRoot.querySelector('slot[name="after"]');
    console.assert(afterSlot.children.length === 0, '<slot> should have no children');
    console.assert(afterSlot.assignedElements().length === 1);
    console.assert(afterSlot.assignedElements()[0].textContent === 'I am in the after slot');
})();