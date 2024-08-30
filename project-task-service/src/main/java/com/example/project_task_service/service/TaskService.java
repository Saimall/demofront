package com.example.project_task_service.service;

import com.example.project_task_service.dto.TaskDto;
import com.example.project_task_service.model.Project;
import com.example.project_task_service.model.Status;
import com.example.project_task_service.model.Task;
import com.example.project_task_service.repository.ProjectRepository;
import com.example.project_task_service.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private ProjectRepository projectRepository;

    public Task addTaskToProject(Long projectId, TaskDto taskDto) {
        Project project = projectRepository.findById(projectId).orElseThrow(()->new RuntimeException("Project not found to assign task"));
        Task task = Task.builder()
                .taskTitle(taskDto.getTaskTitle())
                .taskDescription(taskDto.getTaskDescription())
                .dueDate(taskDto.getDueDate())
                .priority(taskDto.getPriority())
                .employeeId(taskDto.getEmployeeId())
                .status(Status.TODO)
                .createdAt(LocalDate.now())
                .updatedAt(LocalDate.now())
                .completedAt(null)
                .project(project)
                .build();
        return taskRepository.save(task);
    }

    public List<Task> getTaskByProjectId(Long projectId) {
        Project project = projectRepository.findById(projectId).orElseThrow(()->new RuntimeException("Project not found with id " + projectId));
        return project.getTasks();
    }

    public List<Task> getTasksByDueDate(LocalDate dueDate) {
        return taskRepository.findByDueDate(dueDate);
    }

    public List<Task> getTasksByCreatedDate(LocalDate createdAt) {
        return taskRepository.findByCreatedAt(createdAt);
    }

    public List<Task> getTasksByStatus(Status status) {
        return taskRepository.findByStatus(status);
    }

//    public Task updateTask(Long taskId, TaskDto taskDto) {
//        Task existingTask = taskRepository.findById(taskId).orElseThrow(()->new RuntimeException("Task not found with id " + taskId));
//        existingTask.setTaskTitle(taskDto.getTaskTitle());
//        existingTask.setTaskDescription(taskDto.getTaskTitle());
//        existingTask.set(taskDto.getTaskTitle());
//        existingTask.set()
//        task.setUpdatedAt(LocalDate.now());
//        return taskRepository.save(task);
//    }
}
