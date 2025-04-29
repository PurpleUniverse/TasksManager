import React, { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Paper, Box, CircularProgress } from '@mui/material';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FeatureToggleInfo from './components/FeatureToggleInfo';
import { fetchApiInfo, fetchTasks, createTask, updateTask, deleteTask } from './services/taskService';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiInfo, setApiInfo] = useState({
    currentVersion: '',
    features: { taskCategories: false, taskPriorities: false }
  });
  const [apiVersion, setApiVersion] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);

        // Fetch API information including feature flags and versions
        const info = await fetchApiInfo();
        setApiInfo(info);
        setApiVersion(info.currentVersion);

        // Fetch all tasks
        const tasksData = await fetchTasks(info.currentVersion);
        setTasks(tasksData);

        setError(null);
      } catch (err) {
        setError(`Failed to initialize app: ${err.message}`);
        console.error('Error initializing app:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleAddTask = async (newTask) => {
    try {
      setLoading(true);
      const createdTask = await createTask(apiVersion, newTask);
      setTasks(prev => [...prev, createdTask]);
    } catch (err) {
      setError(`Failed to add task: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      setLoading(true);
      const result = await updateTask(apiVersion, updatedTask.id, updatedTask);
      setTasks(prev => prev.map(task => task.id === result.id ? result : task));
    } catch (err) {
      setError(`Failed to update task: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setLoading(true);
      await deleteTask(apiVersion, taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError(`Failed to delete task: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (taskToUpdate) {
      const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
      await handleUpdateTask(updatedTask);
    }
  };

  return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Task Manager
            </Typography>
            <Typography variant="subtitle2">
              API v{apiVersion}
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4 }}>
          {error && (
              <Paper sx={{ p: 2, mb: 2, bgcolor: '#fff4f4' }}>
                <Typography color="error">{error}</Typography>
              </Paper>
          )}

          <FeatureToggleInfo features={apiInfo.features} />

          <Paper sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add New Task
            </Typography>
            <TaskForm
                onSubmit={handleAddTask}
                showCategories={apiInfo.features.taskCategories}
                showPriorities={apiInfo.features.taskPriorities}
            />
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tasks
            </Typography>
            {loading && tasks.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
            ) : (
                <TaskList
                    tasks={tasks}
                    onToggleComplete={toggleTaskCompletion}
                    onDelete={handleDeleteTask}
                    onUpdate={handleUpdateTask}
                    showCategories={apiInfo.features.taskCategories}
                    showPriorities={apiInfo.features.taskPriorities}
                />
            )}
          </Paper>
        </Container>
      </div>
  );
}

export default App;
