package org.example.taskmanager.service;

import org.example.taskmanager.config.FeatureFlags.Features;
import org.example.taskmanager.model.Task;
import org.example.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Optional<Task> getTaskById(String id) {
        return taskRepository.findById(id);
    }

    public List<Task> getTasksByCompleted(boolean completed) {
        return taskRepository.findByCompleted(completed);
    }

    public Task createTask(Task task) {
        // Set created and updated timestamps
        LocalDateTime now = LocalDateTime.now();
        task.setCreatedAt(now);
        task.setUpdatedAt(now);

        // Handle feature flags
        if (!Features.TASK_CATEGORIES.isActive()) {
            task.setCategory(null);
        }

        if (!Features.TASK_PRIORITIES.isActive()) {
            task.setPriority(null);
        }

        return taskRepository.save(task);
    }

    public Optional<Task> updateTask(String id, Task updatedTask) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    existingTask.setTitle(updatedTask.getTitle());
                    existingTask.setDescription(updatedTask.getDescription());
                    existingTask.setCompleted(updatedTask.isCompleted());
                    existingTask.setUpdatedAt(LocalDateTime.now());

                    // Update category only if feature is enabled
                    if (Features.TASK_CATEGORIES.isActive()) {
                        existingTask.setCategory(updatedTask.getCategory());
                    }

                    // Update priority only if feature is enabled
                    if (Features.TASK_PRIORITIES.isActive()) {
                        existingTask.setPriority(updatedTask.getPriority());
                    }

                    return taskRepository.save(existingTask);
                });
    }

    public boolean deleteTask(String id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Feature-specific methods
    public List<Task> getTasksByCategory(String category) {
        if (Features.TASK_CATEGORIES.isActive()) {
            return taskRepository.findByCategory(category);
        }
        return List.of();
    }

    public List<Task> getTasksByPriority(Task.TaskPriority priority) {
        if (Features.TASK_PRIORITIES.isActive()) {
            return taskRepository.findByPriority(priority);
        }
        return List.of();
    }
}
