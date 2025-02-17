export const checkAuthStatus = async () => {
    try {
        const response = await fetch('/auth/status');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.authenticated || false;
    } catch (error) {
        console.error('Error checking auth status:', error);
        return false;
    }
};

export const fetchUsername = async () => {
    const response = await fetch('/api/user');
    if (response.ok) {
        const data = await response.json();
        return data.username;
    }
    return '';
};

export const fetchTasks = async () => {
    const response = await fetch('/tasks');
    if (response.ok) {
        return await response.json();
    }
    return [];
};

export const addTask = async (task) => {
    const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
    return await response.json();
};

export const deleteTask = async (taskId) => {
    const response = await fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete task');
    }
};
