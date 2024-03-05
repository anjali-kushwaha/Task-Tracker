
class Task {
    constructor(title, description, dueDate, priority, status = 'pending') {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
        this.id = Date.now();
    }
}

// retrieved value from loca
let tasks = localStorage.getItem('tasks') || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}



function renderTasks(filteredTasks = tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = task.status === 'completed' ? 'task completed' : 'task';
        taskElement.innerHTML = `
            <h3>${task.title} [${task.priority}] ${task.status === 'completed' ? '(Completed)' : ''}</h3>
            <p>${task.description}</p>
            <p>Due: ${task.dueDate}</p>
            <button onclick="TaskCompletion(${task.id})">${task.status === 'completed' ? 'Undo' : 'Complete'}</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
            <button onclick="editPrompt(${task.id})">Edit</button>
        `;
        taskList.appendChild(taskElement);
    });
}

document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;

    if (!title.trim() || !description.trim() || !dueDate.trim()) {
        customAlert("Please fill out all fields."); 
        return;
    }

    addTask(title, description, dueDate, priority);
    this.reset(); 
});


function addTask(title, description, dueDate, priority) {
    const newTask = new Task(title, description, dueDate, priority);
    tasks.push(newTask);
    saveTasks();
    renderTasks();
}

function TaskCompletion(taskId) {
    const taskIndex = tasks.findIndex(task => task.id == taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = tasks[taskIndex].status === 'pending' ? 'completed' : 'pending';
        saveTasks();
        renderTasks();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id != taskId);
    saveTasks();
    renderTasks();
}

function editPrompt(taskId) {
    
    const taskIndex = tasks.findIndex(task => task.id == taskId);
    
    if (taskIndex === -1) return;
    const task = tasks[taskIndex];

    const newTitle = prompt('New task title', task.title);
    const newDescription = prompt('New task description', task.description);
    const newDueDate = prompt('New task due date', task.dueDate);
    const newPriority = prompt('New task priority', task.priority);
    
    if (newTitle && newDescription && newDueDate && newPriority) {
        editTask(taskId, newTitle, newDescription, newDueDate, newPriority);
    }
}

function editTask(taskId, title, description, dueDate, priority) {
    const taskIndex = tasks.findIndex(task => task.id == taskId);
    if (taskIndex > -1) {
        tasks[taskIndex].title = title;
        tasks[taskIndex].description = description;
        tasks[taskIndex].dueDate = dueDate;
        tasks[taskIndex].priority = priority;
        saveTasks();
        renderTasks();
    }
}


function sortTasks(sortBy) {
    if (sortBy === 'dueDate') {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } 
    else if (sortBy === 'priority') {
        const priorityOrder = {High: 1, Medium: 2, Low: 3};
        tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } 
    else if (sortBy === 'title') {
        tasks.sort((a, b) => a.title.localeCompare(b.title));
    }
    renderTasks();
}

document.getElementById('sortSelect').addEventListener('change', function() {
    sortTasks(this.value);
});




function filterTasks(filterBy, value) {
    let filteredTasks = tasks;
    if (filterBy === 'status' && value !== 'all') {
        filteredTasks = tasks.filter(task => task.status === value);
    } 
    else if (filterBy === 'priority' && value !== 'all') {
        filteredTasks = tasks.filter(task => task.priority === value);
    }
    renderTasks(filteredTasks);
}

document.getElementById('filterStatus').addEventListener('change', function() {
    filterTasks('status', this.value);
});
