let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const alertBox = document.getElementById("alertBox");

window.onload = () => renderTasks();

function showAlert(message, type = "success") {
  alertBox.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  setTimeout(() => (alertBox.innerHTML = ""), 3000);
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    showAlert("Task cannot be empty!", "danger");
    return;
  }

  const newTask = {
    text: taskText,
    completed: false,
    createdAt: new Date().toLocaleString(),
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  showAlert("✅ Task added successfully!");
}

function deleteTask(index) {
  if (!confirm("Are you sure you want to delete this task?")) return;
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  showAlert(" Task deleted!", "warning");
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function clearAll() {
  if (!confirm("⚠ Are you sure you want to delete ALL tasks?")) return;
  tasks = [];
  saveTasks();
  renderTasks();
  showAlert("All tasks cleared!", "danger");
}

function clearCompleted() {
  if (!tasks.some(t => t.completed)) {
    showAlert("❌ No completed tasks to delete.", "info");
    return;
  }
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
  showAlert("✅ Completed tasks deleted.");
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <input type="checkbox" class="form-check-input me-2" onclick="toggleComplete(${index})" ${task.completed ? "checked" : ""}>
        <span style="text-decoration: ${task.completed ? "line-through" : "none"};">
          ${task.text}
        </span><br/>
        <small class="text-muted">Created: ${task.createdAt}</small>
      </div>
      <button class="btn btn-sm btn-danger" onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(li);
  });

  taskCount.textContent = tasks.length;
}
