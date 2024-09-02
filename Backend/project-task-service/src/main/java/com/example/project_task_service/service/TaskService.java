package com.example.project_task_service.service;

import com.example.project_task_service.dto.TaskRequestDto;
import com.example.project_task_service.dto.TaskResponseDto;
import com.example.project_task_service.exceptions.ProjectNotFoundException;
import com.example.project_task_service.exceptions.TaskNotFoundException;
import com.example.project_task_service.model.Project;
import com.example.project_task_service.model.Status;
import com.example.project_task_service.model.Task;
import com.example.project_task_service.repository.ProjectRepository;
import com.example.project_task_service.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public Task addTaskToProject(Long projectId, TaskRequestDto taskDto) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found to assign task with ID: " + projectId));

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

    public List<TaskResponseDto> getTaskByProjectId(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with ID " + projectId));

        List<Task> tasks = project.getTasks();
        if (tasks.isEmpty()) {
            throw new TaskNotFoundException("No tasks found for project with ID " + projectId);
        }

        return tasks.stream().map(task -> TaskResponseDto.builder()
                .taskTitle(task.getTaskTitle())
                .taskDescription(task.getTaskDescription())
                .dueDate(task.getDueDate())
                .priority(task.getPriority())
                .employeeId(task.getEmployeeId())
                .status(task.getStatus())
                .build()).toList();
    }

    public List<TaskResponseDto> getTasksByDueDate(LocalDate dueDate) {
        List<Task> tasks = taskRepository.findByDueDate(dueDate);
        if (tasks.isEmpty()) {
            throw new TaskNotFoundException("No tasks found with due date " + dueDate);
        }

        return tasks.stream().map(task -> TaskResponseDto.builder()
                .taskTitle(task.getTaskTitle())
                .taskDescription(task.getTaskDescription())
                .dueDate(task.getDueDate())
                .priority(task.getPriority())
                .employeeId(task.getEmployeeId())
                .status(task.getStatus())
                .build()).toList();
    }

    public List<TaskResponseDto> getTasksByCreatedDate(LocalDate createdAt) {
        List<Task> tasks = taskRepository.findByCreatedAt(createdAt);
        if (tasks.isEmpty()) {
            throw new TaskNotFoundException("No tasks found with created date " + createdAt);
        }

        return tasks.stream().map(task -> TaskResponseDto.builder()
                .taskTitle(task.getTaskTitle())
                .taskDescription(task.getTaskDescription())
                .dueDate(task.getDueDate())
                .priority(task.getPriority())
                .employeeId(task.getEmployeeId())
                .status(task.getStatus())
                .build()).toList();
    }

    public List<TaskResponseDto> getTasksByStatus(Status status) {
        List<Task> tasks = taskRepository.findByStatus(status);
        if (tasks.isEmpty()) {
            throw new TaskNotFoundException("No tasks found with status " + status);
        }

        return tasks.stream().map(task -> TaskResponseDto.builder()
                .taskTitle(task.getTaskTitle())
                .taskDescription(task.getTaskDescription())
                .dueDate(task.getDueDate())
                .priority(task.getPriority())
                .employeeId(task.getEmployeeId())
                .status(task.getStatus())
                .build()).toList();
    }

    public TaskResponseDto updateTask(Long taskId, TaskRequestDto taskDto) {
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with ID " + taskId));

        existingTask.setTaskTitle(taskDto.getTaskTitle());
        existingTask.setTaskDescription(taskDto.getTaskDescription());
        existingTask.setDueDate(taskDto.getDueDate());
        existingTask.setPriority(taskDto.getPriority());
        existingTask.setUpdatedAt(LocalDate.now());

        taskRepository.save(existingTask);

        return TaskResponseDto.builder()
                .taskTitle(existingTask.getTaskTitle())
                .taskDescription(existingTask.getTaskDescription())
                .dueDate(existingTask.getDueDate())
                .priority(existingTask.getPriority())
                .employeeId(existingTask.getEmployeeId())
                .status(existingTask.getStatus())
                .build();
    }

    public TaskResponseDto updateTaskStatus(Long taskId, Status newStatus) {
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with ID " + taskId));

        existingTask.setStatus(newStatus);
        existingTask.setUpdatedAt(LocalDate.now());

        taskRepository.save(existingTask);

        return TaskResponseDto.builder()
                .taskTitle(existingTask.getTaskTitle())
                .taskDescription(existingTask.getTaskDescription())
                .dueDate(existingTask.getDueDate())
                .priority(existingTask.getPriority())
                .employeeId(existingTask.getEmployeeId())
                .status(existingTask.getStatus())
                .build();
    }

    @Transactional
    public String deleteTask(Long taskId) {
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with ID " + taskId));

        Project project = existingTask.getProject();
        if (project != null) {
            project.getTasks().remove(existingTask);
            projectRepository.save(project);
        }
        taskRepository.deleteById(taskId);

        return "Task deleted successfully with ID " + taskId;
    }
}
