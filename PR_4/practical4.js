"use strict";

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

addTaskButton.addEventListener("click", function() {
    const taskText = taskInput.value.trim();

    if (taskText) {
        const li = document.createElement("li");
        li.textContent = taskText;
        
        taskList.appendChild(li);
        
        console.log(`Додано завдання: "${taskText}"`);
        
        taskInput.value = "";
    } else {
        console.warn("Спроба додати порожнє завдання");
    }
});


taskList.addEventListener("click", function(event) {
    if (event.target.nodeName === "LI") {
        const removedTask = event.target.textContent;
        
        event.target.remove();
        
        console.log(`Завдання видалено: "${removedTask}"`);
    }
});