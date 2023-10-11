import { v4 as uuidV4 } from "uuid";
import { saveTask } from "./test";
import { Task } from "./types";

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
  editButton.innerText = "Edit";
  editButton.onclick = editTask;

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveTask(tasks);
  });
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  label.append(checkbox, task.title, " ", deleteButton, " ", editButton);
  item.append(label);
  list?.append(item);
  saveTask(tasks);
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

function editTask(e: Event) {
  const target = e.target as HTMLButtonElement;
  const id = target.parentElement?.parentElement?.id;
  if (!id) return;
  const deleteTaskIndex = tasks.findIndex((task) => task.id === id);
  if (deleteTaskIndex === -1) return;
  const inputValue = input?.value;
  if (!inputValue || inputValue == "") return;
  const editedTask = { ...tasks[deleteTaskIndex], title: inputValue };
  tasks.splice(deleteTaskIndex, 1, editedTask);

  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  const deleteButton = document.createElement("button");
  const editButton = document.createElement("button");

  deleteButton.innerText = "Delete";
  deleteButton.onclick = removeTask;
  editButton.innerText = "Edit";
  editButton.onclick = editTask;

  item.id = editedTask.id;
  checkbox.type = "checkbox";
  checkbox.checked = editedTask.completed;

  label.append(checkbox, editedTask.title, " ", deleteButton, " ", editButton);
  item.append(label);
  document.getElementById(id)?.replaceChildren(item);
  input.value = "";

  localStorage.setItem("TASKS", JSON.stringify(tasks));
}
