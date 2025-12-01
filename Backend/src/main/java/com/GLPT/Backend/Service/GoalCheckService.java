package com.GLPT.Backend.Service;

import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Entity.GoalCheck;
import com.GLPT.Backend.Repository.GoalCheckRepository;
import com.GLPT.Backend.Repository.GoalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class GoalCheckService {

    private GoalCheckRepository checkRepo;
    private GoalRepository goalRepo;

    GoalCheckService(GoalCheckRepository checkRepo,
                        GoalRepository goalRepo){
        this.checkRepo = checkRepo;
        this.goalRepo = goalRepo;
    }

    /**
     * - Mark goal done for today
     *
     * @return true if a new check was created,
     *  flase if it was already marked for today.
     */
    public boolean markGoalDoneToday(long goalId) {
        Goal goal = goalRepo.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        LocalDate today = LocalDate.now();

        Optional<GoalCheck> existing =
                checkRepo.findByGoalAndCheckDate(goal, today);

        if(existing.isPresent()){
            return false;
        }

        GoalCheck check = new GoalCheck();
        check.setGoal(goal);
        check.setCheckDate(today);
        checkRepo.save(check);
        return true;
    }
    /**
     * -- Goal all checks for a goal between two dates (inclusive).
     */
    public List<GoalCheck> getChecksForGoalBetween(
            long goalId, LocalDate from, LocalDate to){

        Goal goal = goalRepo.findById(goalId)
                .orElseThrow(()-> new RuntimeException("Goal not found"));

        return checkRepo.findByGoalAndCheckDateBetween(goal,from, to);
    }

}
