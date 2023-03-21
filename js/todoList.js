const todoList = function () {
  const todoBtn = document.querySelector('.todo-btn'),
    todoMenu = document.querySelector('.todo-menu'),
    todoInput = document.querySelector('.todo-input'),
    todoTasks = document.querySelector('.todo-tasks'),
    todoPlaceholder = document.querySelector('.todo-placeholder');

  todoBtn.addEventListener('click', () => {
    todoMenu.classList.toggle('active-menu');
  });

  let todoCount = 0;

  function addTask() {
    todoTasks.innerHTML += `<li class="todo-task">${todoInput.value}<button class="todo-delete"></button></li>`;
    todoInput.value = '';
    todoCount++;
    checkPlaceholder();
  }

  function checkPlaceholder() {
    if (todoCount === 0) todoPlaceholder.style.display = 'block';
    else todoPlaceholder.style.display = 'none';
  }

  todoTasks.addEventListener('click', (e) => {
    if (e.target.classList.contains('todo-delete')) {
      const task = e.target.closest('li');
      task.remove();
      todoCount--;
      checkPlaceholder();
    }
    if (e.target.classList.contains('todo-task') || e.target.classList.contains('todo-complete')) {
      e.target.classList.toggle('todo-complete');
      e.target.classList.toggle('todo-task');
    }
  });

  todoInput.addEventListener('change', addTask);
};

export default todoList;
