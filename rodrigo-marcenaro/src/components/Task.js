import React from 'react';
import { deleteTask } from '../api';

function Task({ task, setTasks, onEdit }) {
    const handleDelete = async () => {
        await deleteTask(task._id);
        setTasks(prevTasks => prevTasks.filter(t => t._id !== task._id));
    };

    const handleEdit = () => {
        onEdit(task);
        handleDelete();
    };

    return (
        <li className="bg-gray-100 hover:bg-gray-200 rounded">
            <b class="taskname">{task.taskname}</b><br />
            <b>Due:</b> {task.duedate}<br />
            <b>Priority:</b> {task.priority}<br />
            <b>Description:</b> {task.description}<br />
            <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleDelete}>Remove</button>
            <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-3" onClick={handleEdit}>Edit</button>
        </li>
    );
}

export default Task;