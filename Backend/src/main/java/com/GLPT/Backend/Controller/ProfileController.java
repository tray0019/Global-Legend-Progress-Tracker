package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.GlobalContributionDto;
import com.GLPT.Backend.DTO.PublicGoalDetailDto;
import com.GLPT.Backend.DTO.UserProfileDto;
import com.GLPT.Backend.Entity.GoalCheck;
import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Entity.UserProgress;
import com.GLPT.Backend.Repository.GoalRepository;
import com.GLPT.Backend.Repository.UserRepository;
import com.GLPT.Backend.Service.GoalCheckService;
import com.GLPT.Backend.Service.GoalService;
import com.GLPT.Backend.Service.UserProgressService;
import com.GLPT.Backend.Service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
public class ProfileController {

    @Autowired
    private UserService userService;
    private final UserRepository userRepository;
    private final GoalService goalService;
    private final GoalCheckService goalCheckService;
    private final UserProgressService progressService;

    private final GoalRepository goalRepository;

    public ProfileController(UserRepository userRepository, GoalService goalService, GoalCheckService goalCheckService, UserProgressService progressService, GoalRepository goalRepository) {
        this.userRepository = userRepository;
        this.goalService = goalService;
        this.goalCheckService = goalCheckService;
        this.progressService = progressService;
        this.goalRepository = goalRepository;

    }

    private User requireUser(HttpSession session) {
        User user = (User) session.getAttribute("currentUser");

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Login required");
        }

        if (!user.isProfileCompleted()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Complete profile first");
        }

        return user;
    }

    @GetMapping("/users/profile/{targetId}")
    public UserProfileDto getPublicProfile(@PathVariable Long targetId,
                                           @RequestParam(required = false) LocalDate from,
                                           @RequestParam(required = false) LocalDate to,
                                           HttpSession session) {
        User viewer = requireUser(session);
        User target = userRepository.findById(targetId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // Default timeframe: last 6 months for the calendar
        LocalDate start = (from != null) ? from : LocalDate.now().minusMonths(6);
        LocalDate end = (to != null) ? to : LocalDate.now();

        // 1. Re-use Service logic for the heatmap
        List<GlobalContributionDto> calendar = goalCheckService.getUserContribution(target, start, end);

        // 1. Get Progress & Stats
        UserProgress progress = progressService.getProgressWithDecayCheckForUser(target);

        // 2. Map Goals with their Check-ins using your existing Service method
        List<PublicGoalDetailDto> goalDetails = goalService.getActiveGoalsForUser(target).stream()
                .map(goal -> {
                    // Re-using: getChecksForUserAndGoalBetween(long goalId, User user, LocalDate from, LocalDate to)
                    List<LocalDate> checks = goalCheckService
                            .getChecksForUserAndGoalBetween(goal.getId(), target, start, end)
                            .stream()
                            .map(GoalCheck::getCheckDate) // Extract just the LocalDate from the GoalCheck entity
                            .toList();

                    return new PublicGoalDetailDto(
                            goal.getId(),
                            goal.getGoalTitle(),
                            goal.getPosition(),
                            checks
                    );
                }).toList();

        return new UserProfileDto(
                target.getId(),
                target.getFirstName(),
                target.getLastName(),
                progress.getCurrentRank().name(),
                progress.getTotalXP(),
                target.getFollowers().size(),
                target.getFollowing().size(),
                target.getFollowers().contains(viewer),
                goalDetails,
                calendar
        );
    }
}
