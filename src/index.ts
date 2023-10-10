import { v4 as uuidV4 } from "uuid";

type Task = { id: string, title: string, completed: boolean, createdAt: Date }
const list = document.querySelector<HTMLUListElement>("#list");
const form = document.querySelector<HTMLFormElement>("#new-task-form");
const input = document.querySelector<HTMLInputElement>("#new-task-title");
const tasks: Task[] = loadTasks();
tasks.forEach(addListItem)
form?.addEventListener("submit", e => {
    e.preventDefault();
    if (input?.value == "" || input?.value == null) return;
    const newTask: Task = {
        id: uuidV4(),
        title: input.value,
        completed: false,
        createdAt: new Date()
    }
    tasks.push(newTask);
    addListItem(newTask);
    input.value = "";
})

function addListItem(task: Task) {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    const deleteButton = document.createElement("button");
    deleteButton.id = task.id;
    deleteButton.innerText = "delete";
    deleteButton.onclick = removeTask
    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTask();
    })
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    label.append(checkbox, task.title, " ", deleteButton);
    item.append(label);
    list?.append(item);
}

function saveTask() {
    localStorage.setItem("TASKS", JSON.stringify(tasks));
}
function loadTasks(): Task[] {
    const taskJson = localStorage.getItem("TASKS")
    if (taskJson == null) return [];
    return JSON.parse(taskJson);
}

function removeTask(e: Event) {
    const target = e.target as HTMLButtonElement;
    document.getElementById(target.id)?.parentElement?.remove();
    const deletedtask = tasks.filter((task) => task.id !== target.id);
    localStorage.setItem("TASKS", JSON.stringify(deletedtask));
}
