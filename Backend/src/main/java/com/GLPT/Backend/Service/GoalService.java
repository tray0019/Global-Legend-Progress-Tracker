package com.GLPT.Backend.Service;


import com.GLPT.Backend.DTO.GoalPositionDto;
import com.GLPT.Backend.Entity.Difficulty;
import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Entity.GoalStatus;
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

    public List<Goal> getActiveGoals() {
        // ACTIVE, not archived, not achievement
        return repo.findByStatusAndArchivedFalseAndIsAchievementFalseOrderByPositionAsc(GoalStatus.ACTIVE);
    }

    public List<Goal> getArchiveGoals() {
        // archived (regardless of status)
        return repo.findByArchivedTrueOrderByPositionAsc();
    }

    public List<Goal> getAchievements() {
        // marked as achievement
        return repo.findByIsAchievementTrueOrderByPositionAsc();
    }


    public List<Goal> getCompletedGoals() {
        return repo.findByStatusOrderByPositionAsc(GoalStatus.COMPLETED);
    }

    public Goal getGoal(long goalId){
        return repo.findById(goalId)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"Goal Id not found"));
    }


    @Transactional
    public boolean toggleArchive(long goalId) {
        Goal goal = repo.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        goal.setArchived(!goal.isArchived()); // toggle flag
        repo.save(goal);
        return goal.isArchived();
    }



    /**
     * -- Create one goal
     */
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

    /** -- View All goal
     */
    public List<Goal> viewAllGoal(){
        return repo.findAllByOrderByPositionAsc();
    }

    /**
     * -- View one goal by Id
     * Throw exception if not
     */
    public Goal viewGoal(long goalId){

        Optional<Goal> boxGoal = repo.findById(goalId);

        if(boxGoal.isPresent()){
            return boxGoal.get();
        }else{
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,"Goal not found");
        }
    }

    /**
     * -- Rename Goal title
     */
    public Goal renameGoal(long goalId, String newTitle){
            Goal goal = repo.findById(goalId)
                    .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Goal Id not found"));
            goal.setGoalTitle(newTitle);
            return repo.save(goal);
    }

    /** -- Delete a goal
     */
    public void deleteGoal(long goalId){
        if(!repo.existsById(goalId)){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Goal Id not foung");
        }
        repo.deleteById(goalId);
    }

    @Transactional
    public void updatePositions(List<GoalPositionDto> positions){
        for(GoalPositionDto dto: positions){
            Goal goal = repo.findById(dto.getId())
                    .orElseThrow();
            goal.setPosition(dto.getPosition());
        }
    }

    public Goal updateDifficulty(long goalId, Difficulty difficulty){
        Goal goal = repo.findById(goalId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,"Goal not found"));
        goal.setDifficulty(difficulty);
        return repo.save(goal);
    }

    @Transactional
    public Goal completeGoal(long goalId) {
        Goal goal = repo.findById(goalId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Goal not found"));

        goal.setStatus(GoalStatus.COMPLETED);
        return goal;
    }

    @Transactional
    public Goal toggleAchievement(long goalId) {
        Goal goal = repo.findById(goalId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Goal not found"));

        goal.setAchievement(!goal.isAchievement());
        return goal; // managed entity auto-saves
    }





}
