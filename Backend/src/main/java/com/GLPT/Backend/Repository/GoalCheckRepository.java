package com.GLPT.Backend.Repository;

import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Entity.GoalCheck;
import com.GLPT.Backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GoalCheckRepository extends JpaRepository<GoalCheck, Long> {

        Optional<GoalCheck> findByGoalAndCheckDate(Goal goal, LocalDate checkDate);
        List<GoalCheck> findByGoalAndCheckDateBetween(Goal goal, LocalDate from, LocalDate to);

        List<GoalCheck> findByCheckDateBetween(LocalDate from, LocalDate to);

        boolean existsByGoalIdAndCheckDate(Long goalId, LocalDate checkDate);
        void deleteByGoalIdAndCheckDate(Long goalId, LocalDate checkDate);

        Optional<GoalCheck> findByGoalAndCheckDateAndGoal_User(
                Goal goal,
                LocalDate date,
                User user
        );

}
