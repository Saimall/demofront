package com.example.project_task_service.controller;

import com.example.project_task_service.dto.ProjectDto;
import com.example.project_task_service.exceptions.ProjectNotFoundException;
import com.example.project_task_service.model.Project;
import com.example.project_task_service.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v2/project")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping("/addProject/{managerId}")
    public ResponseEntity<Project> addProject(@RequestBody ProjectDto projectDto, @PathVariable Long managerId) {
            Project newProject = projectService.addProject(projectDto, managerId);
            return ResponseEntity.status(HttpStatus.CREATED).body(newProject);

    }

    @GetMapping("/getProjects/{managerId}")
    public ResponseEntity<?> getProjectsByManager(@PathVariable Long managerId) {
        try {
            List<ProjectDto> projects = projectService.getProjectsByManager(managerId);

            // If the list is empty, return a 204 No Content with a custom message
            if (projects.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT)
                        .body("No projects found under this manager");
            }

            // Return the list of projects with a 200 OK status
            return ResponseEntity.status(HttpStatus.OK).body(projects);

        }
        catch (ProjectNotFoundException e) {
            // Handle the specific exception if no projects are found
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No projects found under this manager");

        }
//        catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(null);
//        }
    }

    //Each Project has unique project ID, So when we delete  by project id it is associated with particular manager only
    @DeleteMapping("/deleteProjects/{projectId}")
    public ResponseEntity<String> deleteProjectsByManager(@PathVariable Long projectId){
        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(projectService.deleteProjectsByManager(projectId));
        }
        catch (ProjectNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                   .body(null);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}
