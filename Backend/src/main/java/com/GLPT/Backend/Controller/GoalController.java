package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.GoalCreateDto;
import com.GLPT.Backend.DTO.GoalResponseDto;
import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Service.GoalService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class GoalController {


    private final GoalService service;

    GoalController(GoalService service){
        this.service = service;
    }

    @PostMapping("/goals")
    public GoalResponseDto createGoal(@RequestBody GoalCreateDto dto){
        Goal goal = new Goal();
        goal.setGoalTitle(dto.getGoalTitle());
        Goal save = service.createNewGoal(goal);
        return new GoalResponseDto(save.getId(), save.getGoalTitle());
    }

    /**
     * -- View All Goals
     */
    @GetMapping("/goals")
    public List<GoalResponseDto> getAllGoals(){
        List<Goal> goals =  service.viewAllGoal();
        List<GoalResponseDto> dtoList = new ArrayList<>();

        for(Goal goal: goals){
            GoalResponseDto dto = new GoalResponseDto(goal.getId(), goal.getGoalTitle());
            dtoList.add(dto);
        }

        return dtoList;

    }

    /**
     *  -- View One Goal and its Progress EntryService
     */

    @GetMapping("/goals/{goalId}")
    public GoalResponseDto getGoal(@PathVariable long goalId){
        Goal goal =  service.viewGoal(goalId);
        return new GoalResponseDto(goal.getId(),goal.getGoalTitle());
    }

    /**
     *  -- Rename Goal title
     */
    @PutMapping("/goals/{goalId}")
    public GoalResponseDto renameGoal(@PathVariable long goalId, @RequestParam String newTitle){
        Goal goal = service.renameGoal(goalId, newTitle);
        return new GoalResponseDto(goal.getId(),goal.getGoalTitle());
    }

    /**
     * -- delete a goal
     */
    @DeleteMapping("/goals/{goalId}")
    public void deleteGoal(@PathVariable long goalId){
         service.deleteGoal(goalId);
    }





}
