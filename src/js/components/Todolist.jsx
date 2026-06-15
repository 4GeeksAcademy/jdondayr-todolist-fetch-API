import React, { useEffect, useState } from "react";

const Todolist = () => {

    // useStates
    const [taskInputValue, setTaskInputValue] = useState("");
    const [itemsLeft, setItemsLeft] = useState(0);
    const [tasks, setTasks] = useState([]);

    // Function to add task to the list
    const addTask = (ev) => {
        if (ev.key === "Enter") {
            if (taskInputValue === "" || tasks.includes(taskInputValue)) return;
            setTasks([...tasks, taskInputValue]);
            setTaskInputValue("");
            setItemsLeft(prev => prev + 1);
            let newTask = {
                "label": taskInputValue,
                "is_done": false
            }
            addTaskToDatabase(newTask);
        }
    }

    // Async function to add tasks to database
    async function addTaskToDatabase(task) {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/todos/juanitodr94", {
                method: "POST",
                body: JSON.stringify(task),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            getUserTasks()
        }
        catch (error) {
            console.log("There was an error:", error)
        }
    }

    // Remove functions
    const removeTaskFromTasks = (indexToRemove) => {
        if (itemsLeft < 0) return;
        const updatedTasks = tasks.filter((task, index) => index != indexToRemove);
        setTasks(updatedTasks);
        setItemsLeft(prev => prev - 1);
    }

    // Async function to delete a task
    async function deleteTaskFromDatabase(id) {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/todos/" + id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            getUserTasks()
        }
        catch (error) {
            console.log("There was an error: " + error);
        }
    }

    // Async function to delete all tasks
    async function deleteAllTasksFromDatabase() {
        try {
            tasks.map((task, index) => {
                deleteTaskFromDatabase(task.id)
                removeTaskFromTasks(index)
            })
        }
        catch (error) {
            console.log(error)
        }
    }
    
    // Async function to get tasks and user
    async function getUserTasks() {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/juanitodr94");
            if (response.status === 404) alert("User juanitodr94 not found, maybe deleted? try to create again")
            if (!response.ok) throw new Error("There was an error: " + response.statusText);
            const data = await response.json();
            const userTasks = data.todos;
            setTasks(userTasks)
        }
        catch (error) {
            console.log("There was an error", error)
        }
    }

    // useEffect to get users when the component is loaded
    useEffect(() => {
        getUserTasks()
    }, [])

    const tasksList = tasks.map((task, index) => {
        return (
            <li key={index} className="task">{task.label}
                <span className="close-button" onClick={() => {
                    deleteTaskFromDatabase(task.id);
                    removeTaskFromTasks(index)
                }}>
                    <i className="fa-solid fa-trash-can"></i>
                </span>
            </li>
        )
    })



    return (
        <div>
            <h1>to-dos</h1>
            <div className="todo-list">
                <input type="text" className="task-input" onChange={(ev) => setTaskInputValue(ev.target.value)} onKeyDown={addTask} value={taskInputValue} placeholder="Insert your task" />
                <h4 style={{ display: (tasks.length >= 1 ? "block" : "none") }}>Pending tasks</h4>
                <ul className="list">
                    {tasksList}
                </ul>
                <h4>{(tasks.length === 0 ? "No tasks available, please add one" : `${tasks.length} items left`)}</h4>
                <button onClick={deleteAllTasksFromDatabase}>Delete all tasks</button>
            </div>
        </div>
    )
}

export default Todolist;