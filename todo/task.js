const form = document.getElementById('tasks__form');
const taskList = document.getElementById('tasks__list');


function createTODO(text) {
    const task = document.createElement('div');
    task.classList.add('task');

    const taskTitle = document.createElement('div');
    taskTitle.classList.add('task__title');
    taskTitle.textContent = text;

    const taskRemove = document.createElement('a');
    taskRemove.classList.add('task__remove');
    taskRemove.innerHTML = '&times;';

    taskList.appendChild(task);
    task.appendChild(taskTitle);
    task.appendChild(taskRemove);
    
    taskRemove.addEventListener('click', () => {
        task.remove();
        tempTodos = JSON.parse(localStorage.getItem('tasks'));
        index = tempTodos.indexOf(text);
        // Если элемент существует в локальном хранилище
        if (index !== -1) {
            tempTodos.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tempTodos));
        }
        
    })
}

// Получаю заметки из локального хранилища
let todos = JSON.parse(localStorage.getItem('tasks'));
// Если заметок нет - создаю пустой список заметок
if (!todos) {
    todos = [];
}

// Отрисовываю уже имеющиеся заметки из локального хранилища
todos.forEach(elem => {
    createTODO(elem)
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    textInput = form.elements['task__input'].value
    todos.push(textInput)
    // Добавляю заметку в localstorage
    localStorage.setItem('tasks', JSON.stringify(todos))
    // Создаю заметку
    createTODO(textInput)
    
    form.reset()
})

