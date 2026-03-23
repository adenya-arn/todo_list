import Todo from "./todos.js";
import Project from "./projects.js";
import { projects, saveToLocalStorage } from "./app.js";

export function renderProjects(projects) {
  const projectContainer = document.getElementById("projects");
  projectContainer.innerHTML = "";

  projects.forEach((project, index) => {
    const wrapper = document.createElement("div");

    const btn = document.createElement("button");
    btn.textContent = project.name;

    if (project === currentProject) {
      btn.style.backgroundColor = "#f4a261";
    }

    btn.addEventListener("click", () => {
      setCurrentProject(project);
      renderProjects(projects);
      renderTodos(project);
    });

    //delete project button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // 🔥 prevent switching project

      deleteProject(index);
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(deleteBtn);

    projectContainer.appendChild(wrapper);
  });
}

export function renderTodos(project) {
  const todoContainer = document.querySelector(".todos");
  todoContainer.innerHTML = "";

  project.todos.forEach((todo, index) => {
    const div = document.createElement("div");

    div.addEventListener("click", () => {
      renderTodoDetails(todo);
    });
    div.classList.add("todo-item", todo.priority);

    const title = document.createElement("span");
    title.textContent = `${todo.title} - ${todo.dueDate}`;
    if (todo.priority === "high") {
      div.style.borderLeft = "5px solid red";
    } else if (todo.priority === "medium") {
      div.style.borderLeft = "5px solid orange";
    } else {
      div.style.borderLeft = "5px solid green";
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", (evnt) => {
      evnt.stopPropagation();
      project.removeTodo(index);
      saveToLocalStorage(projects);
      renderTodos(project); // re-render
    });

    div.appendChild(title);
    div.appendChild(deleteBtn);

    todoContainer.appendChild(div);
  });
}

let currentProject = null;

export function setCurrentProject(project) {
  currentProject = project;
}

export function setupTodoForm() {
  const form = document.getElementById("todo-form");

  form.addEventListener("submit", (evnt) => {
    evnt.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    const newTodo = new Todo(title, description, dueDate, priority);

    if (currentProject) {
      currentProject.addTodo(newTodo);
      saveToLocalStorage(projects);
    }

    form.reset();
    renderTodos(currentProject);
  });
}

export function setupProjectForm() {
  const form = document.getElementById("project-form");

  form.addEventListener("submit", (evnt) => {
    evnt.preventDefault();

    const name = document.getElementById("project-name").value;

    const newProject = new Project(name);
    projects.push(newProject);
    saveToLocalStorage(projects);

    form.reset();
    renderProjects(projects);
    renderTodos(newProject);
  });
}

export function renderTodoDetails(todo) {
  const details = document.getElementById("todo-details");
  details.innerHTML = "";

  const form = document.createElement("form");

  const title = document.createElement("input");
  title.value = todo.title;

  const desc = document.createElement("textarea");
  desc.value = todo.description;

  const due = document.createElement("input");
  due.type = "date";
  due.value = todo.dueDate;

  const priority = document.createElement("select");

  ["low", "medium", "high"].forEach((level) => {
    const option = document.createElement("option");
    option.value = level;
    option.textContent = level;

    if (level === todo.priority) {
      option.selected = true;
    }

    priority.appendChild(option);
  });

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";

  form.appendChild(title);
  form.appendChild(desc);
  form.appendChild(due);
  form.appendChild(priority);
  form.appendChild(saveBtn);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    todo.title = title.value;
    todo.description = desc.value;
    todo.dueDate = due.value;
    todo.priority = priority.value;

    saveToLocalStorage(projects);
    renderTodos(currentProject);
    renderTodoDetails(todo);
  });

  details.appendChild(form);
}

function deleteProject(index) {
  if (projects.length === 1) {
    alert("You must have at least one project!");
    return;
  }

  projects.splice(index, 1);

  // 👇 switch to another project
  setCurrentProject(projects[0]);

  saveToLocalStorage(projects);

  renderProjects(projects);
  renderTodos(projects[0]);
}
