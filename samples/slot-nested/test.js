(() => {
    const outer = container.querySelector('x-outer');
    assert(outer !== null, '<x-outer> should be defined');
    assert(outer.shadowRoot !== null, '<x-outer> should have an associated shadow root');
    assert(outer.shadowRoot.childElementCount === 3, 'Invalid number of child elements');


    const inner = outer.shadowRoot.querySelector('x-inner');
    assert(inner !== null, '<x-outer> should be defined');
    assert(inner.shadowRoot !== null, '<x-outer> should have an associated shadow root');
    assert(inner.shadowRoot.childElementCount === 3, 'Invalid number of child elements');


    const innerSlot = inner.shadowRoot.querySelector('slot');
    assert(innerSlot.children.length === 0, '<slot> should have no children');

    assert(innerSlot.assignedElements().length === 3, '<slot> should have 3 assigned element');
    assert(innerSlot.assignedElements()[0].tagName === 'P');
    assert(innerSlot.assignedElements()[1].tagName === 'SLOT');
    assert(innerSlot.assignedElements()[2].tagName === 'P');
    
    assert(innerSlot.assignedElements({ flatten: true }).length === 3, '<slot> should have 3 assigned element (flatten)');
    assert(innerSlot.assignedElements({ flatten: true })[0].tagName === 'P');
    assert(innerSlot.assignedElements({ flatten: true })[1].tagName === 'P');
    assert(innerSlot.assignedElements({ flatten: true })[2].tagName === 'P');

    
    const outerSlot = outer.shadowRoot.querySelector('slot');
    assert(outerSlot.children.length === 0, '<slot> should have no children');
    
    assert(outerSlot.assignedElements().length === 1, '<slot> should have 1 assigned element');
    assert(outerSlot.assignedElements()[0].textContent === 'I am a slotted content', '<slot> assigned element should have the right text content');
    
    assert(outerSlot.assignedElements({ flatten: true }).length === 1, '<slot> should have 1 assigned element (flatten)');
    assert(outerSlot.assignedElements({ flatten: true })[0].textContent === 'I am a slotted content', '<slot> assigned element should have the right text content (flatten)');
})();