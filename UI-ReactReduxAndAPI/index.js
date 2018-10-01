'use strict';

const ADD_TODO = 'ADD_TODO',
  REMOVE_TODO = 'REMOVE_TODO',
  TOGGLE_TODO = 'TOGGLE_TODO',
  ADD_GOAL = 'ADD_GOAL',
  REMOVE_GOAL = 'REMOVE_GOAL',
  RECEIVE_DATA = 'RECEIVE_DATA';

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
  } else if (action.type === RECEIVE_DATA) {
    return action.todos;
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

    case RECEIVE_DATA:
      return action.goals;

    default:
      return state;
  }
}

//reducer function
function loading(state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false;

    default:
      return state;
  }
}

// Reducer middleware interceptor function
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

function handleDeleteTodo(todo) {
  return dispatch => {
    dispatch(removeTodoAction(todo.id));
    return API.deleteTodo(todo.id).catch(e => {
      dispatch(addTodoAction(todo));
      alert('error occurred; try again');
      console.error(`failed to delete todo & reading it: `, todo);
    });
  };
}

function handleAddTodo(name, cb) {
  return dispatch => {
    return API.saveTodo(name)
      .then(todo => {
        dispatch(addTodoAction(todo));
      })
      .then(cb)
      .catch(() => alert('There was an error. Try again!'));
  };
}

function handleDeleteGoal(goal) {
  return dispatch => {
    dispatch(removeGoalAction(goal.id));
    return API.deleteGoal(goal.id).catch(e => {
      dispatch(addGoalAction(goal));
      alert('Error occurred; try again');
      console.error(`failed to delete goal & reading it: `, goal);
    });
  };
}

function handleAddGoalAction(name, cb) {
  return dispatch => {
    return API.saveGoal(name)
      .then(goal => {
        dispatch(addGoalAction(goal));
      })
      .then(cb)
      .catch(() => alert('There was an error. Try again!'));
  };
}

function handleInitialData() {
  return dispatch => {
    return Promise.all([API.fetchTodos(), API.fetchGoals()]).then(
      ([todos, goals]) => {
        store.dispatch(receivedDataAction(todos, goals));
      }
    );
  };
}

function receivedDataAction(todos, goals) {
  return {
    type: RECEIVE_DATA,
    todos,
    goals
  };
}

let store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
    loading
  }),
  //middleware to hook into after an action is dispatched but before it reaches the reducer
  Redux.applyMiddleware(ReduxThunk.default, checker, logger)
);
let unsubscribe = store.subscribe(() => {
  console.log('Logger for store: \n', store.getState());
});

function generateId() {
  return (
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36)
  );
}

//==================  now react code ===========

function BuiltWithReact() {
  return <h1>Built using React!!</h1>;
}

function List(props) {
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>
          <span>{item.name}</span>
          <span>&nbsp;</span>
          <button onClick={() => props.remove(item)}>X</button>
        </li>
      ))}
    </ul>
  );
}

class Todos extends React.Component {
  addItem = e => {
    e.preventDefault();
    this.props.store.dispatch(
      handleAddTodo(this.input.value, () => (this.input.value = ''))
    );
  };

  removeItem = todo => {
    this.props.store.dispatch(handleDeleteTodo(todo));
  };

  render() {
    return (
      <div>
        <h2> Todos</h2>
        <input
          type="text"
          placeholder="Add Todo"
          ref={input => (this.input = input)}
        />

        <button onClick={this.addItem}>Add Todo</button>
        <List items={this.props.todos} remove={this.removeItem} />
      </div>
    );
  }
}

class Goals extends React.Component {
  addItem = e => {
    e.preventDefault();
    this.props.store.dispatch(
      handleAddGoalAction(this.input.value, () => (this.input.value = ''))
    );
  };

  removeItem = goal => {
    this.props.store.dispatch(handleDeleteGoal(goal));
  };

  render() {
    return (
      <div>
        <h2> Goals</h2>
        <input
          type="text"
          placeholder="Add Goal"
          ref={input => (this.input = input)}
        />
        <button onClick={this.addItem}>Add Goal</button>
        <List items={this.props.goals} remove={this.removeItem} />
      </div>
    );
  }
}

class App extends React.Component {
  componentDidMount() {
    const { store } = this.props;
    store.dispatch(handleInitialData());
    store.subscribe(() => {
      this.forceUpdate();
    });
  }

  render() {
    const { store } = this.props;
    const { todos, goals, loading } = store.getState();

    if (loading) {
      return <h3>Loading...</h3>;
    } else {
      return (
        <div>
          <BuiltWithReact />
          <Todos store={this.props.store} todos={todos} />
          <Goals store={this.props.store} goals={goals} />
        </div>
      );
    }
  }
}

console.log('API: ', API);

ReactDOM.render(<App store={store} />, document.getElementById('app'));
