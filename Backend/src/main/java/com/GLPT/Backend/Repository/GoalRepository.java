package com.GLPT.Backend.Repository;
import com.GLPT.Backend.Entity.Goal;

import com.GLPT.Backend.Entity.GoalStatus;
import com.GLPT.Backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findAllByOrderByPositionAsc();
    List<Goal> findByArchivedFalseOrderByPositionAsc();
    List<Goal> findByArchivedTrueOrderByPositionAsc();

    @Query("SELECT MAX(g.position) FROM Goal g")
    Integer findMaxPosition();

    List<Goal> findByStatusOrderByPositionAsc(GoalStatus status);
    List<Goal> findByStatusAndArchivedFalseOrderByPositionAsc(GoalStatus status);
    List<Goal> findByStatusAndArchivedFalseAndIsAchievementFalseOrderByPositionAsc(GoalStatus status);
    List<Goal> findByIsAchievementTrueOrderByPositionAsc();


    List<Goal> findByUser(User user);
}
