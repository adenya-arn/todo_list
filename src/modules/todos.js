export default class Todo {
  constructor(
    title,
    description,
    dueDate,
    priority,
    notes = [],
    checklist = [],
  ) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
    this.completed = false;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }

  addNote(note) {
    this.notes.push(note);
  }

  addChecklistItem(item) {
    this.checklist.push({ item: item, done: false });
  }

  toggleChecklistItem(index) {
    if (this.checklist[index]) {
      this.checklist[index].done = !this.checklist[index].done;
    }
  }
}
