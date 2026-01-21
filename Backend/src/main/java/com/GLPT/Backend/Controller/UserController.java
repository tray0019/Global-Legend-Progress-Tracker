package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.*;
import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Entity.ProgressEntry;
import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Repository.GoalRepository;
import com.GLPT.Backend.Repository.UserRepository;
import com.GLPT.Backend.Service.GoalService;
import com.GLPT.Backend.Service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.oauth2.core.user.OAuth2User;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;
    private final UserRepository userRepository;
    private final GoalService goalService;
    private final GoalRepository goalRepository;

    public UserController(UserService userService, UserRepository userRepository, GoalService goalService, GoalRepository goalRepository){
        this.userService = userService;
        this.userRepository = userRepository;
        this.goalService = goalService;
        this.goalRepository = goalRepository;
    }

    @GetMapping("/me/goals")
    public List<GoalWithEntriesDto> getMyGoals(HttpSession session) {
        User user = (User) session.getAttribute("currentUser");

        if (user == null) {
            // TEMP: use first user in DB for testing
            user = userRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new RuntimeException("No users in DB"));
            session.setAttribute("currentUser", user);
        }

        return userService.getUserGoalsWithEntries(user.getId());
    }








//    @GetMapping("/{userId}/goals")
//    public List<GoalWithEntriesDto> getUserGoals(@PathVariable Long userId) {
//        return userService.getUserGoalsWithEntries(userId);
//    }

    @GetMapping("/me/goals/{goalId}")
    public GoalWithEntriesDto getMyGoal(
            @PathVariable long goalId,
            HttpSession session
    ) {

        User user = (User) session.getAttribute("currentUser");
        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Login required"
            );
        }

        Goal goal = userService.viewGoalForUser(goalId, user);

        List<EntryResponseDto> entryDto = new ArrayList<>();
        for(ProgressEntry entry: goal.getEntries()){
            entryDto.add(new EntryResponseDto(entry.getId(),entry.getDescription()));
        }

        // map checks
        List<GoalCheckDto> checkDtos = goal.getChecks().stream()
                .map(check -> new GoalCheckDto(check.getCheckDate()))
                .toList();

        // map user info
        long uId = goal.getUser().getId();
        String uName = (goal.getUser().getFirstName() != null ? goal.getUser().getFirstName() : "") +
                " " +
                (goal.getUser().getLastName() != null ? goal.getUser().getLastName() : "");


        return new GoalWithEntriesDto(goal.getId(),goal.getGoalTitle(),entryDto,checkDtos,
                uId,
                uName.trim());
    }



    @PostMapping("/oauth-register")
    public UserResponse register(@RequestBody UserRegistrationRequest request,
                                 HttpSession session){
        User user = userService.registerOrLoginOAuthUser(request);

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
            @Valid @RequestBody CompleteProfileRequest request) {

        User updatedUser = userService.completeProfile(userId, request);

        return new UserResponse(
                updatedUser.getId(),
                updatedUser.getFirstName(),
                updatedUser.getLastName(),
                updatedUser.getEmail(),
                updatedUser.getBirthDate(),
                updatedUser.getGender(),
                updatedUser.isProfileCompleted()
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


    @GetMapping("/me")
    public UserResponse getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("currentUser");

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Not logged in"
            );
        }

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

    @PostMapping("/logout")
    public void logout(HttpSession session) {
        session.invalidate();
    }




}
