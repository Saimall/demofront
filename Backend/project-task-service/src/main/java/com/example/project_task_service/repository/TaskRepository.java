package com.example.project_task_service.repository;

import com.example.project_task_service.model.Status;
import com.example.project_task_service.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByDueDate(LocalDate dueDate);

    List<Task> findByCreatedAt(LocalDate createdAt);

    List<Task> findByStatus(Status status);
}
