package com.example.user_service.service;

import com.example.user_service.dto.*;
import com.example.user_service.exceptions.EmployeeNotFoundException;
import com.example.user_service.exceptions.ManagerNotFoundException;
import com.example.user_service.model.Employee;
import com.example.user_service.model.Manager;
import com.example.user_service.model.User;
import com.example.user_service.model.UserRole;
import com.example.user_service.repository.EmployeeRepo;
import com.example.user_service.repository.ManagerRepo;
import com.example.user_service.repository.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private ManagerRepo managerRepo;

    @Autowired
    private UserRepo userRepo;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Transactional
    public Manager registerManager(ManagerDto managerDto) {

        Manager manager = Manager.builder()
                .name(managerDto.getName())
                .email(managerDto.getEmail())
//                .password(managerDto.getPassword())
                .contact(managerDto.getContact())
                .build();
        User user = User.builder()
                .email(managerDto.getEmail())
                .password(encoder.encode(managerDto.getPassword()))
                .role(UserRole.MANAGER)
                .build();

        userRepo.save(user);
        managerRepo.save(manager);
        return manager;

    }

    public Employee registerEmployee(EmployeeDto employeedto, Long managerId) {
        Manager manager = managerRepo.findById(managerId).orElseThrow(() -> new ManagerNotFoundException("Manager not found"));
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
                .password(encoder.encode(employeedto.getPassword()))
                .role(UserRole.EMPLOYEE)
                .build();

        userRepo.save(user);
        employeeRepo.save(employee);
        return employee;
    }

    public AuthenticationResponse verify(User user) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(user.getEmail());
            Optional<User> existingUser = userRepo.findByEmail(user.getEmail());
            if (existingUser.isPresent() && existingUser.get().getRole() == UserRole.MANAGER) {
                Manager existingManager = managerRepo.findByEmail(existingUser.get().getEmail());
                return new AuthenticationResponse(token, existingManager.getManagerId());
            } else if (existingUser.isPresent() && existingUser.get().getRole() == UserRole.EMPLOYEE) {
                Employee existingEmployee = employeeRepo.findByEmail(existingUser.get().getEmail());
                return new AuthenticationResponse(token, existingEmployee.getEmpId());
            }

        }
        return new AuthenticationResponse("Failed", null);

    }

//    public User getuserdetails(String username) {
//        return userRepo.findByUsername(username);
//    }


//    public List<Manager> getAllManagers() {
//        return managerRepo.findAll();
//    }

    public List<Employee> viewEmployees(Long managerId) {
        Manager manager = managerRepo.findById(managerId)
                .orElseThrow(() -> new ManagerNotFoundException("Manager not found with id: " + managerId));
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
    public String deleteEmployee(Long employeeId) {
        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + employeeId));

        // Remove the employee from the manager's list of employees
        Manager manager = employee.getManager();
        if (manager != null) {
            manager.getEmployees().remove(employee);
            managerRepo.save(manager);
        }

        // Delete the employee from the user repository
        userRepo.deleteByEmail(employee.getEmail());

        // Now delete the employee
        employeeRepo.deleteById(employeeId);
        return "Employee deleted successfully";
    }


    public Employee viewEmployeeById(Long employeeId) {
        // Attempt to find the employee by ID
        return employeeRepo.findById(employeeId)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + employeeId));
    }

    public ManagerDashboardDto viewManagerDetails(Long managerId) {
        // Attempt to find the manager by ID
        Manager manager = managerRepo.findById(managerId)
                .orElseThrow(() -> new ManagerNotFoundException("Manager not found with id: " + managerId));

        // Create and populate the DTO
        ManagerDashboardDto managerDashboard = new ManagerDashboardDto();
        managerDashboard.setName(manager.getName());
        managerDashboard.setEmail(manager.getEmail());
        managerDashboard.setContact(manager.getContact());

        return managerDashboard;
    }

    public EmployeeDashboardDto viewEmployeeDetails(Long employeeId) {
        // Attempt to find the employee by ID
        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + employeeId));

        // Create and populate the DTO
        EmployeeDashboardDto employeeDashboard = new EmployeeDashboardDto();
        employeeDashboard.setName(employee.getName());
        employeeDashboard.setEmail(employee.getEmail());
        employeeDashboard.setContact(employee.getContact());
        employeeDashboard.setDesignation(employee.getDesignation());

        return employeeDashboard;
    }
}
