export default class Project {
  constructor(name) {
    this.name = name;
    this.todos = []; // array of Todo objects
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  removeTodo(todoIndex) {
    this.todos.splice(todoIndex, 1);
  }
}
