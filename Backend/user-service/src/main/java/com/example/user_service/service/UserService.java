package com.example.user_service.service;

import com.example.user_service.dto.*;
import com.example.user_service.model.Employee;
import com.example.user_service.model.Manager;
import com.example.user_service.model.User;
import com.example.user_service.model.UserRole;
import com.example.user_service.repository.EmployeeRepo;
import com.example.user_service.repository.ManagerRepo;
import com.example.user_service.repository.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;

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

        if (manager.getEmail() != null && managerRepo.existsByEmail(manager.getEmail())) {
            throw new RuntimeException("User already exists");
        }
        userRepo.save(user);
        managerRepo.save(manager);
        return manager;

    }

    public Employee registerEmployee(EmployeeDto employeedto, Long managerId) {
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
                .password(encoder.encode(employeedto.getPassword()))
                .role(UserRole.EMPLOYEE)
                .build();

        if (employee.getEmail() != null && employeeRepo.existsByEmail(manager.getEmail())) {
            throw new RuntimeException("Employee already exists");
        }
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
        try {
            Manager manager = managerRepo.findById(managerId)
                    .orElseThrow(() -> new IllegalArgumentException("Manager not found with id: " + managerId));
            return manager.getEmployees();
        } catch (IllegalArgumentException e) {
            // Handle case where the manager is not found
            throw new RuntimeException("Error retrieving employees: " + e.getMessage(), e);
        } catch (Exception e) {
            // Handle any other unexpected exceptions
            throw new RuntimeException("An unexpected error occurred while retrieving employees", e);
        }
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
        try {
            // Check if the employee exists
            Employee employee = employeeRepo.findById(employeeId)
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + employeeId));

            // Remove the employee from the manager's list of employees
            Manager manager = employee.getManager();
            if (manager != null) {
                manager.getEmployees().remove(employee);
                managerRepo.save(manager);
            }

            // Delete the user from the user repository
            try {
                userRepo.deleteByEmail(employee.getEmail());
            } catch (Exception e) {
                throw new RuntimeException("Error occurred while deleting user associated with email: " + employee.getEmail(), e);
            }

            // Now delete the employee
            try {
                employeeRepo.deleteById(employeeId);
            } catch (DataIntegrityViolationException e) {
                throw new RuntimeException("Data integrity violation occurred while deleting employee with id: " + employeeId, e);
            } catch (Exception e) {
                throw new RuntimeException("Error occurred while deleting employee with id: " + employeeId, e);
            }

            return "Employee deleted successfully";
        } catch (IllegalArgumentException e) {
            // Handle case where the employee is not found
            throw new RuntimeException("Error retrieving employee: " + e.getMessage(), e);
        } catch (TransactionSystemException e) {
            // Handle case where transaction-related errors occur
            throw new RuntimeException("Transaction error occurred while deleting employee with id: " + employeeId, e);
        } catch (Exception e) {
            // Handle any other unexpected exceptions
            throw new RuntimeException("An unexpected error occurred while deleting employee with id: " + employeeId, e);
        }
    }


    public Employee viewEmployeeById(Long employeeId) {
        try {
            // Attempt to find the employee by ID
            return employeeRepo.findById(employeeId)
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + employeeId));
        } catch (IllegalArgumentException e) {
            // Handle the case where the employee is not found
            throw new RuntimeException("Error retrieving employee: " + e.getMessage(), e);
        } catch (DataAccessException e) {
            // Handle database access errors
            throw new RuntimeException("Database error occurred while retrieving employee with id: " + employeeId, e);
        } catch (Exception e) {
            // Handle any other unexpected exceptions
            throw new RuntimeException("An unexpected error occurred while retrieving employee with id: " + employeeId, e);
        }
    }
    public ManagerDashboardDto viewManagerDetails(Long managerId) {
        try {
            // Attempt to find the manager by ID
            Manager manager = managerRepo.findById(managerId)
                    .orElseThrow(() -> new IllegalArgumentException("Manager not found with id: " + managerId));

            // Create and populate the DTO
            ManagerDashboardDto managerDashboard = new ManagerDashboardDto();
            managerDashboard.setName(manager.getName());
            managerDashboard.setEmail(manager.getEmail());
            managerDashboard.setContact(manager.getContact());

            return managerDashboard;
        } catch (IllegalArgumentException e) {
            // Handle the case where the manager is not found
            throw new RuntimeException("Error retrieving manager details: " + e.getMessage(), e);
        } catch (DataAccessException e) {
            // Handle database access errors
            throw new RuntimeException("Database error occurred while retrieving manager details with id: " + managerId, e);
        } catch (Exception e) {
            // Handle any other unexpected exceptions
            throw new RuntimeException("An unexpected error occurred while retrieving manager details with id: " + managerId, e);
        }
    }

    public EmployeeDashboardDto viewEmployeeDetails(Long employeeId) {
        try {
            // Attempt to find the employee by ID
            Employee employee = employeeRepo.findById(employeeId)
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + employeeId));

            // Create and populate the DTO
            EmployeeDashboardDto employeeDashboard = new EmployeeDashboardDto();
            employeeDashboard.setName(employee.getName());
            employeeDashboard.setEmail(employee.getEmail());
            employeeDashboard.setContact(employee.getContact());
            employeeDashboard.setDesignation(employee.getDesignation());

            return employeeDashboard;
        } catch (IllegalArgumentException e) {
            // Handle the case where the employee is not found
            throw new RuntimeException("Error retrieving employee details: " + e.getMessage(), e);
        } catch (DataAccessException e) {
            // Handle database access errors
            throw new RuntimeException("Database error occurred while retrieving employee details with id: " + employeeId, e);
        } catch (Exception e) {
            // Handle any other unexpected exceptions
            throw new RuntimeException("An unexpected error occurred while retrieving employee details with id: " + employeeId, e);
        }
    }

}
