package com.example.user_service.controller;

import com.example.user_service.dto.AuthenticationResponse;
import com.example.user_service.model.User;
import com.example.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    private UserService service;


    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody User user) {
        return service.verify(user);
    }


}