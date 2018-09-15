'use strict';

const ADD_TODO = 'ADD_TODO',
  REMOVE_TODO = 'REMOVE_TODO',
  TOGGLE_TODO = 'TOGGLE_TODO',
  ADD_GOAL = 'ADD_GOAL',
  REMOVE_GOAL = 'REMOVE_GOAL';

function createAction(actionType, actionKey) {
  return actionMessage => ({
    type: actionType,
    [actionKey]: actionMessage
  });
}

//kinda not happy about the action key and the reducer function dependency on it
let addTodoAction = createAction(ADD_TODO, 'todo');
let toggleTodoAction = createAction(TOGGLE_TODO, 'id');
let removeTodoAction = createAction(REMOVE_TODO, 'id');

let addGoalAction = createAction(ADD_GOAL, 'goal');
let removeGoalAction = createAction(REMOVE_GOAL, 'id');

// Reducer function
function todos(state = [], action) {
  if (action.type === ADD_TODO) {
    return state.concat([action.todo]);
  } else if (action.type === REMOVE_TODO) {
    return state.filter(todo => todo.id !== action.id);
  } else if (action.type === TOGGLE_TODO) {
    return state.map(todo => {
      let newState = Object.assign({}, todo);
      newState.id === action.id && (newState.complete = !newState.complete);
      return newState;
    });
  } else {
    return state;
  }
}

// Reducer function
function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
      break;

    case REMOVE_GOAL:
      return state.filter(goal => goal.id !== action.id);
      break;

    default:
      return state;
  }
}

// Reducer function
function rootReducer(state = {}, action) {
  /* app invokes all our reducers
  the shape of the store is:
    {
      todos: [],
      goals: []
    }
  */
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action)
  };
}

module.exports = {
  rootReducer,
  addTodoAction,
  toggleTodoAction,
  removeTodoAction,
  addGoalAction,
  removeGoalAction
};
