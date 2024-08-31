package com.example.user_service.controller;

import com.example.user_service.dto.EmployeeDto;
import com.example.user_service.dto.ManagerDashboardDto;
import com.example.user_service.dto.ManagerDto;
import com.example.user_service.model.Employee;
import com.example.user_service.model.Manager;
import com.example.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/manager")
public class ManagerController {
    @Autowired
    private UserService userService;

    //To Register a Manager
    @PostMapping("/register")
    public Manager registerManager(@RequestBody ManagerDto managerDto){
        return userService.registerManager(managerDto);
    }

    //To Register an Employee
    @PostMapping("/registerEmployee/{managerId}")
    public Employee registerEmployee(@RequestBody EmployeeDto employeedto, @PathVariable Long managerId){
        return userService.registerEmployee(employeedto,managerId);
    }


    //To View Employees Assigned to Manager
    @GetMapping("/{managerId}/viewEmployees")
    public List<Employee> viewEmployees(@PathVariable Long managerId){
        return userService.viewEmployees(managerId);
    }

    //To View Employee Details by Employee Id
    @GetMapping("/viewEmployeeById/{employeeId}")
    public Employee viewEmployeeById(@PathVariable Long employeeId){
        return userService.viewEmployeeById(employeeId);
    }
    

    //To Delete a Employee
    @DeleteMapping("/deleteEmployee/{employeeId}")
    public String deleteEmployee(@PathVariable Long employeeId){
       return userService.deleteEmployee(employeeId);
    }

    //To View Manager Details by Manager Id (In Dashboard)
    @GetMapping("/viewManagerDetails/{managerId}")
    public ManagerDashboardDto viewManagerDetails(@PathVariable Long managerId){
        return userService.viewManagerDetails(managerId);
    }
}