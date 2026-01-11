package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.UserRegistrationRequest;
import com.GLPT.Backend.DTO.UserResponse;
import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/oauth-register")
    public UserResponse register(@RequestBody UserRegistrationRequest request){
        User user = userService.registerOAuthUser(request);
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getBirthDate(),
                user.getGender(),
                user.isProfileCompleted()
        );
    }

}
