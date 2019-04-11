(() => {
    const simple = container.querySelector('x-simple');
    assert(simple !== null, '<x-simple> should be defined');
    assert(simple.shadowRoot !== null, '<x-simple> should have an associated shadow root');
    assert(simple.shadowRoot.querySelector('p').textContent === 'I am a simple component', 'Invalid text content');
})();