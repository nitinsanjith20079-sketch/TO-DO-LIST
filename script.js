// ============================================
// STEP 1: Get all the HTML elements we need
// ============================================

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// ============================================
// STEP 2: Our tasks array (will be saved in localStorage)
// ============================================

let tasks = [];
let currentFilter = 'all'; // 'all', 'active', or 'completed'

// ============================================
// STEP 3: Load tasks from localStorage when page loads
// ============================================

loadTasks();

// ============================================
// STEP 4: Event Listeners
// ============================================

// Add task when "Add Task" button is clicked
addBtn.addEventListener('click', addTask);

// Add task when Enter key is pressed in input
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Clear completed tasks
clearCompletedBtn.addEventListener('click', clearCompleted);

// Filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove 'active' class from all filter buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add 'active' class to clicked button
        this.classList.add('active');
        // Update current filter
        currentFilter = this.dataset.filter;
        // Re-render tasks
        renderTasks();
    });
});

// ============================================
// STEP 5: Functions
// ============================================

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Don't add empty tasks
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create new task object
    const newTask = {
        id: Date.now(), // Unique ID based on timestamp
        text: taskText,
        completed: false
    };
    
    // Add to tasks array
    tasks.push(newTask);
    
    // Clear input field
    taskInput.value = '';
    
    // Save to localStorage
    saveTasks();
    
    // Re-render the task list
    renderTasks();
}

// Delete a task
function deleteTask(id) {
    // Filter out the task with the matching id
    tasks = tasks.filter(task => task.id !== id);
    
    // Save to localStorage
    saveTasks();
    
    // Re-render the task list
    renderTasks();
}

// Toggle task completion status
function toggleTask(id) {
    // Find the task and toggle its 'completed' property
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    // Save to localStorage
    saveTasks();
    
    // Re-render the task list
    renderTasks();
}

// Clear all completed tasks
function clearCompleted() {
    // Keep only tasks that are NOT completed
    tasks = tasks.filter(task => !task.completed);
    
    // Save to localStorage
    saveTasks();
    
    // Re-render the task list
    renderTasks();
}

// Render tasks based on current filter
function renderTasks() {
    // Clear the task list
    taskList.innerHTML = '';
    
    // Filter tasks based on current filter
    let filteredTasks = tasks;
    
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    // Check if there are no tasks
    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        
        if (tasks.length === 0) {
            emptyMessage.textContent = '📭 No tasks yet. Add one above!';
        } else if (currentFilter === 'active') {
            emptyMessage.textContent = '🎉 All tasks completed!';
        } else if (currentFilter === 'completed') {
            emptyMessage.textContent = '📋 No completed tasks yet.';
        }
        
        taskList.appendChild(emptyMessage);
    } else {
        // Loop through each task and create HTML for it
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (task.completed) {
                li.classList.add('completed');
            }
            
            // Create checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', function() {
                toggleTask(task.id);
            });
            
            // Create task text
            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;
            
            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function() {
                deleteTask(task.id);
            });
            
            // Add everything to the list item
            li.appendChild(checkbox);
            li.appendChild(taskText);
            li.appendChild(deleteBtn);
            
            // Add the list item to the task list
            taskList.appendChild(li);
        });
    }
    
    // Update the task count
    updateTaskCount();
}

// Update the task count in the footer
function updateTaskCount() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} remaining`;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        // Add some example tasks for first-time users
        tasks = [
            { id: 1, text: 'Learn JavaScript', completed: false },
            { id: 2, text: 'Build a to-do list app', completed: false },
            { id: 3, text: 'Deploy to GitHub', completed: false }
        ];
        saveTasks();
    }
    renderTasks();
}
