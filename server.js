const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const tasksFile = path.join(__dirname, "data", "tasks.json");

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Utility function to read tasks
function readTasks() {
  try {
    const data = fs.readFileSync(tasksFile, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// ✅ Utility function to write tasks
function writeTasks(tasks) {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

// ------------------ Task 1: Create New Task (POST) ------------------
app.post("/api/tasks", (req, res) => {
  const { title, description, priority } = req.body;

  // Validation
  if (!title || !priority) {
    return res.status(400).json({ error: "Title and priority are required" });
  }

  const validPriorities = ["low", "medium", "high", "urgent"];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({ error: "Invalid priority value" });
  }

  const newTask = {
    taskId: "TASK-" + Date.now(),
    title,
    description: description || "",
    priority,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const tasks = readTasks();
  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json(newTask);
});

// ------------------ Task 2: Get All Tasks (GET) ------------------
app.get("/api/tasks", (req, res) => {
  try {
    const tasks = readTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to load tasks" });
  }
});

// ------------------ Start Server ------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
