Q: Why does the user webpack build require _babel-polyfill_ on IE 11, but the Playground webpack build doesn't?

Which package relies on (unpolyfilled) Promises?

Answer: `async-until` (addressed in https://github.com/skidding/async-until/pull/3)

Not sure why I was setting `polyfill: false` to `transform-runtime` plugin in every Babel config. I think it only makes sense if you're certain a global polyfill (like _babel-polyfill_) is always imported before the compiled code. Not a good idea for libraries!

Fixed in: https://github.com/react-cosmos/react-cosmos/pull/820

---

Q: How to link fixture state to specific component instances?

Context: A fixture can render more than one component element, which means it can hold state for more than one component instance (of the same type or of different types) at the same time. We need an identifier for each component instance.

Options:

- A. Component type
- B. Component instance (ref)
- C. Component element
- D. Decorator instance (ref)

A. doesn't work because we can have multiple child instances of the same type in one fixture.

B. doesn't work because stateless components don't have instances.

C. doesn't work because AFAIK elements have neither unique reference nor content

D. works well. But different types of fixture state (eg. props and component state) **can't be grouped per component instance**. Each type of fixture state will be identified by the instance of its corresponding decorator. We can't reliably group decorator instances by child type because, as mentioned above, more children of the same type can coexist in a fixture.
