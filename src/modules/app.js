// src/modules/app.js
import Todo from "./todos.js";
import Project from "./projects.js";

const projects = [];

// Load from localStorage
function loadFromLocalStorage() {
  const data = localStorage.getItem("todoApp");
  if (!data) return [];

  const parsed = JSON.parse(data);

  return parsed.map((proj) => {
    const project = new Project(proj.name);
    proj.todos.forEach((t) => {
      const todo = new Todo(t.title, t.description, t.dueDate, t.priority);
      todo.completed = t.completed;
      project.addTodo(todo);
    });
    return project;
  });
}

// Save to localStorage
function saveToLocalStorage() {
  localStorage.setItem("todoApp", JSON.stringify(projects));
}

// Initialize projects array
const storedProjects = loadFromLocalStorage();
projects.push(...storedProjects);

// Create default project if none exist
let defaultProject = projects.find((p) => p.name === "Default");
if (!defaultProject) {
  defaultProject = new Project("Default Project");
  projects.push(defaultProject);
}

export { projects, defaultProject, saveToLocalStorage };
