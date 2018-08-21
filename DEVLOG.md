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
