package com.GLPT.Backend.Repository;
import com.GLPT.Backend.Entity.Goal;

import com.GLPT.Backend.Entity.GoalStatus;
import com.GLPT.Backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findAllByOrderByPositionAsc();
    List<Goal> findByArchivedTrueOrderByPositionAsc();
    List<Goal> findByStatusOrderByPositionAsc(GoalStatus status);
    List<Goal> findByStatusAndArchivedFalseAndIsAchievementFalseOrderByPositionAsc(GoalStatus status);
    List<Goal> findByIsAchievementTrueOrderByPositionAsc();
    @Query("SELECT MAX(g.position) FROM Goal g")
    Integer findMaxPosition();

    // === Phase 2 ==

    Optional<Goal> findByIdAndUser(Long id, User user);
    List<Goal> findByUserOrderByPositionAsc(User user);
    List<Goal> findByUserAndArchivedTrueOrderByPositionAsc(User user);
    List<Goal> findByUserAndIsAchievementTrueOrderByPositionAsc(User user);
    List<Goal> findAllByUserOrderByPositionAsc(User user);

    List<Goal> findByUserAndStatusAndArchivedFalseAndIsAchievementFalseOrderByPositionAsc(
            User user,
            GoalStatus status
    );

    @Query("SELECT MAX(g.position) FROM Goal g WHERE g.user = :user")
    Integer findMaxPositionByUser(User user);
}
