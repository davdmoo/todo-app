const todos = [
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

const parser = new DOMParser();
const todoList = document.getElementById("todo-list");
for (let i = 0; i < todos.length; ++i) {
  const todo = todos[i];
  const { id, title, isCompleted } = todo;

  const deleteTodoButton = `<svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            class="delete-todo-button"
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
          <div class="todo-title">
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
          <div class="todo-title">
            <div class="unchecked-circle"></div>
            <p>${title}</p>
          </div>
          ${deleteTodoButton}
        </div>`;
  }

  todoList.appendChild(parser.parseFromString(element, 'text/xml').firstChild);
}

const todoCountIndicator = `<div class="todo-item">
  <p id="todo-count-indicator">${todos.length} item(s) left</p>
  <p>Clear Completed</p>
</div>`;
todoList.appendChild(parser.parseFromString(todoCountIndicator, 'text/xml').firstChild);
