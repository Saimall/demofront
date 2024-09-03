package com.example.user_service.controller;

import com.example.user_service.dto.EmployeeDashboardDto;
import com.example.user_service.exceptions.EmployeeNotFoundException;
import com.example.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/employee")
public class EmployeeController {
    @Autowired
    private UserService userService;

    //To view Employee's details in DashBoard
    @GetMapping("/viewEmployeeDetails/{employeeId}")
    public ResponseEntity<EmployeeDashboardDto> viewEmployeeDetails(@PathVariable Long employeeId){
        try{
            return ResponseEntity.status(HttpStatus.OK)
                    .body(userService.viewEmployeeDetails(employeeId));
        }
        catch (EmployeeNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                   .body(null);
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body(null);
        }
    }
}
