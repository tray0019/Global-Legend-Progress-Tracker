package com.GLPT.Backend.Service;


import com.GLPT.Backend.DTO.GoalPositionDto;
import com.GLPT.Backend.Entity.Difficulty;
import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Entity.GoalStatus;
import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Repository.GoalRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class GoalService {

    private final GoalRepository repo;

    GoalService(GoalRepository repo){
        this.repo = repo;
    }

    // ==== LEGACY (Phase 1) ===
    public List<Goal> getActiveGoals() {
        // ACTIVE, not archived, not achievement
        return repo.findByStatusAndArchivedFalseAndIsAchievementFalseOrderByPositionAsc(GoalStatus.ACTIVE);
    }

    // ==== USER-SCOPE (Phase 2+) ====
    public List<Goal> getActiveGoalsForUser(User user) {
        // ACTIVE, not archived, not achievement
        return repo.findByUserAndStatusAndArchivedFalseAndIsAchievementFalseOrderByPositionAsc(user,GoalStatus.ACTIVE);
    }

    // ==== LEGACY (Phase 1) ===
    public List<Goal> getArchiveGoals() {
        // archived (regardless of status)
        return repo.findByArchivedTrueOrderByPositionAsc();
    }

    // ==== USER-SCOPE (Phase 2+) ====
    public List<Goal> getArchiveGoalsForUser(User user) {
        // archived (regardless of status)
        return repo.findByUserAndArchivedTrueOrderByPositionAsc(user);
    }

    // ==== LEGACY (Phase 1) ===
    public List<Goal> getAchievements() {
        // marked as achievement
        return repo.findByIsAchievementTrueOrderByPositionAsc();
    }

    // ==== USER-SCOPE (Phase 2+) ====
    public List<Goal> getAchievementsForUser(User user) {
        // marked as achievement
        return repo.findByUserAndIsAchievementTrueOrderByPositionAsc(user);
    }


    // ==== LEGACY (Phase 1) ===
    public List<Goal> getCompletedGoals() {
        return repo.findByStatusOrderByPositionAsc(GoalStatus.COMPLETED);
    }

    // ==== LEGACY (Phase 1) ===
    public Goal getGoal(long goalId){
        return repo.findById(goalId)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Goal Id not found"));
    }


    // ==== LEGACY (Phase 1) ===
    @Transactional
    public boolean toggleArchive(long goalId) {
        Goal goal = repo.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        goal.setArchived(!goal.isArchived()); // toggle flag
        repo.save(goal);
        return goal.isArchived();
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @Transactional
    public boolean toggleArchiveForUser(long goalId, User user) {
        Goal goal = repo.findByIdAndUser(goalId, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Not your goal"));

        goal.setArchived(!goal.isArchived());
        return goal.isArchived();
    }



    // ==== LEGACY (Phase 1) ===
    public Goal createNewGoal(Goal goal){
        Integer maxPosition = repo.findMaxPosition();
        if(maxPosition == null) maxPosition = 0;
        goal.setPosition(maxPosition + 1);
        goal.setArchived(false);

        if(goal.getDifficulty()==null) {
            goal.setDifficulty(Difficulty.MEDIUM);
        }

        return repo.save(goal);
    }

    // ==== LEGACY (Phase 1) ===
    public List<Goal> viewAllGoal(){
        return repo.findAllByOrderByPositionAsc();
    }

    public List<Goal> viewAllGoalsForUser(User user) {
        return repo.findAllByUserOrderByPositionAsc(user);
    }



    // ==== LEGACY (Phase 1) ===
    public Goal viewGoal(long goalId){

        Optional<Goal> boxGoal = repo.findById(goalId);

        if(boxGoal.isPresent()){
            return boxGoal.get();
        }else{
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,"Goal not found");
        }
    }

    // ==== USER-SCOPE (Phase 2+) ====
    public Goal viewGoalForUser(long goalId, User user) {
        return repo.findByIdAndUser(goalId, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Not your goal"));
    }


    // ==== LEGACY (Phase 1) ===
    public Goal renameGoal(long goalId, String newTitle){
            Goal goal = repo.findById(goalId)
                    .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Goal Id not found"));
            goal.setGoalTitle(newTitle);
            return repo.save(goal);
    }

    // ==== USER-SCOPE (Phase 2+) ====
    public Goal renameGoalForUser(long goalId, String newTitle, User user) {
        Goal goal = repo.findByIdAndUser(goalId, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Not your goal"));

        goal.setGoalTitle(newTitle);
        return repo.save(goal);
    }


    // ==== LEGACY (Phase 1) ===
    public void deleteGoal(long goalId){
        if(!repo.existsById(goalId)){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Goal Id not foung");
        }
        repo.deleteById(goalId);
    }

    // ==== USER-SCOPE (Phase 2+) ====
    public void deleteGoalForUser(long goalId, User user) {
        Goal goal = repo.findByIdAndUser(goalId, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Not your goal"));

        repo.delete(goal);
    }


    // ==== LEGACY (Phase 1) ===
    @Transactional
    public void updatePositions(List<GoalPositionDto> positions){
        for(GoalPositionDto dto: positions){
            Goal goal = repo.findById(dto.getId())
                    .orElseThrow();
            goal.setPosition(dto.getPosition());
        }
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @Transactional
    public void updatePositionsForUser(List<GoalPositionDto> positions, User user) {
        for (GoalPositionDto dto : positions) {
            Goal goal = repo.findByIdAndUser(dto.getId(), user)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.FORBIDDEN, "Not your goal"));

            goal.setPosition(dto.getPosition());
        }
    }


    // ==== LEGACY (Phase 1) ===
    public Goal updateDifficulty(long goalId, Difficulty difficulty){
        Goal goal = repo.findById(goalId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,"Goal not found"));
        goal.setDifficulty(difficulty);
        return repo.save(goal);
    }

    // ==== USER-SCOPE (Phase 2+) ====
    public Goal updateDifficultyForUser(long goalId, Difficulty difficulty, User user) {
        Goal goal = repo.findByIdAndUser(goalId, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Not your goal"));

        goal.setDifficulty(difficulty);
        return repo.save(goal);
    }


    // ==== LEGACY (Phase 1) ===
    @Transactional
    public Goal completeGoal(long goalId) {
        Goal goal = repo.findById(goalId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Goal not found"));

        goal.setStatus(GoalStatus.COMPLETED);
        return goal;
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @Transactional
    public Goal completeGoalForUser(long goalId, User user) {
        Goal goal = repo.findByIdAndUser(goalId, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Not your goal"));

        goal.setStatus(GoalStatus.COMPLETED);
        return goal;
    }


    // ==== LEGACY (Phase 1) ===
    @Transactional
    public Goal toggleAchievement(long goalId) {
        Goal goal = repo.findById(goalId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Goal not found"));

        goal.setAchievement(!goal.isAchievement());
        return goal; // managed entity auto-saves
    }

    // ==== USER-SCOPE (Phase 2+) ====
    @Transactional
    public Goal toggleAchievementForUser(long goalId, User user) {
        Goal goal = repo.findByIdAndUser(goalId, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Not your goal"));

        goal.setAchievement(!goal.isAchievement());
        return goal;
    }


    public Goal createGoalForUser(String title, User user){
        Integer max = repo.findMaxPositionByUser(user);
        if(max == null) max = 0;

        Goal goal = new Goal();
        goal.setGoalTitle(title);
        goal.setUser(user);
        goal.setPosition(max + 1);
        goal.setArchived(false);
        goal.setDifficulty(Difficulty.MEDIUM);

        return repo.save(goal);
    }








}
