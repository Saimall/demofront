package com.example.project_task_service.controller;

import com.example.project_task_service.dto.TaskRequestDto;
import com.example.project_task_service.dto.TaskResponseDto;
import com.example.project_task_service.exceptions.ProjectNotFoundException;
import com.example.project_task_service.exceptions.TaskNotFoundException;
import com.example.project_task_service.model.Status;
import com.example.project_task_service.model.Task;
import com.example.project_task_service.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v2/task")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping("/addTask/{projectId}")
    public ResponseEntity<Task> addTaskToProject(@PathVariable Long projectId, @RequestBody TaskRequestDto taskRequestDto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(taskService.addTaskToProject(projectId, taskRequestDto));
        }
        catch (ProjectNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                   .body(null);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body(null);
        }
    }
    @GetMapping("/getTaskByProjectId/{projectId}")
    public ResponseEntity<List<TaskResponseDto>> getTaskByProjectId(@PathVariable Long projectId) {
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(taskService.getTaskByProjectId(projectId));
        }
        catch (ProjectNotFoundException | TaskNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                   .body(null);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
    
    @GetMapping("/getTasksByDueDate/{dueDate}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByDueDate(@PathVariable LocalDate dueDate) {
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(taskService.getTasksByDueDate(dueDate));
        }
        catch (TaskNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/getTasksByCreatedDate/{createdAt}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByCreatedDate(@PathVariable LocalDate createdAt) {
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(taskService.getTasksByCreatedDate(createdAt));
        }
        catch (TaskNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/getTasksByStatus/{status}")
    public ResponseEntity<List<TaskResponseDto>> getTasksByStatus(@PathVariable Status status) {
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(taskService.getTasksByStatus(status));
        }
        catch (TaskNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PutMapping("/updateTasks/{taskId}")
    public ResponseEntity<TaskResponseDto> updateTask(@PathVariable Long taskId,@RequestBody TaskRequestDto taskRequestDto){
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(taskService.updateTask(taskId,taskRequestDto));
        }
        catch (TaskNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PutMapping("/updateTaskStatus/{taskId}/{status}")
    public ResponseEntity<TaskResponseDto> updateTaskStatus(@PathVariable Long taskId, @PathVariable Status status){
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(taskService.updateTaskStatus(taskId,status));
        }
        catch (TaskNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @DeleteMapping("/deleteTask/{taskId}")
    public ResponseEntity<String> deleteTask(@PathVariable Long taskId){
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(taskService.deleteTask(taskId));
        }
        catch (TaskNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}
