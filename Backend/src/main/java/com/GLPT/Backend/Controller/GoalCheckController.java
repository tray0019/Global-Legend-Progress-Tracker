package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.GlobalContributionDto;
import com.GLPT.Backend.DTO.GoalCheckDto;
import com.GLPT.Backend.DTO.GoalTodayStatusDto;
import com.GLPT.Backend.Entity.GoalCheck;
import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Entity.UserProgress;
import com.GLPT.Backend.Service.GoalCheckService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000/")
public class GoalCheckController {

    private final GoalCheckService goalService;

    GoalCheckController(GoalCheckService goalService){
        this.goalService = goalService;
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

    @PostMapping("/goals/{goalId}/checks")
    public boolean markGoalDoneToday(@PathVariable long goalId){
        return goalService.markGoalDoneToday(goalId);
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @PostMapping("/users/goals/{goalId}/checks")
    public boolean markGoalDoneTodayForUser(
            @PathVariable long goalId,
            HttpSession session
    ) {
        User user = requireUser(session);
        return goalService.toggleDoneTodayForUser(goalId, user);
    }


    @GetMapping("/goals/{goalId}/checks")
    public List<GoalCheckDto> getChecksForGoal(
            @PathVariable long goalId,
            @RequestParam LocalDate from,
            @RequestParam LocalDate to) {

        List<GoalCheck> checks =
                goalService.getChecksForGoalBetween(goalId, from, to);

        List<GoalCheckDto> result = new ArrayList<>();

        for(GoalCheck check: checks){
            GoalCheckDto dto = new GoalCheckDto(check.getCheckDate());
            result.add(dto);
        }

        return result;
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @GetMapping("/users/goals/{goalId}/checks")
    public List<GoalCheckDto> getChecksForGoalForUser(
            @PathVariable long goalId,
            @RequestParam LocalDate from,
            @RequestParam LocalDate to,
            HttpSession session
    ) {
        User user = requireUser(session);

        List<GoalCheck> checks =
                goalService.getChecksForUserBetween(user, from, to);

        return checks.stream()
                .map(c -> new GoalCheckDto(c.getCheckDate()))
                .toList();
    }


    @GetMapping("/calendar/contributions")
    public List<GlobalContributionDto> getGlobalContributions(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to){
        return goalService.getGlobalContribution(from,to);
    }

    @PostMapping("/goals/{goalId}/checks/today/toggle")
    public GoalTodayStatusDto toggleToday(@PathVariable long goalId){
        boolean done = goalService.toggleDoneToday(goalId);
        return new GoalTodayStatusDto(goalId, done);
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @PostMapping("/users/goals/{goalId}/checks/today/toggle")
    public GoalTodayStatusDto toggleTodayForUser(
            @PathVariable long goalId,
            HttpSession session
    ) {
        User user = requireUser(session);
        boolean done = goalService.toggleDoneTodayForUser(goalId, user);
        return new GoalTodayStatusDto(goalId, done);
    }


    @GetMapping("/goals/{goalId}/checks/today")
    public GoalTodayStatusDto isDoneToday(@PathVariable long goalId) {
        boolean done = goalService.isDoneToday(goalId);
        return new GoalTodayStatusDto(goalId, done);
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @GetMapping("/users/goals/{goalId}/checks/today")
    public GoalTodayStatusDto isDoneTodayForUser(
            @PathVariable long goalId,
            HttpSession session
    ) {
        User user = requireUser(session);
        boolean done = goalService.isDoneTodayForUser(goalId, user);
        return new GoalTodayStatusDto(goalId, done);
    }

}

