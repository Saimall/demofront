package com.example.project_task_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Project {
    @Id
    private Long projectId;
    private String projectName;
    private String projectDescription;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long managerId;
}
