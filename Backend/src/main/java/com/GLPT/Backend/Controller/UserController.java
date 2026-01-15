package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.CompleteProfileRequest;
import com.GLPT.Backend.DTO.UserRegistrationRequest;
import com.GLPT.Backend.DTO.UserResponse;
import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000/")
public class UserController {

    @Autowired
    private UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/oauth-register")
    public UserResponse register(@RequestBody UserRegistrationRequest request,
                                 HttpSession session){
        User user = userService.registerOAuthUser(request);

        // store user in session
        session.setAttribute("currentUser", user);

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
            @Valid @RequestBody CompleteProfileRequest request,
            HttpSession session){

        User currentUser = (User) session.getAttribute("currentUser");

        if(currentUser == null){
            throw new RuntimeException("Not logged in");
        }

        User updateUser = userService.completeProfile(currentUser.getId(), request);

        return new UserResponse(
                updateUser.getId(),
                updateUser.getFirstName(),
                updateUser.getLastName(),
                updateUser.getEmail(),
                updateUser.getBirthDate(),
                updateUser.getGender(),
                updateUser.isProfileCompleted()
        );

    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        User user = userService.findById(id); // we'll add this in UserService
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

    @GetMapping("/{id}/goals")
    public List<Goal> getUserGoals(@PathVariable Long id) {
        User user = userService.findById(id); // we'll add this method
        return user.getGoals();
    }



}
