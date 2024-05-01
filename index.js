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
  },
];
let todos = [...allTodos];

const filters = ["All", "Active", "Completed"];
let activeFilter = "All";

const isDesktop = window.matchMedia("(min-width: 600px)");
/**
 *
 * @param {MediaQueryList} isDesktop
 */
function desktopBackgroundImage(isDesktop) {
  const body = document.getElementById("app");
  const backgroundImage = document.getElementById("background-image");
  const currentTheme = body.classList[0];

  backgroundImage.src = isDesktop.matches
    ? `images/bg-desktop-${currentTheme}.jpg`
    : `images/bg-mobile-${currentTheme}.jpg`;
}

desktopBackgroundImage(isDesktop);

isDesktop.addEventListener("change", function () {
  desktopBackgroundImage(isDesktop);
});

function themeToggler() {
  const body = document.body;
  const currentTheme = body.classList[0];
  const backgroundImage = document.getElementById("background-image");
  const filter = document.getElementById("filter");
  const todoList = document.getElementById("todo-list");

  let newThemeMode;
  if (currentTheme === "dark") {
    newThemeMode = "light";

    filter.classList.add("light-shadow");
    todoList.classList.add("light-shadow");
  } else {
    newThemeMode = "dark";

    filter.classList.remove("light-shadow");
    todoList.classList.remove("light-shadow");
  }

  backgroundImage.src = isDesktop.matches
    ? `images/bg-desktop-${newThemeMode}.jpg`
    : `images/bg-mobile-${newThemeMode}.jpg`;
  body.classList.remove(currentTheme);
  body.classList.add(newThemeMode);
}

/**
 *
 * @param {{id: string, title: string, isCompleted: boolean}[]} newTodos
 */
function setTodos(newTodos) {
  todos = [...newTodos];
}

/**
 *
 * @param {string} id
 * @returns
 */
function findTodoById(id) {
  return allTodos.find((todo) => todo.id == id);
}

/**
 *
 * @param {string} id
 * @param {boolean} value
 * @returns
 */
function toggleTodo(id, value) {
  const todo = findTodoById(id);
  if (todo === undefined) return;
  todo.isCompleted = value;

  render();
}

/**
 *
 * @param {string} id
 * @returns
 */
function removeTodo(id) {
  const todo = findTodoById(id);
  if (todo === undefined) return;
  allTodos = [...allTodos.filter((todo) => todo.id !== id)];
  setTodos(allTodos);

  render();
}

function clearCompletedTodos() {
  allTodos = [...allTodos.filter((todo) => todo.isCompleted == false)];
  setTodos(allTodos);

  render();
}

/**
 *
 * @param {string} title
 */
function createTodo(title) {
  const orderedTodos = allTodos.sort((a, b) => b.id > a.id);

  const newId = orderedTodos.length === 0 ? 1 : orderedTodos[0].id + 1;
  const newTodo = { id: newId, title: title, isCompleted: false };
  allTodos.push(newTodo);
  setTodos(allTodos);

  render();
}

/**
 *
 * @param {string} newFilter
 * @returns
 */
function applyFilter(newFilter) {
  if (!filters.includes(newFilter)) return;
  if (activeFilter === newFilter) return;

  activeFilter = newFilter;

  let filteredTodos;
  switch (activeFilter) {
    case "Completed":
      filteredTodos = [
        ...allTodos.filter((todo) => {
          return todo.isCompleted;
        }),
      ];
      break;
    case "Active":
      filteredTodos = [
        ...allTodos.filter((todo) => {
          return !todo.isCompleted;
        }),
      ];
      break;
    default:
      filteredTodos = [...allTodos];
      break;
  }

  setTodos(filteredTodos);
  render();
}

/**
 *
 * @param {DragEvent} ev
 */
function dragoverHandler(ev) {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
}

const TODO_DROP_DATA = "todo-item-drop-data";
/**
 *
 * @param {DragEvent} ev
 */
function dropHandler(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData(TODO_DROP_DATA);

  const todoToRemove = findTodoById(data);
  const targetTodo = findTodoById(ev.target.id);

  // get target's index before any removal
  const index = allTodos.indexOf(targetTodo);

  // remove the data from allTodos
  allTodos = [...allTodos.filter((todo) => todo.id !== todoToRemove.id)];

  // insert it at the target's index
  allTodos.splice(index, 0, todoToRemove);

  setTodos(allTodos);
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
  const todoList = document.getElementById("todo-list");

  todoList.innerHTML = "";

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

    const todoItemElement = document.createElement("div");
    todoItemElement.classList.add("todo-item");
    todoItemElement.id = id;
    todoItemElement.draggable = true;

    todoItemElement.addEventListener("dragstart", function (ev) {
      ev.dataTransfer.setData(TODO_DROP_DATA, id); // id becomes string here (from number)
      ev.dataTransfer.effectAllowed = "move";
    });

    todoItemElement.ondrop = (event) => {
      const data = Number(event.dataTransfer.getData(TODO_DROP_DATA)); // converts id back into number
      if (data === id) return;
      dropHandler(event);
    };

    todoItemElement.ondragover = (event) => dragoverHandler(event);

    if (isCompleted) {
      todoItemElement.innerHTML = `
          <div class="todo-title" onclick="toggleTodo(${id}, ${!isCompleted})">
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
      `;
    } else {
      todoItemElement.innerHTML = `
        <div class="todo-title" onclick="toggleTodo(${id}, ${!isCompleted})">
            <div class="unchecked-circle"></div>
            <p class="unchecked-todo-title">${title}</p>
        </div>
        ${deleteTodoButton}
      `;
    }

    todoList.appendChild(todoItemElement);
  }

  const activeTodosCount = [...allTodos.filter((todo) => !todo.isCompleted)]
    .length;
  const todoCountIndicator = document.createElement("div");
  todoCountIndicator.classList.add("todo-item");
  todoCountIndicator.innerHTML = `
    <p id="todo-count-indicator" class="greyed-out-text">${activeTodosCount} item(s) left</p>
    <p id="clear-completed-todos" class="greyed-out-text cursor-pointer" onclick="clearCompletedTodos()">Clear Completed</p>
  `;
  todoList.appendChild(todoCountIndicator);

  const filtersElement = document.getElementById("filter");
  filtersElement.innerHTML = "";
  for (let i = 0; i < filters.length; ++i) {
    const filter = filters[i];
    let filterHtml;
    if (activeFilter === filter) {
      filterHtml = `<p id="${filter}" class="greyed-out-text cursor-pointer active-filter-item text-bold">${filter}</p>`;
    } else {
      filterHtml = `<p id="${filter}" class="greyed-out-text cursor-pointer filter-item text-bold">${filter}</p>`;
    }

    const filterElement = parser.parseFromString(filterHtml, "text/xml");
    filterElement.firstChild.addEventListener("click", () =>
      applyFilter(filter)
    );
    filtersElement.appendChild(filterElement.firstChild);
  }
}

function firstRender() {
  // sort todos based on its isCompleted value then its ID's on first render
  allTodos = [
    ...allTodos.sort((a, b) => {
      // negative value means the first element (a) will be ordered first in the list
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? -1 : 1;
      }

      return b.id - a.id;
    }),
  ];

  let filteredTodos;
  switch (activeFilter) {
    case "Completed":
      filteredTodos = [
        ...allTodos.filter((todo) => {
          return todo.isCompleted;
        }),
      ];
      break;
    case "Active":
      filteredTodos = [
        ...allTodos.filter((todo) => {
          return !todo.isCompleted;
        }),
      ];
      break;
    default:
      filteredTodos = [...allTodos];
      break;
  }

  setTodos(filteredTodos);

  const body = document.getElementById("app");
  body.classList.add("dark");

  const backgroundImage = document.getElementById("background-image");
  backgroundImage.src = isDesktop.matches
    ? `images/bg-desktop-dark.jpg`
    : `images/bg-mobile-dark.jpg`;

  render();
}

firstRender();
