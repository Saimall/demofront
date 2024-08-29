package com.example.user_service.controller;

import com.example.user_service.dto.EmployeeDto;
import com.example.user_service.dto.ManagerDto;
import com.example.user_service.model.Employee;
import com.example.user_service.model.Manager;
import com.example.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    @Autowired
    private UserService userService;

    //To Register a Manager
    @PostMapping("/manager/register")
    public Manager registerManager(@RequestBody ManagerDto managerdto){
        return userService.registerManager(managerdto);
    }

    //To Register an Employee
    @PostMapping("/employee/register")
    public Employee registerEmployee(@RequestBody EmployeeDto employeedto, @RequestParam Long managerId){
        return userService.registerEmployee(employeedto,managerId);
    }

    @GetMapping("/manager/getall")
    public List<Manager> getAllManagers(){
        return userService.getAllManagers();
    }


}
