import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Checkbox,
    IconButton,
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    FlagOutlined as FlagIcon,
    CategoryOutlined as CategoryIcon
} from '@mui/icons-material';
import TaskForm from './TaskForm';

const priorityColors = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'error'
};

const TaskList = ({
                      tasks,
                      onToggleComplete,
                      onDelete,
                      onUpdate,
                      showCategories = true,
                      showPriorities = true
                  }) => {
    const [editTask, setEditTask] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const handleEditClick = (task) => {
        setEditTask(task);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setEditTask(null);
    };

    const handleUpdateTask = (updatedTask) => {
        onUpdate(updatedTask);
        setEditDialogOpen(false);
    };

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (taskToDelete) {
            onDelete(taskToDelete.id);
            setDeleteDialogOpen(false);
            setTaskToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setTaskToDelete(null);
    };

    if (tasks.length === 0) {
        return (
            <Typography align="center" sx={{ p: 2 }}>
                No tasks found. Add a new task to get started!
            </Typography>
        );
    }

    return (
        <>
            <List sx={{ width: '100%' }}>
                {tasks.map((task) => (
                    <ListItem
                        key={task.id}
                        secondaryAction={
                            <Box>
                                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(task)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(task)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        }
                        sx={{
                            borderBottom: '1px solid #eee',
                            backgroundColor: task.completed ? '#f9f9f9' : 'transparent',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            opacity: task.completed ? 0.7 : 1,
                        }}
                    >
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={task.completed}
                                onChange={() => onToggleComplete(task.id)}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItemIcon>

                        <ListItemText
                            primary={task.title}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'block' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {task.description}
                                    </Typography>

                                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                        {showCategories && task.category && (
                                            <Chip
                                                size="small"
                                                icon={<CategoryIcon />}
                                                label={task.category}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        )}

                                        {showPriorities && task.priority && (
                                            <Chip
                                                size="small"
                                                icon={<FlagIcon />}
                                                label={task.priority}
                                                color={priorityColors[task.priority] || 'default'}
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                ))}
            </List>

            {/* Edit Task Dialog */}
            <Dialog open={editDialogOpen} onClose={handleEditDialogClose} fullWidth>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    {editTask && (
                        <TaskForm
                            task={editTask}
                            onSubmit={handleUpdateTask}
                            showCategories={showCategories}
                            showPriorities={showPriorities}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the task "{taskToDelete?.title}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TaskList;