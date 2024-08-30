package com.example.user_service.service;

import com.example.user_service.dto.EmployeeDashboardDto;
import com.example.user_service.dto.EmployeeDto;
import com.example.user_service.dto.ManagerDashboardDto;
import com.example.user_service.dto.ManagerDto;
import com.example.user_service.model.Employee;
import com.example.user_service.model.Manager;
import com.example.user_service.model.User;
import com.example.user_service.model.UserRole;
import com.example.user_service.repository.EmployeeRepo;
import com.example.user_service.repository.ManagerRepo;
import com.example.user_service.repository.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private ManagerRepo managerRepo;

    @Autowired
    private UserRepo userRepo;

    public Manager registerManager(ManagerDto managerDto){
        Manager manager = Manager.builder()
                .name(managerDto.getName())
                .email(managerDto.getEmail())
//                .password(managerDto.getPassword())
                .contact(managerDto.getContact())
                .build();
        User user = User.builder()
                .email(managerDto.getEmail())
                .password(managerDto.getPassword())
                .role(UserRole.MANAGER)
                .build();
        userRepo.save(user);
        return managerRepo.save(manager);

    }

    public Employee registerEmployee(EmployeeDto employeedto,Long managerId) {
        Manager manager = managerRepo.findById(managerId).orElseThrow(() -> new RuntimeException("Manager not found"));
        Employee employee = Employee.builder()
                .name(employeedto.getName())
                .email(employeedto.getEmail())
//                .password(employeedto.getPassword())
                .contact(employeedto.getContact())
                .designation(employeedto.getDesignation())
                .manager(manager)
                .build();
        User user = User.builder()
                .email(employeedto.getEmail())
                .password(employeedto.getPassword())
                .role(UserRole.EMPLOYEE)
                .build();
        userRepo.save(user);
        return employeeRepo.save(employee);
    }

//    public List<Manager> getAllManagers() {
//        return managerRepo.findAll();
//    }

    public List<Employee> viewEmployees(Long managerId) {
        Manager manager = managerRepo.findById(managerId).orElseThrow(() -> new RuntimeException("Manager not found"));
        return manager.getEmployees();
    }

//    public Employee updateEmployee(EmployeeDto employeedto, Long employeeId) {
//        Employee employee = employeeRepo.findById(employeeId).orElseThrow(() -> new RuntimeException("Employee not found"));
//        employee.setName(employeedto.getName());
//        employee.setEmail(employeedto.getEmail());
//        employee.setContact(employeedto.getContact());
//        employee.setDesignation(employeedto.getDesignation());
//        return employeeRepo.save(employee);
//    }

    @Transactional
    public String deleteEmployee(Long employeeId){
        // Check if the employee exists
        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));

        // Remove the employee from the manager's list of employees
        Manager manager = employee.getManager();
        if (manager != null) {
            manager.getEmployees().remove(employee);
            managerRepo.save(manager);
        }
        userRepo.deleteByEmail(employee.getEmail());
        // Now delete the employee
        employeeRepo.deleteById(employeeId);
        return "Employee deleted successfully";
    }

    public Employee viewEmployeeById(Long employeeId) {
        return employeeRepo.findById(employeeId).orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));
    }

    public ManagerDashboardDto viewManagerDetails(Long managerId) {
        Manager manager = managerRepo.findById(managerId).orElseThrow(() -> new RuntimeException("Manager not found with id: " + managerId));
        ManagerDashboardDto managerDashboard = new ManagerDashboardDto();
        managerDashboard.setName(manager.getName());
        managerDashboard.setEmail(manager.getEmail());
        managerDashboard.setContact(manager.getContact());
        return managerDashboard;
    }

    public EmployeeDashboardDto viewEmployeeDetails(Long employeeId) {
        Employee employee = employeeRepo.findById(employeeId).orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));
        EmployeeDashboardDto employeeDashboard = new EmployeeDashboardDto();
        employeeDashboard.setName(employee.getName());
        employeeDashboard.setEmail(employee.getEmail());
        employeeDashboard.setContact(employee.getContact());
        employeeDashboard.setDesignation(employee.getDesignation());
        return employeeDashboard;
    }
}
