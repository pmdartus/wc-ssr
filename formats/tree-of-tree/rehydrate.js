customElements.define('shadow-root', class extends HTMLElement {
    connectedCallback() {
        const parent = this.parentElement;
        const shadow = parent.attachShadow({ mode: 'open' });

        while (this.firstChild) {
            shadow.appendChild(this.firstChild, shadow.firstChild);
        }

        this.remove();
    }
});