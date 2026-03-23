import Todo from "./todos.js";
import Project from "./projects.js";

const storedProjects = loadFromLocalStorage();

const projects = storedProjects;

const defaultProject = new Project("Default");
projects.push(defaultProject);

function saveToLocalStorage(projects) {
  localStorage.setItem("todoApp", JSON.stringify(projects));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("todoApp");

  if (!data) return null;

  const parsed = JSON.parse(data);

  // rebuild classes
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
export { projects, defaultProject, saveToLocalStorage, loadFromLocalStorage };
