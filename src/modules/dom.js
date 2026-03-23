import { projects, saveToLocalStorage } from "./app.js";
import Todo from "./todos.js";
import Project from "./projects.js";

const projectsContainer = document.getElementById("projects");
const todosContainer = document.querySelector(".todos");
const todoDetails = document.getElementById("todo-details");
const projectFormContainer = document.getElementById("project-form-container");
const todoFormContainer = document.getElementById("todo-form-container");
const toggleProjectBtn = document.getElementById("toggle-project-form");
const toggleTodoBtn = document.getElementById("toggle-todo-form");
const currentProjectName = document.getElementById("current-project-name");

let currentProject = projects[0]; // default selected project

// Toggle project form
toggleProjectBtn.addEventListener("click", () => {
  projectFormContainer.style.display =
    projectFormContainer.style.display === "none" ? "block" : "none";
});

// Toggle todo form
toggleTodoBtn.addEventListener("click", () => {
  if (!currentProject) return alert("Select a project first!");
  todoFormContainer.style.display =
    todoFormContainer.style.display === "none" ? "block" : "none";
});

export function setCurrentProject(project) {
  currentProject = project;
  if (!project) {
    currentProjectName.textContent = "No Project";
    todosContainer.innerHTML = "";
    return;
  }
  currentProjectName.textContent = project.name;
  renderTodos(currentProject);
  todoFormContainer.style.display = "none"; // hide todo form when switching
}

export function renderProjects(projects) {
  projectsContainer.innerHTML = "";

  projects.forEach((project, index) => {
    const projectDiv = document.createElement("div");

    const btn = document.createElement("button");
    btn.textContent = project.name;
    btn.addEventListener("click", () => setCurrentProject(project));

    const delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.style.backgroundColor = "#e76f51";
    delBtn.style.marginLeft = "0.25rem";
    delBtn.addEventListener("click", () => {
      projects.splice(index, 1);
      saveToLocalStorage(projects);

      if (projects.length === 0) {
        const newDefault = new Project("Default");
        projects.push(newDefault);
      }

      setCurrentProject(projects[0]);
      renderProjects(projects);
    });

    projectDiv.appendChild(btn);
    projectDiv.appendChild(delBtn);
    projectsContainer.appendChild(projectDiv);
  });
}

export function renderTodos(project) {
  todosContainer.innerHTML = "";

  if (!project) return;

  project.todos.forEach((todo, index) => {
    const card = document.createElement("div");
    card.innerHTML = `<h3>${todo.title}</h3>
                      <p>Due: ${todo.dueDate || "Not set"}</p>`;

    // Priority color
    switch (todo.priority) {
      case "low":
        card.style.borderLeft = "5px solid #2a9d8f";
        break;
      case "medium":
        card.style.borderLeft = "5px solid #f4a261";
        break;
      case "high":
        card.style.borderLeft = "5px solid #f70e06ff";
        break;
    }

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      project.removeTodo(index);
      saveToLocalStorage(projects);
      renderTodos(project);
      todoDetails.classList.remove("active");
    });

    card.appendChild(delBtn);

    card.addEventListener("click", () => {
      todoDetails.classList.add("active");
      todoDetails.innerHTML = `
        <button id="close-details">Close</button>
        <h3>${todo.title}</h3>
        <p>${todo.description || "No description"}</p>
        <p><strong>Due:</strong> ${todo.dueDate || "Not set"}</p>
        <p><strong>Priority:</strong> ${todo.priority}</p>
        ${todo.notes.length > 0 ? `<p><strong>Notes:</strong> ${todo.notes.join(", ")}</p>` : ""}
      `;
      document.getElementById("close-details").addEventListener("click", () => {
        todoDetails.classList.remove("active");
      });
    });

    todosContainer.appendChild(card);
  });
}

export function setupProjectForm() {
  const form = document.getElementById("project-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("project-name");
    if (!input.value.trim()) return;
    const newProject = new Project(input.value.trim());
    projects.push(newProject);
    input.value = "";
    saveToLocalStorage(projects);
    renderProjects(projects);
  });
}

export function setupTodoForm() {
  const form = document.getElementById("todo-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!currentProject) return alert("Select a project first!");

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    if (!title.trim()) return;

    const newTodo = new Todo(
      title.trim(),
      description.trim(),
      dueDate,
      priority,
    );
    currentProject.addTodo(newTodo);

    form.reset();
    saveToLocalStorage(projects);
    renderTodos(currentProject);
  });
}
