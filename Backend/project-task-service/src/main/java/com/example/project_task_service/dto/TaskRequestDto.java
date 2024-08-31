package com.example.project_task_service.dto;

import com.example.project_task_service.model.Priority;
import com.example.project_task_service.model.Status;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequestDto {
    private String taskTitle;
    private String taskDescription;
    private LocalDate dueDate;
    @Enumerated(value = EnumType.STRING)
    private Priority priority;
    private Long employeeId; //from feign client(Assigned to)
}