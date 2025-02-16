import './App.css';
import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import LoginButton from './components/LoginButton';
import { checkAuthStatus, fetchUsername, fetchTasks } from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const authStatus = await checkAuthStatus();
            setIsAuthenticated(authStatus);
            if (authStatus) {
                const user = await fetchUsername();
                setUsername(user);
                const userTasks = await fetchTasks(user);
                setTasks(userTasks);
            }
        };
        fetchData();
    }, []);

    const handleTaskAdded = (newTask) => {
        setTasks(prevTasks => [...prevTasks, newTask]);
        setTaskToEdit(null);
    };

    const handleEdit = (task) => {
        setTaskToEdit(task);
    };

  return (
      <div className="bg-gray-100 font-sans">
        <div className="max-w-4xl mx-auto p-4">
          {username && <div className="text-center mb-4 text-lg text-blue-600">Hello, {username}</div>}
          {isAuthenticated ? (
              <div className="flex flex-col md:flex-row">
                <TaskForm onTaskAdded={handleTaskAdded} taskToEdit={taskToEdit} />
                <TaskList tasks={tasks} setTasks={setTasks} onEdit={handleEdit} />
              </div>
          ) : (
              <LoginButton />
          )}
        </div>
      </div>
  );
}

export default App;
