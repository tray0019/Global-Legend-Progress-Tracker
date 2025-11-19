package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.GoalCreateDto;
import com.GLPT.Backend.DTO.GoalResponseDto;
import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Service.GoalService;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping("/goals")//set goalView
    public List<Goal> getAllGoal(){
        return service.viewAllGoal();
    }

    /**
     *  -- View One Goal and its Progress EntryService
     */

    @GetMapping("/goals/{goalId}")
    public Goal getGoal(@PathVariable long goalId){
        return service.viewGoal(goalId);
    }

    /**
     *  -- Rename Goal title
     */
    @PutMapping("/goals/{goalId}")
    public Goal renameGoal(@PathVariable long goalId, @RequestParam String newTitle){
        return service.renameGoal(goalId,newTitle);
    }

    /**
     * -- delete a goal
     */
    @DeleteMapping("/goals/{goalId}")
    public void deleteGoal(@PathVariable long goalId){
         service.deleteGoal(goalId);
    }





}
