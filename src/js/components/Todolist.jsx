import React, { useEffect, useState } from "react";

const Todolist = () => {

    // useStates
    const [taskInputValue, setTaskInputValue] = useState("");
    const [itemsLeft, setItemsLeft] = useState(0);
    const [tasks, setTasks] = useState([]);

    // Async function to add tasks to database
    async function addTaskToDatabase(ev) {
        if (ev.key === "Enter") {
            let newTask = {
                    "label": taskInputValue,
                    "is_done": false
                }
            if (taskInputValue === "") return;
            for (let task of tasks) {
                if (task.label === taskInputValue) return
            }
            setTaskInputValue("");
            try {
                const response = await fetch("https://playground.4geeks.com/todo/todos/juanitodr94", {
                    method: "POST",
                    body: JSON.stringify(newTask),
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
            if (response.status === 404) alert("User juanitodr94 not found. It's been deleted. Press the button above to create it again")
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

    // Function to create juanitodr94 user in case that it's been removed
    async function createUser() {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/juanitodr94", {
                method: "POST",
                headers: {"Content-Type": "application/json"}
            })
            if (response.ok) alert("User created succesfully!")
            else if (response.status === 400) {
                alert("User juanitodr94 alredy exists");
                throw new Error("User alredy exists");
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    // Print on website my tasks
    const tasksList = tasks.map((task, index) => {
        return (
            <li key={index} className="task">{task.label}
                <span className="close-button" onClick={() => {
                    deleteTaskFromDatabase(task.id);
                }}>
                    <i className="fa-solid fa-trash-can"></i>
                </span>
            </li>
        )
    })

    // Return of the component

    return (
        <div>
            <h1>to-dos</h1>
            <div className="todo-list">
                <input type="text" className="task-input" onChange={(ev) => setTaskInputValue(ev.target.value)} onKeyDown={addTaskToDatabase} value={taskInputValue} placeholder="Insert your task" />
                <h4 style={{ display: (tasks.length >= 1 ? "block" : "none") }}>Pending tasks</h4>
                <ul className="list">
                    {tasksList}
                </ul>
                <h4>{(tasks.length === 0 ? "No tasks available, please add one" : `${tasks.length} items left`)}</h4>
                <button style={{display: (tasks.length === 0 ? "none" : "block")}} onClick={deleteAllTasksFromDatabase}>Delete all tasks</button>
                <p>If user doesn't exist, you can click <span onClick={createUser} className="createUserSpan">here</span> to create</p>
            </div>
        </div>
    )
}

export default Todolist;