"use strict";

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const header = document.getElementById("header");

function loadTasks() {
    const tasksJSON = localStorage.getItem("tasks");
    return tasksJSON ? JSON.parse(tasksJSON) : [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks() {
    const tasks = loadTasks();
    taskList.innerHTML = "";

    tasks.forEach((task, index) => { 
        const li = document.createElement("li"); 
        li.textContent = task; 
        li.setAttribute("data-index", index); 
        taskList.appendChild(li);
    });
}

addTaskButton.addEventListener("click", function() {
    const taskText = taskInput.value.trim();

    if (taskText !== "") { 
        const tasks = loadTasks();
        tasks.push(taskText);
        saveTasks(tasks);
        displayTasks();
        taskInput.value = "";
    }
});

taskList.addEventListener("click", function(event) {
    if (event.target && event.target.nodeName === "LI") {
        const index = event.target.getAttribute("data-index");
        let tasks = loadTasks();
        
        tasks.splice(index, 1);
        saveTasks(tasks);
        displayTasks();
        console.log("Завдання видалено");
    }
});

header.addEventListener("click", function(event) {
    addTaskButton.remove();
});

displayTasks();