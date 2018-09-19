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
const checker = store => next => action => {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().indexOf('bitcoin') !== -1
  ) {
    return alert("Nope. That's a bad idea.");
  }
  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().indexOf('bitcoin') !== -1
  ) {
    return alert("Nope. That's a bad idea.");
  }
  return next(action);
};

const logger = store => next => action => {
  console.group(action.type);
  console.log('the action: ', action);
  const result = next(action);
  console.log('the new state: ', store.getState());
  console.groupEnd();
  return result;
};

//kinda not happy about the action key and the reducer function dependency on it
let addTodoAction = createAction(ADD_TODO, 'todo');
let toggleTodoAction = createAction(TOGGLE_TODO, 'id');
let removeTodoAction = createAction(REMOVE_TODO, 'id');

let addGoalAction = createAction(ADD_GOAL, 'goal');
let removeGoalAction = createAction(REMOVE_GOAL, 'id');

let store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals
  }),
  Redux.applyMiddleware(checker, logger)
);
let unsubscribe = store.subscribe(() => {
  console.log('Logger for store: \n', store.getState());
});

//DOM CODE

store.subscribe(() => {
  removeAllLIs('todos');
  removeAllLIs('goals');
  let { goals, todos } = store.getState();

  goals.forEach(addGoalToDOM);
  todos.forEach(addTodoToDOM);
});

function generateId() {
  return (
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36)
  );
}

function getInputValueFromDOM(id) {
  let input = document.getElementById(id);
  const name = input.value;
  input.value = '';
  return name;
}

function addLIElementToDom(id, content) {
  let node = document.createElement('li'),
    text = document.createTextNode(content.name);
  node.appendChild(text);
  node.style.textDecoration = content.complete ? 'line-through' : 'none';
  node.addEventListener('click', () => {
    store.dispatch(content.onComplete(content.id));
  });

  document.getElementById(id).appendChild(node);
}

function removeAllLIs(id) {
  document.getElementById(id).innerHTML = '';
}

function userAddedTodo(params) {
  store.dispatch(
    addTodoAction({
      id: generateId(),
      name: getInputValueFromDOM('todo'),
      complete: false,
      onComplete: toggleTodoAction
    })
  );
}

function userAddedGoal(params) {
  store.dispatch(
    addGoalAction({
      id: generateId(),
      name: getInputValueFromDOM('goal'),
      complete: false,
      onComplete: removeGoalAction
    })
  );
}

function addTodoToDOM(todo) {
  addLIElementToDom('todos', todo);
}

function addGoalToDOM(goal) {
  addLIElementToDom('goals', goal);
}

document.getElementById('todoBtn').addEventListener('click', userAddedTodo);
document.getElementById('goalBtn').addEventListener('click', userAddedGoal);
