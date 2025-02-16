import React, {use, useEffect, useState} from 'react';
import { addTask } from '../api';

function TaskForm({ onTaskAdded, taskToEdit }) {
    const [task, setTask] = useState({
        taskname: 'Add a task here',
        duedate: '',
        priority: 'high',
        description: ''
    });

    useEffect(() => {
        if (taskToEdit) {
            setTask(taskToEdit);
        }
    }, [taskToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTask = await addTask(task);
        onTaskAdded(newTask);
        setTask({
            taskname: 'Add a task here',
            duedate: '',
            priority: 'High',
            description: ''
        });
    };

    const handleChange = (e) => {
        const {name, value } = e.target;
        setTask(prevTask => ({ ...prevTask, [name]: value }));
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex-1">
            <form onSubmit={handleSubmit} className="space-y-4">
                <label for="taskname">New Task: </label>
                <input type="text" id="taskname" name="taskname" value={task.taskname || ''} onChange={handleChange} /><br />
                <label for="duedate">Due date:</label>
                <input type="date" id="duedate" name="duedate" value={task.duedate || ''} onChange={handleChange} /><br />
                <label for="priority">Priority: </label>
                <select id="priority" name="priority" value={task.priority || ''} onChange={handleChange}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select><br />
                <label for="description">Description: </label>
                <textarea id="description" name="description" rows="8" cols="50" value={task.description || ''} onChange={handleChange}></textarea><br />
                <button type="submit"
                        className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 border-white">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default TaskForm;