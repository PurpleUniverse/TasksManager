import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from '@mui/material';

const PRIORITY_OPTIONS = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' }
];

const CATEGORY_OPTIONS = [
    { value: 'WORK', label: 'Work' },
    { value: 'PERSONAL', label: 'Personal' },
    { value: 'HOME', label: 'Home' },
    { value: 'STUDY', label: 'Study' },
    { value: 'OTHER', label: 'Other' }
];

const TaskForm = ({ onSubmit, task = {}, showCategories = true, showPriorities = true }) => {
    const [title, setTitle] = useState(task.title || '');
    const [description, setDescription] = useState(task.description || '');
    const [category, setCategory] = useState(task.category || '');
    const [priority, setPriority] = useState(task.priority || '');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const newTask = {
            ...task,
            title,
            description,
            completed: task.completed || false,
        };

        if (showCategories) {
            newTask.category = category;
        }

        if (showPriorities) {
            newTask.priority = priority;
        }

        onSubmit(newTask);

        // Clear form if it's a new task (no id provided)
        if (!task.id) {
            setTitle('');
            setDescription('');
            setCategory('');
            setPriority('');
            setErrors({});
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Task Title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
            />

            <TextField
                margin="normal"
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                {showCategories && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            value={category}
                            label="Category"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {CATEGORY_OPTIONS.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>Task category feature is enabled</FormHelperText>
                    </FormControl>
                )}

                {showPriorities && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select
                            labelId="priority-label"
                            id="priority"
                            value={priority}
                            label="Priority"
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {PRIORITY_OPTIONS.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>Task priority feature is enabled</FormHelperText>
                    </FormControl>
                )}
            </Box>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
            >
                {task.id ? 'Update Task' : 'Add Task'}
            </Button>
        </Box>
    );
};

export default TaskForm;