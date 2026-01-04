package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.GlobalContributionDto;
import com.GLPT.Backend.DTO.GoalCheckDto;
import com.GLPT.Backend.DTO.GoalTodayStatusDto;
import com.GLPT.Backend.Entity.GoalCheck;
import com.GLPT.Backend.Entity.UserProgress;
import com.GLPT.Backend.Service.GoalCheckService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/goals/{goalId}/checks")
    public boolean markGoalDoneToday(@PathVariable long goalId){
        return goalService.markGoalDoneToday(goalId);
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

    @GetMapping("/goals/{goalId}/checks/today")
    public GoalTodayStatusDto isDoneToday(@PathVariable long goalId) {
        boolean done = goalService.isDoneToday(goalId);
        return new GoalTodayStatusDto(goalId, done);
    }






}
