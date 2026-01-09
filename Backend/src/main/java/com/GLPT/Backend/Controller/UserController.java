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

@Controller
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public UserResponse register(@RequestBody UserRegistrationRequest request){
        User user = userService.register(request);
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setEmail(user.getEmail());
        return response;
    }

}
