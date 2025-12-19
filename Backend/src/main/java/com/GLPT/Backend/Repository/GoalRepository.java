package com.GLPT.Backend.Repository;
import com.GLPT.Backend.Entity.Goal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findAllByOrderByPositionAsc();
    List<Goal> findByArchivedFalseOrderByPositionAsc();
    List<Goal> findByArchivedTrueOrderByPositionAsc();
    long countByArchivedFalse();
}
