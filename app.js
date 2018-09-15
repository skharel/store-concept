'use strict';

let createStore = require('./store'),
  {
    rootReducer,
    addTodoAction,
    toggleTodoAction,
    removeTodoAction,
    addGoalAction,
    removeGoalAction
  } = require('./reducers');

let store = createStore(rootReducer);
let unsubscribe = store.subscribe(() => {
  console.log('Logger for store: \n', store.getState());
});

store.dispatch(
  addTodoAction({
    id: 0,
    name: 'learn Redux',
    complete: false
  })
);

store.dispatch(
  addTodoAction({
    id: 1,
    name: 'Learn Pure Functions',
    complete: true
  })
);

store.dispatch(
  addTodoAction({
    id: 2,
    name: 'Learn Vue JS',
    complete: false
  })
);

store.dispatch(toggleTodoAction(2));

store.dispatch(removeTodoAction(2));

store.dispatch(
  addGoalAction({
    id: 0,
    name: 'Walk 5 miles',
    complete: false
  })
);

store.dispatch(removeGoalAction(0));
