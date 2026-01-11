package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.CompleteProfileRequest;
import com.GLPT.Backend.DTO.UserRegistrationRequest;
import com.GLPT.Backend.DTO.UserResponse;
import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/complete-profile/{userId}")
    public UserResponse completeProfile(
            @PathVariable Long userId,
            @Valid @RequestBody CompleteProfileRequest request){

        User user = userService.completeProfile(userId, request);

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
