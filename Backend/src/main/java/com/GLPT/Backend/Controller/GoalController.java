package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.*;
import com.GLPT.Backend.Entity.*;
import com.GLPT.Backend.Service.GoalService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class GoalController {


    private final GoalService service;

    GoalController(GoalService service){
        this.service = service;
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


    @PostMapping("/goals")
    public GoalResponseDto createGoal(
            @Valid @RequestBody GoalCreateDto dto,
            HttpSession session
    ) {
        User user = requireUser(session);

        Goal goal = service.createGoalForUser(
                dto.getGoalTitle(),
                user
        );

        // difficulty override (optional)
        if (dto.getDifficulty() != null) {
            goal.setDifficulty(Difficulty.fromValue(dto.getDifficulty()));
        }

        return new GoalResponseDto(
                goal.getId(),
                goal.getGoalTitle(),
                goal.getDifficulty().getValue(),
                goal.getPosition(),
                goal.getStatus(),
                goal.getStatus() == GoalStatus.ARCHIVED
        );
    }



    /*
    @PostMapping("/goals")
    public GoalResponseDto createGoal(@Valid @RequestBody GoalCreateDto dto){
        Goal goal = new Goal();
        goal.setGoalTitle(dto.getGoalTitle());

        if (dto.getDifficulty() != null){
            goal.setDifficulty(Difficulty.fromValue(dto.getDifficulty()));
        }else{
            goal.setDifficulty(Difficulty.MEDIUM);
        }

        Goal save = service.createNewGoal(goal);
        return new GoalResponseDto(
                goal.getId(),
                goal.getGoalTitle(),
                goal.getDifficulty().getValue(),
                goal.getPosition(),
                goal.getStatus(),
                goal.getStatus() == GoalStatus.ARCHIVED
        );
    }*/

    // ==== USER-SCOPE (Phase 2+) ====
    @PostMapping("/users/goals")
    public GoalResponseDto createGoalForUser(
            @Valid @RequestBody GoalCreateDto dto,
            HttpSession session) {

        User user = requireUser(session);

        Goal goal = service.createGoalForUser(
                dto.getGoalTitle(),
                user
        );

        return new GoalResponseDto(
                goal.getId(),
                goal.getGoalTitle(),
                goal.getDifficulty().getValue(),
                goal.getPosition(),
                goal.getStatus(),
                goal.isArchived()
        );
    }

    /**
     * -- View All Goals

    @GetMapping("/goals")
    public List<GoalResponseDto> getAllGoals(){
        List<Goal> goals =  service.viewAllGoal();
        List<GoalResponseDto> dtoList = new ArrayList<>();

        for(Goal goal: goals){
            GoalResponseDto dto = new GoalResponseDto(
                    goal.getId(),
                    goal.getGoalTitle(),
                    goal.getDifficulty().getValue(),
                    goal.getPosition(),
                    goal.getStatus(), goal.getStatus() == GoalStatus.ARCHIVED
            );
            dtoList.add(dto);
        }

        return dtoList;

    }*/

    // ==== USER-SCOPE (Phase 2+) ====
    @GetMapping("/goals")
    public List<GoalResponseDto> getAllGoals(HttpSession session) {
        User user = requireUser(session);

        List<Goal> goals = service.viewAllGoalsForUser(user);
        List<GoalResponseDto> dtoList = new ArrayList<>();

        for (Goal goal : goals) {
            dtoList.add(new GoalResponseDto(
                    goal.getId(),
                    goal.getGoalTitle(),
                    goal.getDifficulty().getValue(),
                    goal.getPosition(),
                    goal.getStatus(),
                    goal.getStatus() == GoalStatus.ARCHIVED
            ));
        }

        return dtoList;
    }


    /**
     *  -- View One Goal and its Progress EntryService
     */
    @GetMapping("/goals/{goalId}")
    public GoalWithEntriesDto getGoal(@PathVariable long goalId){
        Goal goal =  service.viewGoal(goalId);

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

    // ==== USER-SCOPE (Phase 2+) ====
    @GetMapping("/users/goals/{goalId}")
    public GoalWithEntriesDto getUserGoal(
            @PathVariable long goalId,
            HttpSession session
    ) {
        User user = requireUser(session);

        Goal goal = service.viewGoalForUser(goalId, user);

        List<EntryResponseDto> entryDto = new ArrayList<>();
        for (ProgressEntry entry : goal.getEntries()) {
            entryDto.add(new EntryResponseDto(
                    entry.getId(),
                    entry.getDescription()
            ));
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

        return new GoalWithEntriesDto(
                goal.getId(),
                goal.getGoalTitle(),
                entryDto,
                checkDtos,
                uId,
                uName.trim()
        );
    }

    /**
     *  -- Rename Goal title
     */
    @PutMapping("/goals/{goalId}")
    public GoalResponseDto renameGoal(@PathVariable long goalId, @RequestParam String newTitle){
        Goal goal = service.renameGoal(goalId, newTitle);
        return new GoalResponseDto(
                goal.getId(),
                goal.getGoalTitle(),
                goal.getDifficulty().getValue(),
                goal.getPosition(),
                goal.getStatus(),
                goal.getStatus() == GoalStatus.ARCHIVED
        );
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @PutMapping("/users/goals/{goalId}")
    public GoalResponseDto renameGoalForUser(
            @PathVariable long goalId,
            @RequestParam String newTitle,
            HttpSession session) {

        User user = requireUser(session);
        Goal goal = service.renameGoalForUser(goalId, newTitle, user);

        return new GoalResponseDto(
                goal.getId(),
                goal.getGoalTitle(),
                goal.getDifficulty().getValue(),
                goal.getPosition(),
                goal.getStatus(),
                goal.isArchived()
        );
    }

    /**
     * -- delete a goal
     */
    @DeleteMapping("/goals/{goalId}")
    public void deleteGoal(@PathVariable long goalId){
         service.deleteGoal(goalId);
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @DeleteMapping("/users/goals/{goalId}")
    public void deleteGoalForUser(
            @PathVariable long goalId,
            HttpSession session) {

        User user = requireUser(session);
        service.deleteGoalForUser(goalId, user);
    }

    @PutMapping("/goals/reorder")
    public void reorderGoals(@RequestBody List<GoalPositionDto> positions){
        service.updatePositions(positions);
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @PutMapping("/users/goals/reorder")
    public void reorderGoalsForUser(
            @RequestBody List<GoalPositionDto> positions,
            HttpSession session) {

        User user = requireUser(session);
        service.updatePositionsForUser(positions, user);
    }


    @PutMapping("/goals/{goalId}/archived/toggle")
    public Map<String, Object> toggleArchive(@PathVariable long goalId){
        boolean archived = service.toggleArchive(goalId);
        return Map.of(
                "goalId", goalId,
                "archived", archived
        );
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @PutMapping("/users/goals/{goalId}/archived/toggle")
    public Map<String, Object> toggleArchiveForUser(
            @PathVariable long goalId,
            HttpSession session) {

        User user = requireUser(session);
        boolean archived = service.toggleArchiveForUser(goalId, user);

        return Map.of(
                "goalId", goalId,
                "archived", archived
        );
    }

    @GetMapping("/goals/archived")
    public List<GoalResponseDto> getArchivedGoals() {
        List<Goal> archived = service.getArchiveGoals();
        List<GoalResponseDto> dtoList = new ArrayList<>();
        for (Goal goal : archived) {
            dtoList.add(new GoalResponseDto(
                    goal.getId(),
                    goal.getGoalTitle(),
                    goal.getDifficulty().getValue(),
                    goal.getPosition(),
                    goal.getStatus(), goal.getStatus() == GoalStatus.ARCHIVED
            ));
        }
        return dtoList;
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @GetMapping("/users/goals/archived")
    public List<GoalResponseDto> getArchivedGoalsForUser(HttpSession session) {
        User user = requireUser(session);

        List<Goal> goals = service.getArchiveGoalsForUser(user);
        List<GoalResponseDto> dtoList = new ArrayList<>();

        for (Goal goal : goals) {
            dtoList.add(new GoalResponseDto(
                    goal.getId(),
                    goal.getGoalTitle(),
                    goal.getDifficulty().getValue(),
                    goal.getPosition(),
                    goal.getStatus(),
                    goal.isArchived()
            ));
        }

        return dtoList;
    }

    @GetMapping("/goals/active")
    public List<GoalResponseDto> getActiveGoals() {
        List<Goal> active = service.getActiveGoals(); // only archived=false
        List<GoalResponseDto> dtoList = new ArrayList<>();
        for (Goal goal : active) {
            dtoList.add(new GoalResponseDto(
                    goal.getId(),
                    goal.getGoalTitle(),
                    goal.getDifficulty().getValue(),
                    goal.getPosition(),
                    goal.getStatus(),
                    goal.getStatus() == GoalStatus.ACTIVE));
        }
        return dtoList;
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @GetMapping("/users/goals/active")
    public List<GoalResponseDto> getActiveGoalsForUser(HttpSession session) {
        User user = requireUser(session);

        List<Goal> goals = service.getActiveGoalsForUser(user);
        List<GoalResponseDto> dtoList = new ArrayList<>();

        for (Goal goal : goals) {
            dtoList.add(new GoalResponseDto(
                    goal.getId(),
                    goal.getGoalTitle(),
                    goal.getDifficulty().getValue(),
                    goal.getPosition(),
                    goal.getStatus(),
                    goal.isArchived()
            ));
        }

        return dtoList;
    }


    @PatchMapping("/goals/{goalId}/difficulty")
    public GoalResponseDto updateDifficulty(
            @PathVariable long goalId,
            @RequestBody GoalDifficultyDto dto){

        Difficulty difficultyEnum = Difficulty.fromValue(dto.getDifficulty());
        Goal goal = service.updateDifficulty(goalId, (difficultyEnum));

        return new GoalResponseDto(
                goal.getId(),
                goal.getGoalTitle(),
                goal.getDifficulty().getValue(),
                goal.getPosition(),
                goal.getStatus(),
                goal.getStatus() == GoalStatus.ACTIVE
        );
    }

    // ==== USER-SCOPE (Phase 2+) ====

    @PatchMapping("/goals/{goalId}/complete")
    public GoalResponseDto completeGoal(@PathVariable long goalId) {
        Goal goal = service.completeGoal(goalId);

        return new GoalResponseDto(
                goal.getId(),
                goal.getGoalTitle(),
                goal.getDifficulty().getValue(),
                goal.getPosition(),
                goal.getStatus(),
                goal.getStatus() == GoalStatus.ARCHIVED
        );
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @PatchMapping("/users/goals/{goalId}/complete")
    public GoalResponseDto completeGoalForUser(
            @PathVariable long goalId,
            HttpSession session) {

        User user = requireUser(session);
        Goal goal = service.completeGoalForUser(goalId, user);

        return new GoalResponseDto(
                goal.getId(),
                goal.getGoalTitle(),
                goal.getDifficulty().getValue(),
                goal.getPosition(),
                goal.getStatus(),
                goal.isArchived()
        );
    }


    @GetMapping("/goals/achievements")
    public List<GoalResponseDto> getAchievements() {
        List<Goal> goals = service.getAchievements();
        List<GoalResponseDto> dtoList = new ArrayList<>();
        for (Goal goal : goals) {
            dtoList.add(new GoalResponseDto(
                    goal.getId(),
                    goal.getGoalTitle(),
                    goal.getDifficulty().getValue(),
                    goal.getPosition(),
                    goal.getStatus(),
                    goal.getStatus() == GoalStatus.ARCHIVED
            ));
        }
        return dtoList;
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @GetMapping("/users/goals/achievements")
    public List<GoalResponseDto> getAchievementsForUser(HttpSession session) {
        User user = requireUser(session);

        List<Goal> goals = service.getAchievementsForUser(user);
        List<GoalResponseDto> dtoList = new ArrayList<>();

        for (Goal goal : goals) {
            dtoList.add(new GoalResponseDto(
                    goal.getId(),
                    goal.getGoalTitle(),
                    goal.getDifficulty().getValue(),
                    goal.getPosition(),
                    goal.getStatus(),
                    goal.isArchived()
            ));
        }

        return dtoList;
    }


    @PutMapping("/goals/{goalId}/achievement/toggle")
    public GoalResponseDto toggleAchievement(@PathVariable long goalId) {
        Goal goal = service.toggleAchievement(goalId);

        return new GoalResponseDto(
                goal.getId(),
                goal.getGoalTitle(),
                goal.getDifficulty().getValue(),
                goal.getPosition(),
                goal.getStatus(),
                goal.getStatus() == GoalStatus.ARCHIVED
        );
    }

    // ==== USER-SCOPE (Phase 2+) ====





















}
