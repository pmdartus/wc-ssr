function assert(predicate, message) {
    if (!predicate) {
        throw new Error(`Assertion error: ${message}`);
    }
}