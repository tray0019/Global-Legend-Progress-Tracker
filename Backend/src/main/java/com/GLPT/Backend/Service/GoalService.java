package com.GLPT.Backend.Service;


import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Repository.GoalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GoalService {

    private final GoalRepository repo;

    GoalService(GoalRepository repo){
        this.repo = repo;
    }

    /**
     * -- Create one goal
     */
    public Goal createNewGoal(Goal goal){
        return repo.save(goal);
    }

    /** -- View All goal
     */
    public List<Goal> viewAllGoal(){
        return repo.findAll();
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
            throw new RuntimeException("Goal not found");
        }
    }

    /**
     * -- Rename Goal title
     */
    public Goal renameGoal(long goalId, String newTitle){
            Goal goal = repo.findById(goalId)
                    .orElseThrow(()-> new RuntimeException("Goal not found"));
            goal.setGoalTitle(newTitle);
            return repo.save(goal);
    }

    /** -- Delete a goal
     */
    public void deleteGoal(long goalId){
        if(!repo.existsById(goalId)){
            throw new RuntimeException("Goal not found");
        }
        repo.deleteById(goalId);
    }
}
