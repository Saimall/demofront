package com.example.project_task_service.controller;

import com.example.project_task_service.dto.TaskDto;
import com.example.project_task_service.model.Status;
import com.example.project_task_service.model.Task;
import com.example.project_task_service.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/task")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping("/addTask/{projectId}")
    public Task addTaskToProject(@PathVariable Long projectId, @RequestBody TaskDto taskDto) {
        return taskService.addTaskToProject(projectId,taskDto);
    }
    @GetMapping("/getTaskByProjectId/{projectId}")
    public List<Task> getTaskByProjectId(@PathVariable Long projectId) {
        return taskService.getTaskByProjectId(projectId);
    }
    
    @GetMapping("/getTasksByDueDate/{dueDate}")
    public List<Task> gettasksByDueDate(@PathVariable LocalDate dueDate) {
        return taskService.getTasksByDueDate(dueDate);
    }

    @GetMapping("/getTasksByCreatedDate/{createdAt}")
    public List<Task> getTasksByCreatedDate(@PathVariable LocalDate createdAt) {
        return taskService.getTasksByCreatedDate(createdAt);
    }

    @GetMapping("/getTasksByStatus/{status}")
    public List<Task> getTasksByStatus(@PathVariable Status status) {
        return taskService.getTasksByStatus(status);
    }

    @PutMapping("/updateTasks/{taskId}")
    public Task updateTask(@PathVariable Long taskId,@RequestBody TaskDto){
        return taskService.updateTask(taskId);
    }
}
