import React, { useState } from "react";

const Todolist = () => {

    // useStates
    const [taskInputValue, setTaskInputValue] = useState("");
    const [itemsLeft, setItemsLeft] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    const addTask = (ev) => {
        if (ev.key === "Enter") {
            if (taskInputValue === "" || tasks.includes(taskInputValue)) return;
            setTasks([...tasks, taskInputValue]);
            setTaskInputValue("");
            setItemsLeft(prev => prev + 1);
        }
    }

    // Remove functions
    const removeTaskFromTasks = (indexToRemove) => {
        if (itemsLeft < 0) return;
        const updatedTasks = tasks.filter((task, index) => index != indexToRemove);
        setTasks(updatedTasks);
        setItemsLeft(prev => prev - 1);
    }

    const removeTaskFromCompletedTasks = (indexToRemove) => {
        if (itemsLeft < 0) return;
        const updatedTasks = completedTasks.filter((task, index) => index != indexToRemove);
        setCompletedTasks(updatedTasks);
    }

    // Toggle between lists functions
    const completeTask = (indexOfTheTaskToComplete) => {
        setCompletedTasks([...completedTasks, tasks.filter((task, index) => {
            if (index === indexOfTheTaskToComplete) return task;
        })]);
        removeTaskFromTasks(indexOfTheTaskToComplete)
    }

    const returnTaskToIncomplete = (indexOfTheTaskToReturn) => {
        setTasks([...tasks, completedTasks.filter((task, index) => {
           if (index === indexOfTheTaskToReturn) return task;
        })]);
        removeTaskFromCompletedTasks(indexOfTheTaskToReturn);
        setItemsLeft(prev => prev + 1);
    }

    const tasksList = tasks.map((task, index) => {
        return  <li key={index} className="task">{task}
                    <button onClick={() => completeTask(index)}>Completed</button>
                    <span className="close-button" onClick={()=> removeTaskFromTasks(index)}>
                        <i className="fa-solid fa-trash-can"></i>
                    </span>
                </li>
    })

    const completedTasksList = completedTasks.map((task, index) => {
        return  <li key={index} className="task done-task">{task}
                    <button onClick={() => returnTaskToIncomplete(index)}>Return to incompleted list</button>
                    <span className="close-button" onClick={()=> removeTaskFromCompletedTasks(index)}>
                        <i className="fa-solid fa-trash-can"></i>
                    </span>
                </li>
    })

    return (
        <div className="todo-list">
            <input type="text" onChange={(ev) => setTaskInputValue(ev.target.value)} onKeyDown={addTask} value={taskInputValue} placeholder="Insert your task" />
            <ul className="list">
                {tasksList}
            </ul>
            <span className="items-left">{itemsLeft >= 1 ? `${itemsLeft} items left` : "There is no available tasks, please add one"}</span>
            <h2 style={{display: (completedTasks.length > 0 ? "block" : "none")}}>Completed tasks</h2>
            <ul className="completed-list">
                {completedTasksList}
            </ul>
        </div>
    )
}

export default Todolist;