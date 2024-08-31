package com.example.project_task_service.controller;

import com.example.project_task_service.dto.ProjectDto;
import com.example.project_task_service.model.Project;
import com.example.project_task_service.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/project")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/addProject/{managerId}")
    public Project addProject(@RequestBody ProjectDto projectDto, @PathVariable Long managerId) {
        return projectService.addProject(projectDto,managerId);
    }

    @GetMapping("/getProjects/{managerId}")
    public List<ProjectDto> getProjectsByManager(@PathVariable Long managerId) {
        return projectService.getProjectsByManager(managerId);
    }

    //Each Project has unique project ID, So when we delete  by project id it is associated with particular manager only
    @DeleteMapping("/deleteProjects/{projectId}")
    public String deleteProjectsByManager(@PathVariable Long projectId){
        return projectService.deleteProjectsByManager(projectId);
    }
}
