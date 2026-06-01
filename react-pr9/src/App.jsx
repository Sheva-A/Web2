import { useState } from "react";
import "./App.css";

export default function App() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  const addTask = () => {
    if (!text.trim()) return;
    setTasks([...tasks, { id: Date.now(), text, done: false }]);
    setText("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "Active") return !task.done;
    if (filter === "Done") return task.done;
    return true;
  });

  return (
    <div className="todo-container">
      <h1>Mini ToDo</h1>
      
      <div className="todo-input-block">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введіть задачу..."
        />
        <button className="btn-main" onClick={addTask}>Add</button>
      </div>

      <div className="todo-filters">
        <button 
          className={filter === "All" ? "active" : ""} 
          onClick={() => setFilter("All")}
        >
          All
        </button>
        <button 
          className={filter === "Active" ? "active" : ""} 
          onClick={() => setFilter("Active")}
        >
          Active
        </button>
        <button 
          className={filter === "Done" ? "active" : ""} 
          onClick={() => setFilter("Done")}
        >
          Done
        </button>
      </div>

      <ul className="todo-list">
        {filteredTasks.map(task => (
          <li key={task.id} className="todo-item">
            <span
              onClick={() => toggleTask(task.id)}
              style={{ textDecoration: task.done ? "line-through" : "none" }}
            >
              {task.text}
            </span>
            <button className="btn-delete" onClick={() => removeTask(task.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}