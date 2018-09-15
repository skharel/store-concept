'use strict';

function createStore(reducer) {
  /*
store should have 4 parts
1. The state
2. Get the state (getState)
3. Listen to changes on the state (subscribe)
4. update the state (dispatch)
*/

  let state;
  let listeners = [];

  let getState = () => state;

  let subscribe = listener => {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  let dispatch = action => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  return {
    getState,
    subscribe,
    dispatch
  };
}

module.exports = createStore;
