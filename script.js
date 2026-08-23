// === GET ALL ELEMENTS ===
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearAllBtn = document.getElementById('clearAllBtn');

// === LOAD SAVED TASKS ===
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

// === INITIALIZE ===
renderTasks();

// === EVENT LISTENERS ===
addBtn.addEventListener('click', addNewTask);
taskInput.addEventListener('keydown', e => e.key === 'Enter' && addNewTask());
clearAllBtn.addEventListener('click', clearAllTasks);

// === ADD NEW TASK ===
function addNewTask() {
  const text = taskInput.value.trim();
  
  if (!text) {
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: Date.now(),
    text: text,
    completed: false
  });

  saveTasks();
  taskInput.value = '';
  renderTasks();
}

// === RENDER ALL TASKS ===
function renderTasks() {
  taskList.innerHTML = '';

  // Update count
  taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;

  // Empty state
  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        🎯 No tasks yet!<br>
        Add your first task above to get started.
      </div>
    `;
    return;
  }

  // Create each task element
  tasks.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskEl.innerHTML = `
      <div class="checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}">
        ${task.completed ? '✓' : ''}
      </div>
      <span class="task-text">${escapeHtml(task.text)}</span>
      <button class="delete-task" data-id="${task.id}">🗑️</button>
    `;
    taskList.appendChild(taskEl);
  });

  // Attach toggle & delete events
  document.querySelectorAll('.checkbox').forEach(box => {
    box.addEventListener('click', toggleTask);
  });
  document.querySelectorAll('.delete-task').forEach(btn => {
    btn.addEventListener('click', deleteTask);
  });
}

// === TOGGLE COMPLETED ===
function toggleTask(e) {
  const id = parseInt(e.target.dataset.id);
  tasks = tasks.map(t => 
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

// === DELETE ONE TASK ===
function deleteTask(e) {
  const id = parseInt(e.target.dataset.id);
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// === CLEAR ALL TASKS ===
function clearAllTasks() {
  if (tasks.length === 0) return;
  if (confirm('Delete ALL tasks? This cannot be undone!')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// === SAVE TO STORAGE ===
function saveTasks() {
  localStorage.setItem('myTasks', JSON.stringify(tasks));
}

// === PREVENT HTML INJECTION (safety) ===
function escapeHtml(text) {
  const temp = document.createElement('div');
  temp.textContent = text;
  return temp.innerHTML;
}
