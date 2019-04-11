(() => {
    const outer = container.querySelector('x-outer');
    console.assert(outer !== null, '<x-outer> should be defined');
    console.assert(outer.shadowRoot !== null, '<x-outer> should have an associated shadow root');
    console.assert(outer.shadowRoot.childElementCount === 3, 'Invalid number of child elements');


    const inner = outer.shadowRoot.querySelector('x-inner');
    console.assert(inner !== null, '<x-outer> should be defined');
    console.assert(inner.shadowRoot !== null, '<x-outer> should have an associated shadow root');
    console.assert(inner.shadowRoot.childElementCount === 3, 'Invalid number of child elements');


    const innerSlot = inner.shadowRoot.querySelector('slot');
    console.assert(innerSlot.children.length === 0, '<slot> should have no children');

    console.assert(innerSlot.assignedElements().length === 3, '<slot> should have 3 assigned element');
    console.assert(innerSlot.assignedElements()[0].tagName === 'P');
    console.assert(innerSlot.assignedElements()[1].tagName === 'SLOT');
    console.assert(innerSlot.assignedElements()[2].tagName === 'P');
    
    console.assert(innerSlot.assignedElements({ flatten: true }).length === 3, '<slot> should have 3 assigned element (flatten)');
    console.assert(innerSlot.assignedElements({ flatten: true })[0].tagName === 'P');
    console.assert(innerSlot.assignedElements({ flatten: true })[1].tagName === 'P');
    console.assert(innerSlot.assignedElements({ flatten: true })[2].tagName === 'P');

    
    const outerSlot = outer.shadowRoot.querySelector('slot');
    console.assert(outerSlot.children.length === 0, '<slot> should have no children');
    
    console.assert(outerSlot.assignedElements().length === 1, '<slot> should have 1 assigned element');
    console.assert(outerSlot.assignedElements()[0].textContent === 'I am a slotted content', '<slot> assigned element should have the right text content');
    
    console.assert(outerSlot.assignedElements({ flatten: true }).length === 1, '<slot> should have 1 assigned element (flatten)');
    console.assert(outerSlot.assignedElements({ flatten: true })[0].textContent === 'I am a slotted content', '<slot> assigned element should have the right text content (flatten)');
})();