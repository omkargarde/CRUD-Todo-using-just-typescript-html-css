import { v4 as uuidV4 } from "uuid";

type Task = { id: string; title: string; completed: boolean; createdAt: Date };
const list = document.querySelector<HTMLUListElement>("#list");
const form = document.querySelector<HTMLFormElement>("#new-task-form");
const input = document.querySelector<HTMLInputElement>("#new-task-title");
const tasks: Task[] = loadTasks();
tasks.forEach(addListItem);
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input?.value == "" || input?.value == null) return;
  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };
  tasks.push(newTask);
  addListItem(newTask);
  input.value = "";
});
function addListItem(task: Task) {
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  const deleteButton = document.createElement("button");
  const editButton = document.createElement("button");

  item.id = task.id;
  deleteButton.innerText = "Delete";
  deleteButton.onclick = removeTask;

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveTask();
  });
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  label.append(checkbox, task.title, " ", deleteButton, " ", editButton);
  item.append(label);
  list?.append(item);
  saveTask();
}

function saveTask() {
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const taskJson = localStorage.getItem("TASKS");
  return taskJson ? JSON.parse(taskJson) : [];
}

function removeTask(e: Event) {
  const target = e.target as HTMLButtonElement;
  const id = target.parentElement?.parentElement?.id;
  if (id == null) return;
  document.getElementById(id)?.remove();
  const deleteTaskIndex = tasks.findIndex((task) => task.id === id);
  if (deleteTaskIndex !== -1) {
    tasks.splice(deleteTaskIndex, 1);
  }
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}
