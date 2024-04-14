let allTodos = [
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
let todos = [...allTodos];

const filters = ["All", "Active", "Completed"];
let activeFilter = "All";

function findTodoById(id) {
  return allTodos.find((todo) => todo.id == id);
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
  allTodos = [...allTodos.filter((todo) => todo.id !== id)];

  render();
}

function clearCompletedTodos() {
  allTodos = [...allTodos.filter((todo) => todo.isCompleted == false)];
  render();
}

function createTodo(title) {
  const orderedTodos = allTodos.sort((a, b) => b.id > a.id);

  const newId = orderedTodos.length === 0 ? 1 : orderedTodos[0].id + 1;
  const newTodo = { id: newId, title: title, isCompleted: false };
  allTodos.push(newTodo);

  render();
}

function applyFilter(newFilter) {
  if (!filters.includes(newFilter)) return;
  if (activeFilter === newFilter) return;

  activeFilter = newFilter;
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

const parser = new DOMParser();
function render() {
  console.log("render");
  const todoList = document.getElementById("todo-list");

  // removes existing HTML in cases where we need to re-render
  todoList.innerHTML = "";

  switch (activeFilter) {
    case "Completed":
      todos = [...allTodos.filter((todo) => {
        return todo.isCompleted;
      })];
      break;
    case "Active":
      todos = [...allTodos.filter((todo) => {
        return !todo.isCompleted;
      })];
      break;
    default:
      todos = [...allTodos];
      break;
  }

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

  const activeTodosCount = [...allTodos.filter((todo) => !todo.isCompleted)].length;
  const todoCountIndicator = `<div class="todo-item">
    <p id="todo-count-indicator" class="greyed-out-text">${activeTodosCount} item(s) left</p>
    <p id="clear-completed-todos" class="greyed-out-text cursor-pointer">Clear Completed</p>
  </div>`;
  const todoCountIndicatorElement = parser.parseFromString(todoCountIndicator, 'text/xml');
  const clearCompletedTodosButton = todoCountIndicatorElement.getElementById("clear-completed-todos");
  clearCompletedTodosButton.addEventListener("click", () => clearCompletedTodos());

  todoList.appendChild(todoCountIndicatorElement.firstChild);

  const filtersElement = document.getElementById("filter");
  filtersElement.innerHTML = "";
  for (let i = 0; i < filters.length; ++i) {
    const filter = filters[i];
    let filterHtml;
    if (activeFilter === filter) {
      filterHtml = `<p id="${filter}" class="greyed-out-text cursor-pointer active-filter-item">${filter}</p>`;
    } else {
      filterHtml = `<p id="${filter}" class="greyed-out-text cursor-pointer filter-item">${filter}</p>`;
    }

    const filterElement = parser.parseFromString(filterHtml, 'text/xml');
    filterElement.firstChild.addEventListener("click", () => applyFilter(filter));
    filtersElement.appendChild(filterElement.firstChild);
  }
}

render();
