const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Get API information and feature flags
export const fetchApiInfo = async () => {
    try {
        const response = await fetch(`${API_URL}/api`);
        if (!response.ok) {
            throw new Error(`API Info request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching API info:', error);
        throw error;
    }
};

// Fetch all tasks
export const fetchTasks = async (apiVersion) => {
    try {
        const response = await fetch(`${API_URL}/api/${apiVersion}/tasks`);
        if (!response.ok) {
            throw new Error(`Tasks request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

// Create a new task
export const createTask = async (apiVersion, task) => {
    try {
        const response = await fetch(`${API_URL}/api/${apiVersion}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) {
            throw new Error(`Create task request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

// Update an existing task
export const updateTask = async (apiVersion, taskId, task) => {
    try {
        const response = await fetch(`${API_URL}/api/${apiVersion}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) {
            throw new Error(`Update task request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

// Delete a task
export const deleteTask = async (apiVersion, taskId) => {
    try {
        const response = await fetch(`${API_URL}/api/${apiVersion}/tasks/${taskId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Delete task request failed with status ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

// Fetch tasks by category (feature-dependent)
export const fetchTasksByCategory = async (apiVersion, category) => {
    try {
        const response = await fetch(`${API_URL}/api/${apiVersion}/tasks/category/${category}`);
        if (response.status === 501) {
            // Not implemented - feature is disabled
            return [];
        }
        if (!response.ok) {
            throw new Error(`Tasks by category request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching tasks by category:', error);
        throw error;
    }
};

// Fetch tasks by priority (feature-dependent)
export const fetchTasksByPriority = async (apiVersion, priority) => {
    try {
        const response = await fetch(`${API_URL}/api/${apiVersion}/tasks/priority/${priority}`);
        if (response.status === 501) {
            // Not implemented - feature is disabled
            return [];
        }
        if (!response.ok) {
            throw new Error(`Tasks by priority request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching tasks by priority:', error);
        throw error;
    }
};

// Get feature toggle status
export const fetchFeatures = async () => {
    try {
        const response = await fetch(`${API_URL}/api/features`);
        if (!response.ok) {
            throw new Error(`Features request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching features:', error);
        throw error;
    }
};