package com.example.project_task_service.controller;

import com.example.project_task_service.dto.TaskRequestDto;
import com.example.project_task_service.dto.TaskResponseDto;
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
    public Task addTaskToProject(@PathVariable Long projectId, @RequestBody TaskRequestDto taskRequestDto) {
        return taskService.addTaskToProject(projectId,taskRequestDto);
    }
    @GetMapping("/getTaskByProjectId/{projectId}")
    public List<TaskResponseDto> getTaskByProjectId(@PathVariable Long projectId) {
        return taskService.getTaskByProjectId(projectId);
    }
    
    @GetMapping("/getTasksByDueDate/{dueDate}")
    public List<TaskResponseDto> gettasksByDueDate(@PathVariable LocalDate dueDate) {
        return taskService.getTasksByDueDate(dueDate);
    }

    @GetMapping("/getTasksByCreatedDate/{createdAt}")
    public List<TaskResponseDto> getTasksByCreatedDate(@PathVariable LocalDate createdAt) {
        return taskService.getTasksByCreatedDate(createdAt);
    }

    @GetMapping("/getTasksByStatus/{status}")
    public List<TaskResponseDto> getTasksByStatus(@PathVariable Status status) {
        return taskService.getTasksByStatus(status);
    }

    @PutMapping("/updateTasks/{taskId}")
    public TaskResponseDto updateTask(@PathVariable Long taskId,@RequestBody TaskRequestDto taskRequestDto){
        return taskService.updateTask(taskId,taskRequestDto);
    }

    @PutMapping("/updateTaskStatus/{taskId}/{status}")
    public TaskResponseDto updateTaskStatus(@PathVariable Long taskId, @PathVariable Status status){
        return taskService.updateTaskStatus(taskId,status);
    }

    @DeleteMapping("/deleteTask/{taskId}")
    public String deleteTask(@PathVariable Long taskId){
       return taskService.deleteTask(taskId);
    }
}
