import React from 'react';
import Task from './Task';

function TaskList({ tasks, setTasks, onEdit }) {
    const sortedTasks = [...tasks].sort((a, b) => calculatePriority(b) - calculatePriority(a));

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex-1 ml-10">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Tasks</h2>
            <ul className="space-y-2">
                {sortedTasks.map(task => (
                    <Task key={task._id} task={task} setTasks={setTasks} onEdit={onEdit}/>
                ))}
            </ul>
        </div>
    );
}

function calculatePriority(task) {
    const priorityValues = { high: 16, medium: 13, low: 10 };
    const priority = priorityValues[task.priority];
    const daysUntilDue = Math.ceil((new Date(task.duedate) - new Date()) / (1000 * 60 * 60 * 24));
    return priority - daysUntilDue;
}

export default TaskList;