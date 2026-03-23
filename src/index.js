import "./styles.css";

import { projects, defaultProject } from "./modules/app.js";
import Todo from "./modules/todos.js";
import {
  renderProjects,
  renderTodos,
  setupTodoForm,
  setCurrentProject,
} from "./modules/dom.js";

import { setupProjectForm } from "./modules/dom.js";
//test data
const todo1 = new Todo(
  "Learn Webpack",
  "Finish todo project",
  "2026-03-25",
  "high",
);
defaultProject.addTodo(todo1);

setCurrentProject(defaultProject);

renderProjects(projects);
renderTodos(defaultProject);

setupTodoForm();
setupProjectForm();
