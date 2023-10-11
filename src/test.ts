export function saveTask(tasks: any) {
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}
