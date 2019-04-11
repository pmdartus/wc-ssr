# Web component SSR format

This repository discusses multiple approachs to efficiently serialize web component to HTML and rehydrate the generated markup on the client.

## Context

The HTML specification doesn't provide today a way to declaratively define a shadow tree via HTML. In order to properly implement Web Component server-side rendering, it will require to send enough information along with the generated HTML for the browser to properly recreate the component tree. Now that JSDOM [supports shadow DOM](https://github.com/jsdom/jsdom/issues/2343) and that [custom element is currently under active work](https://github.com/jsdom/jsdom/pull/2548), we can start discussing what would be the best way to transfer web components over the wire.

Each approach discussed below is associated with 2 javascript files:

-   `serialize.js`: exposes a method to convert a DOM tree to a valid HTML string
-   `rehydrate.js`: script injected along with the generated HTML to recreate the DOM tree

This project also contains a set of sample pages in the [sample](sample) directory with the associated pre-rendered page for each approach.

### 1. Tree of trees - with script

**[serialize](formats/tree-of-tree-with-script/serialize.js)** | **[rehydrate](formats/tree-of-tree-with-script/rehydrate.js)**

This approach is similar to the work done by Trey Shugart in [@skatejs/ssr](https://github.com/skatejs/skatejs/tree/master/packages/ssr). With this approach, each shadow root is transformed into a standard element (`<shadow-root>`) and all the elements in the original shadow tree are moved into the element.

```html
<x-foo>
    #shadow-root
    <p>
        Hello

        <!-- Serialized -->
        <x-foo>
            <shadow-root> <p>Hello</p></shadow-root></x-foo
        >
    </p></x-foo
>
```

During serialization, `<script>` tags are inserted along each `<shadow-root>` element. This way once the parser has done processing the content of the tag, it can be updated in place by: creating a new shadow root on the parent element, assign its children to the shadow root and remove itself from the DOM.

This approach as the benefit to be simple and straight-forward at the same time since there is not much DOM manipulation. However, the main drawback of this approach is that slotted content is not in the right place which can hurt SEO.

```html
<x-foo>
    #shadow-root Hello
    <x-strong>
        #shadow-root
        <strong>
            <slot>
                world !

                <!-- Serialized -->
                <x-foo>
                    <shadow-root>
                        Hello
                        <x-strong>
                            <shadow-root>
                                <strong>
                                    <slot> world !</slot></strong
                                ></shadow-root
                            ></x-strong
                        ></shadow-root
                    ></x-foo
                ></slot
            ></strong
        ></x-strong
    ></x-foo
>
```

As you can see in the previous example, the `world` text node instead of being wrapped into the `<strong>` tag, its a child node of the `<x-strong>` element.

### 2. Tree of trees - custom element

**[serialize](formats/tree-of-tree/serialize.js)** | **[rehydrate](formats/tree-of-tree/rehydrate.js)**

This approach is comparable to the previous one, except that instead of adding a `<script>` along the `<shadow-root>`, a native `<shadow-root>` custom element is defined at the end of the page. During the custom element upgrade, it executes a similar algorithm that described above to recreate the right DOM structure.

### 3. Flat tree

**[serialize](formats/flat-tree/serialize.js)** | **[rehydrate](formats/flat-tree/rehydrate.js)**

In this approach, the DOM tree is serialized into a flat tree, where each node is assigned to the proper `assignedNode`.

During serialization:

-   all the elements with a shadow root are marked with a `shadow-root` attribute
-   all the host elements child nodes are appended into their assigned slot
-   all the slots with a fallback content and no slotted content are marked with a `slot-fallback` attribute
-   all the slots with a fallback content and a slotted content move their fallback content into a `<template>` tag with a `slot-fallback` attribute in order to keep the slot fallback semantic

While this approach requires more DOM manipulation compared to the 2 previous one, this approach provides better SEO since it keeps the slotted content at its expected place in the DOM.

## Examples

| sample        | tree of trees - script                                          | tree of trees - custom element                      | flat tree                                        |
| ------------- | --------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------ |
| simple        | [example](https://pmdartus.github.io/wc-ssr/samples/simple/rendered/tree-of-tree-with-script.html) | [example](https://pmdartus.github.io/wc-ssr/samples/simple/rendered/tree-of-tree.html) | [example](https://pmdartus.github.io/wc-ssr/samples/simple/rendered/flat-tree.html) |
| nested        | [example](https://pmdartus.github.io/wc-ssr/samples/nested/rendered/tree-of-tree-with-script.html) | [example](https://pmdartus.github.io/wc-ssr/samples/nested/rendered/tree-of-tree.html) | [example](https://pmdartus.github.io/wc-ssr/samples/nested/rendered/flat-tree.html) |
| slot          | [example](https://pmdartus.github.io/wc-ssr/samples/slot/rendered/tree-of-tree-with-script.html) | [example](https://pmdartus.github.io/wc-ssr/samples/slot/rendered/tree-of-tree.html) | [example](https://pmdartus.github.io/wc-ssr/samples/slot/rendered/flat-tree.html) |
| slot-fallback | [example](https://pmdartus.github.io/wc-ssr/samples/slot-fallback/rendered/tree-of-tree-with-script.html) | [example]https://pmdartus.github.io/wc-ssr/(samples/slot-fallback/rendered/tree-of-tree.html) | [example](https://pmdartus.github.io/wc-ssr/samples/slot-fallback/rendered/flat-tree.html) |
| slot-named    | [example](https://pmdartus.github.io/wc-ssr/samples/slot-named/rendered/tree-of-tree-with-script.html) | [example](https://pmdartus.github.io/wc-ssr/samples/slot-named/rendered/tree-of-tree.html) | [example](https://pmdartus.github.io/wc-ssr/samples/slot-named/rendered/flat-tree.html) |
| slot-nested   | [example](https://pmdartus.github.io/wc-ssr/samples/slot-nested/rendered/tree-of-tree-with-script.html) | [example]https://pmdartus.github.io/wc-ssr/(samples/slot-nested/rendered/tree-of-tree.html) | [example](https://pmdartus.github.io/wc-ssr/samples/slot-nested/rendered/flat-tree.html) |
| large         | [example](https://pmdartus.github.io/wc-ssr/samples/large/rendered/tree-of-tree-with-script.html) | [example](https://pmdartus.github.io/wc-ssr/samples/large/rendered/tree-of-tree.html) | [example](https://pmdartus.github.io/wc-ssr/samples/large/rendered/flat-tree.html) |

## Contributing

```sh
npm run serve       # start local server
npm run serialize   # update all html the generated prerendered pages
npm run validate    # run the validation tests against the generated pages
```
