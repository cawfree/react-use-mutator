import { useState } from 'react';
import { isEqual } from 'lodash';

export const useMutator = (initialState) => {
  const [ init ] = useState(initialState);
  const [ state, setState ] = useState(
    () => [ init ],
  );
  const [ mutate ] = useState(
    () => (fn) => {
      const [ currentState ] = state;
      if (fn === undefined) {
        return currentState;
      }
      const v = fn(currentState);
      if (!isEqual(v, currentState)) {
        setState(
          [state[0] = v],
        );
      }
      return v;
    },
  );
  const useMutations = () => state[0];
  return [ useMutations, mutate ];
};
