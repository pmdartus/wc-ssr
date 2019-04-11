(() => {
    const simple = container.querySelector('x-simple');
    console.assert(simple !== null, '<x-simple> should be defined');
    console.assert(simple.shadowRoot !== null, '<x-simple> should have an associated shadow root');
    console.assert(simple.shadowRoot.querySelector('p').textContent === 'I am a simple component', 'Invalid text content');
})();