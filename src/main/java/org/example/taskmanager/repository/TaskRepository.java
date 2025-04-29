package org.example.taskmanager.repository;

import org.example.taskmanager.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByCompleted(boolean completed);
    List<Task> findByCategory(String category);
    List<Task> findByPriority(Task.TaskPriority priority);
    List<Task> findByCategoryAndCompleted(String category, boolean completed);
    List<Task> findByPriorityAndCompleted(Task.TaskPriority priority, boolean completed);
}
