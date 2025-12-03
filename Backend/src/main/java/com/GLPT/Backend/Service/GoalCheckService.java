package com.GLPT.Backend.Service;

import com.GLPT.Backend.DTO.GlobalContributionDto;
import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Entity.GoalCheck;
import com.GLPT.Backend.Repository.GoalCheckRepository;
import com.GLPT.Backend.Repository.GoalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

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
            checkRepo.delete(existing.get());
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

    public List<GlobalContributionDto> getGlobalContribution(LocalDate from, LocalDate to){
        List<GoalCheck> checks = checkRepo.findByCheckDateBetween(from,to);

        Map<LocalDate, Integer> counter = new HashMap<>();

        for(GoalCheck check: checks){
            LocalDate date = check.getCheckDate();

            if(!counter.containsKey(date)){
                counter.put(date,1);
            }else{
                int current  = counter.get(date);
                counter.put(date, current+1);
            }
        }
            List<GlobalContributionDto> result = new ArrayList<>();

            for(Map.Entry<LocalDate, Integer> entry: counter.entrySet()){
                GlobalContributionDto dto =
                        new GlobalContributionDto(entry.getKey(), entry.getValue());
                result.add(dto);
            }

            return result;

    }

}
