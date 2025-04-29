package org.example.taskmanager.controller;

import org.example.taskmanager.config.FeatureFlags.Features;
import org.example.taskmanager.model.Task;
import org.example.taskmanager.model.Task.TaskPriority;
import org.example.taskmanager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Value("${api.current.version}")
    private String currentApiVersion;

    @Value("${api.legacy.version}")
    private String legacyApiVersion;

    // API Version information endpoint
    @GetMapping("/api")
    public ResponseEntity<Map<String, Object>> getApiInfo() {
        Map<String, Object> apiInfo = new HashMap<>();
        apiInfo.put("currentVersion", currentApiVersion);
        apiInfo.put("legacyVersion", legacyApiVersion);

        Map<String, Boolean> features = new HashMap<>();
        features.put("taskCategories", Features.TASK_CATEGORIES.isActive());
        features.put("taskPriorities", Features.TASK_PRIORITIES.isActive());
        apiInfo.put("features", features);

        return ResponseEntity.ok(apiInfo);
    }

    // Current version endpoints
    @GetMapping("/api/${api.current.version}/tasks")
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/api/${api.current.version}/tasks/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api/${api.current.version}/tasks")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(task));
    }

    @PutMapping("/api/${api.current.version}/tasks/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody Task task) {
        return taskService.updateTask(id, task)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/${api.current.version}/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        if (taskService.deleteTask(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Feature-specific endpoints
    @GetMapping("/api/${api.current.version}/tasks/category/{category}")
    public ResponseEntity<List<Task>> getTasksByCategory(@PathVariable String category) {
        if (Features.TASK_CATEGORIES.isActive()) {
            return ResponseEntity.ok(taskService.getTasksByCategory(category));
        }
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    @GetMapping("/api/${api.current.version}/tasks/priority/{priority}")
    public ResponseEntity<List<Task>> getTasksByPriority(@PathVariable String priority) {
        if (Features.TASK_PRIORITIES.isActive()) {
            try {
                TaskPriority taskPriority = TaskPriority.valueOf(priority.toUpperCase());
                return ResponseEntity.ok(taskService.getTasksByPriority(taskPriority));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    // Legacy version endpoints (simplified for rollback purposes)
    @GetMapping("/api/${api.legacy.version}/tasks")
    public ResponseEntity<List<Task>> getAllTasksLegacy() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @PostMapping("/api/${api.legacy.version}/tasks")
    public ResponseEntity<Task> createTaskLegacy(@RequestBody Task task) {
        // In legacy version, disable advanced features
        task.setCategory(null);
        task.setPriority(null);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(task));
    }
}
