let todos = [
  {
    id: 1,
    title: "Jog around the park 30x",
    isCompleted: false,
  },
  {
    id: 2,
    title: "Read a book",
    isCompleted: true,
  }
];

function findTodoById(id) {
  return todos.find((todo) => todo.id == id);
}

function toggleTodo(id, value) {
  const todo = findTodoById(id);
  if (todo === undefined) return;
  todo.isCompleted = value;

  render();
}

function removeTodo(id) {
  const todo = findTodoById(id);
  if (todo === undefined) return;
  todos = [...todos.filter((todo) => todo.id !== id)];

  render();
}

function clearCompletedTodos() {
  todos = [...todos.filter((todo) => todo.isCompleted == false)];
  render();
}

function createTodo(title) {
  const orderedTodos = todos.sort((a, b) => b.id > a.id);

  const newId = orderedTodos.length === 0 ? 1 : orderedTodos[0].id + 1;
  const newTodo = { id: newId, title: title, isCompleted: false };
  todos.push(newTodo);

  render();
}

const todoInput = document.getElementById("input-todo");
todoInput.addEventListener("keydown", function (event) {
  if (event.code !== "Enter") return;
  if (todoInput.value === "") return;
  if (todoInput.value.trim().length === 0) return;

  createTodo(todoInput.value);
  todoInput.value = "";
});

function render() {
  const parser = new DOMParser();
  const todoList = document.getElementById("todo-list");

  // removes existing HTML in cases where we need to re-render
  todoList.innerHTML = "";

  todos = [...todos.sort((a, b) => {
    // negative value means the first element (a) will be ordered first in the list
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? -1 : 1;
    }

    return b.id - a.id;
  })];
  for (let i = 0; i < todos.length; ++i) {
    const todo = todos[i];
    const { id, title, isCompleted } = todo;

    const deleteTodoButton = `<svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            class="delete-todo-button"
            onclick="removeTodo(${id})"
          >
            <path
              fill="#494C6B"
              fill-rule="evenodd"
              d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
            />
          </svg>`;

    let element;
    if (isCompleted) {
      element = `<div class="todo-item" id="${id}">
          <div class="todo-title" id="todo-title-${id}">
            <div class="checked-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
                <path
                  fill="none"
                  stroke="#FFF"
                  stroke-width="2"
                  d="M1 4.304L3.696 7l6-6"
                />
              </svg>
            </div>
            <p class="checked-todo-item">${title}</p>
          </div>
          ${deleteTodoButton}
        </div>`;
    } else {
      element = `<div class="todo-item" id="${id}">
          <div class="todo-title" id="todo-title-${id}">
            <div class="unchecked-circle"></div>
            <p>${title}</p>
          </div>
          ${deleteTodoButton}
        </div>`;
    }

    const parsedElement = parser.parseFromString(element, 'text/xml');

    // couldn't add onclick dynamically using JS string (couldn't figure out why)
    const todoTitle = parsedElement.getElementById(`todo-title-${id}`);
    todoTitle.addEventListener("click", () => toggleTodo(id, !isCompleted));
    todoList.appendChild(parsedElement.firstChild);
  }

  const todoCountIndicator = `<div class="todo-item">
    <p id="todo-count-indicator" class="greyed-out-text">${todos.length} item(s) left</p>
    <p id="clear-completed-todos" class="greyed-out-text cursor-pointer">Clear Completed</p>
  </div>`;
  const todoCountIndicatorElement = parser.parseFromString(todoCountIndicator, 'text/xml');
  const clearCompletedTodosButton = todoCountIndicatorElement.getElementById("clear-completed-todos");
  clearCompletedTodosButton.addEventListener("click", () => clearCompletedTodos());

  todoList.appendChild(todoCountIndicatorElement.firstChild);
}

render();
