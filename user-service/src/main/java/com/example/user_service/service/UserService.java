package com.example.user_service.service;

import com.example.user_service.dto.EmployeeDto;
import com.example.user_service.dto.ManagerDto;
import com.example.user_service.model.Employee;
import com.example.user_service.model.Manager;
import com.example.user_service.model.User;
import com.example.user_service.model.UserRole;
import com.example.user_service.repository.EmployeeRepo;
import com.example.user_service.repository.ManagerRepo;
import com.example.user_service.repository.UserRepo;
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
                .password(managerDto.getPassword())
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
                .password(employeedto.getPassword())
                .contact(employeedto.getContact())
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

    public List<Manager> getAllManagers() {
        return managerRepo.findAll();
    }
}
