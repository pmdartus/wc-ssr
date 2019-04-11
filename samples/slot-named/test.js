(() => {
    const slotComponent = container.querySelector('x-slot');
    
    assert(slotComponent !== null, '<x-slot> should be defined');
    assert(slotComponent.shadowRoot !== null, '<x-slot> should have an associated shadow root');
    assert(slotComponent.shadowRoot.childElementCount === 3, 'Invalid number of child elements');
    
    const defaultSlot = slotComponent.shadowRoot.querySelector('slot:not([name])');
    assert(defaultSlot.children.length === 0, '<slot> should have no children');
    assert(defaultSlot.assignedElements().length === 3);
    assert(defaultSlot.assignedElements()[0].textContent === 'I am in the default slot');
    assert(defaultSlot.assignedElements()[1].textContent === 'I am also in the default slot');
    assert(defaultSlot.assignedElements()[2].textContent === 'I am in the default slot as well');

    const beforeSlot = slotComponent.shadowRoot.querySelector('slot[name="before"]');
    assert(beforeSlot.children.length === 0, '<slot> should have no children');
    assert(beforeSlot.assignedElements().length === 1);
    assert(beforeSlot.assignedElements()[0].textContent === 'I am in the before slot');

    const afterSlot = slotComponent.shadowRoot.querySelector('slot[name="after"]');
    assert(afterSlot.children.length === 0, '<slot> should have no children');
    assert(afterSlot.assignedElements().length === 1);
    assert(afterSlot.assignedElements()[0].textContent === 'I am in the after slot');
})();