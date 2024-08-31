package com.example.project_task_service.service;

import com.example.project_task_service.dto.ProjectDto;
import com.example.project_task_service.model.Project;
import com.example.project_task_service.repository.ProjectRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;


    public Project addProject(ProjectDto projectDto,Long managerId) {
        Project project = Project.builder()
                .projectName(projectDto.getProjectName())
                .projectDescription(projectDto.getProjectDescription())
                .startDate(projectDto.getStartDate())
                .endDate(projectDto.getEndDate())
                .managerId(managerId)
                .createdAt(LocalDate.now())
                .updatedAt(LocalDate.now())
//                .tasks(null)
                .build();
        // Map projectDto to project model
        return projectRepository.save(project);
    }

    public List<ProjectDto> getProjectsByManager(Long managerId) {
        List<Project> projects = projectRepository.findAllByManagerId(managerId);
//        return projects.stream().map(project->new ProjectDto(project.getProjectId(), project.getProjectName(), project.get))
        return projects.stream().map(project->{
            ProjectDto projectDto = new ProjectDto();
            BeanUtils.copyProperties(project, projectDto);
            return projectDto;
        }).toList();
    }

    public String deleteProjectsByManager(Long projectId) {
        Optional<Project> project = projectRepository.findById(projectId);
        if(project.isPresent()) {
            projectRepository.deleteById(projectId);
            return "Project deleted successfully with id: " + projectId;
        }
        return  "Project not found with id: " + projectId;
    }
}
