package com.example.project_task_service.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long taskId;
    private String taskTitle;
    private String taskDescription;
    private LocalDate dueDate;
    @Enumerated(value = EnumType.STRING)
    private Priority priority;
    @Enumerated(value = EnumType.STRING)
    private Status status;

    private Long employeeId; //from feign client(Assigned to)

    private LocalDate createdAt;
    private LocalDate updatedAt;
    private LocalDate completedAt;

    @JsonBackReference
    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

}
