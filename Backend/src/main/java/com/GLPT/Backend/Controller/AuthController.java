package com.GLPT.Backend.Controller;

import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/dev-login")
    public void devLogin(HttpSession session) {
        User user = userRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No users in DB"));

        session.setAttribute("currentUser", user);
    }
}

