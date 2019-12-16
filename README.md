# react-use-mutator
A React hook for inspecting and mutating shared state without subscribing to render updates.

## 🚀 Getting Started

Using [`npm`]():

```bash
npm install --save react-use-mutator
```

Using [`yarn`]():

```bash
yarn add react-use-mutator
```

## 🤔 What is this for?

Some applications depend on `useState` to manage a value which can be both consumed by and written to by many children, but because of the way [React]() updates your components, their changes have the chance to overwrite or not reflect upon previous changes since the last `render`.

Additionally, sometimes it is useful to interrogate the value of the state held by a hook, without necessarily wanting to _subscribe_ to those changes.

`react-use-mutator` enables us to both predictably update shared state, and inspect the current value of that state without subscribing to it.

## ✍️ Example

In this example, we render `5000` children who all have shared access to the global state, who on mount, all attempt to register their unique identifier. Without using mutations, printing to the `console` in our `useLayoutEffect` hook only ever retain the contents of a single key, since all `children` effectively complete to register against the initial, empty state.

By contrast, `useMutator` allows us to register all `5000` children safely, _without_ an insane amount of render updates. This takes just a single render operation!

```javascript
import React, { useContext, useEffect, useLayoutEffect } from 'react';
import uuidv4 from 'uuid/v4';
import { Map } from 'immutable';
import { useMutator } from 'react-use-mutator';

const StateContext = React.createContext();
const MutatorContext = React.createContext();

const Child = ({ ...extraProps }) => {
  // XXX: Registers this child to the currently mounted
  //      value of the StateContext in the DOM.
  const currentState = useContext(StateContext)();
  const mutateState = useContext(MutatorContext);
  const [ myId ] = useState(
    () => uuidv4(),
  );
  useEffect(
    () => {
      mutateState(
        currentState => currentState
          .set(myId, true),
      );
    },
    [],
  );
  return null;
};

export default () => {
  const [ useMutations, mutate ] = useMutator(
    () => Map({}),
  );
  useLayoutEffect(
    // XXX: The current value of the state can be used any times by calling mutate().
    //      mutate() normally expects a mutation function, but if this is not provided,
    //      it terminates early with the value of the current state.
    () => console.log(JSON.stringify(mutate()));
  );
  return (
    <MutatorContext.Provider
      value={mutate}
    >
      <StateContext.Provider
        value={useMutations}
      >
        {[...Array(5000)]   
          .map(
            (_, i) => (
              <Child
                key={i}
              />
            ),
          )}
      </StateContext.Provider>
    </MutatorContext.Provider>
  );
};

```

## ✌️ License
[MIT](https://opensource.org/licenses/MIT)

<p align="center">
  <a href="https://www.buymeacoffee.com/cawfree">
    <img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy @cawfree a coffee" width="232" height="50" />
  </a>
</p>
